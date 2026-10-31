# Customer location and the stores' map

Studied on 31 October 2026, when the pilot was to take stores outside Tasco Mall ([meeting of 30 October](../brief/meetings/2026-10-30-trials-meeting.md)). The questions: how a customer's place is found, what the home shows before it is known, whether a place can be typed and is remembered, and how a map of stores works. The open-source projects were cloned shallowly into the git-ignored `.tmp/` and read, not run; paths are relative to each clone. **Verified** means read in code or in the primary document; **reported** means taken from a third-party article and not checked in the app.

## Findings

- **Ask for the device's location only after a tap, explain why, and always offer a typed address.** web.dev: "Never ask on page load or without user interaction"; ask "after the user has interacted with the page", for example from a "Use my location" button; "if requesting geolocation permission, offer a text field where users can enter a zip code or address"; 77% of desktop prompts shown without user intent were blocked. Apple: "Avoid requesting permission at launch unless the data or resource is required for your app to function", and "wait to request permission until people actually use an app feature that requires access". Verified.
- **None of the open-source projects asks for the device's location when a page opens.** Verified:
  - foodsharing never calls `navigator.geolocation`. It uses the address in the person's profile, a "locate me" button on the map that acts only when tapped, and an address search (`client/src/views/pages/Map/MapPage.vue:19,29,298-301`, `components/map/AddressSearchField.vue`). Without a place the map opens on the centre of Germany (`MapPage.vue:176-178`), and the nearby list says it needs a location (`NearbyBasketsList.vue:30-36`).
  - Karrot guesses the place from the request's address with GeoLite2 (`karrot-backend/karrot/utils/geoip.py`, `bootstrap/api.py:44-48`), falls back to a fixed point (`karrot-frontend/src/base/services/geo.js:6,25`) and geocodes a typed address through Nominatim (`src/maps/api/geocoding.js:4-5`).
  - Open Food Network takes a typed place and lists the shops within 50 km of it, or every shop (`app/assets/javascripts/darkswarm/services/enterprises.js.coffee:61-86`, `filters/distance_within_km.js.coffee`).
  - Umi Feeds has no browsing by place for customers.
- **Commercial apps let people choose a place other than where they stand.** Too Good To Go sets the place by a pin on the map, a city search or the device's location, and searches a radius of 1 to 20 miles. Reported ([Pratt IxD](https://ixd.prattsi.org/2024/02/design-critique-too-good-to-go/), [Time Out](https://timeout.com/newyork/news/let-me-tell-youthis-app-is-the-key-to-finding-great-cheap-food-in-nyc-062723)). ShopeeFood asks to confirm or enter a delivery address when it opens and shows only that area's shops, since it delivers. Reported ([Sapo](https://www.sapo.vn/blog/cach-dat-do-an-tren-shopee-food)).
- **A map of stores is a second view beside the list.** Too Good To Go's Browse switches between a list and a map, the map with cards along the bottom whose place is highlighted. Reported (Pratt IxD). foodpanda's and Uber Eats' pick-up show nearby restaurants on a map with their distance. Reported ([Honeycombers](https://thehoneycombers.com/singapore/foodpanda-self-pick-up/), [TechCrunch](https://techcrunch.com/2021/09/22/uber-eats-adds-map-feature-so-users-can-find-nearest-restaurants-for-pickup/)). foodsharing and Open Food Network keep the map on a page of its own, a pin opening the item's card (`MapPage.vue:232-253`, `directives/open_street_map.js.coffee:24-25`); Karrot puts a clustered map above the list (`src/groupInfo/components/GroupGalleryMap.vue`). Verified.
- **No open-source map loads what the visible area holds or offers "search this area"; each uses a fixed radius around one point**: foodsharing 30 km by default (`api/baskets.ts:26`), Open Food Network 50 km, Karrot frames the nearest groups (`GroupGalleryMap.vue:60-77`). Verified.
- **Distance on a card** reads "850 m" under a kilometre and "1.2 km" above in foodsharing (`NearbyBasketsList.vue:70-75`), "(N km)" in Open Food Network (`app/views/shops/_skinny.html.haml:12`). Verified.

## What Second Bite does with it

The home shows every shop until a place is chosen, asks for the device's location only from "Dùng vị trí của tôi", adds a typed place and remembers the choice; the map waits until stores are spread over several areas. The design is the [customer place increment](../increments/active/customer-place/design.md). Guessing the place from the request's address, as Karrot does, is left out: Vietnamese mobile networks share addresses through the carrier, so the guess would be far off (the team's judgement, not measured).

## Sources

| Source | Read |
| --- | --- |
| [web.dev, permissions best practices](https://web.dev/articles/permissions-best-practices) | 31 October 2026 |
| [Apple HIG, privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) | 31 October 2026 |
| foodsharing, Karrot (frontend and backend), Open Food Network and Umi Feeds in `.tmp/` | 31 October 2026 |
| Pratt IxD, Time Out, Sapo, Honeycombers and TechCrunch, linked above | 31 October 2026 |
