package identity

import (
	"context"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"slices"
	"strings"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/kl3inIT/second-bite/server/internal/identity/internal/db"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

const (
	providerGoogle = "google"
	// googleKeysURL is where Google publishes the keys its ID tokens are
	// signed with (https://accounts.google.com/.well-known/openid-configuration).
	googleKeysURL = "https://www.googleapis.com/oauth2/v3/certs"
	// googleKeysTimeout bounds a fetch of Google's keys, so a sign-in fails
	// soon when Google cannot be reached; the emailed code still works.
	googleKeysTimeout = 5 * time.Second
	maxNameLength     = 200
	maxPictureLength  = 2048
)

// googleIssuers are the two forms of issuer Google writes in its ID tokens.
var googleIssuers = []string{"https://accounts.google.com", "accounts.google.com"}

// google verifies Google's ID tokens: the signature against Google's keys,
// the issuer, the audience among our client IDs, and the expiry.
type google struct {
	clientIDs []string
	verifier  *oidc.IDTokenVerifier
}

func newGoogle(clientIDs []string, keys oidc.KeySet) *google {
	// The issuer and the audience are checked here, since Google has two
	// issuers and we accept several client IDs (web, iOS, Android).
	return &google{
		clientIDs: clientIDs,
		verifier: oidc.NewVerifier(googleIssuers[0], keys, &oidc.Config{
			SkipClientIDCheck: true, SkipIssuerCheck: true,
		}),
	}
}

// remoteGoogleKeys fetches Google's keys when a token names one it has not
// seen, and keeps them.
func remoteGoogleKeys() oidc.KeySet {
	ctx := oidc.ClientContext(context.Background(), &http.Client{Timeout: googleKeysTimeout})

	return oidc.NewRemoteKeySet(ctx, googleKeysURL)
}

// googleClaims is what is read from a verified ID token.
type googleClaims struct {
	Subject       string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	HostedDomain  string `json:"hd"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

// authoritative tells whether Google speaks for the address: one at
// gmail.com, or a Google Workspace account (hd). For any other address the
// Google account's owner may no longer own it (design of SEC-29, decision 4).
func (c googleClaims) authoritative() bool {
	_, domain, _ := strings.Cut(c.Email, "@")

	return domain == "gmail.com" || c.HostedDomain != ""
}

// verify checks the token and, when a nonce is on either side, that the
// token's is the SHA-256 of the one posted, as Supabase Auth does.
func (g *google) verify(ctx context.Context, rawToken, nonce string) (googleClaims, error) {
	token, err := g.verifier.Verify(ctx, rawToken)
	if err != nil {
		return googleClaims{}, fmt.Errorf("verifying: %w", err)
	}

	if !slices.Contains(googleIssuers, token.Issuer) {
		return googleClaims{}, fmt.Errorf("issuer %q is not Google's", token.Issuer)
	}

	if !slices.ContainsFunc(token.Audience, func(aud string) bool { return slices.Contains(g.clientIDs, aud) }) {
		return googleClaims{}, errors.New("the audience is not one of our client IDs")
	}

	if token.Nonce != "" || nonce != "" {
		sum := sha256.Sum256([]byte(nonce))
		if nonce == "" || subtle.ConstantTimeCompare([]byte(token.Nonce), []byte(hex.EncodeToString(sum[:]))) != 1 {
			return googleClaims{}, errors.New("the nonce does not match")
		}
	}

	var c googleClaims
	if err := token.Claims(&c); err != nil {
		return googleClaims{}, fmt.Errorf("reading the claims: %w", err)
	}

	if c.Subject == "" {
		return googleClaims{}, errors.New("no subject")
	}

	c.Name = truncate(strings.TrimSpace(c.Name), maxNameLength)
	if len(c.Picture) > maxPictureLength || !strings.HasPrefix(c.Picture, "https://") {
		c.Picture = ""
	}

	return c, nil
}

func truncate(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}

	return string(r[:n])
}

// GoogleClientID is the client ID the web's sign-in button uses, the first
// one configured, or "" when Google is off.
func (s *Service) GoogleClientID() string {
	if s.google == nil {
		return ""
	}

	return s.google.clientIDs[0]
}

// SignInWithGoogle opens a session for the person Google's ID token names.
// The identity is found by Google's subject, never by address. A first
// sign-in needs a verified address; it creates the account, or links one
// that has the address when Google speaks for it, and otherwise asks the
// person to sign in with the emailed code (design of SEC-29, decision 4).
func (s *Service) SignInWithGoogle(ctx context.Context, idToken, nonce string) (Session, error) {
	if s.google == nil {
		return Session{}, ErrGoogleNotConfigured
	}

	claims, err := s.google.verify(ctx, idToken, nonce)
	if err != nil {
		s.logger.InfoContext(ctx, "Google token refused",
			slog.String("event", "identity.sign_in.failed"),
			slog.String("method", providerGoogle),
			slog.String("error_code", ErrGoogleTokenInvalid.Code),
			slog.String("error", err.Error()),
		)

		return Session{}, ErrGoogleTokenInvalid
	}

	var session Session

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		account, err := s.googleAccount(ctx, q, claims)
		if err != nil {
			return err
		}

		session, err = s.openSession(ctx, q, account, methodGoogle)

		return err
	})
	if err != nil {
		return Session{}, err
	}

	s.logger.InfoContext(ctx, "signed in",
		slog.String("event", "identity.sign_in.succeeded"),
		slog.String("account_id", session.Account.ID.String()),
		slog.String("method", providerGoogle),
	)

	return session, nil
}

// googleAccount returns the account of the Google identity, linking it on
// its first sign-in, and fills the account's name when it has none.
func (s *Service) googleAccount(ctx context.Context, q *db.Queries, c googleClaims) (Account, error) {
	if err := q.LockSubject(ctx, db.LockSubjectParams{Provider: providerGoogle, Subject: c.Subject}); err != nil {
		return Account{}, fmt.Errorf("locking the identity: %w", err)
	}

	accountID, err := q.FindExternalLogin(ctx, db.FindExternalLoginParams{Provider: providerGoogle, Subject: c.Subject})

	switch {
	case err == nil:
		refreshed, err := q.RefreshExternalLogin(ctx, db.RefreshExternalLoginParams{
			Name: c.Name, PictureUrl: c.Picture, Provider: providerGoogle, Subject: c.Subject,
		})
		if err != nil {
			return Account{}, fmt.Errorf("refreshing the identity: %w", err)
		}

		// An emailed code removed the link while this sign-in was reading it,
		// and ended the account's sessions: the identity is unlinked again.
		if refreshed == 0 {
			return s.linkGoogle(ctx, q, c)
		}

		return fillName(ctx, q, accountID, c.Name)
	case errors.Is(err, pgx.ErrNoRows):
		return s.linkGoogle(ctx, q, c)
	default:
		return Account{}, fmt.Errorf("finding the identity: %w", err)
	}
}

func (s *Service) linkGoogle(ctx context.Context, q *db.Queries, c googleClaims) (Account, error) {
	if !c.EmailVerified {
		return Account{}, ErrEmailNotVerified
	}

	email, err := normalizeEmail(c.Email)
	if err != nil {
		return Account{}, ErrEmailNotVerified
	}

	if err := q.LockEmail(ctx, email); err != nil {
		return Account{}, fmt.Errorf("locking the address: %w", err)
	}

	var accountID uuid.UUID

	existing, err := q.FindAccountByEmail(ctx, email)

	switch {
	case err == nil:
		if !c.authoritative() {
			return Account{}, ErrGoogleLinkRequired
		}

		accountID = existing.ID
	case errors.Is(err, pgx.ErrNoRows):
		created, err := q.InsertAccount(ctx, email)
		if err != nil {
			return Account{}, fmt.Errorf("creating the account: %w", err)
		}

		accountID = created.ID
	default:
		return Account{}, fmt.Errorf("finding the account: %w", err)
	}

	if err := q.InsertExternalLogin(ctx, db.InsertExternalLoginParams{
		AccountID: accountID, Provider: providerGoogle, Subject: c.Subject,
		LinkedEmail: email, EmailTrusted: c.authoritative(), Name: c.Name, PictureUrl: c.Picture,
	}); err != nil {
		return Account{}, fmt.Errorf("linking the identity: %w", err)
	}

	s.logger.InfoContext(ctx, "Google identity linked",
		slog.String("event", "identity.external_login.linked"),
		slog.String("account_id", accountID.String()),
		slog.String("provider", providerGoogle),
	)

	return fillName(ctx, q, accountID, c.Name)
}

// fillName gives the account Google's name when it has none and returns it.
func fillName(ctx context.Context, q *db.Queries, id uuid.UUID, name string) (Account, error) {
	row, err := q.FillDisplayName(ctx, db.FillDisplayNameParams{ID: id, DisplayName: name})
	if err != nil {
		return Account{}, fmt.Errorf("naming the account: %w", err)
	}

	return Account{ID: row.ID, Email: row.Email, Role: platform.Role(row.Role), DisplayName: row.DisplayName}, nil
}
