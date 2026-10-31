# How open-source food projects model pickups, stock and collection

Studied on 16 October 2026 for the [pilot domain model](../increments/completed/sec-6-pilot-domain-model/design.md) (SEC-8). Each repository was cloned shallowly into the git-ignored `.tmp/` and read, not run. Paths are relative to each repository.

| Repository | Revision | What it is |
| --- | --- | --- |
| [Open Food Network](https://github.com/openfoodfoundation/openfoodnetwork) | `6d906ac`, 2026-10-15 | Several local suppliers sell through order cycles with pickup points |
| [Karrot](https://codeberg.org/karrot) backend and frontend | `b7a4e54`, `fdf8593`, 2026-09-22 | Groups that rescue food from shops on a schedule of pickups |
| [foodsharing](https://gitlab.com/foodsharing-dev/foodsharing) | `c4ab5f1`, 2026-10-16 | Germany's food rescue network with store pickup slots |
| [Umi Feeds](https://github.com/GTBitsOfGood) backend and app | `07e29de` (2023), `aa8c7ed` (2024) | Donors post food, volunteers collect it |

## Technology and mobile

| Project | Backend | Web | Mobile |
| --- | --- | --- | --- |
| Open Food Network | Ruby on Rails on a vendored Spree core, PostgreSQL | Server-rendered Hotwire (Turbo, Stimulus, StimulusReflex), legacy AngularJS | None: a responsive web application, no PWA manifest |
| Karrot | Django and Django REST Framework, PostgreSQL, huey jobs, Channels over Redis | Vue 3 with Quasar | A PWA (`quasar build -m pwa`) and a Cordova Android app with Firebase push; no iOS build |
| foodsharing | PHP 8.3 on Symfony 7, MySQL, Phinx migrations | Vue 2.7 | A separate native Android app in Kotlin ([foodsharing-android](https://gitlab.com/foodsharing-dev/foodsharing-android), on Google Play, active July 2026); the iOS repository linked from the docs was not found |
| Umi Feeds | Node, Express, TypeScript, MongoDB | None (`expo start --web` only) | React Native on Expo SDK 44, built with EAS, Expo push |

None of them uses Flutter or Go. Each mobile route was chosen for its team: native Kotlin for one platform, Cordova around an existing Vue application, or Expo.

## Findings by question

### Collection windows

- Open Food Network keeps the ordering window as timestamps (`order_cycles.orders_open_at`, `orders_close_at`) but the pickup time as free text (`exchanges.pickup_time`), so nothing can be checked against it.
- Karrot stores an activity's time as a PostgreSQL timestamp range with a GiST index (`activities/models.py`, `Activity.date`), and an hourly job creates activities from a recurrence rule (`ActivitySeries.rule`).
- foodsharing keeps one-off slots (`fs_fetchdate`) and weekly regular slots (`fs_abholzeiten`).
- Umi Feeds keeps `pickupStartTime` and `pickupEndTime` on the donation.

### Holding stock and preventing overselling

- Open Food Network takes stock only when an order completes (`Order#finalize!` → `manifest_unstock`), locking the order and its variants in id order (`app/services/order_locker.rb`), with `count_on_hand >= 0` validated and stock returned on cancellation (`Shipment#after_cancel`).
- Karrot locks the activity row (`select_for_update`, `activities/api.py`) and counts participants against `max_participants`; the database only guarantees one participation per person.
- foodsharing counts sign-ups and then inserts, with no lock or transaction (`StoreTransactions::joinPickup`): two people joining at the same moment can overfill a slot.
- Umi Feeds overwrites whatever the app sends (`ongoingDonationsController.ts`), so two volunteers can claim one donation.

### Lifecycle, confirmation and no-shows

- Open Food Network: order states `cart → … → complete`, with `canceled`; every transition logged in `spree_state_changes`. Collection is confirmed by an administrator marking the shipment shipped; there is no code checked at the counter.
- Karrot: leaving deletes the participant row; a job every minute marks activities started, done or missed (`tasks.py`); no-shows are reported by other participants (`FeedbackNoShow`) and never acted on automatically.
- foodsharing: a sign-up stays unconfirmed until a store manager confirms it; every step is written to a store log (`StoreLogAction`); no-shows are reported by people (`ReportReason::NO_SHOW`); per-person limits per day and per period (`checkPickupRule`).
- Umi Feeds: the app sets the status (`Pending`, `Claimed`, `Overdue`, `Delivered`); the server enforces nothing.

### Collection by someone else

None of the four has it. It is designed from scratch.

### Seller approval and roles

- Open Food Network: self-service with email confirmation; owner and managers per enterprise; no manual approval.
- Karrot: group applications and trust between members; places carry a status label without a workflow.
- foodsharing: stores are not self-registered; their cooperation status runs from no contact to cooperation established, and store teams have applied, member and coordinator states.
- Umi Feeds: donors are not verified; volunteers enter one shared passcode.

### Sign-in and push

- Email and password in Open Food Network, Karrot and foodsharing (foodsharing adds passkeys); Auth0 in Umi Feeds. None signs in by phone number.
- Push: Karrot uses Web Push with VAPID and Firebase for Android; foodsharing posts to Firebase's legacy API, which Google has shut down; Umi Feeds uses Expo push.

## What Second Bite takes, and what it avoids

| Take | From |
| --- | --- |
| Collection window as two timestamps checked by the database | Karrot (range), Umi Feeds; not Open Food Network's free text |
| A status per reservation and a log of every transition, never a deleted row | Open Food Network `spree_state_changes`, foodsharing `StoreLogAction` |
| A job every minute that closes windows and marks what was not collected | Karrot `process_activities` |
| No-show recorded automatically when the window closes without the code, not by reports | Improves on Karrot, foodsharing and Umi Feeds |
| Per-customer limits per day | foodsharing `checkPickupRule` |
| Sellers verified by an operator through statuses | foodsharing's cooperation status; not Open Food Network's self-service |
| Stock taken when the reservation is made, by one conditional update with a database check, returned on cancellation | Open Food Network's check and restock, without its lock-then-count |

| Avoid | Seen in |
| --- | --- |
| Count-then-insert without a lock | foodsharing |
| The client setting a status; the server not checking the caller | Umi Feeds |
| The same data stored twice | Umi Feeds, Open Food Network's stock overrides |
| Free-text pickup time | Open Food Network |
| Firebase's legacy API | foodsharing |
| A shared sign-up passcode | Umi Feeds |

The collection code and collection by someone else have no precedent in these projects; Too Good To Go's store flows on Mobbin are the reference still to read.
