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
| The operations are in the contract | `TestOpenAPIDocumentIsCurrent` (`cmd/secondbite/openapi_test.go`) |

Not covered by a test: two staff changing one offer at once (held by the row lock), and the flow through the API, which the composition test gains with search (step 4).
