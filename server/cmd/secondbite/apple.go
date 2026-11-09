package main

import (
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// appleConfig reads Sign in with Apple's settings (SEC-38). Without
// SECONDBITE_APPLE_CLIENT_IDS Apple is off and nothing else is read; with it,
// the team ID, the key ID, the key and the token key are required, the last two
// as secrets.
func appleConfig(getenv func(string) string) (identity.AppleConfig, error) {
	cfg := identity.AppleConfig{
		ClientIDs: listOf(getenv("SECONDBITE_APPLE_CLIENT_IDS")),
		TeamID:    getenv("SECONDBITE_APPLE_TEAM_ID"),
		KeyID:     getenv("SECONDBITE_APPLE_KEY_ID"),
	}
	if len(cfg.ClientIDs) == 0 {
		return identity.AppleConfig{}, nil
	}

	key, err := platform.ReadSecret(getenv, "SECONDBITE_APPLE_PRIVATE_KEY")
	if err != nil {
		return identity.AppleConfig{}, err
	}

	cfg.PrivateKey = key

	cfg.TokenKey, err = platform.ReadKey(getenv, "SECONDBITE_APPLE_TOKEN_KEY")
	if err != nil {
		return identity.AppleConfig{}, err
	}

	return cfg, nil
}
