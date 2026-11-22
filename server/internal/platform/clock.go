package platform

import (
	"regexp"

	"github.com/jackc/pgx/v5/pgtype"
)

// clockPattern is a time of day as HH:MM, from 00:00 to 23:59; 24:00 also
// ends a range, at midnight.
var clockPattern = regexp.MustCompile(`^(([01][0-9]|2[0-3]):[0-5][0-9]|24:00)$`)

// Clock is a part of every day in Vietnam, [From, Until) as HH:MM, by which
// the admins' lists and report keep what starts within it, such as 17:30 to
// 21:15. The zero Clock is the whole day.
type Clock struct {
	From, Until string
}

// ParseClock reads a part of the day; both ends empty is the whole day. It
// refuses one end alone, a time not written HH:MM, 24:00 as a start, and a
// range that does not start before it ends.
func ParseClock(from, until string) (Clock, bool) {
	if from == "" && until == "" {
		return Clock{}, true
	}

	if !clockPattern.MatchString(from) || !clockPattern.MatchString(until) || from == "24:00" || from >= until {
		return Clock{}, false
	}

	return Clock{From: from, Until: until}, true
}

// IsZero is true for the whole day.
func (c Clock) IsZero() bool { return c.From == "" && c.Until == "" }

// Bounds are the range's ends for a query, both null for the whole day; the
// query compares them as times with what it keeps, in Vietnam.
func (c Clock) Bounds() (from, until pgtype.Text) {
	if c.IsZero() {
		return pgtype.Text{}, pgtype.Text{}
	}

	return pgtype.Text{String: c.From, Valid: true}, pgtype.Text{String: c.Until, Valid: true}
}
