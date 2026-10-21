package notification

import (
	"bytes"
	"context"
	"errors"
	"slices"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

// senderName is who the test emails are from.
const senderName = "Second Bite"

// TestSettingsSaved runs in one database of its own, since the settings are
// one row: the first save, a second first save, then a change with the
// version read, each as the trail records it.
func TestSettingsSaved(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	logger := platformtest.Logger()

	s, err := NewService(pool, audit.NewService(pool, logger), Config{SettingsKey: bytes.Repeat([]byte{7}, 32)}, logger)
	if err != nil {
		t.Fatal(err)
	}

	admin := platform.WithCaller(t.Context(), platform.Caller{
		AccountID: uuid.New(), Role: platform.RoleAdmin, Label: "admin@example.com",
	})
	first := EmailSettingsChange{
		Provider: EmailProviderSMTP, SenderAddress: "noreply@example.com", SenderName: senderName,
		SMTPHost: "smtp.example.com", SMTPPort: 587, SMTPSecurity: SMTPSecuritySTARTTLS,
		SMTPUsername: "mailer@example.com", SMTPPassword: "a password",
	}

	if _, err := s.EmailSettings(admin); !errors.Is(err, ErrEmailNotConfigured) {
		t.Fatalf("reading before any save: %v, want ErrEmailNotConfigured", err)
	}

	if err := s.CreateEmailSettings(admin, first); err != nil {
		t.Fatalf("the first save: %v", err)
	}

	if err := s.CreateEmailSettings(admin, first); !errors.Is(err, platform.ErrChangedSinceRead) {
		t.Errorf("a first save over saved settings: %v, want ErrChangedSinceRead", err)
	}

	read, err := s.EmailSettings(admin)
	if err != nil || read.SenderName != senderName || !read.SMTPPasswordSet {
		t.Fatalf("read after the first save: %+v, %v", read, err)
	}

	renamed := first
	renamed.SenderName, renamed.SMTPPassword, renamed.SMTPUsername = senderName+" Tasco", "another password", "other@example.com"

	if err := s.SaveEmailSettings(admin, renamed, read.UpdatedAt); err != nil {
		t.Fatalf("a change at the version read: %v", err)
	}

	checkLastChanges(t, pool, `[{"to": "Second Bite Tasco", "from": "Second Bite", "field": "senderName"}, {"field": "smtpUsername"}, {"field": "smtpPassword"}]`)

	checkTestEmail(admin, t, s)

	customer := platform.WithCaller(context.Background(), platform.Caller{AccountID: uuid.New(), Role: platform.RoleCustomer})
	if err := s.CreateEmailSettings(customer, first); !errors.Is(err, platform.ErrAdminRequired) {
		t.Errorf("a customer: %v, want ErrAdminRequired", err)
	}
}

// checkLastChanges checks the changes the last email settings event keeps:
// the values of what may be kept, and only the name of a secret or the user.
func checkLastChanges(t *testing.T, pool *pgxpool.Pool, want string) {
	t.Helper()

	var got string
	if err := pool.QueryRow(t.Context(), `SELECT details->'changes' FROM audit_events
		WHERE action = 'email_settings.change' ORDER BY occurred_at DESC, id DESC LIMIT 1`).Scan(&got); err != nil {
		t.Fatal(err)
	}

	if got != want {
		t.Errorf("changes %s, want %s", got, want)
	}
}

// fakeSender answers err, or delivers; it keeps who each email went to.
type fakeSender struct {
	err error
	to  []string
}

func (f *fakeSender) Send(_ context.Context, _ providerConfig, e Email) (string, error) {
	if f.err != nil {
		return "", f.err
	}

	f.to = append(f.to, e.To)

	return "fake-id", nil
}

// checkTestEmail checks who a test email goes to, and that a failure says
// whether the provider refused or could not be reached.
func checkTestEmail(admin context.Context, t *testing.T, s *Service) {
	t.Helper()

	delivered := &fakeSender{}
	s.senders[EmailProviderSMTP] = delivered

	if err := s.SendTestEmail(admin, ""); err != nil {
		t.Fatalf("a test email to oneself: %v", err)
	}

	if err := s.SendTestEmail(admin, "bep@example.com"); err != nil {
		t.Fatalf("a test email to another mailbox: %v", err)
	}

	if want := []string{"admin@example.com", "bep@example.com"}; !slices.Equal(delivered.to, want) {
		t.Errorf("test emails went to %v, want %v", delivered.to, want)
	}

	for outcome, want := range map[sendOutcome]error{
		sendRefused:     ErrTestEmailRefused,
		sendUnavailable: ErrTestEmailUnreachable,
		sendRateLimited: ErrEmailUnavailable,
	} {
		s.senders[EmailProviderSMTP] = &fakeSender{err: &sendError{outcome: outcome, cause: errors.New("the provider's own words")}}

		if err := s.SendTestEmail(admin, ""); !errors.Is(err, want) {
			t.Errorf("a test email whose send ends in outcome %d: %v, want %v", outcome, err, want)
		}
	}
}
