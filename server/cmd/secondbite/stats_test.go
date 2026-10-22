package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// codeRequestInvalid is the problem of a request out of its contract.
const codeRequestInvalid = "PLATFORM_REQUEST_INVALID"

// checkViewCounted sends a page view without a session, as the web does: a
// phone's is kept with the address the proxy forwarded, a bot's is answered
// the same and not kept.
func checkViewCounted(t *testing.T, svc service) {
	t.Helper()

	seller := uuid.New()
	path := "/vi/sellers/" + seller.String()

	phone := http.Header{
		"User-Agent":      {"Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36"},
		"X-Forwarded-For": {"113.161.10.20, 172.18.0.5"},
	}
	bot := http.Header{"User-Agent": {"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}}

	for _, header := range []http.Header{phone, bot} {
		if resp := send(t, http.MethodPost, svc.base+"/stats/views", header,
			map[string]string{"path": path, "source": "qr"}); resp.status != http.StatusNoContent {
			t.Fatalf("status %d, want 204; body %s", resp.status, resp.body)
		}
	}

	conn, err := pgx.Connect(t.Context(), svc.dsn)
	if err != nil {
		t.Fatal(err)
	}

	defer func() {
		if err := conn.Close(context.WithoutCancel(t.Context())); err != nil {
			t.Error(err)
		}
	}()

	var views int
	if err := conn.QueryRow(t.Context(),
		`SELECT count(*) FROM stats_views WHERE kind = 'seller' AND subject_id = $1 AND source = 'qr'`, seller,
	).Scan(&views); err != nil {
		t.Fatal(err)
	}

	if views != 1 {
		t.Errorf("%d views kept, want the phone's only", views)
	}

	if p := send(t, http.MethodPost, svc.base+"/stats/views", phone, map[string]string{"path": ""}).
		problem(t, http.StatusBadRequest); p.Code != codeRequestInvalid {
		t.Errorf("an empty path: %q", p.Code)
	}
}
