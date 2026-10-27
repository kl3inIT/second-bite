# SEC-109 — Favourites: design

Status: started on 21 October 2026. Tracked in Linear as SEC-109. The owner asked for the "Yêu thích" tab after Figma section "10 · Yêu thích" (349:36160) on page "Mobile · Khách":

- K9 (349:35768): the sellers the customer follows, one card each, with their dishes on sale tonight;
- K9a (349:35958): the empty state, "Chưa có quán yêu thích", with "Khám phá quán".

## Domain story

A customer opens a seller's page and taps its heart. The seller is now one of their favourites, and a toast says "Đã thêm vào Yêu thích". Later the customer opens "Yêu thích" and sees each followed seller with tonight's dishes, or the line that it has none tonight. Tapping the filled heart unfollows it. A customer who never signed in keeps their favourites on their device. Once they sign in, the device's favourites join the ones their account keeps, and the account keeps them from then on, on every device.

Failure paths: a followed seller that is later blocked or closed drops out of the list. Following a seller that does not exist or is not active is refused as not found.

## Glossary

- **Favourite:** a seller a customer follows. One customer follows any number of sellers, and one seller is followed by any number of customers. Following twice is still one favourite.
- **Follow, unfollow:** the customer's commands. Both are idempotent.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | A customer follows a seller, not a dish. The heart on a dish card follows the dish's seller | Figma K9 lists sellers; a dish lasts one evening, while a seller is there every night |
| 2 | The seller module owns favourites: the table `seller_follows` (account, seller, when), with `PUT` and `DELETE /sellers/{sellerId}/follow` and `GET /sellers/followed`, all for a signed-in customer | A favourite is a fact about a seller and an account, and the seller module already owns the sellers and decides which are active. It needs no module of its own ([boundary discovery](../../../conventions.md#boundary-discovery): prefer fewer modules) |
| 3 | `GET /sellers/followed` answers the followed sellers that are still active, as their public profiles, newest favourite first | The tab shows the profile; a blocked seller must not show |
| 4 | Without signing in, favourites are kept on the device (the web's local storage). After signing in, the web follows on the server every seller kept on the device and then forgets the device's list | The owner's choice on 21 October 2026: ordering needs no login, but an account keeps favourites everywhere |
| 5 | The tab reads tonight's dishes from the offers already listed for the home, grouped by seller | No new offer query is needed |
| 6 | Not built: telling the customer when a followed seller posts. The Figma's "có món giảm sẽ báo bạn" copy is left out until that exists | Nothing sends it, so the page must not promise it |
| 7 | Deleting an account deletes its favourites | The account's data goes with it |
