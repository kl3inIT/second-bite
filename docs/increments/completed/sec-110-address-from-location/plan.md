# SEC-110 — The open-store form fills the address from where the person stands: plan

Design: [design.md](design.md).

1. `seller/locate.go`: the geocoder, the address written in Vietnamese order, `Service.AddressAt`; unit checks with a test server.
2. `GET /sellers/address`; OpenAPI and the web client regenerated.
3. The form asks it after the browser's coordinates, fills the field by rule 5 and says which in the note; words in both languages.
4. The stub backend answers it; Playwright checks of the filled, kept and unknown cases.
5. Spec: `docs/specs/seller.md`.
