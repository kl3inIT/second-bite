package main

import (
	"bufio"
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"strings"

	"github.com/kl3inIT/second-bite/server/internal/notification"
)

// configureEmail saves the email settings from flags. The SMTP password or the
// Brevo API key is read from standard input with -secret-stdin, never from a
// flag, so it stays out of the shell's history.
func configureEmail(ctx context.Context, s *notification.Service, args []string, stdin io.Reader, stdout io.Writer) error {
	fs := flag.NewFlagSet("email configure", flag.ContinueOnError)
	fs.SetOutput(stdout)

	var c notification.EmailSettingsChange

	provider := fs.String("provider", "", "smtp or brevo")
	fs.StringVar(&c.SenderAddress, "sender-address", "", "the address emails come from")
	fs.StringVar(&c.SenderName, "sender-name", "Second Bite", "the name emails come from")
	fs.StringVar(&c.SMTPHost, "smtp-host", "", "the SMTP server")
	fs.IntVar(&c.SMTPPort, "smtp-port", 0, "the SMTP port")
	security := fs.String("smtp-security", "starttls", "starttls, tls or none")
	fs.StringVar(&c.SMTPUsername, "smtp-username", "", "the SMTP user, if the server asks for one")
	secretStdin := fs.Bool("secret-stdin", false, "read the SMTP password or the Brevo API key from standard input")

	if err := fs.Parse(args); err != nil {
		return err
	}

	if fs.NArg() > 0 {
		return fmt.Errorf("unexpected arguments: %s", strings.Join(fs.Args(), " "))
	}

	c.Provider = notification.EmailProvider(*provider)
	c.SMTPSecurity = notification.SMTPSecurity(*security)

	if *secretStdin {
		line, err := bufio.NewReader(stdin).ReadString('\n')
		if err != nil && !errors.Is(err, io.EOF) {
			return fmt.Errorf("reading the secret: %w", err)
		}

		secret := strings.TrimSpace(line)

		switch c.Provider {
		case notification.EmailProviderBrevo:
			c.BrevoAPIKey = secret
		case notification.EmailProviderSMTP:
			c.SMTPPassword = secret
		}
	}

	if err := s.SaveEmailSettingsAsSystem(ctx, c); err != nil {
		return err
	}

	_, err := fmt.Fprintf(stdout, "email is delivered by %s\n", c.Provider)

	return err
}
