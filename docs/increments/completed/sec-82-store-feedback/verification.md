# SEC-82 — Feedback after a pick-up, and a place for the store: verification

Run on 24 October 2026 on Windows 11, on the branch before review, which sits on SEC-84's.

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; `TestFeedback` and the seller, migration and boundary tests pass; `sqlc diff` clean; the contract rewritten |
| Web | `pnpm check` passes: 1,596 message keys, 170 unit tests, types, lint, knip. Playwright passes on a phone and a computer, with axe: the store menu's box and the report's card |
| App | The API client regenerated from the contract |

## Against the real service

The server and the web's production build ran from the branch. The store was used at 1440 × 900 and on a Pixel 7, and the admin at 1440.

- **The store:**
  - Its menu shows "Góp ý cho Second Bite", which opens G1 as a dialog on a computer and as a sheet on a phone.
  - Two notes were sent, each closing with "Đã gửi góp ý. Cảm ơn quán!".
- **API:**
  - Blank feedback answers 400 `SELLER_FEEDBACK_INVALID`: "Viết góp ý từ 1 đến 1.000 ký tự."
  - The 21st in a day answers 409 `SELLER_FEEDBACK_LIMIT_REACHED`.
  - The admin's list gives both notes, the latest first, with the store's name. The store's owner reading it gets 403 `PLATFORM_ADMIN_REQUIRED`.
  - The table holds `id, seller_id, body, created_at` and no author.
- **The admin:** the report page shows "Góp ý của quán · 2 góp ý" under the stores' table, each note with its store and time.
