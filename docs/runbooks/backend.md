# Run and check the backend

How to run the backend on a developer's machine and run the checks CI runs. The backend's rules are in the [backend guideline](../guidelines/backend.md).

## Prerequisites

- Go at the version in `server/go.mod`.
- Docker, for the local database and for the tests, which start PostgreSQL with PostGIS in containers.
- golangci-lint v2.15.0, the version CI runs: `go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.15.0`. Its maintainers advise against `go tool` for it, so it is not pinned in `go.mod`.
- govulncheck: `go install golang.org/x/vuln/cmd/govulncheck@latest`.

## Run locally

From the repository root, start the database and Mailpit:

```sh
docker compose up -d --wait
```

`SECONDBITE_POSTGRES_PORT`, `SECONDBITE_MAILPIT_SMTP_PORT` and `SECONDBITE_MAILPIT_WEB_PORT` publish them on other ports when 5432, 1025 or 8025 are taken. Then, from `server/`, set the environment once per shell. The two keys are made up for this machine; keep them for as long as the local database lives, because the email settings are sealed under the first.

```sh
export SECONDBITE_DATABASE_URL="postgres://secondbite@127.0.0.1:5432/secondbite?sslmode=disable"
export SECONDBITE_DATABASE_PASSWORD=secondbite-local
export SECONDBITE_EMAIL_SETTINGS_KEY="$(openssl rand -base64 32)"
export SECONDBITE_SIGN_IN_CODE_KEY="$(openssl rand -base64 32)"
export SECONDBITE_LOG_FORMAT=text
```

A fresh database sends no email and has no admin. Configure email to Mailpit and make yourself an admin, once:

```sh
go run ./cmd/secondbite email configure -provider smtp -sender-address no-reply@secondbite.local \
  -smtp-host 127.0.0.1 -smtp-port 1025 -smtp-security none
go run ./cmd/secondbite admin grant you@example.com
```

Then serve:

```sh
go run ./cmd/secondbite serve
```

To offer signing in with Google, set the OAuth client IDs whose tokens are accepted, the web's first, comma-separated. A client ID is public, but it belongs to whoever owns the Google Cloud project, so it lives in each environment's configuration and never in Git. Create a client of type "Web application" in that project, with `http://localhost:3000` among its authorised JavaScript origins, and while its consent screen is in testing mode add each person who signs in as a test user.

```sh
export SECONDBITE_GOOGLE_CLIENT_IDS="<the web client's ID>"
```

Every email the service sends appears in Mailpit at <http://127.0.0.1:8025>. To sign in, `POST /auth/sign-in-codes` with `{"email": "you@example.com"}`, read the code in Mailpit, `POST /auth/sessions` with the `challengeId` and the `code`, and send the `token` it answers as `Authorization: Bearer <token>`.

The service migrates the database at every command, then `serve` listens on `:8080`:

| Path | Answers |
| --- | --- |
| `/livez` | 204 while the process runs |
| `/readyz` | 204 while the database answers, otherwise a 503 problem |
| `/openapi.json`, `/openapi.yaml` | The OpenAPI 3.1 contract |
| `/docs` | The contract as a page to read |

`docker compose down` stops the database and keeps its data; `docker compose down -v` deletes it.

To keep files in an S3-compatible store rather than PostgreSQL, start VersityGW as well, create a bucket once, and point the service at it:

```bash
docker compose --profile s3 up -d --wait
# once: create the bucket with any S3 client, for example
#   aws --endpoint-url http://127.0.0.1:7070 s3 mb s3://secondbite   (keys below)
export SECONDBITE_FILE_STORE=s3
export SECONDBITE_S3_ENDPOINT=http://127.0.0.1:7070
export SECONDBITE_S3_BUCKET=secondbite
export SECONDBITE_S3_ACCESS_KEY_ID=secondbite-local
export SECONDBITE_S3_SECRET_ACCESS_KEY=secondbite-local-secret
```

The tests start the images `compose.yaml` names, so Dependabot's updates of that file are what move the tests to newer images.

## Configuration

| Variable | Default | Holds |
| --- | --- | --- |
| `SECONDBITE_DATABASE_URL` | required | The PostgreSQL URL, without the password |
| `SECONDBITE_DATABASE_PASSWORD` | required, a secret | The database password |
| `SECONDBITE_EMAIL_SETTINGS_KEY` | required, a secret | 32 bytes in standard base64 that seal the email provider's password or API key in the database. Replacing it makes them unreadable: an admin enters them again |
| `SECONDBITE_SIGN_IN_CODE_KEY` | required, a secret | 32 bytes in standard base64 that key the HMAC of stored sign-in codes. Replacing it voids the codes sent in the last 15 minutes |
| `SECONDBITE_DATABASE_MAX_CONNS` | `10` | The size of the connection pool |
| `SECONDBITE_HTTP_ADDR` | `:8080` | Where the API listens |
| `SECONDBITE_LOG_FORMAT` | `json` | `json`, or `text` for local development |
| `SECONDBITE_LOG_LEVEL` | `info` | `debug`, `info`, `warn` or `error` |
| `SECONDBITE_FILE_STORE` | `postgres` | Where new files are kept: `postgres`, or `s3` with the S3 settings below |
| `SECONDBITE_S3_BUCKET` | none | The bucket of an S3-compatible store (AWS S3, Cloudflare R2, Garage, SeaweedFS, MinIO); setting it configures the S3 store, and the service checks at startup that it answers |
| `SECONDBITE_S3_ENDPOINT` | AWS S3 | The store's URL, such as `https://<account>.r2.cloudflarestorage.com` |
| `SECONDBITE_S3_REGION` | `us-east-1` | `auto` for R2 |
| `SECONDBITE_S3_ACCESS_KEY_ID` | required with a bucket | The access key's identifier |
| `SECONDBITE_S3_SECRET_ACCESS_KEY` | required with a bucket, a secret | The access key's secret |
| `SECONDBITE_S3_PATH_STYLE` | `true` | `false` addresses the bucket in the host name, as AWS prefers |
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

## Administrative commands

A fresh installation needs an email provider and a first admin before anyone can sign in, so both are commands of the binary, run where the service runs, with its environment:

| Command | Does |
| --- | --- |
| `secondbite email configure -provider smtp -sender-address A -smtp-host H -smtp-port P [-smtp-security starttls\|tls\|none] [-smtp-username U -secret-stdin]` | Delivers email through an SMTP server; the password is read from standard input |
| `secondbite email configure -provider brevo -sender-address A -secret-stdin` | Delivers email through Brevo's API; the API key is read from standard input |
| `secondbite admin grant EMAIL` | Makes the account of EMAIL an admin, creating it if the address has never signed in |

A secret is never a flag, so it stays out of the shell's history: `secondbite email configure ... -secret-stdin < /run/secrets/brevo-api-key`. Afterwards admins change the provider in the API (`PUT /admin/email-settings`) and the next email uses it, without a restart.

## Regenerate the queries

Each module's SQL is in `internal/<module>/queries.sql`; sqlc turns it into Go under `internal/<module>/internal/db`, against the schema the migrations build. After changing a query or a migration:

```sh
go tool sqlc generate
```

CI runs `go tool sqlc diff` and fails when the generated code is out of date. sqlc is pinned in `go.mod` with a `tool` directive and builds without a C compiler.

## Add a migration

Create `server/migrations/<next version>_<module>_<description>.sql` with goose's `-- +goose Up` and `-- +goose Down` sections. The service applies it at its next start; a PostgreSQL session lock lets only one instance migrate at a time.
