# SEC-134 — Every store's posts for admins: design

Status: started on 22 October 2026. Tracked in Linear as SEC-134, under SEC-62. The screens are Figma AD-BD1 to AD-BD4 (section "Quản trị · Web 1440"), redrawn on 21 October 2026 with the project's components as the stores' screens are ([SEC-62 design](../sec-62-admin-stores/design.md)). The backend is the `offer` module ([spec](../../../specs/offer.md)).

## What an admin can do

- Open "Bài đăng" from the menu, under "Vận hành", and see every store's posts, newest first, 10 to a page by default.
- See how many posts are on sale, sold out, closed and withdrawn, and press a card to list only that status; pressing it again lists every status. The cards follow the other filters.
- Find posts by words of the dish, the store's name or the description, with or without marks; keep one store's; keep the posts of a range of days posted ("Ngày đăng"); choose 10, 25 or 50 rows; move between pages. Every choice is in the address.
- Open a post in a panel beside the list: the panel of a store's page (AD-QD3), with a link to the store's page at its foot.

## Decisions

- **One read, as the stores' list.** There was no list across sellers: `GET /offers` is the customers' search (on sale only) and `GET /sellers/{id}/offers` reads one seller. `GET /admin/offers` answers a page, its total and the count of each status, with the filters as query parameters, as `GET /admin/sellers` does. The status is read from the units left and the window in the query, as `SellerOffers` reads it.
- **Words are found as customers search**: the offer's own `search_vector` (dish, seller's name, description) with `searchQuery`, so the module keeps one way of reading Vietnamese.
- **The item nests the offer.** `AdminOfferBody` is `{offer, sellerName}`: huma leaves an unexported embedded body out of the document (SEC-62 met the same), and nesting lets the web hand `offer` to the same panel as a store's page.
- **An index on `created_at`.** The list runs across sellers, newest first, and by the day posted; the seller's index serves one seller only.
- **Only what the backend allows** (as [SEC-57](../sec-57-seller-web/design.md) and SEC-62 did):

  | In Figma | Why it is not on the web |
  | --- | --- |
  | "Gỡ bài vi phạm" with a reason (AD-BD2 to AD-BD4) | Withdrawing is for the seller's people (`Withdraw` checks membership); no admin API. Drawn only |
  | A "Gỡ do vi phạm" card and status | No such status: an offer is on sale, sold out, closed or withdrawn |

## Contract

| Call | Used for |
| --- | --- |
| `GET /admin/offers?status=&q=&sellerId=&postedSince=&postedUntil=&page=&size=` | The page, its total and the counts; `OFFER_ADMIN_LIST_INVALID` (400) for a bad filter |
| `GET /admin/sellers?sort=name&size=100` | The stores the "Cửa hàng" filter offers |
