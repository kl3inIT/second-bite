// Package media keeps the photos sellers' staff upload for their offers and
// their sellers: each is written again as JPEG in two sizes without its
// metadata, kept in a store chosen by configuration, and served through the
// API. Memos keeps attachments the same way: in its database first, in an
// S3-compatible store when configured, each attachment recording its store.
package media

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/media/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	// MaxUploadBytes bounds one upload; a phone's photo is 3 to 8 MB.
	MaxUploadBytes = 10 << 20
	// maxUnusedPhotos bounds the photos an account holds without using them,
	// until unused photos are deleted after a day.
	maxUnusedPhotos = 20
	// maxPhotosPerDay bounds what one account stores, since a photo once
	// used is kept: an owner setting photo after photo on a seller would
	// otherwise pass the limit of unused photos.
	maxPhotosPerDay = 100
	// concurrentRenders bounds the memory decoding takes: about 200 MB for
	// the largest photo accepted.
	concurrentRenders = 2
	contentTypeJPEG   = "image/jpeg"
)

// Config configures the module.
type Config struct {
	// Store keeps the files of new photos.
	Store Store
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

func objectKey(id uuid.UUID, size Size) string {
	return "photos/" + id.String() + "/" + fileName(size)
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
// one the service knows.
func NewService(pool *pgxpool.Pool, cfg Config, logger *slog.Logger) (*Service, error) {
	registry, err := newObjectStores(map[Store]objectStore{
		StorePostgres: newPostgresObjectStore(pool),
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
	unused, err := s.queries.CountUnusedPhotos(ctx, caller.AccountID)
	if err != nil {
		return Photo{}, fmt.Errorf("counting unused photos: %w", err)
	}

	if unused >= maxUnusedPhotos {
		return Photo{}, ErrUnusedPhotoLimit
	}

	today, err := s.queries.CountPhotosSince(ctx, db.CountPhotosSinceParams{AccountID: caller.AccountID, Since: time.Now().Add(-24 * time.Hour)})
	if err != nil {
		return Photo{}, fmt.Errorf("counting the day's photos: %w", err)
	}

	if today >= maxPhotosPerDay {
		return Photo{}, ErrDailyPhotoLimit
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
		slog.String("event", "media.photo.uploaded"),
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

	// The files are stored before the row, which no store's transaction
	// covers; when the row is refused, they are deleted again.
	for size, file := range img.files {
		if err := store.Put(ctx, objectKey(photo.ID, size), object{contentType: contentTypeJPEG, data: file}); err != nil {
			s.deleteFiles(ctx, store, photo.ID)

			return ErrStoreUnavailable.WithCause(err)
		}
	}

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockUploader(ctx, uploader.String()); err != nil {
			return fmt.Errorf("locking the uploader: %w", err)
		}

		unused, err := q.CountUnusedPhotos(ctx, uploader)
		if err != nil {
			return fmt.Errorf("counting unused photos: %w", err)
		}

		if unused >= maxUnusedPhotos {
			return ErrUnusedPhotoLimit
		}

		return q.InsertPhoto(ctx, db.InsertPhotoParams{
			ID: photo.ID, Store: string(s.store), UploadedBy: uploader,
			Width: int32(photo.Width), Height: int32(photo.Height), //nolint:gosec // at most maxPixels on a side
		})
	})
	if err != nil {
		s.deleteFiles(ctx, store, photo.ID)

		return err
	}

	return nil
}

// Claim marks a photo as used by an offer or a seller, so it is kept. Only
// the account that uploaded it may claim it; anyone else gets
// ErrPhotoNotFound, as for a photo that does not exist. Claiming again
// succeeds.
func (s *Service) Claim(ctx context.Context, photoID, accountID uuid.UUID) error {
	n, err := s.queries.ClaimPhoto(ctx, db.ClaimPhotoParams{ID: photoID, AccountID: accountID})
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
	row, err := s.queries.GetPhoto(ctx, photoID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrPhotoNotFound
	}

	if err != nil {
		return nil, fmt.Errorf("reading the photo: %w", err)
	}

	store, err := s.stores.get(Store(row.Store))
	if err != nil {
		return nil, err
	}

	o, err := store.Get(ctx, objectKey(photoID, size))
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

// deleteFiles removes what an upload stored before it failed. A failure is
// logged; the files are then left without a photo.
func (s *Service) deleteFiles(ctx context.Context, store objectStore, id uuid.UUID) {
	for _, size := range sizes {
		if err := store.Delete(context.WithoutCancel(ctx), objectKey(id, size)); err != nil {
			s.logger.WarnContext(ctx, "photo files left after a failed upload",
				slog.String("event", "media.photo.files_left"),
				slog.String("photo_id", id.String()),
				slog.String("error", err.Error()),
			)
		}
	}
}
