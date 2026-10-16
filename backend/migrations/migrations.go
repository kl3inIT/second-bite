// Package migrations holds the versioned SQL migrations that own the schema,
// named <n>_<module>_<description>.sql and applied by goose at startup.
package migrations

import "embed"

// FS holds every migration.
//
//go:embed *.sql
var FS embed.FS
