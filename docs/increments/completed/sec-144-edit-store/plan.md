# SEC-144 — The owner edits a store's name, phone number and photo: plan

Design: [design.md](design.md).

1. The page `/stores/{id}/edit`, its server part (owner only) and its form (name, phone, photo; the address and pin go back as they are).
2. "Sửa quán" in the store menu, a pencil button in the list of the person's stores, words in both languages.
3. A store opened whose photo failed goes to the page with a notice.
4. A Playwright check of the page and the list's button.
