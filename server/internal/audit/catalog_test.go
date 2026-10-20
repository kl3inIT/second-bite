package audit

import (
	"regexp"
	"testing"
)

// catalog is every action of catalog.go; a type added there is added here.
var catalog = []Action{
	OfferSettingsChanged{},
	EmailSettingsChanged{},
}

var actionName = regexp.MustCompile(`^[a-z_]+\.[a-z_]+$`)

// TestCatalog checks each action's name has the shape the table accepts and
// names one action only.
func TestCatalog(t *testing.T) {
	t.Parallel()

	seen := map[string]Action{}

	for _, a := range catalog {
		name := a.action()
		if !actionName.MatchString(name) {
			t.Errorf("%T is named %q, want subject.verb in lower case", a, name)
		}

		if other, ok := seen[name]; ok {
			t.Errorf("%T and %T are both named %q", a, other, name)
		}

		seen[name] = a
	}
}
