# SEC-28 — Failure messages translated by the server: design

Tracked in Linear as SEC-28.

## What a person sees

- A failure reads in the language the person reads the site or the app in, Vietnamese or English, and says the same thing on the web and in the app: the words are written once, in the Go server, beside the failure they describe.
- A form still puts a failure at its field, offers a new code or gives way from Google to the emailed code: those are decided by the problem's `code`, never by its words.
- A request that got no answer at all (no network, a timeout, a proxy's page) keeps the client's own sentence, since no server spoke.

## Where things stand

- 43 failures in six modules (`internal/<module>/errors.go`, `platform/caller.go`) carry one English `detail`; the platform's own ten codes (unknown route, malformed body, internal failure…) carry `http.StatusText` or huma's message.
- Request validation answers huma's English sentences in each violation's `detail` (`expected length >= 1`). huma keeps them as package variables, the same for the whole process.
- The web translates 15 codes itself in five forms (`switch (code)`), and the app does the same for the sign-in and deletion codes (`SignInProblem`). The conventions and the web guideline say clients translate codes and never show `detail`.
- The app already sends `Accept-Language` (`mobile/lib/core/api.dart`); the web sends none, so on the server it gets whatever the browser sends and from Next.js nothing.

## Decisions

1. **The words live with the failure.** `platform.NewFailure(code, category, platform.Words{VI: "…", EN: "…"})`. A module's failures stay its own (`errors.go`), and a failure without both languages cannot exist: `NewFailure` panics when a language is empty, as it already does for a malformed code, so every test run of a package that declares one fails. One catalog per language was the alternative; it separates a code from its meaning and needs its own coverage test for something the type can hold.
2. **The language is read once per request,** in `withRequest`, beside the request id: `Accept-Language` matched against Vietnamese and English with `golang.org/x/text/language` (already a dependency), Vietnamese when neither is asked for. Problems answer in it, with `Content-Language` and `Vary: Accept-Language`.
3. **The platform's own failures get words too**: route not found, method not allowed, malformed request, body too large, unsupported media type, database unavailable, internal failure, request refused, and the top-level sentence of a validation failure.
4. **Violations are translated by recognising huma's sentence.** Each of huma's message templates (`validation.MsgExpectedMinLength` = `expected length >= %d`) has a Vietnamese template with the same values; the English is huma's own. A sentence no template matches answers a generic one ("Giá trị không hợp lệ."), so an upgrade of huma can only make a sentence plainer, never English in a Vietnamese answer. The table refers to huma's variables, so a renamed one stops the build.
5. **Clients show `detail`.** The web sends the page's locale as `Accept-Language` from the browser and from the server, so the language chosen on the site wins over the browser's. Both clients branch on `code` only to act differently (a field, a new code, the Google step), show `detail` otherwise, and keep a sentence of their own only for a request that got no answer. The per-code sentences in `web/messages/*.json` and the app's `.arb` files go.
6. **Out of scope:** emails and every other text the server sends; they are their own work.

## Verification plan

- **Go:**
  - every failure in both languages (by loading the packages);
  - `Accept-Language` matching (`vi`, `en-US`, `fr`, none, quality values);
  - a module failure, a platform failure, an unknown route and a panic in both languages with `Content-Language` and `Vary`;
  - violations translated and the generic fallback;
  - all of it through the platform's real handler, middleware and problem mapping (`httptest`), and the existing composition test unchanged in Vietnamese.
- **Web:**
  - the client sends the page's locale;
  - forms show the server's sentence at the same place as before (unit and browser tests against the stub backend, which answers in the asked language).
- **App:** widget tests that the sign-in and deletion screens show the problem's `detail`, and their own sentence without an answer.
