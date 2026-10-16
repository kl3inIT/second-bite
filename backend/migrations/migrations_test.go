package migrations_test

import (
	"io/fs"
	"regexp"
	"testing"

	"github.com/kl3inIT/second-bite/backend/migrations"
)

var namePattern = regexp.MustCompile(`^(\d{4})_[a-z][a-z0-9]*_[a-z0-9_]+\.sql$`)

// TestNames checks the rule of the persistence guideline: a migration is named
// <n>_<module>_<description>.sql in snake case, and a version belongs to one
// migration only.
func TestNames(t *testing.T) {
	t.Parallel()

	names, err := fs.Glob(migrations.FS, "*.sql")
	if err != nil {
		t.Fatal(err)
	}

	if len(names) == 0 {
		t.Fatal("no migration found")
	}

	seen := map[string]string{}

	for _, name := range names {
		m := namePattern.FindStringSubmatch(name)
		if m == nil {
			t.Errorf("%s: want <n>_<module>_<description>.sql with a four-digit version, in snake case", name)

			continue
		}

		if other, dup := seen[m[1]]; dup {
			t.Errorf("version %s is used by %s and %s", m[1], other, name)
		}

		seen[m[1]] = name
	}
}
