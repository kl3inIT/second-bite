package order

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/google/uuid"
)

// Contact is who collects an order: the name the seller calls at the counter
// and a Vietnamese phone number, given with every order, signed in or not.
type Contact struct {
	Name  string
	Phone string
}

// maxNameLength is as long as an account's display name may be.
const maxNameLength = 50

var phonePattern = regexp.MustCompile(`^0[0-9]{9}$`)

// normalized is the contact as stored: the name trimmed, the phone number's
// spaces, dots and dashes taken out and +84 written as 0, or
// ErrContactInvalid.
func (c Contact) normalized() (Contact, error) {
	name := strings.TrimSpace(c.Name)
	phone := strings.NewReplacer(" ", "", ".", "", "-", "").Replace(strings.TrimSpace(c.Phone))

	if rest, ok := strings.CutPrefix(phone, "+84"); ok {
		phone = "0" + rest
	}

	if n := utf8.RuneCountInString(name); n < 1 || n > maxNameLength || !phonePattern.MatchString(phone) {
		return Contact{}, ErrContactInvalid
	}

	return Contact{Name: name, Phone: phone}, nil
}

// access is what proves an order is theirs to whoever placed it without
// signing in: HMAC-SHA-256 of the order's identifier under the code key,
// apart from the collection code by its label. Derived when needed and never
// stored, so the same order always has the same one.
func (s *Service) access(orderID uuid.UUID) string {
	mac := hmac.New(sha256.New, s.codeKey)
	mac.Write([]byte("access:"))
	mac.Write(orderID[:])

	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil)[:18])
}

// accessMatches compares what a reader sent with an order's access, in
// constant time; nothing sent never matches.
func (s *Service) accessMatches(orderID uuid.UUID, given string) bool {
	return given != "" && subtle.ConstantTimeCompare([]byte(s.access(orderID)), []byte(given)) == 1
}
