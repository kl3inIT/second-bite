package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"os"

	webpush "github.com/SherClockHolmes/webpush-go"

	"github.com/kl3inIT/second-bite/server/internal/notification"
	"github.com/kl3inIT/second-bite/server/internal/platform"
)

// pushConfig reads Web Push's settings (SEC-25). Without
// SECONDBITE_PUSH_PUBLIC_KEY Web Push is off and nothing else is read; with it,
// the private key is a secret and the site's origin is required.
func pushConfig(getenv func(string) string) (notification.PushConfig, error) {
	cfg := notification.PushConfig{PublicKey: getenv("SECONDBITE_PUSH_PUBLIC_KEY"), SiteURL: getenv("SECONDBITE_SITE_URL")}
	if cfg.PublicKey == "" {
		return notification.PushConfig{}, nil
	}

	if cfg.SiteURL == "" {
		return notification.PushConfig{}, errors.New("SECONDBITE_SITE_URL is required with SECONDBITE_PUSH_PUBLIC_KEY")
	}

	private, err := platform.ReadSecret(getenv, "SECONDBITE_PUSH_PRIVATE_KEY")
	if err != nil {
		return notification.PushConfig{}, err
	}

	cfg.PrivateKey = private

	return cfg, nil
}

// pushKeys makes a VAPID key pair: the private key goes to a new file, only
// its owner may read it, and is never printed; the public key is printed, for
// SECONDBITE_PUSH_PUBLIC_KEY.
func pushKeys(args []string, stdout io.Writer) error {
	if len(args) == 0 || args[0] != "keys" {
		return errUsage
	}

	flags := flag.NewFlagSet("push keys", flag.ContinueOnError)
	flags.SetOutput(stdout)

	path := flags.String("private-key-file", "", "the new file the private key is written to")
	if err := flags.Parse(args[1:]); err != nil {
		return err
	}

	if *path == "" || flags.NArg() != 0 {
		return errUsage
	}

	private, public, err := webpush.GenerateVAPIDKeys()
	if err != nil {
		return fmt.Errorf("making the VAPID keys: %w", err)
	}

	f, err := os.OpenFile(*path, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o400)
	if err != nil {
		return fmt.Errorf("creating the private key file: %w", err)
	}

	if _, err := io.WriteString(f, private); err != nil {
		return errors.Join(fmt.Errorf("writing the private key: %w", err), f.Close())
	}

	if err := f.Close(); err != nil {
		return fmt.Errorf("writing the private key: %w", err)
	}

	_, err = fmt.Fprintln(stdout, public)

	return err
}
