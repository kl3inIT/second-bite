package stats

import (
	"bytes"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const (
	phone = "Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) " +
		"Chrome/124.0.0.0 Mobile Safari/537.36"
	address = "113.161.10.20"
	home    = "/vi"
)

func TestPageOf(t *testing.T) {
	t.Parallel()

	id := uuid.MustParse("019a0b6e-7c1d-7e2f-8a3b-4c5d6e7f8a9b")

	for path, want := range map[string]struct {
		kind    string
		subject uuid.NullUUID
	}{
		"/":                          {KindHome, uuid.NullUUID{}},
		home:                         {KindHome, uuid.NullUUID{}},
		"/en/?utm_source=qr":         {KindHome, uuid.NullUUID{}},
		"/vi/sellers/" + id.String(): {KindSeller, uuid.NullUUID{UUID: id, Valid: true}},
		"/offers/" + id.String():     {KindOffer, uuid.NullUUID{UUID: id, Valid: true}},
		"/vi/sellers/not-an-id":      {KindOther, uuid.NullUUID{}},
		"/vi/cart":                   {KindOther, uuid.NullUUID{}},
		"/vi/orders/" + id.String():  {KindOther, uuid.NullUUID{}},
	} {
		kind, subject := pageOf(path)
		if kind != want.kind || subject != want.subject {
			t.Errorf("pageOf(%q) = %s, %v; want %s, %v", path, kind, subject, want.kind, want.subject)
		}
	}
}

func TestVisitorKey(t *testing.T) {
	t.Parallel()

	monday, tuesday := bytes.Repeat([]byte{1}, 32), bytes.Repeat([]byte{2}, 32)
	key := visitorKey(monday, address, phone)

	switch {
	case !bytes.Equal(key, visitorKey(monday, address, phone)):
		t.Error("one browser on one day has two keys")
	case bytes.Equal(key, visitorKey(tuesday, address, phone)):
		t.Error("one browser has the same key on two days")
	case bytes.Equal(key, visitorKey(monday, "113.161.10.21", phone)):
		t.Error("two addresses share a key")
	case bytes.Equal(visitorKey(monday, "1", "23"), visitorKey(monday, "12", "3")):
		t.Error("the address and the browser run into each other")
	}
}

func TestClientAddress(t *testing.T) {
	t.Parallel()

	for _, tc := range []struct{ forwarded, remote, want string }{
		{"113.161.10.20, 172.18.0.5", "172.18.0.6:41234", address},
		{"", "172.18.0.6:41234", "172.18.0.6"},
		{" ", "[::1]:8080", "::1"},
	} {
		if got := clientAddress(tc.forwarded, tc.remote); got != tc.want {
			t.Errorf("clientAddress(%q, %q) = %q, want %q", tc.forwarded, tc.remote, got, tc.want)
		}
	}
}

func TestDayOf(t *testing.T) {
	t.Parallel()

	// 23:30 in Hanoi is still the evening's day; 00:30 is the next one.
	evening := time.Date(2026, 10, 22, 16, 30, 0, 0, time.UTC)
	if got := dayOf(evening); got != time.Date(2026, 10, 22, 0, 0, 0, 0, time.UTC) {
		t.Errorf("dayOf(23:30 in Hanoi) = %s", got)
	}

	if got := dayOf(evening.Add(time.Hour)); got != time.Date(2026, 10, 23, 0, 0, 0, 0, time.UTC) {
		t.Errorf("dayOf(00:30 in Hanoi) = %s", got)
	}
}

func TestService(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)

	for name, check := range map[string]func(*testing.T, *pgxpool.Pool){
		"a view keeps its page, store and source, and one browser is one visitor": checkRecord,
		"a bot and a prefetch are not counted":                                    checkBotsDropped,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, pool)
		})
	}
}

// newService is a service whose clock reads at.
func newService(pool *pgxpool.Pool, at time.Time) *Service {
	s := NewService(pool, nil, nil, nil, platformtest.Logger()) // views only
	s.now = func() time.Time { return at }

	return s
}

type view struct {
	kind, source string
	subject      uuid.NullUUID
	visitor      []byte
}

// viewsOn reads the views of day in the order they were kept.
func viewsOn(t *testing.T, pool *pgxpool.Pool, day time.Time) []view {
	t.Helper()

	rows, err := pool.Query(t.Context(),
		`SELECT kind, source, subject_id, visitor FROM stats_views WHERE day = $1 ORDER BY id`, day)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()

	var got []view

	for rows.Next() {
		var v view
		if err := rows.Scan(&v.kind, &v.source, &v.subject, &v.visitor); err != nil {
			t.Fatal(err)
		}

		got = append(got, v)
	}

	if err := rows.Err(); err != nil {
		t.Fatal(err)
	}

	return got
}

func checkRecord(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	at := time.Date(2026, 3, 2, 12, 0, 0, 0, time.UTC)
	s := newService(pool, at)
	seller := uuid.New()

	for _, v := range []Visit{
		{Path: "/vi/sellers/" + seller.String(), Source: " QR ", Address: address, UserAgent: phone},
		{Path: home, Source: "<script>", Address: address, UserAgent: phone},
		{Path: home, Address: "113.161.10.99", UserAgent: phone},
	} {
		if err := s.Record(t.Context(), v); err != nil {
			t.Fatal(err)
		}
	}

	got := viewsOn(t, pool, dayOf(at))
	if len(got) != 3 {
		t.Fatalf("%d views kept, want 3", len(got))
	}

	if got[0].kind != KindSeller || got[0].subject.UUID != seller || got[0].source != "qr" {
		t.Errorf("the store's view = %+v", got[0])
	}

	if got[1].kind != KindHome || got[1].subject.Valid || got[1].source != "" {
		t.Errorf("the home's view = %+v; a source out of its pattern counts as none", got[1])
	}

	if !bytes.Equal(got[0].visitor, got[1].visitor) || bytes.Equal(got[1].visitor, got[2].visitor) {
		t.Error("one browser is not one visitor, or two browsers are one")
	}

	checkSaltSurvivesRestart(t, pool, at, got[0].visitor)
}

// checkSaltSurvivesRestart records the browser of first again from a second
// service, as after a restart, which reads the same salt for the day.
func checkSaltSurvivesRestart(t *testing.T, pool *pgxpool.Pool, at time.Time, first []byte) {
	t.Helper()

	if err := newService(pool, at).Record(t.Context(), Visit{Path: home, Address: address, UserAgent: phone}); err != nil {
		t.Fatal(err)
	}

	if again := viewsOn(t, pool, dayOf(at)); !bytes.Equal(again[len(again)-1].visitor, first) {
		t.Error("a restart made the same browser a new visitor")
	}
}

func checkBotsDropped(t *testing.T, pool *pgxpool.Pool) {
	t.Helper()

	at := time.Date(2026, 3, 3, 12, 0, 0, 0, time.UTC)
	s := newService(pool, at)

	for _, v := range []Visit{
		{Path: home, Address: address, UserAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"},
		{Path: home, Address: address, UserAgent: "facebookexternalhit/1.1"},
		{Path: home, Address: address, UserAgent: ""},
		{Path: home, Address: address, UserAgent: phone, Prefetch: true},
	} {
		if err := s.Record(t.Context(), v); err != nil {
			t.Fatal(err)
		}
	}

	if got := viewsOn(t, pool, dayOf(at)); len(got) != 0 {
		t.Errorf("%d views of bots and prefetches kept, want none", len(got))
	}
}

// TestForgetOld has a database of its own: forgetting deletes every salt before
// today, so on TestService's it would delete the salts of the checks recording
// views beside it (SEC-151).
func TestForgetOld(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	long := time.Date(2025, 1, 10, 12, 0, 0, 0, time.UTC)
	yesterday := time.Date(2026, 3, 9, 12, 0, 0, 0, time.UTC)
	today := yesterday.AddDate(0, 0, 1)

	for _, at := range []time.Time{long, yesterday, today} {
		if err := newService(pool, at).Record(t.Context(), Visit{Path: home, Address: address, UserAgent: phone}); err != nil {
			t.Fatal(err)
		}
	}

	if err := newService(pool, today).ForgetOld(t.Context()); err != nil {
		t.Fatal(err)
	}

	var salts []time.Time

	rows, err := pool.Query(t.Context(), `SELECT day FROM stats_salts WHERE day IN ($1, $2, $3)`,
		dayOf(long), dayOf(yesterday), dayOf(today))
	if err != nil {
		t.Fatal(err)
	}

	for rows.Next() {
		var d time.Time
		if err := rows.Scan(&d); err != nil {
			t.Fatal(err)
		}

		salts = append(salts, d)
	}

	rows.Close()

	if len(salts) != 1 || !salts[0].Equal(dayOf(today)) {
		t.Errorf("salts kept %v, want only today's", salts)
	}

	if len(viewsOn(t, pool, dayOf(long))) != 0 || len(viewsOn(t, pool, dayOf(yesterday))) != 1 {
		t.Error("views older than a year and a little more stay, or yesterday's went")
	}
}
