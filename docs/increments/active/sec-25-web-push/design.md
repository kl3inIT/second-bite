# SEC-25 — Web Push for orders, to customers and to sellers: design

Status: decided on 22 October 2026, not built ([plan](plan.md)). Tracked in Linear as SEC-25. The research is [Telling customers and sellers about an order](../../../research/2026-10-22-order-notifications.md).

## Why

- The order page and the seller's Đơn tab follow an order live ([SEC-117](../../completed/sec-117-order-chat-live/design.md)), but only while they are open.
- A customer who closed the page does not learn that their dish is ready, that the store cancelled, or that the collection hours moved. SEC-91, SEC-96 and SEC-108 each left "the customer is not told" for want of a channel.
- A seller learns of a new order only while the Đơn tab is open.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | **Channel:** Web Push for the pilot, sent by the `notification` module itself with `webpush-go` and VAPID keys, as SEC-25 decided on 18 October 2026. The order page keeps working without it. | No push service in between. Zalo and SMS need a legal entity that does not exist yet. |
| 2 | **Customer events:**<br>• the store refused the order or withdrew the post (one message, with the reason);<br>• the order is ready;<br>• the collection hours moved (with the new hours);<br>• a reminder 30 minutes before the window opens;<br>• the store wrote in the order's chat. | These are what comparable products send (research). Confirmation, hand-over, expiry and review requests stay on the page. |
| 3 | **Seller events,** to the store's people:<br>• a new order;<br>• the customer cancelled;<br>• the customer wrote in the chat. | The store is the one who must act. The team installs the web app on the store's phones at onboarding, so iPhones get push too. |
| 4 | **A subscription follows topics, as a live connection does.** `order:{id}` for a customer and `seller:{id}` for the store's people, each proven with SEC-117's live ticket when the browser subscribes. A guest's subscription follows the orders its browser keeps. | Who may hear about an order is already decided once, in `order`. `notification` stores endpoints and topics and knows nothing of orders. |
| 5 | **A seller topic expires seven days after it was last proven.** The Đơn tab proves it again whenever it opens. | A person removed from a store stops hearing its orders within a week, without `notification` reading staff lists. |
| 6 | **`order` writes each push in the transaction of its change** through `notification.QueuePush`, which publishes `notification.push_queued` on the River outbox; `notification`'s own listener sends it. The reminder comes from a periodic job that marks each order once. Changed on 22 October 2026 while building: the words are written where the facts are, so `order` depends on `notification` as `identity` and `seller` do, and `notification` reads no order event. | `pg_notify` reaches only open sockets and is lost otherwise. A push must survive a restart and roll back with its change. |
| 7 | **The event carries the words' facts:** the dish, the store, the hours, the reason code and the topic. It never carries the customer's name, phone, collection code, amounts or chat text. | This is SEC-25's rule that payloads hold only a short line. The page loads the rest. |
| 8 | **The payload is Declarative Web Push JSON** (`"web_push": 8030`, title, body, `navigate` to the order's page). Our service worker shows the same JSON on other browsers. `Topic` is the order, `Urgency` high, TTL 30 minutes. | One payload for every browser. Safari does not revoke it. A newer notice about an order replaces an older one still pending. |
| 9 | **The words are in the subscription's language,** taken from `Accept-Language` when it subscribes. | As the server words failures (SEC-28). |
| 10 | **Permission is asked only from a button.** Chosen with the user on 22 October 2026 over asking inside "Đặt món": the browser's prompt during checkout is refused by reflex, and a refusal cannot be asked again. Once allowed, each later order's page follows it without asking. For a customer, "Báo tôi khi món sẵn sàng" on the order page after ordering. For a store, "Bật thông báo đơn mới" on the Đơn tab. Our sentence comes first, then the browser's prompt. On an iPhone outside a Home Screen app, the button becomes the steps to add it. A denial shows how to undo it. | web.dev and NN/g; the browser refuses a prompt without a tap. |
| 11 | **A 404 or 410 deletes the subscription.** A 429 or 5xx is retried by River with its backoff. | `webpush-go` reports these as responses, not errors. |
| 12 | **Checkout asks once, unticked: "Nhận thông báo đơn qua Zalo khi có".** The answer is stored on the order. Changed on 22 October 2026, with the user: the API keeps `byZalo`, but checkout does not ask until Zalo has a date. | Zalo may ask for proof of consent. A box that promises a channel nobody can turn on yet only lengthens checkout. |

## Trade-offs

- About 40 % of customers (iPhone, Safari tab) get no push unless they add the site to the Home Screen. The live page and the store's phone call cover them until Zalo exists.
- Topics proven with tickets add one request when subscribing, but keep `notification` free of order and staff rules.

## Out of scope

- Zalo and SMS sending.
- Push in the Flutter app (APNs and FCM).
- Followers of a store and announcements (SEC-11 step 6).
- A settings page for which notices a person gets.
- Email for these events.
