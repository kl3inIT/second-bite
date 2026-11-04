package identity

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"testing"

	"golang.org/x/crypto/argon2"
)

const (
	lanUser  = "lan"
	lanAnh99 = "lan.anh_99"
)

func TestCheckUsername(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name string
		ok   bool
	}{
		{lanUser, true},
		{"Lan.Anh_99", true},
		{"NHATNHU", true},
		{"a-b", true},
		{"abc", true},
		{strings.Repeat("a", 30), true},
		{strings.Repeat("A", 30), true},
		{strings.Repeat("a", 31), false},
		{"ab", false},
		{"", false},
		{".lan", false},
		{"lan.", false},
		{"-lan", false},
		{"lan_", false},
		{"lan anh", false},
		{" lan", false},
		{"lan@example.com", false},
		{"lân", false},
		{"lan\n", false},
	}

	for _, c := range cases {
		err := checkUsername(c.name)
		if (err == nil) != c.ok {
			t.Errorf("checkUsername(%q) = %v; want ok %v", c.name, err, c.ok)
		}

		if err != nil && !errors.Is(err, ErrUsernameInvalid) {
			t.Errorf("checkUsername(%q): %v is not ErrUsernameInvalid", c.name, err)
		}
	}
}

func TestCheckPassword(t *testing.T) {
	t.Parallel()

	cases := []struct {
		password, username string
		ok                 bool
	}{
		{"correct horse", lanUser, true},
		{"12345678", lanUser, true},
		{"mật khẩu dài", lanUser, true},
		{strings.Repeat("ă", 128), lanUser, true},
		{strings.Repeat("ă", 129), lanUser, false},
		{"1234567", lanUser, false},
		{"", lanUser, false},
		{lanAnh99, lanAnh99, false},
		{"LAN.ANH_99", lanAnh99, false},
		{"\xff\xfe\xfd\xfc\xfb\xfa\xf9\xf8", lanUser, false},
	}

	for _, c := range cases {
		err := checkPassword(c.password, c.username)
		if (err == nil) != c.ok {
			t.Errorf("checkPassword(%q, %q) = %v; want ok %v", c.password, c.username, err, c.ok)
		}

		if err != nil && !errors.Is(err, ErrPasswordInvalid) {
			t.Errorf("checkPassword(%q): %v is not ErrPasswordInvalid", c.password, err)
		}
	}
}

func TestHashAndVerify(t *testing.T) {
	t.Parallel()

	hash, err := hashPassword("correct horse battery")
	if err != nil {
		t.Fatal(err)
	}

	if !strings.HasPrefix(hash, "$argon2id$v=19$m=19456,t=2,p=1$") {
		t.Fatalf("hash %q does not carry its parameters", hash)
	}

	for password, want := range map[string]bool{
		"correct horse battery":  true,
		"correct horse batterY":  false,
		"":                       false,
		"correct horse battery ": false,
	} {
		got, err := verifyPassword(password, hash)
		if err != nil || got != want {
			t.Errorf("verifyPassword(%q) = %v, %v; want %v", password, got, err, want)
		}
	}

	again, err := hashPassword("correct horse battery")
	if err != nil {
		t.Fatal(err)
	}

	if again == hash {
		t.Error("two hashes of one password are equal: the salt is not random")
	}
}

// TestVerifyKeepsOldParameters checks that a hash made with other parameters
// still verifies, which is what lets the parameters change later.
func TestVerifyKeepsOldParameters(t *testing.T) {
	t.Parallel()

	salt := []byte("0123456789abcdef")
	key := argon2.IDKey([]byte("older password"), salt, 1, 8*1024, 2, 24)
	encoded := fmt.Sprintf("$argon2id$v=%d$m=8192,t=1,p=2$%s$%s", argon2.Version,
		base64.RawStdEncoding.EncodeToString(salt), base64.RawStdEncoding.EncodeToString(key))

	if ok, err := verifyPassword("older password", encoded); err != nil || !ok {
		t.Errorf("the old hash with its right password: %v, %v", ok, err)
	}

	if ok, err := verifyPassword("newer password", encoded); err != nil || ok {
		t.Errorf("the old hash with a wrong password: %v, %v", ok, err)
	}
}

func TestVerifyRefusesAMalformedHash(t *testing.T) {
	t.Parallel()

	for _, encoded := range []string{
		"",
		"plain",
		"$argon2i$v=19$m=19456,t=2,p=1$c2FsdA$a2V5",
		"$argon2id$v=18$m=19456,t=2,p=1$c2FsdA$a2V5",
		"$argon2id$v=19$m=0,t=2,p=1$c2FsdA$a2V5",
		"$argon2id$v=19$m=19456,t=0,p=1$c2FsdA$a2V5",
		"$argon2id$v=19$m=19456,t=2,p=0$c2FsdA$a2V5",
		"$argon2id$v=19$m=19456,t=2,p=1$!!$a2V5",
		"$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$",
		"$argon2id$v=19$m=19456,t=2,p=1$c2FsdA",
	} {
		if ok, err := verifyPassword("whatever", encoded); ok || !errors.Is(err, errHashMalformed) {
			t.Errorf("verifyPassword(%q) = %v, %v; want a malformed hash", encoded, ok, err)
		}
	}
}

func TestUnknownUserHashMatchesNoOneAndIsMadeOnce(t *testing.T) {
	t.Parallel()

	h := unknownUserHash()
	if h != unknownUserHash() {
		t.Error("the hash for unknown usernames is made again at each use")
	}

	if ok, err := verifyPassword("password", h); err != nil || ok {
		t.Errorf("the hash for unknown usernames matches a password: %v, %v", ok, err)
	}
}
