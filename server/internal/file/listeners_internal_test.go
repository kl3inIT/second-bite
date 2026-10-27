package file

import (
	"context"
	"errors"
	"image/color"
	"strings"
	"testing"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// failingDeletes is a store whose deletes of keys under failing fail, as an
// object store going away part-way would.
type failingDeletes struct {
	objectStore

	failing string
}

var errStoreDown = errors.New("store down")

func (f *failingDeletes) Delete(ctx context.Context, key string) error {
	if f.failing != "" && strings.HasPrefix(key, f.failing) {
		return errStoreDown
	}

	return f.objectStore.Delete(ctx, key)
}

// TestForgetUploaderFailsPartWay checks that a run of forgetUploader failing
// on its second photo keeps that photo's row, its first photo being gone with
// its objects, and that the next run finishes the work (SEC-126).
func TestForgetUploaderFailsPartWay(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	s, err := NewService(t.Context(), pool, Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	accountID := uuid.New()
	ctx := platform.WithCaller(t.Context(), platform.Caller{AccountID: accountID, SessionID: uuid.New(), Role: platform.RoleCustomer})

	first, err := s.Upload(ctx, encodePNG(t, solid(40, 30, color.Gray{Y: 0xC0})))
	if err != nil {
		t.Fatal(err)
	}

	second, err := s.Upload(ctx, encodePNG(t, solid(40, 30, color.Gray{Y: 0xC0})))
	if err != nil {
		t.Fatal(err)
	}

	// The listener deletes them in the order it reads them: the second fails.
	files, err := s.queries.UnusedFilesOf(t.Context(), accountID)
	if err != nil || len(files) != 2 {
		t.Fatalf("the unused files: %d, %v", len(files), err)
	}

	gone, kept := first.ID, second.ID
	if files[1].ID == first.ID {
		gone, kept = second.ID, first.ID
	}

	store := &failingDeletes{objectStore: s.stores[StorePostgres], failing: photoPrefix(kept)}
	s.stores = objectStores{StorePostgres: store, StoreS3: s.stores[StoreS3]}

	event := identity.AccountDeletedEvent{AccountID: accountID}
	if err := s.forgetUploader(t.Context(), event); !errors.Is(err, ErrStoreUnavailable) {
		t.Fatalf("the failing run: %v, want ErrStoreUnavailable", err)
	}

	checkFile(t, s, gone, false)
	checkFile(t, s, kept, true)

	store.failing = ""

	if err := s.forgetUploader(t.Context(), event); err != nil {
		t.Fatalf("the next run: %v", err)
	}

	checkFile(t, s, kept, false)
}

// checkFile checks whether the photo's row and its objects are still there.
func checkFile(t *testing.T, s *Service, id uuid.UUID, want bool) {
	t.Helper()

	var rows, blobs int
	if err := s.pool.QueryRow(t.Context(),
		`SELECT (SELECT count(*) FROM file_files WHERE id = $1),
		        (SELECT count(*) FROM file_blobs WHERE key LIKE $2 || '/%')`,
		id, photoPrefix(id),
	).Scan(&rows, &blobs); err != nil {
		t.Fatal(err)
	}

	if want && (rows != 1 || blobs == 0) {
		t.Errorf("photo %s: %d rows and %d objects, want its row and objects", id, rows, blobs)
	}

	if !want && (rows != 0 || blobs != 0) {
		t.Errorf("photo %s: %d rows and %d objects, want none", id, rows, blobs)
	}
}
