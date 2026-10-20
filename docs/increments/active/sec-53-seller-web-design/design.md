# SEC-53 — The seller's web screens in Figma: design

Status: designed on 20 October 2026, in Figma only; no code has changed. Tracked in Linear as SEC-53; related to SEC-46 (the seller screens on the web), SEC-11 (the `offer` module) and SEC-52 (the legal, error and account screens, which follow this group's header).

The screens are web desktop at 1440, in the section `Chủ quán · Web 1440` of the page `Mobile · Khách` of the Figma file `Secondbite`. They are drawn in the project's own style (the Tasco blue palette, Be Vietnam Pro, the `SecondBite` variables), with the arrows of one shared component, `Flow/Mũi tên`. The layout of the screens, not their rules, is what Figma holds; the rules are listed here so the team can read them, and move to their own increments when they are built.

## What is designed

### Signing in and opening a store

- Sign-in with Google or an emailed code, the code typed into six boxes; the home of a signed-in person with no store; the form that opens a store. Anyone may open a store and there is no approval in the first stage.

### The store's tabs

- **Trang chủ, Bài đăng, Danh mục, Đơn.** The order tab is an empty frame.

### Posting

- Choose the kind of post, then a dish from the catalog or a one-off dish.
- **Selling today:** the start by chips (the usual time, now, half hours) and the length by chips; a custom time chosen by hour and minute chips, never typed. The price is checked against the minimum discount, and the start against the clock; both have an error state.
- **Announcing expected surplus:** the date is required, the price is filled in, the units and the hours are optional; they become required when the seller confirms on the day.
- Post straight from a catalog row, and post again from the closed tab.

### Managing posts

- The tabs **Đang bán, Dự kiến, Đã hết, Đã đóng**, each row with the actions that fit it: edit, confirm, sell out now, post again.
- The morning prompt "Hôm nay có dư không?" on the home and on the post tab: one row per announcement of the day, with its photo, "confirm" and "not today".
- Confirming an announcement, and "not today" (nothing is sent to followers).
- Editing a post: everything while no order exists; only the price is locked once orders exist (the units may not go below the units ordered); withdrawing is refused once orders exist. Editing and cancelling an announcement.
- Result states: a toast after posting, confirming, saving and selling out.

### The catalog

- List, add, edit (shown or hidden), delete with a confirmation, and "post now" from a row. The catalog holds the stable base of a dish only; price, hours, units and status belong to the post.

## Rules the screens assume

They are written down in Linear, not yet in a spec: SEC-54 for expected surplus and editing live posts, SEC-55 for the catalog. They differ from `docs/specs/offer.md` and from SEC-11's design in two places: an announcement keeps only a date and a price at first (the units and the hours come when it is confirmed), and the hours of a post with orders may change.

## Not designed

- The order tab and cancelling an order with a reason (SEC-15, SEC-51).
- The calendar for "choose another date" and the custom-time state of an announcement.
- Weekly repeat, staff invitations, the store's settings, and the seller's screens on a phone.
- Four screens were lost from the file and are to be redrawn: the calendar popover, the custom-time picker, the sign-in failure and the account menu.
