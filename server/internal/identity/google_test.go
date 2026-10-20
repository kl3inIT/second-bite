package identity

import (
	"context"
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/go-jose/go-jose/v4"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const (
	testClientID = "web-client.apps.googleusercontent.com"
	// workspaceDomain is a Google Workspace domain, which Google speaks for.
	workspaceDomain = "school.edu.vn"
)

// issuer signs ID tokens as Google would, with a key the verifier is given.
type issuer struct {
	key *rsa.PrivateKey
}

func newIssuer(t *testing.T) issuer {
	t.Helper()

	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatal(err)
	}

	return issuer{key: key}
}

func (i issuer) google() *google {
	return newGoogle([]string{"ios-client", testClientID}, &oidc.StaticKeySet{PublicKeys: []crypto.PublicKey{&i.key.PublicKey}})
}

// token returns an ID token with Google's usual claims, changed by edit.
func (i issuer) token(t *testing.T, sub, email string, edit func(map[string]any)) string {
	t.Helper()

	claims := map[string]any{
		"iss": "https://accounts.google.com", "aud": testClientID, "sub": sub,
		"email": email, "email_verified": true, "name": "Lan Nguyễn",
		"picture": "https://lh3.googleusercontent.com/a/photo",
		"iat":     time.Now().Unix(), "exp": time.Now().Add(time.Hour).Unix(),
	}
	if edit != nil {
		edit(claims)
	}

	payload, err := json.Marshal(claims)
	if err != nil {
		t.Fatal(err)
	}

	signer, err := jose.NewSigner(jose.SigningKey{Algorithm: jose.RS256, Key: i.key}, nil)
	if err != nil {
		t.Fatal(err)
	}

	signed, err := signer.Sign(payload)
	if err != nil {
		t.Fatal(err)
	}

	raw, err := signed.CompactSerialize()
	if err != nil {
		t.Fatal(err)
	}

	return raw
}

func hashed(nonce string) string {
	sum := sha256.Sum256([]byte(nonce))

	return hex.EncodeToString(sum[:])
}

func TestGoogleVerify(t *testing.T) {
	t.Parallel()

	iss := newIssuer(t)
	g := iss.google()
	other := newIssuer(t)

	tests := []struct {
		name  string
		token string
		nonce string
		ok    bool
	}{
		{"a well-formed token", iss.token(t, "1", "a@gmail.com", nil), "", true},
		{"the issuer without https", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["iss"] = "accounts.google.com" }), "", true},
		{"another of our client IDs", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["aud"] = "ios-client" }), "", true},
		{"another issuer", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["iss"] = "https://evil.example" }), "", false},
		{"another audience", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["aud"] = "someone-else" }), "", false},
		{"expired", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["exp"] = time.Now().Add(-time.Minute).Unix() }), "", false},
		{"signed by another key", other.token(t, "1", "a@gmail.com", nil), "", false},
		{"no subject", iss.token(t, "", "a@gmail.com", nil), "", false},
		{"the nonce matches", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["nonce"] = hashed("n-1") }), "n-1", true},
		{"the nonce differs", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["nonce"] = hashed("n-1") }), "n-2", false},
		{"a nonce in the token only", iss.token(t, "1", "a@gmail.com", func(c map[string]any) { c["nonce"] = hashed("n-1") }), "", false},
		{"a nonce posted only", iss.token(t, "1", "a@gmail.com", nil), "n-1", false},
		{"not a token", "abc.def.ghi", "", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			_, err := g.verify(t.Context(), tt.token, tt.nonce)
			if (err == nil) != tt.ok {
				t.Errorf("err %v, want ok %v", err, tt.ok)
			}
		})
	}
}

func TestGoogleAuthoritative(t *testing.T) {
	t.Parallel()

	for email, hd := range map[string]string{"lan@gmail.com": "", "lan@" + workspaceDomain: workspaceDomain} {
		if !(googleClaims{Email: email, HostedDomain: hd}).authoritative() {
			t.Errorf("%s with hd %q: not authoritative", email, hd)
		}
	}

	if (googleClaims{Email: "lan@yahoo.com"}).authoritative() {
		t.Error("an outside address is authoritative")
	}
}

func TestSignInWithGoogle(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	iss := newIssuer(t)

	for name, check := range map[string]func(*testing.T, *Service, issuer){
		"a first sign-in creates the account with Google's name":      testGoogleCreatesAccount,
		"a returning subject keeps its account":                       testGoogleReturningSubject,
		"Google links an account when it speaks for the address":      testGoogleLinksAuthoritative,
		"an outside address with an account asks for the code":        testGoogleLinkRequired,
		"an unverified address is refused on a first sign-in":         testGoogleUnverified,
		"two first sign-ins at once make one link":                    testGoogleConcurrentFirstSignIns,
		"an emailed code removes the links Google does not vouch for": testCodeRemovesUntrustedLinks,
		"privileges given by address wait for the owner's code":       testPrivilegeWaitsForProof,
		"without client IDs Google is off":                            testGoogleOff,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			check(t, newGoogleService(t, pool, iss), iss)
		})
	}
}

func newGoogleService(t *testing.T, pool *pgxpool.Pool, iss issuer) *Service {
	t.Helper()

	s, err := NewService(pool, nil, nil, nil, Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	s.google = iss.google()

	return s
}

// unique returns a subject and an address prefix no other check uses.
func unique() (sub, prefix string) {
	id := uuid.NewString()

	return "sub-" + id, "u" + id[:8]
}

func signInGoogle(t *testing.T, s *Service, token string) Session {
	t.Helper()

	session, err := s.SignInWithGoogle(t.Context(), token, "")
	if err != nil {
		t.Fatalf("signing in: %v", err)
	}

	return session
}

func testGoogleCreatesAccount(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	sub, p := unique()

	session := signInGoogle(t, s, iss.token(t, sub, p+"@gmail.com", nil))
	if session.Token == "" || session.Account.Email != p+"@gmail.com" || session.Account.DisplayName != "Lan Nguyễn" {
		t.Fatalf("session %+v", session.Account)
	}

	caller, err := s.findCaller(t.Context(), session.Token)
	if err != nil || caller.AccountID != session.Account.ID {
		t.Errorf("the session does not read the account: %v", err)
	}
}

func testGoogleReturningSubject(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	sub, p := unique()
	first := signInGoogle(t, s, iss.token(t, sub, p+"@gmail.com", nil))

	// The address changed at Google, and the name too: the account stays,
	// its address does not move, and a name already given is kept.
	again := signInGoogle(t, s, iss.token(t, sub, p+".new@gmail.com", func(c map[string]any) {
		c["name"] = "Lan N."
		c["email_verified"] = false
	}))
	if again.Account.ID != first.Account.ID || again.Account.Email != p+"@gmail.com" || again.Account.DisplayName != "Lan Nguyễn" {
		t.Errorf("returning: %+v, first %+v", again.Account, first.Account)
	}

	var name string
	if err := s.pool.QueryRow(t.Context(),
		"SELECT name FROM identity_external_logins WHERE subject = $1", sub).Scan(&name); err != nil || name != "Lan N." {
		t.Errorf("the identity's name is %q (%v), want Google's latest", name, err)
	}
}

func testGoogleLinksAuthoritative(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	for _, tc := range []struct {
		domain string
		hd     string
	}{{"gmail.com", ""}, {workspaceDomain, workspaceDomain}} {
		sub, p := unique()
		email := p + "@" + tc.domain

		existing, err := s.EnsureAccount(t.Context(), email)
		if err != nil {
			t.Fatal(err)
		}

		session := signInGoogle(t, s, iss.token(t, sub, email, func(c map[string]any) {
			if tc.hd != "" {
				c["hd"] = tc.hd
			}
		}))
		if session.Account.ID != existing.ID {
			t.Errorf("%s: a new account %s instead of %s", tc.domain, session.Account.ID, existing.ID)
		}
	}
}

func testGoogleLinkRequired(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	sub, p := unique()
	email := p + "@yahoo.com"

	if _, err := s.EnsureAccount(t.Context(), email); err != nil {
		t.Fatal(err)
	}

	_, err := s.SignInWithGoogle(t.Context(), iss.token(t, sub, email, nil), "")
	if !errors.Is(err, ErrGoogleLinkRequired) {
		t.Errorf("err %v, want %v", err, ErrGoogleLinkRequired)
	}

	// Without an account the outside address is simply created.
	sub2, p2 := unique()
	signInGoogle(t, s, iss.token(t, sub2, p2+"@yahoo.com", nil))
}

func testGoogleUnverified(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	sub, p := unique()

	_, err := s.SignInWithGoogle(t.Context(), iss.token(t, sub, p+"@gmail.com", func(c map[string]any) {
		c["email_verified"] = false
	}), "")
	if !errors.Is(err, ErrEmailNotVerified) {
		t.Errorf("err %v, want %v", err, ErrEmailNotVerified)
	}
}

func testGoogleConcurrentFirstSignIns(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	sub, p := unique()
	token := iss.token(t, sub, p+"@gmail.com", nil)

	const n = 4

	var (
		wg  sync.WaitGroup
		ids [n]uuid.UUID
	)

	for i := range n {
		wg.Go(func() {
			session, err := s.SignInWithGoogle(context.WithoutCancel(t.Context()), token, "")
			if err != nil {
				t.Errorf("sign-in %d: %v", i, err)

				return
			}

			ids[i] = session.Account.ID
		})
	}

	wg.Wait()

	for i := range n {
		if ids[i] != ids[0] {
			t.Errorf("sign-in %d reached account %s, the first %s", i, ids[i], ids[0])
		}
	}

	var links int
	if err := s.pool.QueryRow(t.Context(),
		"SELECT count(*) FROM identity_external_logins WHERE subject = $1", sub).Scan(&links); err != nil || links != 1 {
		t.Errorf("%d links (%v), want 1", links, err)
	}
}

func testGoogleOff(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	s.google = nil

	if _, err := s.SignInWithGoogle(t.Context(), iss.token(t, "x", "x@gmail.com", nil), ""); !errors.Is(err, ErrGoogleNotConfigured) {
		t.Errorf("err %v", err)
	}

	if s.GoogleClientID() != "" {
		t.Error("a client ID while Google is off")
	}
}

// signInWithCode signs in to email with the emailed code, the challenge put
// in place of the email the test does not send.
func signInWithCode(t *testing.T, s *Service, email string) Session {
	t.Helper()

	id := uuid.New()

	const code = "123456"

	if _, err := s.queries.InsertChallenge(t.Context(), db.InsertChallengeParams{
		ID: id, Email: email, CodeHash: s.codeHash(id, code), Purpose: string(purposeSignIn), LifetimeSeconds: 60,
	}); err != nil {
		t.Fatal(err)
	}

	session, err := s.SignIn(t.Context(), id, code)
	if err != nil {
		t.Fatalf("signing in with the code: %v", err)
	}

	return session
}

func testCodeRemovesUntrustedLinks(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	// Someone links their Google account to an outside address before its
	// owner arrives; the owner then proves the address with the code.
	outsideSub, p := unique()
	outside := p + "@congtycu.vn"
	planted := signInGoogle(t, s, iss.token(t, outsideSub, outside, nil))

	owner := signInWithCode(t, s, outside)
	if owner.Account.ID != planted.Account.ID {
		t.Fatalf("the code reached another account")
	}

	// The session opened through the removed link ends with it; the owner's stays.
	if _, err := s.findCaller(t.Context(), planted.Token); !errors.Is(err, ErrSessionInvalid) {
		t.Errorf("the planted session still works: %v", err)
	}

	if _, err := s.findCaller(t.Context(), owner.Token); err != nil {
		t.Errorf("the owner's session: %v", err)
	}

	if _, err := s.SignInWithGoogle(t.Context(), iss.token(t, outsideSub, outside, nil), ""); !errors.Is(err, ErrGoogleLinkRequired) {
		t.Errorf("Google after the owner's code: err %v, want %v", err, ErrGoogleLinkRequired)
	}

	// Google speaks for gmail.com and Workspace addresses: their links stay.
	for _, hd := range []string{"", workspaceDomain} {
		sub, q := unique()

		email := q + "@gmail.com"
		if hd != "" {
			email = q + "@" + hd
		}

		token := iss.token(t, sub, email, func(c map[string]any) {
			if hd != "" {
				c["hd"] = hd
			}
		})
		first := signInGoogle(t, s, token)
		signInWithCode(t, s, email)

		if again := signInGoogle(t, s, token); again.Account.ID != first.Account.ID {
			t.Errorf("%s: Google reached another account after the code", email)
		}
	}
}

func testPrivilegeWaitsForProof(t *testing.T, s *Service, iss issuer) {
	t.Helper()

	for name, give := range map[string]func(email string) (Account, error){
		"a seller membership": func(email string) (Account, error) { return s.EnsureAccount(t.Context(), email) },
		"a role": func(email string) (Account, error) {
			return s.GrantRole(t.Context(), email, platform.RoleAdmin)
		},
	} {
		// Someone links their Google account to an outside address; giving the
		// address something waits until its owner proves it with the code.
		outsideSub, p := unique()
		outside := p + "@congtycu.vn"
		planted := signInGoogle(t, s, iss.token(t, outsideSub, outside, nil))

		if _, err := give(outside); !errors.Is(err, ErrAddressUnproven) {
			t.Fatalf("%s before the code: err %v, want %v", name, err, ErrAddressUnproven)
		}

		if a, err := s.Account(t.Context(), planted.Account.ID); err != nil || a.Role == platform.RoleAdmin {
			t.Errorf("%s: the refused grant changed the account: %+v, %v", name, a, err)
		}

		// Refusing signs no one out.
		if _, err := s.findCaller(t.Context(), planted.Token); err != nil {
			t.Errorf("%s: a refused grant ended a session: %v", name, err)
		}

		owner := signInWithCode(t, s, outside)

		account, err := give(outside)
		if err != nil {
			t.Fatalf("%s after the code: %v", name, err)
		}

		if account.ID != owner.Account.ID {
			t.Errorf("%s: given to another account", name)
		}

		// Google speaks for gmail.com: giving goes ahead and the session stays.
		trustedSub, q := unique()
		trusted := signInGoogle(t, s, iss.token(t, trustedSub, q+"@gmail.com", nil))

		if _, err := give(q + "@gmail.com"); err != nil {
			t.Fatalf("%s for a gmail.com address: %v", name, err)
		}

		if _, err := s.findCaller(t.Context(), trusted.Token); err != nil {
			t.Errorf("%s: the trusted session ended: %v", name, err)
		}
	}
}
