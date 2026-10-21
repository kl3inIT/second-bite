package main

import (
	"context"
	"fmt"
	"io"

	"github.com/kl3inIT/second-bite/server/internal/identity"
)

// runAdmin runs `secondbite admin grant EMAIL` and `secondbite admin revoke
// EMAIL`. Both are recorded in the audit trail without an actor; revoking
// keeps the last admin.
func runAdmin(ctx context.Context, s *identity.Service, args []string, stdout io.Writer) error {
	if len(args) != 2 {
		return errUsage
	}

	switch args[0] {
	case "grant":
		a, err := s.GrantAdminAsSystem(ctx, args[1])
		if err != nil {
			return err
		}

		_, err = fmt.Fprintf(stdout, "%s is an admin\n", a.Email)

		return err
	case "revoke":
		a, err := s.RevokeAdminAsSystem(ctx, args[1])
		if err != nil {
			return err
		}

		_, err = fmt.Fprintf(stdout, "%s is not an admin\n", a.Email)

		return err
	default:
		return errUsage
	}
}
