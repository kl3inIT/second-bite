package identity

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"sync"
	"unicode/utf8"

	"golang.org/x/crypto/argon2"
)

// The rules of a password (SEC-193): its length protects it, so no composition
// rules and no list of breached passwords (design of SEC-193, section 3).
const (
	minPasswordLength = 8
	maxPasswordLength = 128
)

// The argon2id parameters are OWASP's minimum set: 19 MiB of memory, two
// passes, one lane. They are stored with each hash, so a later change of them
// still verifies the hashes made before.
const (
	argonMemoryKiB = 19 * 1024
	argonPasses    = 2
	argonLanes     = 1
	argonSaltBytes = 16
	argonKeyBytes  = 32
)

// usernamePattern is the form of a username: 3 to 30 characters, lower case
// letters, digits, '.', '_' and '-', the first and the last a letter or a digit.
// It matches the check of identity_accounts.
var usernamePattern = regexp.MustCompile(`^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$`)

// normalizeUsername lower-cases raw, so that two names differing in case are
// one, and checks its form.
func normalizeUsername(raw string) (string, error) {
	name := strings.ToLower(raw)
	if !usernamePattern.MatchString(name) {
		return "", ErrUsernameInvalid
	}

	return name, nil
}

// checkPassword reports whether password is one a person may choose for
// username: 8 to 128 characters, valid UTF-8, and not the username itself.
func checkPassword(password, username string) error {
	n := utf8.RuneCountInString(password)
	if !utf8.ValidString(password) || n < minPasswordLength || n > maxPasswordLength ||
		strings.EqualFold(password, username) {
		return ErrPasswordInvalid
	}

	return nil
}

// hashPassword keeps password as one PHC string of argon2id: the algorithm,
// its parameters, a random salt and the hash.
func hashPassword(password string) (string, error) {
	salt := make([]byte, argonSaltBytes)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("drawing a salt: %w", err)
	}

	key := argon2.IDKey([]byte(password), salt, argonPasses, argonMemoryKiB, argonLanes, argonKeyBytes)

	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, argonMemoryKiB, argonPasses, argonLanes,
		base64.RawStdEncoding.EncodeToString(salt), base64.RawStdEncoding.EncodeToString(key)), nil
}

var errHashMalformed = errors.New("the password hash is not an argon2id PHC string")

// verifyPassword reports whether password is the one encoded kept, using the
// parameters the hash carries and a comparison whose time does not depend on
// where the two differ.
func verifyPassword(password, encoded string) (bool, error) {
	parts := strings.Split(encoded, "$")
	if len(parts) != 6 || parts[0] != "" || parts[1] != "argon2id" {
		return false, errHashMalformed
	}

	var version int
	if _, err := fmt.Sscanf(parts[2], "v=%d", &version); err != nil || version != argon2.Version {
		return false, errHashMalformed
	}

	var (
		memory, passes uint32
		lanes          uint8
	)

	if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &passes, &lanes); err != nil ||
		memory == 0 || passes == 0 || lanes == 0 {
		return false, errHashMalformed
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, errHashMalformed
	}

	want, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil || len(want) == 0 {
		return false, errHashMalformed
	}

	got := argon2.IDKey([]byte(password), salt, passes, memory, lanes, uint32(len(want))) //nolint:gosec // a hash is a few dozen bytes

	return subtle.ConstantTimeCompare(got, want) == 1, nil
}

// unknownUserHash is a hash that matches no password anyone can send, made
// once: a sign-in for a username that does not exist is checked against it, so
// the answer comes as late as for one that does and says nothing of it.
var unknownUserHash = sync.OnceValue(func() string {
	h, err := hashPassword(rand.Text())
	if err != nil {
		// Drawing random bytes failed: nothing here can be answered safely.
		panic(fmt.Sprintf("making the hash for unknown usernames: %v", err))
	}

	return h
})
