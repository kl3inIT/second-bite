package notification

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"testing"
)

func newTestSealer(t *testing.T) *Service {
	t.Helper()

	block, err := aes.NewCipher(bytes.Repeat([]byte{7}, 32))
	if err != nil {
		t.Fatal(err)
	}

	aead, err := cipher.NewGCM(block)
	if err != nil {
		t.Fatal(err)
	}

	return &Service{aead: aead}
}

func TestSealedSecretOpensOnlyInItsField(t *testing.T) {
	t.Parallel()

	s := newTestSealer(t)

	sealed, err := s.seal("brevo_api_key", "xkeysib-secret")
	if err != nil {
		t.Fatal(err)
	}

	if bytes.Contains(sealed, []byte("xkeysib-secret")) {
		t.Fatal("the secret is stored in clear")
	}

	if got, err := s.unseal("brevo_api_key", sealed); err != nil || got != "xkeysib-secret" {
		t.Fatalf("unseal: %q, %v", got, err)
	}

	if _, err := s.unseal("smtp_password", sealed); err == nil {
		t.Fatal("a value sealed for one field opened in another")
	}

	again, err := s.seal("brevo_api_key", "xkeysib-secret")
	if err != nil {
		t.Fatal(err)
	}

	if bytes.Equal(sealed, again) {
		t.Fatal("two seals of one value are equal: the nonce is not random")
	}
}
