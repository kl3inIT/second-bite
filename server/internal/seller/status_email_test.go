package seller

import (
	"strings"
	"testing"
)

func TestStatusEmail(t *testing.T) {
	t.Parallel()

	const reason = "Bán đồ quá hạn <b>nhiều lần</b>"

	for _, tt := range []struct {
		status     Status
		reason     string
		subject    string
		withReason bool
	}{
		{StatusActive, "", "Cửa hàng Bếp Cô Ba đã được duyệt · Bếp Cô Ba is approved on Second Bite", false},
		{StatusRejected, reason, "Cửa hàng Bếp Cô Ba chưa được duyệt · Bếp Cô Ba was not approved on Second Bite", true},
		{StatusBlocked, reason, "Cửa hàng Bếp Cô Ba đã bị tạm khoá · Bếp Cô Ba is blocked on Second Bite", true},
	} {
		t.Run(string(tt.status), func(t *testing.T) {
			t.Parallel()

			e, ok := statusEmail("owner@example.com", "Bếp Cô\r\nBa", tt.status, tt.reason)
			if !ok {
				t.Fatal("no email")
			}

			if e.Subject != tt.subject || e.To != "owner@example.com" || e.Kind != "seller-status-"+string(tt.status) {
				t.Errorf("subject %q, to %q, kind %q", e.Subject, e.To, e.Kind)
			}

			if got := strings.Count(e.Text, reason); got != map[bool]int{true: 2, false: 0}[tt.withReason] {
				t.Errorf("the reason appears %d times in the text, once per language wanted", got)
			}

			if strings.Contains(e.HTML, "<b>") {
				t.Errorf("the reason reached the HTML unescaped: %s", e.HTML)
			}
		})
	}
}

func TestStatusEmailNoneWhilePending(t *testing.T) {
	t.Parallel()

	if _, ok := statusEmail("owner@example.com", "Bếp Cô Ba", StatusPending, ""); ok {
		t.Error("an email for a pending seller")
	}
}
