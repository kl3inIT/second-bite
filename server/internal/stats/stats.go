// Package stats counts the pages people open on the site, for the prototype's
// numbers (SEC-80). A view is kept with its day, the kind of page and the
// store or dish it names, where the visitor came from, and a visitor key: a
// hash of the day's salt, the address and the browser, so one browser counts
// once a day and nobody can be traced, as the salt is deleted after its day
// (Plausible's daily salts). No cookie, address or browser name is stored.
package stats

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"log/slog"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"zgo.at/isbot"

	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/offer"
	"github.com/kl3inIT/second-bite/server/internal/order"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller"
	"github.com/kl3inIT/second-bite/server/internal/stats/internal/db"
)

// The kinds of page a view is of.
const (
	KindHome   = "home"
	KindSeller = "seller"
	KindOffer  = "offer"
	KindOther  = "other"
)

// viewsKept is how long views are kept: a year and a little more, so a day can
// be compared with the same day a year before.
const viewsKept = 400

// vietnam is the zone a view's day is counted in, as the orders' days are.
var vietnam = time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60)

// sourcePattern is what a source may be; anything else is counted as none.
var sourcePattern = regexp.MustCompile(`^[a-z0-9_-]{1,40}$`)

// locales are the web's locale prefixes, which a path starts with.
var locales = map[string]bool{"vi": true, "en": true}

// Service keeps the views and reads the admin's report, asking the accounts,
// the posts, the orders and the stores' names of the modules that own them.
type Service struct {
	queries    *db.Queries
	identities *identity.Service
	offers     *offer.Service
	orders     *order.Service
	sellers    *seller.Service
	logger     *slog.Logger
	now        func() time.Time

	mu    sync.Mutex
	salts map[string][]byte // the day's salt, by day, so a view reads it once

	// viewsByAddress bounds the views one address counts; past it they are
	// dropped as a bot's are (SEC-160).
	viewsByAddress *platform.Limiter
}

// viewsPerAddress views are counted from one address in ten minutes.
const viewsPerAddress = 600

// NewService assembles the module.
func NewService(
	pool *pgxpool.Pool, identities *identity.Service, offers *offer.Service, orders *order.Service,
	sellers *seller.Service, logger *slog.Logger,
) *Service {
	return &Service{
		queries: db.New(pool), identities: identities, offers: offers, orders: orders, sellers: sellers, logger: logger,
		now: time.Now, salts: map[string][]byte{},
		viewsByAddress: platform.NewLimiter(viewsPerAddress, 10*time.Minute),
	}
}

// RegisterSchedules runs the module's nightly cleanup.
func RegisterSchedules(events *platform.Events, s *Service) {
	events.Every("stats.forget_old", 24*time.Hour, s.ForgetOld)
}

// Visit is one page on screen in a browser, as the request told it.
type Visit struct {
	Path      string
	Source    string
	Address   string
	UserAgent string
	// Prefetch is true when the browser only fetched the page ahead.
	Prefetch bool
}

// Record keeps v as a view unless a bot or a prefetch sent it, which it drops
// without an error: the page that sent it never hears of the count.
func (s *Service) Record(ctx context.Context, v Visit) error {
	if v.Prefetch || isbot.Is(isbot.UserAgent(v.UserAgent)) || isbot.Is(isbot.IPRange(v.Address)) {
		return nil
	}

	if !s.counts(ctx) {
		return nil
	}

	day := dayOf(s.now())

	salt, err := s.salt(ctx, day)
	if err != nil {
		return err
	}

	kind, subject := pageOf(v.Path)

	source := strings.ToLower(strings.TrimSpace(v.Source))
	if !sourcePattern.MatchString(source) {
		source = ""
	}

	if err := s.queries.InsertView(ctx, db.InsertViewParams{
		Day:       date(day),
		Kind:      kind,
		SubjectID: subject,
		Source:    source,
		Visitor:   visitorKey(salt, v.Address, v.UserAgent),
	}); err != nil {
		return fmt.Errorf("keeping a view: %w", err)
	}

	return nil
}

// salt is the salt of day: the one stored, or a new random one stored first.
// Two instances racing both read the one that was stored first.
func (s *Service) salt(ctx context.Context, day time.Time) ([]byte, error) {
	key := day.Format(time.DateOnly)

	s.mu.Lock()
	salt, ok := s.salts[key]
	s.mu.Unlock()

	if ok {
		return salt, nil
	}

	// The database is asked without the lock, so one slow call does not hold
	// every view back (SEC-167); views racing here all read the salt stored
	// first, as two instances do.
	fresh := make([]byte, sha256.Size)
	_, _ = rand.Read(fresh) // never fails, as documented

	if err := s.queries.InsertSalt(ctx, db.InsertSaltParams{Day: date(day), Salt: fresh}); err != nil {
		return nil, fmt.Errorf("storing the day's salt: %w", err)
	}

	salt, err := s.queries.GetSalt(ctx, date(day))
	if err != nil {
		return nil, fmt.Errorf("reading the day's salt: %w", err)
	}

	s.mu.Lock()
	s.salts = map[string][]byte{key: salt} // yesterday's is no longer needed
	s.mu.Unlock()

	return salt, nil
}

// ForgetOld deletes the salts of the days that are over, so their visitor keys
// can never be computed again, and the views older than viewsKept days.
// Running it again changes nothing more.
func (s *Service) ForgetOld(ctx context.Context) error {
	today := dayOf(s.now())

	salts, err := s.queries.DeleteSaltsBefore(ctx, date(today))
	if err != nil {
		return fmt.Errorf("forgetting old salts: %w", err)
	}

	views, err := s.queries.DeleteViewsBefore(ctx, date(today.AddDate(0, 0, -viewsKept)))
	if err != nil {
		return fmt.Errorf("forgetting old views: %w", err)
	}

	if salts > 0 || views > 0 {
		s.logger.InfoContext(ctx, "old views forgotten",
			slog.String("event", "stats.views.forgotten_old"),
			slog.Int64("salts_forgotten", salts),
			slog.Int64("views_forgotten", views),
		)
	}

	return nil
}

// pageOf reads the kind of page a path is and the store or dish it names:
// "/vi" is the home, "/vi/sellers/{id}" a store and "/vi/offers/{id}" a dish,
// with or without the locale; anything else is other.
func pageOf(path string) (string, uuid.NullUUID) {
	path, _, _ = strings.Cut(path, "?")
	parts := strings.FieldsFunc(path, func(r rune) bool { return r == '/' })

	if len(parts) > 0 && locales[parts[0]] {
		parts = parts[1:]
	}

	switch {
	case len(parts) == 0:
		return KindHome, uuid.NullUUID{}
	case len(parts) == 2 && (parts[0] == "sellers" || parts[0] == "offers"):
		id, err := uuid.Parse(parts[1])
		if err != nil {
			return KindOther, uuid.NullUUID{}
		}

		if parts[0] == "sellers" {
			return KindSeller, uuid.NullUUID{UUID: id, Valid: true}
		}

		return KindOffer, uuid.NullUUID{UUID: id, Valid: true}
	default:
		return KindOther, uuid.NullUUID{}
	}
}

// visitorKey is sha256 of the salt, the address and the browser, each part
// ended by a zero byte so two parts never run into each other.
func visitorKey(salt []byte, address, userAgent string) []byte {
	h := sha256.New()
	h.Write(salt)
	h.Write([]byte{0})
	h.Write([]byte(address))
	h.Write([]byte{0})
	h.Write([]byte(userAgent))

	return h.Sum(nil)
}

// dayOf is the calendar day in Vietnam at t, as midnight UTC of that date.
func dayOf(t time.Time) time.Time {
	y, m, d := t.In(vietnam).Date()
	return time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
}

func date(day time.Time) pgtype.Date { return pgtype.Date{Time: day, Valid: true} }

// counts says whether a view from the request's address is still counted: past
// viewsPerAddress in ten minutes it is dropped, as a bot's is (SEC-160).
func (s *Service) counts(ctx context.Context) bool {
	return s.viewsByAddress.TakeFor(ctx) == nil
}
