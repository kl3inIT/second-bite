package file_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// TestDeletedUploaderIsForgotten delivers identity's AccountDeletedEvent
// through the outbox, twice as a retry would (SEC-37): the photos the account
// uploaded and never used are deleted, objects and rows, and the one in use
// stays.
func TestDeletedUploaderIsForgotten(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	photos, err := file.NewService(t.Context(), pool, file.Config{}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	ctx, accountID := as(t)

	used, err := photos.Upload(ctx, photoData(t))
	if err != nil {
		t.Fatal(err)
	}

	if err := photos.Claim(t.Context(), used.ID, accountID); err != nil {
		t.Fatal(err)
	}

	unused, err := photos.Upload(ctx, photoData(t))
	if err != nil {
		t.Fatal(err)
	}

	events := startEvents(t, pool, photos)

	publishTwice(t, pool, events, identity.AccountDeletedEvent{AccountID: accountID})

	waitNotServed(t, photos, unused.ID)

	if _, err := photos.File(t.Context(), used.ID, file.SizeSmall); err != nil {
		t.Errorf("the photo in use went with its uploader: %v", err)
	}

	var rows, blobs int
	if err := pool.QueryRow(t.Context(),
		"SELECT (SELECT count(*) FROM file_files WHERE uploaded_by = $1), (SELECT count(*) FROM file_blobs WHERE key LIKE '%' || $2 || '%')",
		accountID, unused.ID.String(),
	).Scan(&rows, &blobs); err != nil {
		t.Fatal(err)
	}

	if rows != 1 || blobs != 0 {
		t.Errorf("%d files of the account and %d objects of the unused photo remain, want 1 and 0", rows, blobs)
	}
}

// waitNotServed waits up to fifteen seconds, the time the listener gets, for
// the photo to be gone.
func waitNotServed(t *testing.T, photos *file.Service, id uuid.UUID) {
	t.Helper()

	deadline := time.Now().Add(15 * time.Second)

	for {
		_, err := photos.File(t.Context(), id, file.SizeSmall)
		if errors.Is(err, file.ErrPhotoNotFound) {
			return
		}

		if time.Now().After(deadline) {
			t.Fatalf("the unused photo is still served: %v", err)
		}

		time.Sleep(100 * time.Millisecond)
	}
}

func startEvents(t *testing.T, pool *pgxpool.Pool, photos *file.Service) *platform.Events {
	t.Helper()

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	file.RegisterListeners(events, photos)

	if err := events.Start(t.Context()); err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		stopCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := events.Stop(stopCtx); err != nil {
			t.Error(err)
		}
	})

	return events
}

// publishTwice publishes event in two transactions, as a retry would deliver
// it twice.
func publishTwice(t *testing.T, pool *pgxpool.Pool, events *platform.Events, event identity.AccountDeletedEvent) {
	t.Helper()

	for range 2 {
		if err := pgx.BeginFunc(t.Context(), pool, func(tx pgx.Tx) error {
			return platform.Publish(t.Context(), tx, events, event)
		}); err != nil {
			t.Fatal(err)
		}
	}
}
