package identity

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/go-jose/go-jose/v4"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/audit"
	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/platform/platformtest"
)

const (
	testNonce     = "n-1"
	testGivenName = "Lan"
	// testName is the name Apple shares, family name first.
	testName     = "Nguyễn Lan"
	testBundleID = "vn.secondbite.secondBite"
	testTeamID   = "TEAM123456"
	testKeyID    = "KEY1234567"
)

// fakeApple answers Apple's token and revocation calls, checking each client
// secret against the key the service signs with.
type fakeApple struct {
	server *httptest.Server
	key    *ecdsa.PrivateKey

	mu       sync.Mutex
	failing  bool
	revoked  []string
	exchange int
}

func newFakeApple(t *testing.T) *fakeApple {
	t.Helper()

	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal(err)
	}

	f := &fakeApple{key: key}
	f.server = httptest.NewServer(http.HandlerFunc(f.serve))
	t.Cleanup(f.server.Close)

	return f
}

func (f *fakeApple) serve(w http.ResponseWriter, r *http.Request) {
	f.mu.Lock()
	defer f.mu.Unlock()

	if err := r.ParseForm(); err != nil || f.failing || !f.secretValid(r.PostForm.Get("client_secret"), r.PostForm.Get("client_id")) {
		http.Error(w, `{"error":"invalid_client"}`, http.StatusBadRequest)

		return
	}

	switch r.URL.Path {
	case "/auth/token":
		if r.PostForm.Get("grant_type") != "authorization_code" || r.PostForm.Get("code") == "" {
			http.Error(w, `{"error":"invalid_grant"}`, http.StatusBadRequest)

			return
		}

		f.exchange++
		_ = json.NewEncoder(w).Encode(map[string]any{
			"access_token": "at", "token_type": "Bearer", "expires_in": 3600,
			"refresh_token": "rt-" + r.PostForm.Get("code"), "id_token": "x",
		})
	case "/auth/revoke":
		if r.PostForm.Get("token_type_hint") != "refresh_token" {
			http.Error(w, `{"error":"unsupported_token_type"}`, http.StatusBadRequest)

			return
		}

		f.revoked = append(f.revoked, r.PostForm.Get("token"))
	default:
		http.NotFound(w, r)
	}
}

// secretValid tells whether secret is the ES256 JWT Apple expects for clientID.
func (f *fakeApple) secretValid(secret, clientID string) bool {
	jws, err := jose.ParseSignedCompact(secret, []jose.SignatureAlgorithm{jose.ES256})
	if err != nil || jws.Signatures[0].Header.KeyID != testKeyID {
		return false
	}

	payload, err := jws.Verify(&f.key.PublicKey)
	if err != nil {
		return false
	}

	var c struct {
		Iss, Aud, Sub string
		Iat, Exp      int64
	}
	if json.Unmarshal(payload, &c) != nil {
		return false
	}

	now := time.Now().Unix()

	return c.Iss == testTeamID && c.Aud == appleIssuer && c.Sub == clientID && c.Iat <= now && c.Exp > now && c.Exp-c.Iat <= 300
}

func (f *fakeApple) revokedTokens() []string {
	f.mu.Lock()
	defer f.mu.Unlock()

	return append([]string(nil), f.revoked...)
}

func (f *fakeApple) exchanges() int {
	f.mu.Lock()
	defer f.mu.Unlock()

	return f.exchange
}

func (f *fakeApple) setFailing(failing bool) {
	f.mu.Lock()
	defer f.mu.Unlock()

	f.failing = failing
}

// config is Apple's configuration with the fake's key in PEM.
func (f *fakeApple) config(t *testing.T) AppleConfig {
	t.Helper()

	der, err := x509.MarshalPKCS8PrivateKey(f.key)
	if err != nil {
		t.Fatal(err)
	}

	tokenKey := make([]byte, 32)
	_, _ = rand.Read(tokenKey)

	return AppleConfig{
		ClientIDs: []string{"vn.secondbite.other", testBundleID}, TeamID: testTeamID, KeyID: testKeyID,
		PrivateKey: string(pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: der})), TokenKey: tokenKey,
	}
}

func (f *fakeApple) apple(t *testing.T, iss issuer) *apple {
	t.Helper()

	a, err := newApple(f.config(t), &oidc.StaticKeySet{PublicKeys: []crypto.PublicKey{&iss.key.PublicKey}}, f.server.URL)
	if err != nil {
		t.Fatal(err)
	}

	return a
}

// appleToken returns an identity token with Apple's usual claims for nonce,
// changed by edit.
func (i issuer) appleToken(t *testing.T, sub, email, nonce string, edit func(map[string]any)) string {
	t.Helper()

	return i.token(t, sub, email, func(c map[string]any) {
		c["iss"] = appleIssuer
		c["aud"] = testBundleID
		c["nonce"] = hashed(nonce)
		c["nonce_supported"] = true
		c["email_verified"] = "true"
		c["is_private_email"] = false
		delete(c, "name")
		delete(c, "picture")

		if edit != nil {
			edit(c)
		}
	})
}

func TestAppleVerify(t *testing.T) {
	t.Parallel()

	iss := newIssuer(t)
	a := newFakeApple(t).apple(t, iss)
	other := newIssuer(t)

	tests := []struct {
		name  string
		token string
		nonce string
		ok    bool
	}{
		{"a well-formed token", iss.appleToken(t, "1", "a@icloud.com", testNonce, nil), testNonce, true},
		{"another of our bundle IDs", iss.appleToken(t, "1", "a@icloud.com", testNonce, func(c map[string]any) { c["aud"] = "vn.secondbite.other" }), testNonce, true},
		{"no nonce posted", iss.appleToken(t, "1", "a@icloud.com", testNonce, nil), "", false},
		{"the nonce differs", iss.appleToken(t, "1", "a@icloud.com", testNonce, nil), "n-2", false},
		{"no nonce in the token", iss.appleToken(t, "1", "a@icloud.com", testNonce, func(c map[string]any) { delete(c, "nonce") }), testNonce, false},
		{"Google's issuer", iss.appleToken(t, "1", "a@icloud.com", testNonce, func(c map[string]any) { c["iss"] = "https://accounts.google.com" }), testNonce, false},
		{"another audience", iss.appleToken(t, "1", "a@icloud.com", testNonce, func(c map[string]any) { c["aud"] = "com.example.app" }), testNonce, false},
		{"expired", iss.appleToken(t, "1", "a@icloud.com", testNonce, func(c map[string]any) { c["exp"] = time.Now().Add(-time.Minute).Unix() }), testNonce, false},
		{"signed by another key", other.appleToken(t, "1", "a@icloud.com", testNonce, nil), testNonce, false},
		{"no subject", iss.appleToken(t, "", "a@icloud.com", testNonce, nil), testNonce, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			_, err := a.verify(t.Context(), tt.token, tt.nonce)
			if (err == nil) != tt.ok {
				t.Errorf("err %v, want ok %v", err, tt.ok)
			}
		})
	}
}

func TestAppleClaimsReadBooleansBothWays(t *testing.T) {
	t.Parallel()

	iss := newIssuer(t)
	a := newFakeApple(t).apple(t, iss)

	for _, verified := range []any{true, "true"} {
		c, err := a.verify(t.Context(), iss.appleToken(t, "1", "a@icloud.com", "n", func(c map[string]any) { c["email_verified"] = verified }), "n")
		if err != nil || !bool(c.EmailVerified) || c.clientID != testBundleID {
			t.Errorf("email_verified %#v: %+v, %v", verified, c, err)
		}
	}

	for _, unverified := range []any{false, "false"} {
		c, err := a.verify(t.Context(), iss.appleToken(t, "1", "a@icloud.com", "n", func(c map[string]any) { c["email_verified"] = unverified }), "n")
		if err != nil || bool(c.EmailVerified) {
			t.Errorf("email_verified %#v: %+v, %v", unverified, c, err)
		}
	}
}

func TestAppleAuthoritative(t *testing.T) {
	t.Parallel()

	for _, email := range []string{"x1y2@privaterelay.appleid.com", "lan@icloud.com", "lan@ME.com", "lan@mac.com"} {
		if !(appleClaims{Email: email}).authoritative() {
			t.Errorf("%s: not authoritative", email)
		}
	}

	for _, email := range []string{"lan@gmail.com", "lan@icloud.com.evil.vn", "lan@notmac.com"} {
		if (appleClaims{Email: email}).authoritative() {
			t.Errorf("%s: authoritative", email)
		}
	}
}

func TestAppleName(t *testing.T) {
	t.Parallel()

	for _, tc := range []struct{ family, given, want string }{
		{"Nguyễn", testGivenName, testName},
		{"", " Lan ", "Lan"},
		{"", "", ""},
		{strings.Repeat("a", 300), "", strings.Repeat("a", maxNameLength)},
	} {
		if got := appleName(tc.family, tc.given); got != tc.want {
			t.Errorf("appleName(%q, %q) = %q, want %q", tc.family, tc.given, got, tc.want)
		}
	}
}

func TestAppleSeal(t *testing.T) {
	t.Parallel()

	f := newFakeApple(t)
	a := f.apple(t, newIssuer(t))
	kept := keptToken{ClientID: testBundleID, RefreshToken: "rt-secret"}

	sealed, err := a.seal(kept)
	if err != nil {
		t.Fatal(err)
	}

	if strings.Contains(string(sealed), "rt-secret") {
		t.Error("the sealed token holds the token in clear")
	}

	if got, err := a.unseal(sealed); err != nil || got != kept {
		t.Errorf("unsealed %+v, %v", got, err)
	}

	// Under another key, the token cannot be read.
	if _, err := f.apple(t, newIssuer(t)).unseal(sealed); err == nil {
		t.Error("another key unsealed the token")
	}
}

func TestAppleConfigNeedsAllOfIt(t *testing.T) {
	t.Parallel()

	f := newFakeApple(t)
	full := f.config(t)

	for name, edit := range map[string]func(*AppleConfig){
		"no team ID":            func(c *AppleConfig) { c.TeamID = "" },
		"no key ID":             func(c *AppleConfig) { c.KeyID = "" },
		"no private key":        func(c *AppleConfig) { c.PrivateKey = "" },
		"a private key not PEM": func(c *AppleConfig) { c.PrivateKey = "not a key" },
		"a short token key":     func(c *AppleConfig) { c.TokenKey = make([]byte, 16) },
		"no client IDs":         func(c *AppleConfig) { c.ClientIDs = nil },
	} {
		cfg := full
		edit(&cfg)

		if _, err := newApple(cfg, &oidc.StaticKeySet{}, f.server.URL); err == nil {
			t.Errorf("%s: accepted", name)
		}
	}

	if (AppleConfig{}).on() {
		t.Error("the zero configuration turns Apple on")
	}
}

func TestSignInWithApple(t *testing.T) {
	t.Parallel()

	pool := platformtest.StartPostgres(t)
	iss := newIssuer(t)

	for name, check := range map[string]func(*testing.T, *Service, issuer, *fakeApple){
		"a first sign-in creates the account with the name shared and keeps the token sealed": testAppleCreatesAccount,
		"a returning subject keeps its account and its name":                                  testAppleReturningSubject,
		"Apple links an account at an address it issued":                                      testAppleLinksAuthoritative,
		"an outside address with an account asks for the code, and the access is revoked":     testAppleLinkRequired,
		"an unverified address is refused":                                                    testAppleUnverified,
		"Apple unreachable fails the sign-in and links nothing":                               testAppleUnavailable,
		"deleting the account revokes Apple's access":                                         testAppleRevokedOnDeletion,
		"an emailed code removing an Apple link revokes its access":                           testAppleRevokedOnUntrustedRemoval,
		"without its configuration Apple is off":                                              testAppleOff,
	} {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			f := newFakeApple(t)
			check(t, newAppleService(t, pool, iss, f), iss, f)
		})
	}
}

func newAppleService(t *testing.T, pool *pgxpool.Pool, iss issuer, f *fakeApple) *Service {
	t.Helper()

	notifications, err := notification.NewService(pool, audit.NewService(pool, platformtest.Logger()), nil, notification.Config{SettingsKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	events, err := platform.NewEvents(pool, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	s, err := NewService(pool, notifications, events, audit.NewService(pool, platformtest.Logger()), Config{CodeKey: make([]byte, 32)}, platformtest.Logger())
	if err != nil {
		t.Fatal(err)
	}

	// The listener is known, so the revocation is written; it is run by hand.
	RegisterListeners(events, s)

	s.apple = f.apple(t, iss)

	return s
}

func signInApple(t *testing.T, s *Service, iss issuer, sub, email string, in AppleSignIn) (Session, error) {
	t.Helper()

	in.IDToken = iss.appleToken(t, sub, email, "n-"+sub, nil)
	in.Nonce = "n-" + sub

	if in.AuthorizationCode == "" {
		in.AuthorizationCode = "code-" + sub
	}

	return s.SignInWithApple(t.Context(), in)
}

// keptSealed returns the sealed refresh token of the subject's link.
func keptSealed(t *testing.T, s *Service, sub string) []byte {
	t.Helper()

	var sealed []byte
	if err := s.pool.QueryRow(t.Context(),
		"SELECT refresh_token_sealed FROM identity_external_logins WHERE provider = 'apple' AND subject = $1", sub).Scan(&sealed); err != nil {
		t.Fatal(err)
	}

	return sealed
}

// runRevocations runs by hand the revocations written for the tokens in want,
// as River would, and fails when one was not written.
func runRevocations(t *testing.T, s *Service, want ...string) {
	t.Helper()

	rows, err := s.pool.Query(t.Context(),
		`SELECT args->>'payload' FROM river_job WHERE args->>'event' = 'identity.apple_tokens_revoked'`)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()

	found := map[string]bool{}

	for rows.Next() {
		var raw string
		if err := rows.Scan(&raw); err != nil {
			t.Fatal(err)
		}

		var e appleTokensRevokedEvent
		if err := json.Unmarshal([]byte(raw), &e); err != nil {
			t.Fatal(err)
		}

		mine := appleTokensRevokedEvent{}

		for _, sealed := range e.Sealed {
			// Other checks' tokens are sealed under other keys.
			if kept, err := s.apple.unseal(sealed); err == nil {
				for _, w := range want {
					if kept.RefreshToken == w {
						found[w] = true

						mine.Sealed = append(mine.Sealed, sealed)
					}
				}
			}
		}

		if len(mine.Sealed) > 0 {
			if err := s.revokeAppleTokens(t.Context(), mine); err != nil {
				t.Fatalf("revoking: %v", err)
			}
		}
	}

	for _, w := range want {
		if !found[w] {
			t.Errorf("no revocation written for %s", w)
		}
	}
}

func testAppleCreatesAccount(t *testing.T, s *Service, iss issuer, _ *fakeApple) {
	t.Helper()

	sub, p := unique()

	session, err := signInApple(t, s, iss, sub, p+"@privaterelay.appleid.com", AppleSignIn{GivenName: testGivenName, FamilyName: "Nguyễn"})
	if err != nil {
		t.Fatal(err)
	}

	if session.Token == "" || session.Account.Email != p+"@privaterelay.appleid.com" || session.Account.DisplayName != testName {
		t.Fatalf("session %+v", session.Account)
	}

	kept, err := s.apple.unseal(keptSealed(t, s, sub))
	if err != nil || kept != (keptToken{ClientID: testBundleID, RefreshToken: "rt-code-" + sub}) {
		t.Errorf("kept %+v, %v", kept, err)
	}

	var method string
	if err := s.pool.QueryRow(t.Context(), "SELECT last_sign_in_method FROM identity_accounts WHERE id = $1",
		session.Account.ID).Scan(&method); err != nil || method != methodApple {
		t.Errorf("last sign-in method %q (%v)", method, err)
	}
}

func testAppleReturningSubject(t *testing.T, s *Service, iss issuer, _ *fakeApple) {
	t.Helper()

	sub, p := unique()

	first, err := signInApple(t, s, iss, sub, p+"@icloud.com", AppleSignIn{GivenName: testGivenName, FamilyName: "Nguyễn", AuthorizationCode: "c1"})
	if err != nil {
		t.Fatal(err)
	}

	// Apple shares the name once: later sign-ins keep it, and the newest
	// refresh token replaces the one before.
	again, err := signInApple(t, s, iss, sub, p+"@icloud.com", AppleSignIn{AuthorizationCode: "c2"})
	if err != nil {
		t.Fatal(err)
	}

	if again.Account.ID != first.Account.ID || again.Account.DisplayName != testName {
		t.Errorf("returning %+v, first %+v", again.Account, first.Account)
	}

	var name string
	if err := s.pool.QueryRow(t.Context(),
		"SELECT name FROM identity_external_logins WHERE subject = $1", sub).Scan(&name); err != nil || name != testName {
		t.Errorf("the link's name is %q (%v)", name, err)
	}

	if kept, err := s.apple.unseal(keptSealed(t, s, sub)); err != nil || kept.RefreshToken != "rt-c2" {
		t.Errorf("kept %+v, %v", kept, err)
	}
}

func testAppleLinksAuthoritative(t *testing.T, s *Service, iss issuer, _ *fakeApple) {
	t.Helper()

	for _, domain := range appleDomains {
		sub, p := unique()
		email := p + "@" + domain

		existing, err := s.EnsureAccount(t.Context(), email)
		if err != nil {
			t.Fatal(err)
		}

		session, err := signInApple(t, s, iss, sub, email, AppleSignIn{})
		if err != nil || session.Account.ID != existing.ID {
			t.Errorf("%s: %+v, %v; want the account %s", domain, session.Account, err, existing.ID)
		}
	}
}

func testAppleLinkRequired(t *testing.T, s *Service, iss issuer, f *fakeApple) {
	t.Helper()

	sub, p := unique()
	email := p + "@gmail.com"

	if _, err := s.EnsureAccount(t.Context(), email); err != nil {
		t.Fatal(err)
	}

	if _, err := signInApple(t, s, iss, sub, email, AppleSignIn{}); !errors.Is(err, ErrAppleLinkRequired) {
		t.Fatalf("err %v, want %v", err, ErrAppleLinkRequired)
	}

	// The access Apple gave for this sign-in is linked to nothing: it is revoked.
	if got := f.revokedTokens(); len(got) != 1 || got[0] != "rt-code-"+sub {
		t.Errorf("revoked %v", got)
	}

	// Without an account, the outside address is simply created, untrusted.
	sub2, p2 := unique()
	if _, err := signInApple(t, s, iss, sub2, p2+"@gmail.com", AppleSignIn{}); err != nil {
		t.Fatal(err)
	}
}

func testAppleUnverified(t *testing.T, s *Service, iss issuer, _ *fakeApple) {
	t.Helper()

	sub, p := unique()
	token := iss.appleToken(t, sub, p+"@icloud.com", "n", func(c map[string]any) { c["email_verified"] = "false" })

	_, err := s.SignInWithApple(t.Context(), AppleSignIn{IDToken: token, Nonce: "n", AuthorizationCode: "c"})
	if !errors.Is(err, ErrEmailNotVerified) {
		t.Errorf("err %v, want %v", err, ErrEmailNotVerified)
	}
}

func testAppleUnavailable(t *testing.T, s *Service, iss issuer, f *fakeApple) {
	t.Helper()

	f.setFailing(true)

	sub, p := unique()
	if _, err := signInApple(t, s, iss, sub, p+"@icloud.com", AppleSignIn{}); !errors.Is(err, ErrAppleUnavailable) {
		t.Fatalf("err %v, want %v", err, ErrAppleUnavailable)
	}

	var links int
	if err := s.pool.QueryRow(t.Context(),
		"SELECT count(*) FROM identity_external_logins WHERE subject = $1", sub).Scan(&links); err != nil || links != 0 {
		t.Errorf("%d links (%v), want none", links, err)
	}

	// An invalid token is refused before Apple is called.
	f.setFailing(false)

	if _, err := s.SignInWithApple(t.Context(), AppleSignIn{IDToken: "abc.def.ghi", Nonce: "n", AuthorizationCode: "c"}); !errors.Is(err, ErrAppleTokenInvalid) {
		t.Errorf("err %v, want %v", err, ErrAppleTokenInvalid)
	}

	if n := f.exchanges(); n != 0 {
		t.Errorf("%d exchanges, want none", n)
	}
}

func testAppleRevokedOnDeletion(t *testing.T, s *Service, iss issuer, f *fakeApple) {
	t.Helper()

	sub, p := unique()
	email := p + "@privaterelay.appleid.com"

	session, err := signInApple(t, s, iss, sub, email, AppleSignIn{})
	if err != nil {
		t.Fatal(err)
	}

	id, code := deletionChallenge(t, s, email)
	if err := s.DeleteAccount(callerCtx(t, session), id, code); err != nil {
		t.Fatal(err)
	}

	runRevocations(t, s, "rt-code-"+sub)

	if got := f.revokedTokens(); len(got) != 1 || got[0] != "rt-code-"+sub {
		t.Errorf("revoked %v", got)
	}
}

func testAppleRevokedOnUntrustedRemoval(t *testing.T, s *Service, iss issuer, f *fakeApple) {
	t.Helper()

	// Someone links their Apple ID to an outside address before its owner
	// arrives; the owner then proves the address with the code.
	sub, p := unique()
	outside := p + "@congtycu.vn"

	if _, err := signInApple(t, s, iss, sub, outside, AppleSignIn{}); err != nil {
		t.Fatal(err)
	}

	signInWithCode(t, s, outside)
	runRevocations(t, s, "rt-code-"+sub)

	if got := f.revokedTokens(); len(got) != 1 || got[0] != "rt-code-"+sub {
		t.Errorf("revoked %v", got)
	}
}

func testAppleOff(t *testing.T, s *Service, iss issuer, _ *fakeApple) {
	t.Helper()

	// A revocation written while Apple was on is dropped once it is off.
	sealed, err := s.apple.seal(keptToken{ClientID: testBundleID, RefreshToken: "rt"})
	if err != nil {
		t.Fatal(err)
	}

	s.apple = nil

	if _, err := signInApple(t, s, iss, "x", "x@icloud.com", AppleSignIn{}); !errors.Is(err, ErrAppleNotConfigured) {
		t.Errorf("err %v", err)
	}

	if s.AppleOn() {
		t.Error("on while off")
	}

	if err := s.revokeAppleTokens(t.Context(), appleTokensRevokedEvent{Sealed: [][]byte{sealed}}); err != nil {
		t.Errorf("revoking while off: %v", err)
	}
}

func TestLooseBool(t *testing.T) {
	t.Parallel()

	for raw, want := range map[string]bool{`true`: true, `"true"`: true, `false`: false, `"false"`: false, `null`: false} {
		var b looseBool
		if err := json.Unmarshal([]byte(raw), &b); err != nil || bool(b) != want {
			t.Errorf("%s: %v, %v", raw, b, err)
		}
	}

	var b looseBool
	if err := json.Unmarshal([]byte(`"yes"`), &b); err == nil {
		t.Error(`"yes" read as a boolean`)
	}
}
