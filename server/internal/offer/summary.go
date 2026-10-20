package offer

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/offer/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// summaryListed is how many sellers and offers a summary lists.
const summaryListed = 5

// Summary is what admins see of the offers at a glance.
type Summary struct {
	// Posted counts the offers posted in the range, whatever became of them.
	Posted int
	// UnitsPosted adds up the units those offers put up.
	UnitsPosted int64
	// OnSale and SoldOut count the offers customers can order now and those
	// they see sold out now, whenever posted; a blocked seller's are left
	// out, as search leaves them out.
	OnSale  int
	SoldOut int
	// PostedPerDay holds the days of the range on which offers were posted,
	// in order; a day without any is absent.
	PostedPerDay []platform.DayCount
	// TopPosters are the five sellers that posted most in the range.
	TopPosters []Poster
	// Latest are the five offers posted last, whenever that was, newest
	// first.
	Latest []Posted
}

// Poster is a seller and how many offers it posted in a range, under the
// name its newest offer copied.
type Poster struct {
	SellerID   uuid.UUID
	SellerName string
	Posted     int
}

// Posted is an offer as a summary lists it, with its seller's name as the
// offer copied it.
type Posted struct {
	ID         uuid.UUID
	Name       string
	SellerID   uuid.UUID
	SellerName string
	PostedAt   time.Time
}

// Summary returns the offers' summary over [from, to), to admins.
func (s *Service) Summary(ctx context.Context, from, to time.Time) (Summary, error) {
	if _, err := platform.RequireAdmin(ctx); err != nil {
		return Summary{}, err
	}

	posted, err := s.queries.SummarizePosted(ctx, db.SummarizePostedParams{RangeStart: from, RangeEnd: to})
	if err != nil {
		return Summary{}, fmt.Errorf("counting the offers posted: %w", err)
	}

	blocked, err := s.sellers.Blocked(ctx)
	if err != nil {
		return Summary{}, err
	}

	open, err := s.queries.SummarizeOpen(ctx, blocked)
	if err != nil {
		return Summary{}, fmt.Errorf("counting the offers open: %w", err)
	}

	out := Summary{
		Posted: int(posted.Posted), UnitsPosted: posted.Units, OnSale: int(open.OnSale), SoldOut: int(open.SoldOut),
	}

	if out.PostedPerDay, err = s.postedPerDay(ctx, from, to); err != nil {
		return Summary{}, err
	}

	if out.TopPosters, err = s.topPosters(ctx, from, to); err != nil {
		return Summary{}, err
	}

	if out.Latest, err = s.latest(ctx); err != nil {
		return Summary{}, err
	}

	return out, nil
}

func (s *Service) postedPerDay(ctx context.Context, from, to time.Time) ([]platform.DayCount, error) {
	rows, err := s.queries.PostedPerDay(ctx, db.PostedPerDayParams{RangeStart: from, RangeEnd: to})
	if err != nil {
		return nil, fmt.Errorf("counting the offers per day: %w", err)
	}

	days := make([]platform.DayCount, 0, len(rows))
	for _, r := range rows {
		days = append(days, platform.DayCount{Day: r.Day.In(platform.Vietnam), Count: int(r.Posted)})
	}

	return days, nil
}

func (s *Service) topPosters(ctx context.Context, from, to time.Time) ([]Poster, error) {
	rows, err := s.queries.TopPosters(ctx, db.TopPostersParams{RangeStart: from, RangeEnd: to, MaxRows: summaryListed})
	if err != nil {
		return nil, fmt.Errorf("ranking the sellers by offers: %w", err)
	}

	top := make([]Poster, 0, len(rows))
	for _, r := range rows {
		top = append(top, Poster{SellerID: r.SellerID, SellerName: r.SellerName, Posted: int(r.Posted)})
	}

	return top, nil
}

func (s *Service) latest(ctx context.Context) ([]Posted, error) {
	rows, err := s.queries.LatestOffers(ctx, summaryListed)
	if err != nil {
		return nil, fmt.Errorf("listing the newest offers: %w", err)
	}

	latest := make([]Posted, 0, len(rows))
	for _, r := range rows {
		latest = append(latest, Posted{ID: r.ID, Name: r.Name, SellerID: r.SellerID, SellerName: r.SellerName, PostedAt: r.CreatedAt})
	}

	return latest, nil
}
