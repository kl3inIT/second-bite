package identity

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// sessionPurgeEvery is how often the sessions past their end are deleted.
const sessionPurgeEvery = 24 * time.Hour

// PurgeExpiredSessions deletes the sessions past their end of every account:
// signing in clears only the signing account's, so a person who never comes
// back would keep theirs for ever (SEC-167). Running it again changes nothing.
func (s *Service) PurgeExpiredSessions(ctx context.Context) error {
	n, err := s.queries.PurgeExpiredSessions(ctx)
	if err != nil {
		return fmt.Errorf("purging the expired sessions: %w", err)
	}

	if n > 0 {
		s.logger.InfoContext(ctx, "expired sessions purged",
			slog.String("event", "identity.sessions.purged"),
			slog.Int64("sessions_purged", n),
		)
	}

	return nil
}

// RegisterSchedules makes the module run what it does on the clock.
func RegisterSchedules(events *platform.Events, s *Service) {
	events.Every("identity.purge_sessions", sessionPurgeEvery, s.PurgeExpiredSessions)
}
