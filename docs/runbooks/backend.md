# Run and check the backend

How to run the backend on a developer's machine and run the checks CI runs. The backend's rules are in the [backend guideline](../guidelines/backend.md).

## Prerequisites

- Go at the version in `server/go.mod`.
- Docker, for the local database and for the tests, which start PostgreSQL with PostGIS in containers.
- golangci-lint v2.14.0, the version CI runs: `go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.14.0`. Its maintainers advise against `go tool` for it, so it is not pinned in `go.mod`.
- govulncheck: `go install golang.org/x/vuln/cmd/govulncheck@latest`.

## Run locally

From the repository root, start the database:

```sh
docker compose up -d --wait
```

`SECONDBITE_POSTGRES_PORT=55432 docker compose up -d --wait` publishes it on another port when 5432 is taken. Then, from `server/`:

```sh
SECONDBITE_DATABASE_URL="postgres://secondbite@127.0.0.1:5432/secondbite?sslmode=disable" \
SECONDBITE_DATABASE_PASSWORD=secondbite-local \
SECONDBITE_LOG_FORMAT=text \
go run ./cmd/secondbite
```

The service migrates the database, then serves on `:8080`:

| Path | Answers |
| --- | --- |
| `/livez` | 204 while the process runs |
| `/readyz` | 204 while the database answers, otherwise a 503 problem |
| `/openapi.json`, `/openapi.yaml` | The OpenAPI 3.1 contract |
| `/docs` | The contract as a page to read |

`docker compose down` stops the database and keeps its data; `docker compose down -v` deletes it.

## Configuration

| Variable | Default | Holds |
| --- | --- | --- |
| `SECONDBITE_DATABASE_URL` | required | The PostgreSQL URL, without the password |
| `SECONDBITE_DATABASE_PASSWORD` | required, a secret | The database password |
| `SECONDBITE_DATABASE_MAX_CONNS` | `10` | The size of the connection pool |
| `SECONDBITE_HTTP_ADDR` | `:8080` | Where the API listens |
| `SECONDBITE_LOG_FORMAT` | `json` | `json`, or `text` for local development |
| `SECONDBITE_LOG_LEVEL` | `info` | `debug`, `info`, `warn` or `error` |
| `SECONDBITE_SECRETS_DIR` | `/run/secrets` | Where secret files are read from |

A secret is read from the file named after its variable in `SECONDBITE_SECRETS_DIR`, as deployed environments mount it. Only when no such file exists is the variable itself read, which is what local development does. The service refuses to start on a missing or malformed value.

## Checks

From `server/`, the same as CI ([workflow](../../.github/workflows/backend.yml)):

```sh
golangci-lint fmt ./...       # format
golangci-lint run ./...       # lint, with the configuration of the golang-lint skill
go test -race -count=1 ./...  # tests, including the boundary check and the contract check
govulncheck ./...             # known vulnerabilities that the code reaches
go mod tidy -diff             # go.mod and go.sum are tidy
```

`-race` needs a C compiler; on Windows without one, run `go test -count=1 ./...` and let CI run the race detector.

The tests include:

- **The boundary check** (`internal/boundaries_test.go`): which module may import which, read from "Allowed module dependencies" in [ARCHITECTURE.md](../../ARCHITECTURE.md).
- **The contract check** (`cmd/secondbite/openapi_test.go`): `api/openapi.yaml` must equal the document the operations generate. After changing an operation, rewrite it and commit it with the change:

  ```sh
  go test ./cmd/secondbite -run TestOpenAPIDocumentIsCurrent -update
  ```

- **The migration names** (`migrations/migrations_test.go`): `<n>_<module>_<description>.sql` with a four-digit version used once ([persistence guideline](../guidelines/persistence.md#schema-ownership)).

## Add a migration

Create `server/migrations/<next version>_<module>_<description>.sql` with goose's `-- +goose Up` and `-- +goose Down` sections. The service applies it at its next start; a PostgreSQL session lock lets only one instance migrate at a time.
