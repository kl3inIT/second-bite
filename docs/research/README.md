# Research

What the team studied before designing Second Bite, kept so that a later reader can see what a decision was based on. Each note is dated and names its sources. A note records what was found; the decisions that follow from it live in the [vision](../vision.md), the guidelines and the increments.

| Note | Covers |
| --- | --- |
| [Similar products](2026-10-16-similar-products.md) | Commercial food-surplus apps in Europe and Southeast Asia, the absence of a paid one in Vietnam, and the open-source projects nearest to the domain |
| [Backend stack](2026-10-16-backend-stack.md) | Spring Boot or Go, how Go projects draw module boundaries, templates, the libraries chosen with their versions, and the Go agent skills |
| [Open-source pickup models](2026-10-16-open-source-pickup-models.md) | How Open Food Network, Karrot, foodsharing and Umi Feeds model collection windows, stock holds, confirmation, no-shows, seller approval, sign-in and mobile, and what Second Bite takes from them |
| [Sharing Excess impact](2026-10-17-sharing-excess-impact.md) | How a food-rescue non-profit derives meals, value and emissions from weight and category, counting only food that reached people; its code is no longer public |
| [Offer models](2026-10-17-offer-models.md) | How foodsharing, Karrot, Umi Feeds, Open Food Network and Too Good To Go model what is offered: content, stock, windows, changes, search and following |
| [Desktop home](2026-10-19-desktop-home.md) | How ShopeeFood, GrabFood, beFood, Bách Hóa Xanh and Tiki lay out their home at 1440 px (container width, header, grids, deals, categories, footer); that surplus-food peers have no web home; NN/g and Baymard on carousels, sticky headers and taglines |
| [Customer flows](2026-10-19-customer-flows.md) | How Keeta, foodpanda (pick-up) and Zomato carry a customer from the home through search, the store, checkout, the collection code, chat, cancellation, help and past orders, read on Mobbin; which parts fit a pickup-first surplus marketplace and which are left out |
| [Sign-in and code](2026-10-19-sign-in-and-code.md) | How Vietnamese apps and passwordless peers sign people in, and what GOV.UK One Login, WCAG 2.2, web.dev, OWASP, Apple and Google say about an emailed code: one field or boxes, paste, auto-submit, resend, spam, the order of buttons |
| [Admin foundation](2026-10-21-admin-foundation.md) | How BeyondPilot, Medusa, Saleor, Spree, Open Food Network, Mattermost, Gitea and Zitadel build their admin: one role or permissions, where the check lives and how a forgotten one is caught, the admin API and its lists, five ways to write an audit trail in Go, granting and revoking admins, opening a store for its owner, approval states, the admin inside the main web, and the libraries |
| [Order notifications](2026-10-22-order-notifications.md) | Telling customers and sellers about an order when its page is closed: Web Push on iPhone (Home Screen only, iOS 26, Declarative Web Push), Android and desktop, when to ask, webpush-go, Zalo ZNS and SMS brandname in Vietnam, and which events Too Good To Go, Phenix, Grab and Karrot send |
| [Realtime transport](2026-10-21-realtime-transport.md) | WebSocket or server-sent events for the live socket: what Second Bite pushes, how Mattermost, Karrot, foodsharing, Gitea, immich, PocketBase, memos, Medusa and listmonk push theirs, when each fits, the Go libraries with their latest releases, the origin check, and the web and mobile clients |
| [Orders for admins](2026-10-21-admin-orders.md) | The admin's orders list and detail against Figma AD-DH1 to AD-DH5: how Open Food Network, Saleor and Medusa list orders and let staff cancel them, how Karrot and foodsharing record no-shows, and what Second Bite takes |

## Sources, kept as received

| File | Holds |
| --- | --- |
| [sources/2026-10-16-kickoff-meeting-transcript.md](sources/2026-10-16-kickoff-meeting-transcript.md) | The automatic transcript of the kickoff with the founder and the sponsor's side, in Vietnamese and English, with phone numbers and personal small talk removed |

## Rules for this folder

- **Credentials and personal contact details are never recorded**: no account name with its password, no token, no key, no phone number. A source that contains one is stored with that part removed and the removal marked.
- The repository is public: small talk about participants' ages, schools and families is removed from a transcript, and names and messages of people outside the team are removed from captures of private conversations.
- A source is kept as received, in its own language, apart from that. Notes are written in English.
- Screenshots of third-party products studied as references are not committed; a note links to the page instead.
- A note is not edited to match later decisions. When a finding is superseded, the newer note says so.
