# Desktop customer home: what Vietnamese food sites do (19 October 2026)

Date of research: 19 Oct 2026. Viewport for all screenshots: 1440×900, Chromium (Playwright), locale vi-VN, logged out. Screenshots were taken for the study and are not committed (third-party products); each source links to its page. Container widths were measured from the DOM (`getBoundingClientRect`) on the same run.

The comparison was our page as it stood on 19 October 2026, before the header gained its sign-in capsule. Content max-width is 1024px, centred. The header has no logo and no visible sign-in, only a language button.

## Sources

| Source | URL | What was seen | Status | Date |
|---|---|---|---|---|
| ShopeeFood | https://shopeefood.vn/ | Full page and first viewport | verified | 19 Oct 2026 |
| GrabFood web | https://food.grab.com/vn/vi/ | First viewport and 4 scrolled viewports | verified | 19 Oct 2026 |
| beFood web | https://food.be.com.vn/ | Full page | verified | 19 Oct 2026 |
| Be corporate site | https://be.com.vn/ | Text via fetch: "Đặt đồ ăn nhanh chóng tại web & ứng dụng" | verified | 19 Oct 2026 |
| Bách Hóa Xanh | https://www.bachhoaxanh.com/ | Full page and viewport | verified | 19 Oct 2026 |
| Tiki | https://tiki.vn/ | Full page and viewport | verified | 19 Oct 2026 |
| Baemin VN | Tuoi Tre News, 24 Nov 2023; Inside Retail, 24 Nov 2023 | Exited Vietnam on 8 Dec 2023, so there is no site to study | reported | 2023 |
| Too Good To Go | https://www.toogoodtogo.com/en-gb | Marketing site: hero, "Download app", "Food nearby" header link. Clicking "Food nearby" headless did not navigate, so a web browsing view was not seen. Press describes ordering as app-only | verified / reported (app-only ordering) | 19 Oct 2026 |
| Flashfood | https://www.flashfood.com/ | Marketing and app-download site, no web browsing | verified | 19 Oct 2026 |
| Yindii (SEA) | https://www.yindii.co/ | Marketing and app-download site, no web browsing | verified | 19 Oct 2026 |
| Karma, Phenix | FAO Agritech Observatory profiles (~mid-2024); Phenix App Store listing | Both are app-first. Karma "plans to launch a browser version" | reported | ~2024 |
| Vietnamese surplus apps | Web search, "ứng dụng giải cứu đồ ăn…" | No active Vietnamese surplus-food marketplace found. 11th Hour (SG) once planned VN | reported | 19 Oct 2026 |
| NN/g, Homepage Design: 5 Fundamental Principles | https://www.nngroup.com/articles/homepage-design-principles/ | Article text | verified | 15 Mar 2024 |
| NN/g, Beware Horizontal Scrolling on Desktop | https://www.nngroup.com/articles/horizontal-scrolling/ | Article text | verified | 27 Apr 2014 |
| NN/g, Designing Effective Carousels | https://www.nngroup.com/articles/designing-effective-carousels/ | Article text | verified | 2013, reviewed Aug 2026 |
| NN/g, Sticky Headers | https://www.nngroup.com/articles/sticky-headers/ | Article text | verified | 4 Apr 2021 |
| Baymard, Homepage & Category Navigation: 10 pitfalls | https://baymard.com/research-articles/ecommerce-navigation-best-practice | Article text (free part; the full guidelines are paywalled) | verified | updated 13 Oct 2026 |
| Baymard, line length | https://baymard.com/blog/line-length-readability | "50–75 characters" | verified | 10 May 2022 |
| Android / Material window size classes | https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes | Breakpoints: compact <600, medium 600–839, expanded 840–1199, large 1200–1599, extra-large ≥1600dp | verified | 19 Oct 2026 |
| Material 3 site (m3.material.io) | — | Page returned 404 / JS-only | not read | — |
| Apple HIG layout | — | Not consulted (time); not cited | — | — |

## Findings

### 1. Header composition at desktop

All observations are **verified**.

| Site | Left | Centre | Right | Sticky |
|---|---|---|---|---|
| ShopeeFood | Logo, city dropdown ("TP. HCM") | Vertical tabs (Đồ ăn, Thực phẩm, …) | Search icon, "Đăng nhập" button, flag (language) | Yes (`position: fixed`) |
| GrabFood | Logo, Mart/Food switch | — | Cart, "Đăng nhập/Đăng ký", language "VI" | Yes, white and opaque on scroll |
| beFood | Logo | Wide search, about 2/3 of the width | Yellow "Đăng nhập/Đăng ký" | Yes (`fixed`) |
| Bách Hóa Xanh | Logo | Wide search | Location picker "Chọn vị trí giao gần bạn", "Đăng nhập" | Yes (`fixed`) |
| Tiki | Logo with tagline | Wide search and keyword links | Home, account, cart; "Giao đến: <address>" under them | No (`relative`) |

- Every Vietnamese peer has the **logo top-left** and a **visible text sign-in button** top-right. Our header has neither.
- **Location** is in the header on ShopeeFood, BHX and Tiki. GrabFood and beFood ask for it in the hero instead.
- **Search** is a wide field (roughly 600–850px) on beFood, BHX and Tiki.
- NN/g (2024): put the logo top-left and add a clear tagline. NN/g (2021): a sticky header should be compact and opaque, use no "stalker" animation, and may reappear on scroll-up.

### 2. Rails vs grids on desktop

All observations are **verified**.

- GrabFood: the promotions row is **4 cards with a right-arrow** (a carousel) followed by a full-width "See all promotions" button. The categories are a **4-column grid** that wraps (14 tiles).
- beFood: the collections are a 4-column row. "Quán ngon quanh đây" is a **4-column grid** that wraps, with a "Xem thêm" button. It has no horizontal rails.
- ShopeeFood: "Ưu đãi" and "Bộ sưu tập" are **3-column grids** inside the right pane, each with "Xem tất cả". The store list is a vertical list with filter tabs.
- BHX and Tiki: promotional "quick links" are a horizontally scrolling icon row with arrows. Products and promos are grids (5 and 4 columns).
- NN/g (2014): desktop users "have not embraced horizontal scrolling". Do not hide essential content behind it, and show visible click controls. NN/g (carousels): use 5 frames or fewer.
- Baymard (2026): static content sections generally perform better than carousels. Never autorotate on mobile.

### 3. Columns at 1024–1440

All observations are **verified** at 1440. Behaviour at 1024 was not measured.

- Store and deal cards are **4 columns** in a 1200–1300px container (GrabFood, beFood).
- ShopeeFood uses **3 columns** in its ~670px right pane.
- BHX uses 5 product columns in a 920px main area beside a 270px sidebar.

The Material/Android width classes are **verified**: 840–1199 is "expanded" and 1200–1599 is "large". This supports a step at about 1200px. The column counts per class are not stated on that page.

### 4. Max content width

All observations are **verified** (DOM measurement at 1440).

| Site | Container |
|---|---|
| ShopeeFood | 1200px (x=120) |
| GrabFood | 1200px (x=120) |
| beFood | 1300px (x=70) |
| Bách Hóa Xanh | 1200px total (sidebar plus 920px main) |
| Tiki | about 1392px, near full width with 24px gutters |
| Flashfood | about 1280px |

None stops at 1024px. Backgrounds (hero, header bar, footer) run full-bleed while the content stays inside the container.

Baymard's 50–75 character line length applies to running text such as the intro paragraph, not to card grids. Our intro line at 1024px is about 120 characters, which is too long.

### 5. Promos and deal banners

All observations are **verified**.

- They come **first after the hero**: GrabFood's "Ưu đãi GrabFood tại Hà Nội" and ShopeeFood's "Ưu đãi" box at the top right.
- beFood puts the discount on each card as a red "Giảm đến 27K" badge instead of a separate banner.
- BHX and Tiki use large banner and promo-tile walls. These are grocery and marketplace patterns.
- NN/g (2024): do not let promotional content that is not core mislead new visitors. For us, the deals are the core offering, so a deal block at the top fits.

### 6. Category navigation on desktop

All observations are **verified**.

| Site | Pattern |
|---|---|
| ShopeeFood | Chips/pills in the hero (All, Đồ ăn, Đồ uống, …, 12 items) |
| GrabFood | Photo-tile grid with labels ("There's something for everyone!"), lower on the page |
| beFood | 4 photo tiles ("Bộ sưu tập món ăn") |
| BHX, Tiki | Persistent **left sidebar** category list (large catalogues), plus an icon quick-link row |

No food peer uses a sidebar. Ours has 7 categories, below Baymard's "around 10" threshold for chunking.

### 7. Intro / explainer for first-time visitors

All observations are **verified**.

- ShopeeFood: hero tagline "Đặt Đồ ăn, giao hàng từ 20'…" and a count line.
- GrabFood: "Let's explore good food near you" in the hero, and lower down "Vì sao bạn nên Order trên GrabFood?" (5 benefit bullets) and an app section.
- TGTG, Yindii, Flashfood: their whole site is the explainer ("Rescue good food in three simple steps", Yindii).
- None of these shows a dismissible card. They use a persistent tagline in the hero or a "why/how" section **below** the listings.
- NN/g: include a tagline that explicitly says what the site does, and do not assume visitors know the brand.

### 8. Sticky header

All observations are **verified**. ShopeeFood, GrabFood, beFood and BHX keep the header fixed. Tiki does not. GrabFood switches the header to an opaque white bar on scroll. See NN/g 2021 in §1.

### 9. Footer content

All observations are **verified**.

| Site | Footer |
|---|---|
| ShopeeFood | Category links; company links (about, help centre, rules, privacy, complaints, partner sign-up); app badges; full company legal block (address, business registration number and date, responsible person, hotline, email); "Đã đăng ký Bộ Công Thương" badge |
| GrabFood | Columns (about, support, open a store); countries; social; app badges; © and privacy |
| beFood | Local SEO links ("Giao đồ ăn gần bạn – Hà Nội"); about, careers, partner, driver; hotline and email; social; QR code to download the app; company legal block; Bộ Công Thương badges |
| BHX, Tiki | Same shape: support hotline, policies, company legal info, Bộ Công Thương badge |

Our footer has only Terms and Privacy. The Bộ Công Thương badges are verified on the pages. That they are a legal requirement for Vietnamese e-commerce sites (Decree 52/2013, as amended) is **reported**, from my background knowledge, and was not checked in this research.

### Surplus-food peers on the web

Too Good To Go, Flashfood, Yindii, Karma and Phenix are **app-first**. Their websites are marketing pages with app-download CTAs. TGTG has a "Food nearby" header entry, but this research could not confirm that it supports web browsing or ordering. **No surplus peer offers a desktop browsing home to copy**, so the layout evidence comes from Vietnamese food delivery and grocery sites.

## Recommended changes to our desktop home

1. **Widen the container to about 1200px at ≥1200px.** Keep a fluid width with side gutters from 1024 to 1199. Keep the header band, hero and footer backgrounds full-bleed.
   - Evidence: ShopeeFood and GrabFood use 1200, beFood 1300, BHX 1200 (verified). The Android "large" class starts at 1200.
   - Strength: strong for the width itself. The 1199 breakpoint is our own choice.
2. **Use the standard header: logo top-left, then location ("Tasco Mall · Long Biên"), a wide search, then a text sign-in button and language at the right.** Make it sticky and opaque, and compact once scrolled.
   - Evidence: every VN peer has a logo top-left and a text sign-in button (verified). NN/g on logos and sticky headers (verified).
   - Strength: strong. Ours currently has no logo and no sign-in.
3. **Use 4 columns at ≥1200 and 3 at 1024–1199 for both card sections, with one card size per section.** Keep everything as grids with "Xem tất cả". Add no horizontal rails on desktop. If a row must scroll, give it visible arrow buttons and 5 frames or fewer.
   - Evidence: GrabFood and beFood use 4-up grids, ShopeeFood 3-up in a narrow pane (verified). NN/g on horizontal scrolling and carousels.
   - Strength: strong for grids over rails. The exact column count is moderate.
4. **Keep tonight's deals as the first block after the header.** Showing the discount on each card (as beFood does) is an alternative to a dark banner.
   - Evidence: GrabFood and ShopeeFood put "Ưu đãi" first, and beFood badges each card (verified).
   - Strength: moderate. No peer uses a dark "up to X%" summary card like ours, but nothing argues against it.
5. **Keep categories as a single row of picture tiles or chips. Do not add a sidebar.**
   - Evidence: food peers use chips or photo tiles. Sidebars appear only on large grocery catalogues (BHX, Tiki), and we have 7 categories (verified).
   - Strength: moderate. Picture tiles and chips both have precedent.
6. **Replace the dismissible "Second Bite là gì?" card with a short persistent tagline near the top.** For example, one line under the place name saying what the service is and how pickup works. Optionally add a 3-step "how it works" section below the listings, as GrabFood and Yindii do. Cap any explanatory text at about 75 characters per line.
   - Evidence: NN/g tagline guidance, the ShopeeFood and GrabFood hero taglines, and GrabFood's "Vì sao…" section (verified). Baymard line length (verified).
   - Strength: moderate. No peer was seen using a dismissible card, but no source says one is harmful.
7. **Expand the footer.** Add an about/how-it-works link, a seller sign-up link, support contact (where it is managed, with no personal numbers in the repository), terms and privacy, and the operating company's legal block, with the Bộ Công Thương registration badge once the company has it. Add app links later, when the apps exist.
   - Evidence: the footers of all five VN sites (verified).
   - Strength: strong for the shape. The legal requirement is **reported**, not checked.
8. **The perk strip ("8 túi đang mở · túi cuối lúc 21:45") has no direct peer equivalent.** The closest are ShopeeFood's count line under its tagline ("Có 113619 Địa Điểm…") and GrabFood's "See all promotions" bar.
   - Recommendation: fold it into the tagline or the deals block rather than keep a separate full-width strip.
   - Strength: weak; this is a judgement from the peers.

Not established by this research: behaviour at exactly 1024px on peer sites (only 1440 was captured), Apple HIG and the Material 3 pages themselves (Material breakpoints come from the Android developer docs), and any Vietnamese surplus-food web product to compare against.
