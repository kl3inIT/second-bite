# Verification

What was run for SEC-158 and what it showed, on 6 November 2026. No raw log, secret or personal value is kept here; the phone numbers are made up.

## Checks

| Command | Outcome |
| --- | --- |
| `go test ./...` in `server/` | Every package passes, with `TestOrderLimits`, the cap in `TestOffer`, and `TestService` › one address holds a bounded number of open orders |
| `golangci-lint run ./...` (v2.15.0) | 0 issues |
| `go test ./cmd/secondbite -run TestOpenAPIDocumentIsCurrent` | `api/openapi.yaml` matches the server |
| `pnpm check` in `web/` | Tokens, messages, API client, Oxlint, Prettier, types, 190 unit tests and knip pass |
| `pnpm test:e2e` | 437 passed, 15 skipped as before, on a phone and a desktop |
| `flutter analyze`, `flutter test` in `mobile/` | No issue; 109 tests pass with the client generated again |

## On the real server and web

A throwaway stack (`docker compose -p sec158`, PostgreSQL on 55432, Mailpit on 18025), the server built from this branch on 18080 and the web built for production against it on 3100. A script set up a store and its dishes through the API, sent the orders below, and took screenshots of each screen the change touched; the page made of them was handed to the user.

| Case | Answer |
| --- | --- |
| A post without its own cap | `perOrderMax` 5, no `maxPerOrder` |
| A post with its own cap of 8 | `perOrderMax` 8, `maxPerOrder` 8 |
| Six units of a dish capped at five | 409 `ORDER_OVER_DISH_LIMIT`, in Vietnamese |
| Eight units of a dish capped at eight | 201 |
| A phone number's third open order at one store | 409 `ORDER_PHONE_HOLDS_ORDERS` |
| A phone number whose two orders the store refused as `suspected` | 403 `ORDER_PHONE_MISSED_ORDERS` at once |
| An address's third open order once an admin set `openPerAddress` to 2 | 429 `ORDER_ADDRESS_HOLDS_ORDERS`; another address 201 |
| The same large order read by its customer and by its store | The customer reads `large` false and no `phone`; the store reads `large` true and `phone {open, missed}` |

## After Đạt's review, 8 November 2026

The address cap, the large-order warning, the phone number's history beside an order and the refusal reason `suspected` were removed, and missed orders are counted 3 in 30 days ([design](design.md)). The cases above for them no longer hold.

| Command | Outcome |
| --- | --- |
| `go test -p 1 ./...` in `server/` | Every package passes, with `TestOrderLimits` (a dish's cap, two open orders per phone number at a store, four placed at once, three missed in thirty days, the settings) |
| `golangci-lint run ./...` (v2.15.0), `go tool sqlc diff`, `go mod tidy -diff` | 0 issues; generated code current; tidy |
| `go test ./cmd/secondbite -run TestOpenAPIDocumentIsCurrent -update` | `api/openapi.yaml` written again |
| `pnpm check` in `web/` | Tokens, messages, API client, Oxlint, Prettier, types, 190 unit tests and knip pass |
| `flutter analyze`, `flutter test` in `mobile/` | No issue; 109 tests pass with the client generated again |
| `pnpm test:e2e` | Left to CI: the run was stopped on the developer's machine for lack of memory |
