# Telling customers and sellers about an order when its page is closed

Studied on 22 October 2026 for SEC-25. The questions were which channel reaches a customer who ordered on the web without signing in, which order events deserve a message, and what Web Push needs on each platform. Each fact says whether it was verified at its source.

## Web Push by platform

- **iPhone and iPad still allow push only in a web app added to the Home Screen.** The permission request must follow a tap. Verified: [WebKit, Web Push for Web Apps on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/).
- **iOS 26 opens every site added to the Home Screen as a web app, and drops the manifest requirement.** The same release note says nothing about push from a Safari tab. Verified: [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/). No later 26.x note was found that allows push in a tab (unverified absence).
- **Declarative Web Push (iOS 18.4, macOS 15.5) uses a JSON payload with `"web_push": 8030`, a title and a `navigate` URL, and needs no service worker.** A subscription is not revoked because a push showed nothing, since a declarative message always shows. Verified: [Meet Declarative Web Push](https://webkit.org/blog/16535/meet-declarative-web-push/).
- **Vietnam's phones in September 2026: Android 59.79 %, iOS 40.19 %.** About two in five customers who order from Safari therefore get no push. Verified: [StatCounter](https://gs.statcounter.com/os-market-share/mobile/viet-nam).
- **When to ask for permission:**
  - Never ask on load.
  - Chrome reports a prompt is allowed 12 % of the time without a user signal and 30 % after an interaction.
  - Explain first in our own words, then call `Notification.requestPermission()`.
  - Offer another way to stay informed, and show how to undo a denial.

  Verified: [web.dev, permissions best practices](https://web.dev/articles/permissions-best-practices), [NN/g, permission requests](https://www.nngroup.com/articles/permission-requests/).
- **Chrome can revoke permission from sites that send a lot and get little engagement.** Installed web apps are exempt. Verified: [Google, automatic permission revocation](https://blog.google/chromium/automatic-notification-permission/).
- **Next.js documents the pieces:**
  - `app/manifest.ts`;
  - a static `public/sw.js`, served with `Cache-Control: no-cache` and its own CSP;
  - VAPID keys;
  - `userVisibleOnly: true`;
  - HTTPS in development (`next dev --experimental-https`).

  Verified: [Next.js, Progressive Web Apps](https://nextjs.org/docs/app/guides/progressive-web-apps), updated 30 July 2026.
- **`github.com/SherClockHolmes/webpush-go` v1.4.0 has slow but live maintenance** (last commit 22 April 2026). No maintained Go library replaces it.
  - It returns the raw response, so a 404 or 410 (subscription gone) is not an error, and the caller must delete the subscription.
  - The payload is padded to a 4096-byte record.
  - It accepts `TTL`, `Urgency` and `Topic`.

  Verified in its source. [RFC 8030](https://www.rfc-editor.org/rfc/rfc8030) fixes the rest:
  - 404 means the subscription expired;
  - a message with the same `Topic` replaces the pending one;
  - with TTL 0, a message never reaches a device that is offline.
- **`pushsubscriptionchange` is missing on iOS Safari.** A subscription lost to cleared data or a removed Home Screen app is learned only from the next send's 404 or 410. Verified: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event).

## Channels by phone number

- **Zalo's notification service was renamed "ZBS Template Message" on 1 January 2026.** Sending by phone number keeps the old ZNS prices. Verified: [Zalo, ZBS Template Message announcement](https://zalo.solutions/news/thong-bao-ra-mat-zbs-template-message-giai-phap-tin-nhan-doanh-nghiep-theo-mau/cp1zx4bq8mzhhszgz0br1ocd).
- **Zalo's rules (policy of 9 July 2026):**
  - The sender needs an Official Account verified with a business or household-business registration; individuals are not provided for.
  - Every template is approved first, in 2 to 3 working days.
  - A message must follow a real transaction within 7 days.
  - Only messages that arrive are billed.
  - Zalo may ask for proof of consent.

  Verified: [Zalo terms](https://zalo.solutions/terms), [OA verification](https://oa.zalo.me/home/documents/guides/xac-thuc-cach-1).
- **Price per message: 200 to 300 VND.** The pricing page and the terms disagree, so plan on 300 VND. Verified: [pricing](https://zalo.solutions/zns/pricing), [terms](https://zalo.solutions/terms).
- **SMS brandname also needs a business licence.** Registration takes about five weeks. Verified: [Telerivet](https://www.telerivet.com/blog/vietnam-sms-compliance-mic-zalo).
- **Decree 91/2020 covers advertising by SMS.** A draft that would replace it, dated September 2026, brings in messaging apps and business-service messages. Verified for the draft's text: [Ministry of Public Security](https://bocongan.gov.vn/media/bca-media/library-20260909084715-c3d4dec4-0f78-459d-96de-3293d10b69b5-4-ban-so-sanh-du-thao.docx). It is not issued yet (unverified absence).
- **What follows:** neither channel can be used until Second Bite has a legal entity (tracking sheet, question 3).

## Which events comparable products send

| Product | Store cancelled | Reminder before the window | Window changed | Ready | Chat |
| --- | --- | --- | --- | --- | --- |
| Too Good To Go | Yes, by email, SMS or the app | No sign of one | Unknown | n/a | n/a |
| Phenix | Yes, by email | Unknown | Unknown | n/a | n/a |
| Grab self pick-up | Unknown | n/a | n/a | Yes, "almost ready" | Unknown |
| Karrot (code) | Push when removed | Push 3 h before | In-app only | n/a | Push |

Sources:

- [Too Good To Go terms §3.6.2 and §7.4](https://static.toogoodtogo.com/general-terms-conditions/en-us/index.html);
- [Phenix help](https://intercom.help/phenix/fr/articles/6457726-pourquoi-ma-commande-a-t-elle-ete-annulee);
- [Grab Malaysia](https://www.grab.com/my/food-blog/introducing-self-pick-up/);
- Karrot `karrot-backend` at `b7a4e54`: `karrot/activities/settings.py`, `karrot/activities/tasks.py`, `karrot/notifications/receivers.py`, `karrot/subscriptions/web_push.py`.

None of them pushes a confirmation, a review request or a hand-over. NN/g warns that bursts of notifications lead people to switch them all off (summary of [nngroup.com/articles/push-notification](https://www.nngroup.com/articles/push-notification/)).
