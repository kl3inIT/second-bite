# offer: verification matrix

Requirements of [docs/specs/offer.md](../specs/offer.md) and the checks that hold them. Paths are under `server/`. `TestOffer` (`internal/offer/offer_test.go`) runs its checks in parallel against one migrated PostGIS, then the check that changes the settings alone. Orders are simulated by taking units in the table, as `order` will through the module.

| Requirement | Check |
| --- | --- |
| A post is on sale with its units left, the default unit, its discount and the seller's collection point; each field's rule, the 20% discount and the window's bounds refuse a post; a mixed box needs what it holds | `TestOffer` › a post follows the rules of its fields |
| Only the owner or staff of an active seller post; a pending or blocked seller, a stranger, an admin and nobody signed in are refused; a stranger does not list the seller's offers | `TestOffer` › only an active seller's people post |
| A photo someone else uploaded is refused; staff post again with an earlier offer's photo; another seller cannot take it; the list is newest first | `TestOffer` › a photo is the poster's or the seller's |
| Everything changes before an order; once units are ordered the price does not, the units not below those ordered, the description and units do; a stranger gets 404; a withdrawn offer does not change | `TestOffer` › orders limit what changes |
| Sold out stays visible; closed is seen only by its seller's people and cannot be withdrawn; withdrawing twice is the same; a withdrawn offer leaves every customer's read; the seller lists by status | `TestOffer` › status follows units, window and withdrawal |
| Admins alone read and save the settings; a stricter minimum discount refuses a post; contradicting settings are refused | `TestOffer` › the settings bound every post |
| Each syllable's loose and exact forms; one word wherever its tone sits, decomposed or not; zero-width characters dropped; a lone "y" read as "i"; the query follows what was typed (marks, prefix, at most ten words) | `TestTermsReadVietnameseSpelling`, `TestOneWordWhereverItsToneSits`, `TestWordsDropFormatCharacters`, `TestSearchVectorKeepsBothFormsAtOnePosition`, `TestSearchQueryFollowsWhatWasTyped` (`internal/offer/search_text_test.go`) |
| "banh mi", "bánh mì" and "banh m" find "bánh mì" and "bánh mỳ" before "mì xào, bánh bao"; "cá" finds no "cà phê", "ca" finds both; the description and the seller's name are searched | `TestOffer` › search reads Vietnamese as it is typed |
| The default radius and a wider and narrower one, nearest first; sold out left out on request; kinds, price, discount, one seller, a window not yet begun; the seller's name and the distance in a result; the refusals | `TestOffer` › search keeps what is near and filtered |
| A blocked seller's offer leaves search and anyone's read, its owner still reads it | `TestOffer` › a blocked seller's offers leave search |
| Through the API: a pending seller cannot post; once active, an offer is posted, found by anyone near Tasco Mall by words without marks with its seller and distance; the seller's page; sorting by distance from no point refused | `TestService` › an offer is posted and found near Tasco Mall (`cmd/secondbite/offer_test.go`) |
| The summary counts the offers posted in the range and their units, per day in Vietnam time (00:30 on the 1st is the 1st, midnight after the last day is out), the sellers that posted most and the five newest; on sale and sold out now, a blocked seller's left out, what was posted still counted; admins alone read it | `TestSummary` (`internal/offer/summary_test.go`), on a database of its own |
| Through the API: admins alone read the summary; without a range it covers the 30 days to today, every day in the series; a reversed range, one over 90 days and a malformed date are refused naming `query.from` | `TestService` › admins read the dashboard's summary over a range of days (`cmd/secondbite/summary_test.go`) |
| The operations are in the contract | `TestOpenAPIDocumentIsCurrent` (`cmd/secondbite/openapi_test.go`) |

Not covered by a test: two staff changing one offer at once (held by the row lock), and the cap of the radius at the settings' maximum.
