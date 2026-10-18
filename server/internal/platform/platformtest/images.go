package platformtest

import (
	"errors"
	"os"
	"path/filepath"
	"testing"

	"go.yaml.in/yaml/v3"
)

// Image returns the image the repository's compose.yaml gives service, so the
// tests run what local development runs, and the one place that names each
// image is the file Dependabot keeps current.
func Image(t *testing.T, service string) string {
	t.Helper()

	path, err := composeFile()
	if err != nil {
		t.Fatal(err)
	}

	data, err := os.ReadFile(path) //nolint:gosec // the repository's own compose file
	if err != nil {
		t.Fatal(err)
	}

	var compose struct {
		Services map[string]struct {
			Image string `yaml:"image"`
		} `yaml:"services"`
	}

	if err := yaml.Unmarshal(data, &compose); err != nil {
		t.Fatalf("reading %s: %v", path, err)
	}

	image := compose.Services[service].Image
	if image == "" {
		t.Fatalf("%s gives service %q no image", path, service)
	}

	return image
}

// composeFile finds compose.yaml in the working directory or above it, at the
// root of the repository.
func composeFile() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	for {
		path := filepath.Join(dir, "compose.yaml")
		if _, err := os.Stat(path); err == nil {
			return path, nil
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			return "", errors.New("compose.yaml not found above the working directory")
		}

		dir = parent
	}
}
