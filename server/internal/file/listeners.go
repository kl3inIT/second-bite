package file

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// RegisterListeners makes the module follow the events of the modules it
// depends on.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "file.forget_uploader", s.forgetUploader)
}

// forgetUploader deletes the photos a deleted account uploaded that nothing
// uses (SEC-37). Photos an offer or a seller uses are the seller's and stay.
// The objects go before their row, so a failure leaves the row for the next
// attempt instead of objects no row points to.
func (s *Service) forgetUploader(ctx context.Context, e identity.AccountDeletedEvent) error {
	files, err := s.queries.UnusedFilesOf(ctx, e.AccountID)
	if err != nil {
		return fmt.Errorf("reading the account's unused files: %w", err)
	}

	for _, f := range files {
		store, err := s.stores.get(Store(f.Store))
		if err != nil {
			return err
		}

		for _, size := range sizes {
			if err := store.Delete(ctx, sizeKey(f.ObjectKey, size)); err != nil {
				return ErrStoreUnavailable.WithCause(err)
			}
		}

		if err := s.queries.DeleteUnusedFile(ctx, f.ID); err != nil {
			return fmt.Errorf("deleting the file's row: %w", err)
		}
	}

	s.logger.InfoContext(ctx, "deleted uploader forgotten",
		slog.String("event", "file.uploader.forgotten"),
		slog.String("account_id", e.AccountID.String()),
		slog.Int("files_deleted", len(files)),
	)

	return nil
}
