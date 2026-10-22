package seller

import (
	"context"
	"fmt"

	"github.com/google/uuid"
)

// NamesOf answers the name of each seller among ids, whatever its status, for
// the admin's report (SEC-80); an unknown seller is left out.
func (s *Service) NamesOf(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]string, error) {
	rows, err := s.queries.SellerNames(ctx, ids)
	if err != nil {
		return nil, fmt.Errorf("reading the sellers' names: %w", err)
	}

	names := make(map[uuid.UUID]string, len(rows))
	for _, r := range rows {
		names[r.ID] = r.Name
	}

	return names, nil
}
