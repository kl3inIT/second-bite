package main

import (
	"bytes"
	"flag"
	"net/http"
	"os"
	"path/filepath"
	"testing"

	"github.com/kl3inIT/second-bite/server/internal/platform"
)

var update = flag.Bool("update", false, "rewrite api/openapi.yaml from the registered operations")

// The OpenAPI document the web and mobile applications read.
const contractFile = "openapi.yaml"

var (
	contractDir  = filepath.Join("..", "..", "..", "api")
	contractPath = filepath.Join(contractDir, contractFile)
)

// TestOpenAPIDocumentIsCurrent fails when the committed contract differs from
// the one the operations generate. Run `go test ./cmd/secondbite -run
// TestOpenAPIDocumentIsCurrent -update` to rewrite it after changing an operation.
func TestOpenAPIDocumentIsCurrent(t *testing.T) {
	t.Parallel()

	api := platform.NewAPI(http.NewServeMux())
	registerOperations(api, &app{})

	got, err := api.OpenAPI().YAML()
	if err != nil {
		t.Fatal(err)
	}

	if *update {
		if err := os.WriteFile(contractPath, got, 0o644); err != nil { //nolint:gosec // a committed document everyone reads
			t.Fatal(err)
		}

		return
	}

	dir, err := os.OpenRoot(contractDir)
	if err != nil {
		t.Fatal(err)
	}

	want, err := dir.ReadFile(contractFile)
	if closeErr := dir.Close(); closeErr != nil {
		t.Fatal(closeErr)
	}

	if err != nil {
		t.Fatalf("reading the contract: %v (run with -update to create it)", err)
	}

	if !bytes.Equal(bytes.ReplaceAll(want, []byte("\r\n"), []byte("\n")), got) {
		t.Fatalf("%s is out of date; run go test ./cmd/secondbite -run TestOpenAPIDocumentIsCurrent -update", contractPath)
	}
}
