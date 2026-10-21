package platform

import (
	"strconv"
	"strings"
	"time"
)

// ErrChangedSinceRead refuses a change sent with a version that is no longer
// the current one, so two admins saving at once cannot overwrite each other
// unseen (SEC-75). The caller reads again and decides.
var ErrChangedSinceRead = NewFailure("PLATFORM_CHANGED_SINCE_READ", CategoryStale, Words{
	VI: "Người khác vừa thay đổi mục này sau khi bạn mở. Tải lại để xem bản mới rồi thử lại.",
	EN: "Someone changed this after you opened it. Reload to see the new version, then try again.",
})

// ETag is the version of a row changed at updatedAt, as the strong entity tag
// a read answers in ETag and a change sends back in If-Match. PostgreSQL keeps
// microseconds, so they are the version.
func ETag(updatedAt time.Time) string {
	return `"` + strconv.FormatInt(updatedAt.UnixMicro(), 10) + `"`
}

// VersionOf reads the version an If-Match header names. Anything but one
// entity tag ETag made, a weak tag or "*" among them, names no version.
func VersionOf(ifMatch string) (time.Time, bool) {
	tag, ok := strings.CutPrefix(strings.TrimSpace(ifMatch), `"`)
	if !ok {
		return time.Time{}, false
	}

	tag, ok = strings.CutSuffix(tag, `"`)
	if !ok {
		return time.Time{}, false
	}

	micros, err := strconv.ParseInt(tag, 10, 64)
	if err != nil || micros <= 0 {
		return time.Time{}, false
	}

	return time.UnixMicro(micros), true
}

// SameVersion reports whether a row changed at updatedAt is at version.
func SameVersion(updatedAt, version time.Time) bool {
	return updatedAt.UnixMicro() == version.UnixMicro()
}
