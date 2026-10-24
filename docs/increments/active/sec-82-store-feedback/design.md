# SEC-82 — Feedback after a pick-up, and a place for the store: design

Tracked in Linear as SEC-82. It is the sponsor's row F-03 ("Thu phản hồi") for the full flow of 31 October, and feeds check K-03: record what buyers and stores say, above all where they got stuck. Figma: G1 (the store's feedback box) and AD-BC4 (the stores' feedback on the admin's report), drawn for this increment.

## What is already there

- **The customer:** SEC-97 already asks one or two short questions after a pick-up. The rating gives one to five stars, the tags say what pleased, and the comment carries the rest. Admins read every review (SEC-145).
- **What went wrong with one order:** SEC-84 lets the customer report it, and the store answers.
- **The store:** has nowhere to tell the team what is hard. This increment adds that place.

## What a person can do

- **The store's people**, owner or staff, open "Góp ý cho Second Bite" from the store's menu.
  - They write what is hard or missing, in 1 to 1,000 characters, and send it.
  - A store sends at most 20 in a day, so a stuck button cannot flood the list.
- **Admins** read the stores' feedback on the report page (SEC-80), for the days and the store chosen there, the latest first, each with its store and when it came.

## Shape

- **Server, module `seller`:**
  - `seller_feedback` holds the store, the text and when it was sent.
  - It keeps no author: the store speaks, and an account's deletion has nothing to forget here.
  - `POST /sellers/{sellerId}/feedback` `{text}` → `204`, for its people.
  - `GET /admin/seller-feedback?since&until&sellerId` → the feedback in the range, at most 200, the latest first.
  - Failures: `SELLER_FEEDBACK_INVALID` and `SELLER_FEEDBACK_LIMIT_REACHED`, in the module's words.
- **Web:**
  - The store menu gains the item. It opens G1, a dialog on a computer and a sheet on a phone. Sent, it closes with a thank-you notice.
  - The report page reads the feedback with the report and shows the card "Góp ý của quán", under the table of stores.

## Not chosen

- **A survey after each pick-up:** the review already asks; a second set of questions would tire the people trying the pilot.
- **A page of its own in the admin's menu:** the team reads the numbers and what was said together, and the report already has the days and the store to filter by.

## Verification plan

- **Go:**
  - the rules: length, control characters, the daily bound;
  - who may send: the owner and staff, not a stranger or an admin outside the store;
  - the admin's list by days and store.
- **Web:** Playwright with axe for the store's box and the report's card.
- **Against the real service:** a store sends feedback from its menu; the admin reads it on the report page.
