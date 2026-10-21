package order

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/binary"
	"fmt"

	"github.com/google/uuid"
)

// code is an order's four-digit collection code: HMAC-SHA-256 of the order's
// identifier under the code key, reduced to four digits. It is derived when
// needed and never stored, so a copy of the database holds no code; three
// wrong codes lock it, which bounds guessing.
func (s *Service) code(orderID uuid.UUID) string {
	mac := hmac.New(sha256.New, s.codeKey)
	mac.Write(orderID[:])

	return fmt.Sprintf("%04d", binary.BigEndian.Uint32(mac.Sum(nil))%10_000)
}

// codeMatches compares a code given at the counter with an order's, in
// constant time.
func (s *Service) codeMatches(orderID uuid.UUID, given string) bool {
	return subtle.ConstantTimeCompare([]byte(s.code(orderID)), []byte(given)) == 1
}
