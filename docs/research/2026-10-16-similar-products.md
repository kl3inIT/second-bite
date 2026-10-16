# Similar products

Studied on 16 October 2026, before the pilot's domain model, to see how others sell or share food surplus and what Second Bite can take from them. Star counts and activity were read on GitHub that day; claims about commercial apps come from the press and aggregator pages linked, not from using the apps.

## Commercial apps

| Product | Market | What it does | What it teaches |
| --- | --- | --- | --- |
| Too Good To Go | Europe, North America; Japan in 2026 ([press release](https://www.toogoodtogo.com/fr/press/too-good-to-go-accelere-son-developpement-international-et-s-etend-dans-un-21e-pays-en-2026-le-japon)) | Sellers offer a "surprise bag" of unsold food at a fixed collection window; customers pay in the app and collect | The reference model: a bag rather than itemized stock lowers the seller's effort; a collection window replaces delivery |
| Value Food | Malaysia ([Malay Mail, July 2026](https://www.malaymail.com/news/life/2026/07/09/as-malaysians-discard-13800-tonnes-of-food-daily-local-app-value-food-turns-surplus-meals-into-savings/226990)) | Surprise bags of surplus at 50–70% below retail; reported 100,000 downloads and 300 business partners | The nearest regional market to Vietnam; the discount range sellers there accept |
| Treatsure | Singapore ([vnbusiness](https://vnbusiness.vn/ung-dung-bien-thuc-an-thua-cua-nha-hang-thanh-bua-an-gia-re.html)) | Surplus from buffets and hotels as discounted meals; reported 30,000 users since 2017 | Buffets and hotels as a seller segment with predictable surplus |
| Yindii | Southeast Asia ([CB Insights](https://www.cbinsights.com/company/too-good-to-go/alternatives-competitors)) | Listed as a competitor of Too Good To Go; its markets were not confirmed | — |
| Karma, Phenix, Flashfood | Sweden, France, Canada | Surplus from restaurants and, for Flashfood, supermarkets | Supermarkets and ingredients as a segment, close to the brief's ingredient offers |
| OLIO; Sanse | United Kingdom; Vietnam ([Sanse](https://itsallwidgets.com/sanse)) | Free sharing of surplus between people and from businesses | Free sharing as a model, close to the sponsor's choice of no fee during the pilot; Sanse's current activity is unknown |

South Korea's environment ministry launched a platform for end-of-day discounts on unsold food ([Herald Corp](https://biz.heraldcorp.com/article/10780763)), a sign that public bodies treat this as waste policy.

No Vietnamese app that sells food surplus for money was found. In Vietnam the practical competitors are Zalo and Facebook groups where people pass on food, and sellers' own end-of-day discounts, such as the 50% after 20:30 at a Tasco Mall outlet mentioned at the kickoff ([transcript, 18:15](sources/2026-10-16-kickoff-meeting-transcript.md)).

## Open-source projects

None of the commercial apps publishes its code. The open projects nearest to the domain:

| Project | What it does | Technology | Use for Second Bite |
| --- | --- | --- | --- |
| [Open Food Network](https://github.com/openfoodfoundation/openfoodnetwork) (1.3k stars, active) | A marketplace where several local food suppliers sell through order cycles with collection points | Ruby on Rails, PostgreSQL | The nearest domain model: several sellers, cycles, collection; read its model, do not reuse its code |
| Karrot (moved to Codeberg; [old GitHub](https://github.com/karrot-dev/karrot-backend), archived) | Groups that rescue food from shops on a pickup schedule | Django, Vue | Pickup scheduling and who collects |
| foodsharing ([GitLab](https://gitlab.com/foodsharing-dev/foodsharing)) | Germany's food rescue network with store pickups | PHP (Symfony), Vue | Store cooperation and pickup slots |
| [openfoodfacts/smooth-app](https://github.com/openfoodfacts/smooth-app) (1.4k stars, active) | A production Flutter app for food product data | Flutter | How a large Flutter app is organized |
| Clones of Too Good To Go on GitHub | Student projects | Various | Not usable (1–7 stars) |

General commerce engines ([Medusa](https://github.com/medusajs/medusa), [Saleor](https://github.com/saleor/saleor)) are built around shipping a catalog and do not fit stock that exists for an evening and is collected in a window. [PocketBase](https://github.com/pocketbase/pocketbase) (Go, one binary with authentication, files and an admin screen) would give a two-day prototype, but its SQLite store has no PostGIS and no row locking for reservations.

## Findings

- The collection window and the bag are the two mechanisms every successful product shares; Second Bite's brief already has the first and plans the second ("grouped boxes").
- Discounts of 50–70% are what the regional market shows; the kickoff discussed 50% as a starting point and a platform-set minimum.
- No reusable open-source system fits; the domain models of Open Food Network, Karrot and foodsharing are worth reading before the reservation design.
