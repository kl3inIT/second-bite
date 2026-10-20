package platform

import "time"

// Vietnam is the time zone times are shown in (persistence guideline). It is
// seven hours ahead of UTC all year, without daylight saving since 1975, so
// it needs no time zone database; PostgreSQL names it Asia/Ho_Chi_Minh.
var Vietnam = time.FixedZone("Asia/Ho_Chi_Minh", 7*60*60)

// DayCount is how many things happened on one day in Vietnam time, as the
// modules' summaries for admins count them.
type DayCount struct {
	// Day is the day's first instant, midnight in Vietnam.
	Day   time.Time
	Count int
}
