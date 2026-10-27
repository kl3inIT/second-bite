// Package file keeps the files of the system in the store configuration
// chooses, PostgreSQL or an S3-compatible store, and serves them through the
// API. Its first files are photos for offers and sellers: each is written
// again as JPEG in two sizes without its metadata. Memos keeps attachments
// the same way: in its database or an S3-compatible store, each attachment
// recording its store.
package file

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/file/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// MaxUploadBytes bounds one upload; a phone's photo is 3 to 8 MB.
	MaxUploadBytes = 10 << 20
	// maxUnusedFiles bounds the files an account holds without using them,
	// until unused files are deleted after a day.
	maxUnusedFiles = 20
	// maxFilesPerDay bounds what one account stores, since a file once used
	// is kept: an owner setting photo after photo on a seller would otherwise
	// pass the limit of unused files.
	maxFilesPerDay = 100
	// concurrentRenders bounds the memory decoding takes: about 200 MB for
	// the largest photo accepted.
	concurrentRenders = 2
	contentTypeJPEG   = "image/jpeg"
)

// Config configures the module.
type Config struct {
	// Store keeps new files; postgres when empty.
	Store Store
	S3    S3Config
}

// Photo is an uploaded photo.
type Photo struct {
	ID     uuid.UUID
	Width  int
	Height int
}

// Path is where the photo is served in size.
func Path(id uuid.UUID, size Size) string {
	return "/photos/" + id.String() + "/" + fileName(size)
}

func fileName(size Size) string {
	return strconv.Itoa(int(size)) + ".jpg"
}

// Purpose is what a file is for; it decides the rules of its upload.
type Purpose string

// The purposes of files.
const (
	PurposePhoto Purpose = "photo"
)

// photoPrefix is the key a photo's sizes are kept under.
func photoPrefix(id uuid.UUID) string {
	return "photos/" + id.String()
}

func sizeKey(prefix string, size Size) string {
	return prefix + "/" + fileName(size)
}

// Service is the module's published API.
type Service struct {
	pool    *pgxpool.Pool
	queries *db.Queries
	stores  objectStores
	store   Store
	renders chan struct{}
	logger  *slog.Logger
}

// NewService assembles the module. It fails when the configured store is not
// one the service knows, or is S3 and its bucket does not answer.
func NewService(ctx context.Context, pool *pgxpool.Pool, cfg Config, logger *slog.Logger) (*Service, error) {
	s3Store := newS3ObjectStore(cfg.S3)

	registry, err := newObjectStores(map[Store]objectStore{
		StorePostgres: newPostgresObjectStore(pool),
		StoreS3:       s3Store,
	})
	if err != nil {
		return nil, err
	}

	if cfg.Store == "" {
		cfg.Store = StorePostgres
	}

	if _, err := registry.get(cfg.Store); err != nil {
		return nil, err
	}

	if cfg.S3.configured() {
		if err := s3Store.check(ctx); err != nil {
			return nil, err
		}
	} else if cfg.Store == StoreS3 {
		return nil, errS3NotConfigured
	}

	return &Service{
		pool: pool, queries: db.New(pool), stores: registry, store: cfg.Store,
		renders: make(chan struct{}, concurrentRenders), logger: logger,
	}, nil
}

// Upload keeps a photo for the caller, who uses it for an offer or a seller.
func (s *Service) Upload(ctx context.Context, data []byte) (Photo, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Photo{}, err
	}

	if len(data) == 0 || len(data) > MaxUploadBytes {
		return Photo{}, ErrPhotoInvalid
	}

	// Checked first without a lock, so a refused upload costs no decoding.
	unused, err := s.queries.CountUnusedFiles(ctx, caller.AccountID)
	if err != nil {
		return Photo{}, fmt.Errorf("counting unused files: %w", err)
	}

	if unused >= maxUnusedFiles {
		return Photo{}, ErrUnusedLimit
	}

	today, err := s.queries.CountFilesSince(ctx, db.CountFilesSinceParams{AccountID: caller.AccountID, Since: time.Now().Add(-24 * time.Hour)})
	if err != nil {
		return Photo{}, fmt.Errorf("counting the day's files: %w", err)
	}

	if today >= maxFilesPerDay {
		return Photo{}, ErrDailyLimit
	}

	img, err := s.render(ctx, data)
	if err != nil {
		return Photo{}, err
	}

	photo := Photo{ID: uuid.Must(uuid.NewV7()), Width: img.width, Height: img.height}

	if err := s.keep(ctx, caller.AccountID, photo, img); err != nil {
		return Photo{}, err
	}

	s.logger.InfoContext(ctx, "photo uploaded",
		slog.String("event", "file.photo.uploaded"),
		slog.String("photo_id", photo.ID.String()),
		slog.String("account_id", caller.AccountID.String()),
		slog.Int("bytes", len(data)),
	)

	return photo, nil
}

// keep stores a rendered photo's files in the configured store, then records
// the photo for its uploader.
func (s *Service) keep(ctx context.Context, uploader uuid.UUID, photo Photo, img rendered) error {
	store, err := s.stores.get(s.store)
	if err != nil {
		return err
	}

	prefix := photoPrefix(photo.ID)

	var total int64

	// The objects are stored before the row, which no store's transaction
	// covers; when the row is refused, they are deleted again.
	for size, data := range img.files {
		if err := store.Put(ctx, sizeKey(prefix, size), object{contentType: contentTypeJPEG, data: data}); err != nil {
			s.deleteSizes(ctx, store, prefix)

			return ErrStoreUnavailable.WithCause(err)
		}

		total += int64(len(data))
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockUploader(ctx, uploader.String()); err != nil {
			return fmt.Errorf("locking the uploader: %w", err)
		}

		unused, err := q.CountUnusedFiles(ctx, uploader)
		if err != nil {
			return fmt.Errorf("counting unused files: %w", err)
		}

		if unused >= maxUnusedFiles {
			return ErrUnusedLimit
		}

		return q.InsertFile(ctx, db.InsertFileParams{
			ID: photo.ID, Purpose: string(PurposePhoto), Store: string(s.store), ObjectKey: prefix,
			MediaType: contentTypeJPEG, SizeBytes: total, UploadedBy: uploader,
			Width:  pgtype.Int4{Int32: int32(photo.Width), Valid: true},  //nolint:gosec // at most maxPixels on a side
			Height: pgtype.Int4{Int32: int32(photo.Height), Valid: true}, //nolint:gosec // likewise
		})
	})
	if err != nil {
		s.deleteSizes(ctx, store, prefix)

		return err
	}

	return nil
}

// Claim marks a photo as used by an offer or a seller, so it is kept. Only
// the account that uploaded it may claim it; anyone else gets
// ErrPhotoNotFound, as for a photo that does not exist. Claiming again
// succeeds.
func (s *Service) Claim(ctx context.Context, photoID, accountID uuid.UUID) error {
	return claim(ctx, s.queries, photoID, accountID)
}

// ClaimIn claims a photo as Claim does, in tx, for a module that claims it
// while it writes: the claim stands or falls with that write, and no second
// connection is asked of the pool while tx holds one (SEC-128, SEC-159).
func (s *Service) ClaimIn(ctx context.Context, tx pgx.Tx, photoID, accountID uuid.UUID) error {
	return claim(ctx, s.queries.WithTx(tx), photoID, accountID)
}

func claim(ctx context.Context, q *db.Queries, photoID, accountID uuid.UUID) error {
	n, err := q.ClaimFile(ctx, db.ClaimFileParams{ID: photoID, Purpose: string(PurposePhoto), AccountID: accountID})
	if err != nil {
		return fmt.Errorf("claiming the photo: %w", err)
	}

	if n == 0 {
		return ErrPhotoNotFound
	}

	return nil
}

// File returns a photo in size as JPEG.
func (s *Service) File(ctx context.Context, photoID uuid.UUID, size Size) ([]byte, error) {
	row, err := s.queries.GetFile(ctx, photoID)
	if errors.Is(err, pgx.ErrNoRows) || err == nil && row.Purpose != string(PurposePhoto) {
		return nil, ErrPhotoNotFound
	}

	if err != nil {
		return nil, fmt.Errorf("reading the photo: %w", err)
	}

	store, err := s.stores.get(Store(row.Store))
	if err != nil {
		return nil, err
	}

	o, err := store.Get(ctx, sizeKey(row.ObjectKey, size))
	if errors.Is(err, errObjectNotFound) {
		return nil, ErrPhotoNotFound
	}

	if err != nil {
		return nil, ErrStoreUnavailable.WithCause(err)
	}

	return o.data, nil
}

// render bounds how many photos are decoded at once.
func (s *Service) render(ctx context.Context, data []byte) (rendered, error) {
	select {
	case s.renders <- struct{}{}:
	case <-ctx.Done():
		return rendered{}, ctx.Err()
	}

	defer func() { <-s.renders }()

	return render(data)
}

// deleteSizes removes what an upload stored before it failed. A failure is
// logged; the objects are then left without a row.
func (s *Service) deleteSizes(ctx context.Context, store objectStore, prefix string) {
	for _, size := range sizes {
		if err := store.Delete(context.WithoutCancel(ctx), sizeKey(prefix, size)); err != nil {
			s.logger.WarnContext(ctx, "photo objects left after a failed upload",
				slog.String("event", "file.photo.objects_left"),
				slog.String("object_key", prefix),
				slog.String("error", err.Error()),
			)
		}
	}
}
