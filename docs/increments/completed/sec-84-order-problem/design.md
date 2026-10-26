# SEC-84 — A customer reports a problem with an order: design

Tracked in Linear as SEC-84; Figma Mobile v3 section 16, screen D6 "Báo vấn đề với đơn", with the states drawn for this increment: D6b (reported, waiting), D6c (answered), Q5p (the store's order page on the web) and O3p (the same on a phone). Part of the sponsor's feedback for 31 October (F-03, K-03).

## What a person can do

- **The customer**, signed in or holding the order's access, opens "Báo vấn đề với đơn" from a collected order, or from an expired one, since "the store was closed when I came" ends as expired.
  - They pick what went wrong: missing item, wrong item, poor quality, store closed.
  - They may add a note of up to 500 characters, and send it.
  - An order takes one report, within two days of its collection, or of its window's end for an expired one.
- **The store's people** see the report on the order's page, are told by Web Push, and answer once, in up to 500 characters.
- **The customer** reads the answer on the order's page and is told by Web Push.
- **Admins** read the report and the answer with the order, as they read its review.

## Shape

- **Server, module `order`:**
  - `order_problems` holds one row per order: kind, note, reported at, answer, answered at.
  - `POST /orders/{orderId}/problem` `{kind, note?}`, header `Order-Access` without an account.
  - `POST /orders/{orderId}/problem/answer` `{answer}`, for the seller's people.
  - The order reads `problem` and `canReportProblem`.
  - The rules live in the module, so a refused report reads in its words (SEC-28): `ORDER_PROBLEM_INVALID`, `ORDER_PROBLEM_NOT_ALLOWED`, `ORDER_PROBLEM_ALREADY_REPORTED`, `ORDER_PROBLEM_NOT_FOUND`, `ORDER_PROBLEM_ALREADY_ANSWERED`, `ORDER_ANSWER_INVALID`.
- **Pushes:** they follow SEC-25's rule and never carry the note or the answer.
  - On a report, the store hears what kind it is.
  - On an answer, the customer hears that the store answered.
  - Both are written in the transaction of the change, and the live pages refresh through the order's notice.
- **Web:**
  - On a phone the customer's form is a sheet (D6); on a computer it is a dialog. Once reported, the order's page shows the report card (D6b, D6c).
  - The store's order page shows the report with an answer form, then the answer (Q5p, O3p).

## Not chosen

- **The order's chat:** it closes two hours after collection (SEC-117), and a report must stay readable as a record of its own.
- **An admin queue of reports:** SEC-13 handles reports, refunds and admin decisions after the pilot. For now an admin reads a report with its order.

## Verification plan

- **Go:**
  - the rules: kinds, note length, statuses, the two days, once each;
  - who may report and answer;
  - one push for each change;
  - the order read by its customer, its store and admins.
- **Web:** Playwright with axe for the customer's sheet and report card, and for the store's answer form.
- **Against the real service:** a collected order reported from the customer's page, answered from the store's page, the answer read by the customer; screenshots on a phone and a computer.
