package offer

import (
	"slices"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
)

// Kind is what an offer is, from a fixed list, as Too Good To Go and Open Food
// Network give each offer one category; Sharing Excess measures food saved by
// category.
type Kind string

// The kinds of offer.
const (
	KindBakery       Kind = "bakery"
	KindPreparedFood Kind = "prepared_food"
	KindIngredients  Kind = "ingredients"
	KindDrinks       Kind = "drinks"
	// KindMixedBox is a bag of several things, described by what it may hold,
	// as Too Good To Go's Surprise Bag.
	KindMixedBox Kind = "mixed_box"
	KindOther    Kind = "other"
)

var kinds = []Kind{KindBakery, KindPreparedFood, KindIngredients, KindDrinks, KindMixedBox, KindOther}

// defaultUnit is what one unit is called when staff name none.
const defaultUnit = "suất"

// Details are what staff enter for an offer.
type Details struct {
	Name        string
	Description string
	Kind        Kind
	Unit        string
	Units       int
	PriceVND    int64
	// OriginalPriceVND is what the food sells for normally; the price must be
	// the minimum discount below it.
	OriginalPriceVND int64
	// WeightGrams of one unit is optional: it lets food saved be measured in
	// weight, not only in units.
	WeightGrams *int
	PhotoID     uuid.UUID
	WindowStart time.Time
	WindowEnd   time.Time
}

// normalized trims the details, names the unit when staff named none, and
// checks each field's own bounds.
func (d Details) normalized() (Details, error) {
	d.Name = strings.TrimSpace(d.Name)
	d.Description = strings.TrimSpace(d.Description)
	d.Unit = strings.TrimSpace(d.Unit)

	if d.Unit == "" {
		d.Unit = defaultUnit
	}

	if !d.textValid() || !d.amountsValid() || d.PhotoID == uuid.Nil {
		return Details{}, ErrDetailsInvalid
	}

	return d, nil
}

// textValid checks the name, the description, the unit and the kind; a mixed
// box is described by what it may hold.
func (d Details) textValid() bool {
	return between(utf8.RuneCountInString(d.Name), 1, 80) &&
		utf8.RuneCountInString(d.Description) <= 1000 &&
		between(utf8.RuneCountInString(d.Unit), 1, 20) &&
		knownKind(d.Kind) &&
		(d.Kind != KindMixedBox || d.Description != "")
}

// amountsValid checks the units, the prices and the weight.
func (d Details) amountsValid() bool {
	return between(d.Units, 1, 999) &&
		d.PriceVND >= 1000 && d.OriginalPriceVND > d.PriceVND &&
		(d.WeightGrams == nil || between(*d.WeightGrams, 1, 100_000))
}

// checkDiscount holds the price at least the minimum discount below the
// original price.
func checkDiscount(price, original int64, set Settings) error {
	if price*100 > original*int64(100-set.MinDiscountPercent) {
		return ErrDiscountTooSmall
	}

	return nil
}

// checkWindow holds a collection window to the settings' length, not over,
// and starting soon enough.
func checkWindow(start, end, now time.Time, set Settings) error {
	length := end.Sub(start)
	if length < set.WindowMin || length > set.WindowMax || !end.After(now) || start.After(now.Add(set.StartsWithin)) {
		return ErrWindowInvalid
	}

	return nil
}

// discountPercent is how far below the original price an offer is, rounded
// down.
func discountPercent(price, original int64) int {
	return int((original - price) * 100 / original)
}

func knownKind(k Kind) bool { return slices.Contains(kinds, k) }

func between(n, lo, hi int) bool { return n >= lo && n <= hi }
