# The backend's checks, named once for the developer's machine and CI (.github/workflows/backend.yml), as
# hypomnema's Makefile. Run from server/. Recipes are single commands so that they run under sh and under cmd.exe,
# the shell GNU make takes on Windows when no sh is on the PATH.

GO ?= go
GOLANGCI_LINT ?= golangci-lint
# The base a branch is compared with by migration-check; CI passes the merge commit's first parent.
BASE ?= origin/main
# The test target verify runs; on Windows without a C compiler, make verify TEST=test and let CI run the race detector.
TEST ?= test-race

.PHONY: help verify fmt lint test test-race vuln tidy-check sqlc-check migration-check

help:
	@echo make verify           the checks CI runs, before every push: tidy, sqlc, lint, tests, vulnerabilities, migrations
	@echo make fmt              format the code
	@echo make lint             golangci-lint, with the configuration of the golang-lint skill
	@echo make test             tests, including the boundary, contract and PostgreSQL checks (needs Docker)
	@echo make test-race        the tests with the race detector (needs a C compiler)
	@echo make vuln             known vulnerabilities that the code reaches
	@echo make tidy-check       go.mod and go.sum are tidy
	@echo make sqlc-check       the code sqlc generates is current
	@echo make migration-check  no migration on BASE=$(BASE) is changed, renamed or removed

verify: tidy-check sqlc-check lint $(TEST) vuln migration-check

fmt:
	$(GOLANGCI_LINT) fmt ./...

lint:
	$(GOLANGCI_LINT) run ./...

test:
	$(GO) test -count=1 ./...

test-race: export CGO_ENABLED = 1
test-race:
	$(GO) test -race -count=1 ./...

vuln:
	$(GO) tool govulncheck ./...

tidy-check:
	$(GO) mod tidy -diff

sqlc-check:
	$(GO) tool sqlc diff

# A migration on main has run in staging and production: a branch may add one, never change, rename or remove one
# (docs/guidelines/persistence.md). git lists the offending files and fails; nothing listed means it passed.
migration-check:
	git diff --exit-code --name-status --no-renames --diff-filter=a $(BASE)...HEAD -- "migrations/*.sql"
