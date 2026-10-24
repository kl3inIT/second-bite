# SEC-84 — A customer reports a problem with an order: verification

Run on 24 October 2026 on Windows 11, on the branch before review.

## Checks

| Part | Outcome |
| --- | --- |
| Backend | `golangci-lint` 0 issues; every order test passes, among them `TestOrder` › a problem is reported and answered, and › a problem is reported within two days; `sqlc diff` clean; the contract rewritten |
| Web | `pnpm check` passes: 1,582 message keys, 170 unit tests, types, lint, knip. Playwright passes 351, with 15 skipped: on a phone and a computer, the customer's sheet (D6) and the store's answer form (Q5p), each with axe |
| App | The API client regenerated from the contract (swagger_parser, build_runner); only the order client and models changed |

## Against the real service

The server was built from the branch and run on its own PostGIS and Mailpit. The web ran from its production build, the customer on a Pixel 7 and the store at 1440 × 900.

- **API:**
  - An order still to collect reads `canReportProblem: false`, and a report is refused with 409 `ORDER_PROBLEM_NOT_ALLOWED`: "Chỉ báo vấn đề được với đơn đã nhận hoặc đã hết hạn, trong vòng 2 ngày."
  - Once handed over, it reads `canReportProblem: true`.
  - A second report answers 409 `ORDER_PROBLEM_ALREADY_REPORTED`, and a second answer 409 `ORDER_PROBLEM_ALREADY_ANSWERED`.
  - The customer reads the kind, the note, the store's answer and both times.
- **Customer on a phone:**
  - "Báo vấn đề với đơn" opens the sheet. "Thiếu món" is chosen, with the note "Thiếu 1 bánh mì chà bông", and sent to the store.
  - The order shows "Vấn đề bạn đã báo", waiting for the store.
  - After the store answered, it shows "La Paris … trả lời · 12:10" with the answer.
- **Store on a computer:** the order's page shows "Khách báo: Thiếu món" with the note and the answer form. The answer is sent and shows as "Quán đã trả lời lúc 12:10".
- **Pushes:** the local server ran without Web Push keys, so it queued no push. The pushes, one to the store and one to the customer with neither the note nor the answer, are checked in `TestOrder` › a problem is reported and answered.
