package internal_test

import (
	"bufio"
	"bytes"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

const modulePath = "github.com/kl3inIT/second-bite/server"

// edgePattern reads one line of the allowed dependencies in ARCHITECTURE.md,
// such as "- `seller` → `identity`, `notification`".
var (
	edgePattern = regexp.MustCompile("^- `([a-z]+)` → (.+)$")
	namePattern = regexp.MustCompile("`([a-z]+)`")
)

// TestModuleBoundaries checks what the compiler cannot: which module may
// depend on which. The allowed edges are the list in ARCHITECTURE.md, so the
// architecture page and this check cannot disagree.
//
//   - internal/platform depends on no module;
//   - a module depends on platform, on its own packages, and on the root
//     package (the published API) of the modules its line names, never on
//     their other packages.
//
// Test imports count too.
func TestModuleBoundaries(t *testing.T) {
	t.Parallel()

	allowed := readAllowedEdges(t)

	cmd := exec.CommandContext(t.Context(), "go", "list", "-f",
		`{{.ImportPath}}{{range .Imports}} {{.}}{{end}}{{range .TestImports}} {{.}}{{end}}{{range .XTestImports}} {{.}}{{end}}`,
		"./...")
	cmd.Dir = ".."

	out, err := cmd.Output()
	if err != nil {
		t.Fatalf("go list: %v", err)
	}

	for line := range strings.SplitSeq(strings.TrimSpace(string(out)), "\n") {
		fields := strings.Fields(line)
		from, ok := moduleOf(fields[0])

		if !ok {
			continue
		}

		for _, imp := range fields[1:] {
			to, isModule := moduleOf(imp)
			if !isModule || to == from || to == "platform" {
				continue
			}

			switch {
			case from == "platform":
				t.Errorf("%s imports %s: platform depends on no module", fields[0], imp)
			case !allowed[from][to]:
				t.Errorf("%s imports %s: %s → %s is not an allowed edge in ARCHITECTURE.md", fields[0], imp, from, to)
			case imp != modulePath+"/internal/"+to:
				t.Errorf("%s imports %s: only the root package of %s is its published API", fields[0], imp, to)
			}
		}
	}
}

// moduleOf names the module a package belongs to: the first directory under
// internal/.
func moduleOf(pkg string) (string, bool) {
	rest, ok := strings.CutPrefix(pkg, modulePath+"/internal/")
	if !ok {
		return "", false
	}

	name, _, _ := strings.Cut(rest, "/")

	return name, true
}

func readAllowedEdges(t *testing.T) map[string]map[string]bool {
	t.Helper()

	const path = "ARCHITECTURE.md"

	repo, err := os.OpenRoot(filepath.Join("..", ".."))
	if err != nil {
		t.Fatal(err)
	}

	content, err := repo.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}

	if err := repo.Close(); err != nil {
		t.Fatal(err)
	}

	edges := map[string]map[string]bool{}
	inSection, found := false, false
	scanner := bufio.NewScanner(bytes.NewReader(content))

	for scanner.Scan() {
		line := scanner.Text()

		if strings.HasPrefix(line, "#") {
			inSection = line == "### Allowed module dependencies"
			found = found || inSection

			continue
		}

		m := edgePattern.FindStringSubmatch(line)
		if !inSection || m == nil {
			continue
		}

		edges[m[1]] = map[string]bool{}
		for _, to := range namePattern.FindAllStringSubmatch(m[2], -1) {
			edges[m[1]][to[1]] = true
		}
	}

	if err := scanner.Err(); err != nil {
		t.Fatal(err)
	}

	if !found {
		t.Fatalf("%s has no section \"### Allowed module dependencies\"", path)
	}

	return edges
}
