package order

import (
	"crypto/subtle"
	"regexp"
	"strings"
	"unicode/utf8"
)

// Contact is who collects an order: the name the seller calls at the counter
// and a Vietnamese phone number, given with every order, signed in or not.
type Contact struct {
	Name  string
	Phone string
	// ByZalo is the customer's consent, asked at checkout, to be told about
	// the order by Zalo once Second Bite can send there (SEC-25 decision 12).
	ByZalo bool
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

// accessMatches compares what a reader sent with the order's access, which is
// random and stored with it, in constant time; nothing sent never matches.
func (o Order) accessMatches(given string) bool {
	return given != "" && subtle.ConstantTimeCompare([]byte(o.access), []byte(given)) == 1
}
