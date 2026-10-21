# SEC-88 — The seller's page holds the dishes: design

Status: started on 21 October 2026. Tracked in Linear as SEC-88. On 21 October 2026, after Keeta, foodpanda, Zomato and Grab, the owner dropped the separate dish page. The new Figma (page "Mobile · Khách") draws:

- K4b (125:4904), the seller's page;
- K4 (335:40430), a dish link landing on it;
- K4a (335:40597), the dish's sheet;
- K5 (105:2914), the confirmation.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| 1 | A dish link opens `/sellers/{sellerId}?at={offerId}#dish-{offerId}`: the row is tinted on the server and the browser scrolls to its anchor | Figma K4; no script is needed, and the address can be shared |
| 2 | `/offers/{id}` stays as an address and redirects there | Links shared or indexed before still lead to the dish |
| 3 | The dish's sheet is local state over the seller's page, not a route; its stepper counts what to add, from one up to what the cart can still take | Figma K4a; the cart, not the address, holds what was chosen |
| 4 | The seller's search is a GET form on the page (`?q=`), matched on the dish's name without accents | Works before JavaScript, like the header's search |
| 5 | The confirmation's lines carry their − and +; − at one portion takes the line out at once, and its seller's basket goes with its last line | Figma K5 |
| 6 | The cart keeps several sellers, so K4c ("Bắt đầu giỏ mới?") is not built and K5 stays grouped by seller | The owner chose, on 21 October 2026, to keep SEC-76 decision 8 |
| 7 | Not built: the seller's heart, the review count and the seller's category | Nothing backs them |
| 8 | The seller's heading is one row, the logo beside the name; the discount sits on each dish's photograph; the confirmation pays only at the counter | The owner's review of the first build, 21 October 2026 |
| 9 | Wider screens widen the page and lay the dishes two and three abreast; the dish's sheet becomes a dialog | The owner asked for the web to work at every width |
| 10 | The test stub gives La Paris ten dishes over three kinds | A long list to review; the home's and the search's specs follow it |
