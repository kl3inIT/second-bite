# Customer place: every shop by default, a typed place, remembered

Status: started on 31 October 2026, decided with the team the same day. Stores open outside Tasco Mall from November ([meeting of 30 October](../../../brief/meetings/2026-10-30-trials-meeting.md)), while the home called its default "Tasco Mall" and listed every shop's offers under it. The research is [customer location and the stores' map](../../../research/2026-10-31-customer-location-and-map.md).

## Decision

Until a customer chooses a place, the home shows **every shop**, the windows closing first, as it already does; nothing asks for the device's location when the page opens (web.dev, Apple; foodsharing, Karrot and Open Food Network do not either). The area sheet offers three ways to choose a place:

1. **Dùng vị trí của tôi**, which asks the browser only then, as today.
2. **A typed place**: an address or the name of an area, answered with up to five places in Hanoi, for people who block location or want to look around where they work (web.dev; Too Good To Go, foodsharing, Karrot, Open Food Network).
3. **Tasco Mall**, kept as a suggested place.

A chosen place lists the offers within the search radius around it, nearest first, under "Quanh <place>". The browser remembers it, so the next visit opens on it; "Tất cả quán" forgets it.

Left out: guessing the place from the request's address (Karrot), since Vietnamese mobile networks share addresses through the carrier; asking when the page opens (ShopeeFood, which needs an address to deliver); a radius the customer sets; a map of stores, decided apart once stores are spread over several areas.

## Steps

1. **Every shop by default** (the web only). The words follow what the home does: "Tất cả quán · Hà Nội" for the heading, "Món ngon tối nay" for the deals, "Tất cả quán" in the area sheet, "Đang bán ở các quán khác" when nothing is around the chosen place, "Tất cả món" over the list unless a place is chosen. The order page no longer says "Tasco Mall Long Biên" under every store's address, and the site's description and taglines say "các quán quanh bạn".
2. **A typed place.** `GET /places?q=` for anyone: the places search that opening a store uses (`GET /sellers/places`, Photon over OpenStreetMap, cached for an hour), bounded per client address as the other public endpoints are (SEC-160). The area sheet gets the field; a place chosen becomes `?near=<point>&place=<name>`.
3. **Remembered.** The chosen point and name in a cookie the server reads, so the home renders on the place without a second load; the search and a store's page read it for their distances.
