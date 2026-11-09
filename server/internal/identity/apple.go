package identity

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"crypto/x509"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"slices"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/go-jose/go-jose/v4"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	providerApple = "apple"
	// appleIssuer is the issuer of Apple's identity tokens and the audience of
	// the client secrets Apple reads (Apple, Verifying a user).
	appleIssuer = "https://appleid.apple.com"
	// appleBaseURL is where Apple publishes its keys and answers the token and
	// revocation calls.
	appleBaseURL = "https://appleid.apple.com"
	// appleTimeout bounds each call to Apple, so a sign-in fails soon when Apple
	// cannot be reached; the other ways in still work.
	appleTimeout = 10 * time.Second
	// appleSecretLifetime is how long a client secret is good for; one is made
	// for each call, as Kratos does.
	appleSecretLifetime = 5 * time.Minute
	// appleTokenSeal binds a sealed refresh token to what it is.
	appleTokenSeal = "apple refresh token"
)

// appleDomains are the addresses Apple issues, whose owner Apple speaks for:
// its private relay and iCloud's (design of SEC-38, section 3).
var appleDomains = []string{"privaterelay.appleid.com", "icloud.com", "me.com", "mac.com"}

// AppleConfig is what signing in with Apple needs (SEC-38); the zero value
// leaves it off.
type AppleConfig struct {
	// ClientIDs are the bundle IDs whose identity tokens are accepted.
	ClientIDs []string
	// TeamID and KeyID name the developer team and its Sign in with Apple key.
	TeamID, KeyID string
	// PrivateKey is that key's .p8 file, in PEM.
	PrivateKey string
	// TokenKey seals the refresh tokens kept for their revocation: 32 bytes.
	TokenKey []byte
}

// on tells whether any of it is set.
func (c AppleConfig) on() bool {
	return len(c.ClientIDs) > 0 || c.TeamID != "" || c.KeyID != "" || c.PrivateKey != "" || len(c.TokenKey) > 0
}

// apple verifies Apple's identity tokens, exchanges an authorization code for
// the refresh token that can revoke the access, and revokes it.
type apple struct {
	clientIDs []string
	teamID    string
	keyID     string
	key       *ecdsa.PrivateKey
	aead      cipher.AEAD
	verifier  *oidc.IDTokenVerifier
	client    *http.Client
	baseURL   string
	now       func() time.Time
}

func newApple(cfg AppleConfig, keys oidc.KeySet, baseURL string) (*apple, error) {
	if len(cfg.ClientIDs) == 0 || cfg.TeamID == "" || cfg.KeyID == "" || cfg.PrivateKey == "" {
		return nil, errors.New("signing in with Apple needs its client IDs, team ID, key ID and private key together")
	}

	block, _ := pem.Decode([]byte(cfg.PrivateKey))
	if block == nil {
		return nil, errors.New("the Apple private key is not PEM")
	}

	parsed, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("the Apple private key: %w", err)
	}

	key, ok := parsed.(*ecdsa.PrivateKey)
	if !ok {
		return nil, errors.New("the Apple private key is not an elliptic-curve key")
	}

	cb, err := aes.NewCipher(cfg.TokenKey)
	if err != nil || len(cfg.TokenKey) != 32 {
		return nil, errors.New("the Apple token key must be 32 bytes")
	}

	aead, err := cipher.NewGCM(cb)
	if err != nil {
		return nil, fmt.Errorf("the Apple token key: %w", err)
	}

	return &apple{
		clientIDs: cfg.ClientIDs, teamID: cfg.TeamID, keyID: cfg.KeyID, key: key, aead: aead,
		// The audience is checked here, among several bundle IDs.
		verifier: oidc.NewVerifier(appleIssuer, keys, &oidc.Config{SkipClientIDCheck: true}),
		client:   &http.Client{Timeout: appleTimeout},
		baseURL:  baseURL,
		now:      time.Now,
	}, nil
}

// remoteAppleKeys fetches Apple's keys when a token names one it has not seen,
// and keeps them.
func remoteAppleKeys() oidc.KeySet {
	ctx := oidc.ClientContext(context.Background(), &http.Client{Timeout: appleTimeout})

	return oidc.NewRemoteKeySet(ctx, appleBaseURL+"/auth/keys")
}

// looseBool reads a claim Apple writes as a boolean or as the string "true".
type looseBool bool

func (b *looseBool) UnmarshalJSON(data []byte) error {
	switch strings.Trim(string(data), `"`) {
	case "true":
		*b = true
	case "false", "null", "":
		*b = false
	default:
		return fmt.Errorf("%s is not a boolean", data)
	}

	return nil
}

// appleClaims is what is read from a verified identity token.
type appleClaims struct {
	Subject       string    `json:"sub"`
	Email         string    `json:"email"`
	EmailVerified looseBool `json:"email_verified"`
	// clientID is the bundle ID the token was issued to.
	clientID string
}

// verify checks the token and that its nonce is the SHA-256 of the one posted.
// Unlike Google's, the nonce is required: the app always sends one.
func (a *apple) verify(ctx context.Context, rawToken, nonce string) (appleClaims, error) {
	if nonce == "" {
		return appleClaims{}, errors.New("no nonce")
	}

	token, err := a.verifier.Verify(ctx, rawToken)
	if err != nil {
		return appleClaims{}, fmt.Errorf("verifying: %w", err)
	}

	i := slices.IndexFunc(token.Audience, func(aud string) bool { return slices.Contains(a.clientIDs, aud) })
	if i < 0 {
		return appleClaims{}, errors.New("the audience is not one of our bundle IDs")
	}

	sum := sha256.Sum256([]byte(nonce))
	if subtle.ConstantTimeCompare([]byte(token.Nonce), []byte(hex.EncodeToString(sum[:]))) != 1 {
		return appleClaims{}, errors.New("the nonce does not match")
	}

	var c appleClaims
	if err := token.Claims(&c); err != nil {
		return appleClaims{}, fmt.Errorf("reading the claims: %w", err)
	}

	if c.Subject == "" {
		return appleClaims{}, errors.New("no subject")
	}

	c.clientID = token.Audience[i]

	return c, nil
}

// authoritative tells whether Apple speaks for the address: one Apple issues.
func (c appleClaims) authoritative() bool {
	_, domain, _ := strings.Cut(strings.ToLower(c.Email), "@")

	return slices.Contains(appleDomains, domain)
}

// clientSecret is the ES256 JWT Apple reads as clientID's secret (Apple,
// Creating a client secret), valid appleSecretLifetime.
func (a *apple) clientSecret(clientID string) (string, error) {
	signer, err := jose.NewSigner(jose.SigningKey{Algorithm: jose.ES256, Key: a.key},
		(&jose.SignerOptions{}).WithType("JWT").WithHeader("kid", a.keyID))
	if err != nil {
		return "", fmt.Errorf("making the signer: %w", err)
	}

	now := a.now()

	payload, err := json.Marshal(map[string]any{
		"iss": a.teamID, "iat": now.Unix(), "exp": now.Add(appleSecretLifetime).Unix(),
		"aud": appleIssuer, "sub": clientID,
	})
	if err != nil {
		return "", fmt.Errorf("writing the claims: %w", err)
	}

	signed, err := signer.Sign(payload)
	if err != nil {
		return "", fmt.Errorf("signing: %w", err)
	}

	return signed.CompactSerialize()
}

// post sends form to Apple's path with clientID's secret and returns the body
// of a 200 answer.
func (a *apple) post(ctx context.Context, path, clientID string, form url.Values) ([]byte, error) {
	secret, err := a.clientSecret(clientID)
	if err != nil {
		return nil, err
	}

	form.Set("client_id", clientID)
	form.Set("client_secret", secret)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, a.baseURL+path, strings.NewReader(form.Encode()))
	if err != nil {
		return nil, fmt.Errorf("making the request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	res, err := a.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("calling Apple: %w", err)
	}
	defer func() { _ = res.Body.Close() }()

	body, err := io.ReadAll(io.LimitReader(res.Body, 64<<10))
	if err != nil {
		return nil, fmt.Errorf("reading Apple's answer: %w", err)
	}

	if res.StatusCode != http.StatusOK {
		// Apple's error body names the error only ("invalid_grant"), never a token.
		return nil, fmt.Errorf("apple answered %d: %s", res.StatusCode, body)
	}

	return body, nil
}

// exchange spends the authorization code for the refresh token that can later
// revoke the access (Apple, Generate and validate tokens).
func (a *apple) exchange(ctx context.Context, clientID, code string) (string, error) {
	body, err := a.post(ctx, "/auth/token", clientID, url.Values{
		"code": {code}, "grant_type": {"authorization_code"},
	})
	if err != nil {
		return "", err
	}

	var answer struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.Unmarshal(body, &answer); err != nil {
		return "", fmt.Errorf("reading Apple's tokens: %w", err)
	}

	if answer.RefreshToken == "" {
		return "", errors.New("apple answered no refresh token")
	}

	return answer.RefreshToken, nil
}

// keptToken is what a sealed refresh token holds: the bundle ID it was issued
// to, which revokes it.
type keptToken struct {
	ClientID     string `json:"clientId"`
	RefreshToken string `json:"refreshToken"`
}

func (a *apple) seal(t keptToken) ([]byte, error) {
	plain, err := json.Marshal(t) //nolint:gosec // sealed at once below, never kept or written in clear
	if err != nil {
		return nil, fmt.Errorf("writing the token: %w", err)
	}

	nonce := make([]byte, a.aead.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, fmt.Errorf("sealing the token: %w", err)
	}

	return a.aead.Seal(nonce, nonce, plain, []byte(appleTokenSeal)), nil
}

func (a *apple) unseal(sealed []byte) (keptToken, error) {
	n := a.aead.NonceSize()
	if len(sealed) < n {
		return keptToken{}, errors.New("unsealing the token: too short")
	}

	plain, err := a.aead.Open(nil, sealed[:n], sealed[n:], []byte(appleTokenSeal))
	if err != nil {
		return keptToken{}, fmt.Errorf("unsealing the token, sealed under another key: %w", err)
	}

	var t keptToken
	if err := json.Unmarshal(plain, &t); err != nil {
		return keptToken{}, fmt.Errorf("reading the token: %w", err)
	}

	return t, nil
}

// revoke tells Apple to forget the access the token gives (Apple, Revoke
// tokens). Apple answers 200 for a token already invalid, so a retry is
// harmless.
func (a *apple) revoke(ctx context.Context, t keptToken) error {
	_, err := a.post(ctx, "/auth/revoke", t.ClientID, url.Values{
		"token": {t.RefreshToken}, "token_type_hint": {"refresh_token"},
	})

	return err
}

// AppleOn tells whether signing in with Apple is configured.
func (s *Service) AppleOn() bool { return s.apple != nil }

// AppleSignIn is what the app posts after Apple's sheet: the identity token,
// the value whose SHA-256 was given to Apple as the nonce, the authorization
// code, and the name Apple shares on the first authorization only.
type AppleSignIn struct {
	IDToken, Nonce, AuthorizationCode string
	GivenName, FamilyName             string
}

// SignInWithApple opens a session for the person Apple's identity token names
// (SEC-38), linked as Google's is. The authorization code is exchanged first,
// and the refresh token kept sealed on the link, so the access can be revoked
// when the link goes; without it, nothing is linked.
func (s *Service) SignInWithApple(ctx context.Context, in AppleSignIn) (Session, error) {
	if s.apple == nil {
		return Session{}, ErrAppleNotConfigured
	}

	claims, err := s.apple.verify(ctx, in.IDToken, in.Nonce)
	if err != nil {
		s.logSignInRefused(ctx, ErrAppleTokenInvalid, err)

		return Session{}, ErrAppleTokenInvalid
	}

	refreshToken, err := s.apple.exchange(ctx, claims.clientID, in.AuthorizationCode)
	if err != nil {
		s.logSignInRefused(ctx, ErrAppleUnavailable, err)

		return Session{}, ErrAppleUnavailable
	}

	kept := keptToken{ClientID: claims.clientID, RefreshToken: refreshToken}

	sealed, err := s.apple.seal(kept)
	if err != nil {
		return Session{}, err
	}

	id := externalIdentity{
		provider: providerApple, subject: claims.Subject, email: claims.Email,
		emailVerified: bool(claims.EmailVerified), authoritative: claims.authoritative(),
		name: appleName(in.FamilyName, in.GivenName), linkRequired: ErrAppleLinkRequired,
	}

	var session Session

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		account, err := s.externalAccount(ctx, q, id)
		if err != nil {
			return err
		}

		if err := q.KeepRefreshToken(ctx, db.KeepRefreshTokenParams{
			RefreshTokenSealed: sealed, Provider: providerApple, Subject: claims.Subject,
		}); err != nil {
			return fmt.Errorf("keeping the refresh token: %w", err)
		}

		session, err = s.openSession(ctx, q, account, methodApple)

		return err
	})
	if err != nil {
		// The access Apple just gave is linked to nothing: it is taken back.
		if revokeErr := s.apple.revoke(ctx, kept); revokeErr != nil {
			s.logger.WarnContext(ctx, "an unlinked Apple access was not revoked",
				slog.String("event", "identity.apple.revoke_failed"),
				slog.String("error", revokeErr.Error()),
			)
		}

		return Session{}, err
	}

	s.logger.InfoContext(ctx, "signed in",
		slog.String("event", "identity.sign_in.succeeded"),
		slog.String("account_id", session.Account.ID.String()),
		slog.String("method", providerApple),
	)

	return session, nil
}

func (s *Service) logSignInRefused(ctx context.Context, failure *platform.FailureError, err error) {
	s.logger.InfoContext(ctx, "Apple sign-in refused",
		slog.String("event", "identity.sign_in.failed"),
		slog.String("method", providerApple),
		slog.String("error_code", failure.Code),
		slog.String("error", err.Error()),
	)
}

// appleName is the name Apple shared, family name first as Vietnamese names
// are written, trimmed to maxNameLength; empty after the first authorization.
func appleName(family, given string) string {
	return truncate(strings.Join(strings.Fields(family+" "+given), " "), maxNameLength)
}

// appleTokensRevokedEvent carries the sealed refresh tokens of links to Apple
// that went, so a listener revokes them with River's retries (SEC-38).
type appleTokensRevokedEvent struct {
	Sealed [][]byte `json:"sealed"`
}

// EventKey names the event where it is stored, delivered and logged.
func (appleTokensRevokedEvent) EventKey() string { return "identity.apple_tokens_revoked" }

// revokeLater publishes in tx the revocation of the sealed tokens among sealed;
// links without one (Google's) are skipped.
func (s *Service) revokeLater(ctx context.Context, tx pgx.Tx, sealed [][]byte) error {
	tokens := slices.DeleteFunc(slices.Clone(sealed), func(b []byte) bool { return len(b) == 0 })
	if len(tokens) == 0 {
		return nil
	}

	return platform.Publish(ctx, tx, s.events, appleTokensRevokedEvent{Sealed: tokens})
}

// revokeAppleTokens tells Apple to forget each access; a failure is retried.
// A token sealed under another key, or one left after Apple was switched off,
// cannot be sent and is dropped with a warning.
func (s *Service) revokeAppleTokens(ctx context.Context, e appleTokensRevokedEvent) error {
	if s.apple == nil {
		s.logger.WarnContext(ctx, "Apple tokens not revoked: Apple is off",
			slog.String("event", "identity.apple.revoke_skipped"), slog.Int("count", len(e.Sealed)))

		return nil
	}

	var errs []error

	for _, sealed := range e.Sealed {
		t, err := s.apple.unseal(sealed)
		if err != nil {
			s.logger.WarnContext(ctx, "an Apple token could not be read and is not revoked",
				slog.String("event", "identity.apple.revoke_skipped"), slog.String("error", err.Error()))

			continue
		}

		errs = append(errs, s.apple.revoke(ctx, t))
	}

	return errors.Join(errs...)
}

// RegisterListeners subscribes the module to its own events.
func RegisterListeners(events *platform.Events, s *Service) {
	platform.Listen(events, "identity.revoke_apple_tokens", s.revokeAppleTokens)
}
