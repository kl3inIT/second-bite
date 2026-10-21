package seller

import (
	"context"
	"errors"
	"fmt"
	"html"
	"log/slog"
	"strings"
	"unicode"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/notification"
)

// StatusChangedEvent tells that an admin approved, rejected or blocked a
// seller (SEC-75). It carries identifiers and the status only.
type StatusChangedEvent struct {
	SellerID uuid.UUID `json:"sellerId"`
	Status   Status    `json:"status"`
}

// EventKey names the event where it is stored, delivered and logged.
func (StatusChangedEvent) EventKey() string { return "seller.status_changed" }

// tellOwner emails the owner what became of their seller, with the reason
// an admin gave. A seller changed again since, gone or without an owner is
// not written about. When no email provider is chosen, it gives up rather
// than retry for hours; a provider's failure is retried, so an owner may
// rarely get the same email twice.
func (s *Service) tellOwner(ctx context.Context, e StatusChangedEvent) error {
	row, err := s.queries.GetSeller(ctx, e.SellerID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil
	}

	if err != nil {
		return fmt.Errorf("reading the seller: %w", err)
	}

	if Status(row.Status) != e.Status {
		return nil
	}

	owners, err := s.queries.OwnersOf(ctx, []uuid.UUID{e.SellerID})
	if err != nil {
		return fmt.Errorf("reading the owner: %w", err)
	}

	if len(owners) == 0 {
		return nil
	}

	accounts, err := s.accounts.Accounts(ctx, []uuid.UUID{owners[0].AccountID})
	if err != nil {
		return err
	}

	owner, ok := accounts[owners[0].AccountID]
	if !ok {
		return nil
	}

	email, ok := statusEmail(owner.Email, row.Name, e.Status, row.StatusReason.String)
	if !ok {
		return nil
	}

	err = s.mail.SendEmail(ctx, email)
	if errors.Is(err, notification.ErrEmailNotConfigured) {
		s.logger.WarnContext(ctx, "owner not told: email not configured",
			slog.String("event", "seller.owner.not_told"),
			slog.String("seller_id", e.SellerID.String()),
			slog.String("error_code", notification.ErrEmailNotConfigured.Code),
		)

		return nil
	}

	return err
}

// statusEmail is the email that tells an owner their seller's new status,
// in Vietnamese then English, as every email of the service is; none for a
// seller waiting for an admin.
func statusEmail(to, name string, status Status, reason string) (notification.Email, bool) {
	name = oneLine(name)

	var vi, en, viBody, enBody string

	switch status {
	case StatusActive:
		vi, en = "Cửa hàng "+name+" đã được duyệt", name+" is approved on Second Bite"
		viBody = "Cửa hàng của bạn đã được duyệt. Bạn và nhân viên có thể đăng món, và khách sẽ thấy cửa hàng trên Second Bite."
		enBody = "Your seller is approved. You and your staff can post offers, and customers see it on Second Bite."
	case StatusRejected:
		vi, en = "Cửa hàng "+name+" chưa được duyệt", name+" was not approved on Second Bite"
		viBody = "Cửa hàng của bạn chưa được duyệt. Lý do quản trị viên ghi lại:"
		enBody = "Your seller was not approved. The reason the admin gave:"
	case StatusBlocked:
		vi, en = "Cửa hàng "+name+" đã bị tạm khoá", name+" is blocked on Second Bite"
		viBody = "Cửa hàng của bạn đã bị tạm khoá: món đăng không còn hiện với khách, và chưa đăng thêm được. Lý do quản trị viên ghi lại:"
		enBody = "Your seller is blocked: its offers no longer show to customers, and none can be posted. The reason the admin gave:"
	case StatusPending:
		return notification.Email{}, false
	}

	text := viBody + "\n"
	htmlBody := "<p>" + html.EscapeString(viBody) + "</p>"

	if reason != "" {
		text += reason + "\n"
		htmlBody += `<blockquote style="white-space:pre-line">` + html.EscapeString(reason) + "</blockquote>"
	}

	text += "\n" + enBody + "\n"
	htmlBody += "<hr><p>" + html.EscapeString(enBody) + "</p>"

	if reason != "" {
		text += reason + "\n"
		htmlBody += `<blockquote style="white-space:pre-line">` + html.EscapeString(reason) + "</blockquote>"
	}

	return notification.Email{
		Kind: "seller-status-" + string(status), To: to, Subject: vi + " · " + en, Text: text, HTML: htmlBody,
	}, true
}

// oneLine keeps a name to one line of printable text, for a subject.
func oneLine(s string) string {
	return strings.Join(strings.Fields(strings.Map(func(r rune) rune {
		if unicode.IsControl(r) {
			return ' '
		}

		return r
	}, s)), " ")
}
