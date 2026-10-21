// What the web asks the Go server, answered for the browser tests and for local work on screens whose
// endpoint is not built yet (`pnpm stub:backend`, then SECONDBITE_API_ORIGIN=http://localhost:3190).
// GET /offers answers as api/openapi.yaml describes it, with real shops of Tasco Mall and dishes from their menus;
// tonight's prices and windows are made up. Adapted from BeyondPilot's
// web/tests/e2e/stub-backend.mjs.
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.STUB_BACKEND_PORT ?? 3190);

/**
 * The words of every failure in both languages, read from the Go server's own declarations (SEC-28:
 * `NewFailure(…, platform.Words{VI, EN})` in each module's errors.go, the platform's own in problem.go), so
 * the stub says what the server says and a sentence is written once.
 */
const failureWords = readFailureWords();

function readFailureWords() {
  const internal = fileURLToPath(new URL("../../../server/internal/", import.meta.url));
  const words = new Map();
  const quoted = String.raw`"((?:[^"\\]|\\.)*)"`;
  const declared = new RegExp(
    String.raw`NewFailure\("([A-Z0-9_]+)",[^{]*Words\{\s*VI:\s*${quoted},\s*EN:\s*${quoted}`,
    "g",
  );
  for (const entry of readdirSync(internal, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of ["errors.go", "caller.go"]) {
      let source;
      try {
        source = readFileSync(join(internal, entry.name, file), "utf8");
      } catch {
        continue;
      }
      for (const [, code, vi, en] of source.matchAll(declared)) words.set(code, { vi, en });
    }
  }
  const problem = readFileSync(join(internal, "platform", "problem.go"), "utf8");
  const codes = new Map(
    [...problem.matchAll(/(Code\w+)\s*=\s*"([A-Z_]+)"/g)].map(([, name, code]) => [name, code]),
  );
  const platform = new RegExp(String.raw`(Code\w+): \{\s*VI:\s*${quoted},\s*EN:\s*${quoted}`, "g");
  for (const [, name, vi, en] of problem.matchAll(platform)) words.set(codes.get(name), { vi, en });
  return words;
}

/** The language of the request being answered, as the server reads Accept-Language: English or Vietnamese. */
const requestLanguage = new AsyncLocalStorage();

function languageOf(header) {
  const first = (header ?? "").split(",")[0].trim().toLowerCase();
  return first.startsWith("en") ? "en" : "vi";
}

/** Today at hh:mm in Vietnam time, as RFC 3339 with its offset. */
function tonight(hour, minute) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  return `${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;
}

/** An offer as `GET /offers` answers (api/openapi.yaml › FoundBody), at Tasco Mall. */
function sample({
  id,
  name,
  description = "",
  kind,
  price,
  originalPrice,
  unitsLeft,
  unit,
  from,
  until,
  seller,
}) {
  const status = unitsLeft > 0 ? "on_sale" : "sold_out";
  const photo = `ph-${id.slice(3)}`;
  return {
    id,
    sellerId: seller.id,
    status,
    name,
    description,
    kind,
    unit,
    units: Math.max(unitsLeft, 1),
    unitsLeft,
    priceVnd: price,
    originalPriceVnd: originalPrice,
    discountPercent: Math.floor(((originalPrice - price) * 100) / originalPrice),
    photo: {
      id: photo,
      largePath: `/photos/${photo}/1600.jpg`,
      smallPath: `/photos/${photo}/400.jpg`,
    },
    windowStart: from,
    windowEnd: until,
    collectionPoint: { latitude: 21.0565, longitude: 105.8964, address: seller.address },
    createdAt: from,
    updatedAt: from,
    seller,
  };
}

/** Surplus expected later tonight: an offer with estimated units instead of units, which nobody can order. */
function announce({ estimatedUnits, ...fields }) {
  const { units: _units, unitsLeft: _unitsLeft, ...offer } = sample({ ...fields, unitsLeft: 0 });
  return { ...offer, status: "announced", estimatedUnits };
}

/** A seller's logo, served like the dishes' photographs (photoFiles below). */
function logo(slug) {
  const id = `ph-logo-${slug}`;
  return { id, largePath: `/photos/${id}/1600.jpg`, smallPath: `/photos/${id}/400.jpg` };
}

const sellers = {
  laParis: {
    id: "se-la-paris",
    name: "La Paris",
    address: "Tầng 1",
    rating: 4.8,
    photo: logo("la-paris"),
  },
  pandaChef: {
    id: "se-panda-chef",
    name: "Panda Chef",
    address: "Tầng 3",
    rating: 4.6,
    photo: logo("panda-chef"),
  },
  netHue: {
    id: "se-net-hue",
    name: "Nét Huế",
    address: "Tầng 3",
    rating: 4.7,
    photo: logo("net-hue"),
  },
  phucLong: {
    id: "se-phuc-long",
    name: "Phúc Long",
    address: "Tầng 1",
    rating: 4.5,
    photo: logo("phuc-long"),
  },
  highlands: {
    id: "se-highlands",
    name: "Highlands Coffee",
    address: "Tầng 1",
    photo: logo("highlands"),
  },
  kfc: { id: "se-kfc", name: "KFC", address: "Tầng hầm", photo: logo("kfc") },
  pizzaHut: { id: "se-pizza-hut", name: "Pizza Hut", address: "Tầng 3", photo: logo("pizza-hut") },
};

// Dishes from the shops' menus at Tasco Mall, at their menu price, with tonight's price and window made up.
const offers = [
  sample({
    id: "of-croissant",
    name: "Bánh Croissant Truyền Thống",
    description:
      "Bánh làm trong ngày, ngon nhất khi dùng trước 24 giờ. Nếu bạn dị ứng món nào, hãy hỏi quán khi đến nhận.",
    kind: "bakery",
    price: 22000,
    originalPrice: 50000,
    unitsLeft: 3,
    unit: "chiếc",
    from: tonight(21, 0),
    until: tonight(21, 45),
    seller: sellers.laParis,
  }),
  sample({
    id: "of-eclair",
    name: "Bánh Eclair Socola",
    kind: "bakery",
    price: 29000,
    originalPrice: 65000,
    unitsLeft: 4,
    unit: "chiếc",
    from: tonight(21, 0),
    until: tonight(21, 45),
    seller: sellers.laParis,
  }),
  sample({
    id: "of-banh-mi",
    name: "Bánh mì mềm chà bông",
    kind: "bakery",
    price: 35000,
    originalPrice: 75000,
    unitsLeft: 0,
    unit: "chiếc",
    from: tonight(21, 0),
    until: tonight(21, 45),
    seller: sellers.laParis,
  }),
  sample({
    id: "of-ha-cao",
    name: "Há cảo tôm",
    kind: "prepared_food",
    price: 25000,
    originalPrice: 59000,
    unitsLeft: 6,
    unit: "phần",
    from: tonight(21, 15),
    until: tonight(21, 45),
    seller: sellers.pandaChef,
  }),
  sample({
    id: "of-banh-bao",
    name: "Bánh bao xá xíu",
    kind: "prepared_food",
    price: 20000,
    originalPrice: 49000,
    unitsLeft: 5,
    unit: "phần",
    from: tonight(21, 15),
    until: tonight(21, 45),
    seller: sellers.pandaChef,
  }),
  sample({
    id: "of-com-thit-kho",
    name: "Cơm Thịt Kho Nước Dừa",
    kind: "prepared_food",
    price: 30000,
    originalPrice: 68000,
    unitsLeft: 2,
    unit: "suất",
    from: tonight(20, 45),
    until: tonight(21, 30),
    seller: sellers.netHue,
  }),
  sample({
    id: "of-tra-sua",
    name: "Trà Sữa Phúc Long",
    kind: "drinks",
    price: 25000,
    originalPrice: 55000,
    unitsLeft: 8,
    unit: "ly",
    from: tonight(21, 30),
    until: tonight(22, 0),
    seller: sellers.phucLong,
  }),
  sample({
    id: "of-bac-xiu",
    name: "Bạc Xỉu Đá",
    kind: "drinks",
    price: 15000,
    originalPrice: 29000,
    unitsLeft: 6,
    unit: "ly",
    from: tonight(21, 30),
    until: tonight(22, 0),
    seller: sellers.highlands,
  }),
  sample({
    id: "of-combo-nhom",
    name: "Combo Nhóm 3 Tụ Tập",
    kind: "mixed_box",
    price: 99000,
    originalPrice: 239000,
    unitsLeft: 2,
    unit: "phần",
    from: tonight(21, 0),
    until: tonight(21, 30),
    seller: sellers.kfc,
  }),
  sample({
    id: "of-pizza",
    name: "Pizza Thập Cẩm",
    kind: "other",
    price: 69000,
    originalPrice: 149000,
    unitsLeft: 3,
    unit: "chiếc",
    from: tonight(21, 15),
    until: tonight(22, 0),
    seller: sellers.pizzaHut,
  }),
  // Announcements, ahead of the contract (SEC-11 step 5; web/src/features/offers/proposed.ts).
  announce({
    id: "an-com-bo",
    name: "Cơm Bò Rang Giòn",
    kind: "prepared_food",
    price: 32000,
    originalPrice: 72000,
    estimatedUnits: 6,
    unit: "suất",
    from: tonight(22, 0),
    until: tonight(22, 45),
    seller: sellers.netHue,
  }),
  announce({
    id: "an-xiu-mai",
    name: "Xíu Mại Hấp",
    kind: "prepared_food",
    price: 24000,
    originalPrice: 55000,
    estimatedUnits: 8,
    unit: "phần",
    from: tonight(22, 30),
    until: tonight(23, 0),
    seller: sellers.pandaChef,
  }),
  announce({
    id: "an-ga-ran",
    name: "3 Miếng Gà Rán",
    kind: "prepared_food",
    price: 45000,
    originalPrice: 99000,
    estimatedUnits: 5,
    unit: "phần",
    from: tonight(21, 45),
    until: tonight(22, 15),
    seller: sellers.kfc,
  }),
];

/** In hours from now, as RFC 3339: a window that has not opened yet, whatever the time of the test. */
function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

// An offer reached only by its page, never in the home's list: its window opens three hours from now, so an
// order of it can always be cancelled free of charge in the tests.
const laterOffer = sample({
  id: "of-banh-bao-thit",
  name: "Bánh bao nhân thịt, 2 chiếc",
  kind: "prepared_food",
  price: 25000,
  originalPrice: 50000,
  unitsLeft: 6,
  unit: "túi",
  from: hoursFromNow(3),
  until: hoursFromNow(4),
  seller: sellers.pandaChef,
});

// Each dish's photograph from the shop's own menu, in the git-ignored copy of Tasco Mall's food directory
// (.tmp/tascomall-am-thuc, or STUB_PHOTOS_DIR). Without it, as in CI, a placeholder stands in.
const photosDir =
  process.env.STUB_PHOTOS_DIR ??
  fileURLToPath(new URL("../../../.tmp/tascomall-am-thuc/san-pham/", import.meta.url));
const photoFiles = {
  "ph-croissant": "la-paris/01-banh-croissant-truyen-thong.webp",
  "ph-eclair": "la-paris/05-banh-eclair-socola.webp",
  "ph-banh-mi": "la-paris/09-banh-mi-mem-cha-bong.webp",
  "ph-ha-cao": "panda-chef/01-ha-cao-tom.png",
  "ph-banh-bao": "panda-chef/07-banh-bao-xa-xiu.png",
  "ph-com-thit-kho": "net-hue/07-com-thit-kho-nuoc-dua.jpg",
  "ph-tra-sua": "phuc-long/01-tra-sua-phuc-long.jpg",
  "ph-bac-xiu": "highlands-coffee-2/01-bac-xiu-da.jpg",
  "ph-combo-nhom": "kfc/10-combo-nhom-3-tu-tap.jpg",
  "ph-pizza": "pizza-hut/02-pizza-thap-cam.webp",
  "ph-com-bo": "net-hue/08-com-bo-rang-gion.jpg",
  "ph-xiu-mai": "panda-chef/02-xiu-mai-hap.png",
  "ph-ga-ran": "kfc/01-3-mieng-ga-ran.jpg",
  // The sellers' logos, from the directory's list of shops.
  "ph-logo-la-paris": "../quan-an/la-paris.png",
  "ph-logo-panda-chef": "../quan-an/panda-chef.png",
  "ph-logo-net-hue": "../quan-an/net-hue.png",
  "ph-logo-kfc": "../quan-an/kfc.jpeg",
  "ph-logo-pizza-hut": "../quan-an/pizza-hut.png",
  "ph-logo-phuc-long": "../giai-khat/phuc-long.png",
  "ph-logo-highlands": "../giai-khat/highlands-coffee-2.png",
};
const imageTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** The dish's photograph when the directory is there, otherwise a placeholder. */
async function photo(id) {
  const file = photoFiles[id];
  if (file) {
    try {
      return { type: imageTypes[extname(file)], body: await readFile(join(photosDir, file)) };
    } catch {
      // Not on this machine: the placeholder below.
    }
  }
  return {
    type: "image/svg+xml",
    body: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1D7A8"/><stop offset="1" stop-color="#B9763E"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="160" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#1C1A17" opacity="0.5">sample</text></svg>`,
  };
}

function fold(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
}

const DEFAULT_RADIUS_KM = 5;
const EARTH_RADIUS_M = 6_371_000;

/** Metres between two points on the Earth, by the haversine formula. */
function metresBetween([lat1, lon1], [lat2, lon2]) {
  const rad = (degrees) => (degrees * Math.PI) / 180;
  const h =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return Math.round(2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h)));
}

function search(url) {
  const q = url.searchParams.get("q");
  const kind = url.searchParams.get("kind");
  const from = url.searchParams.get("collectFrom");
  const to = url.searchParams.get("collectTo");
  const near = url.searchParams.get("near")?.split(",").map(Number);
  const radiusKm = Number(url.searchParams.get("radiusKm") ?? DEFAULT_RADIUS_KM);
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");
  const sellerId = url.searchParams.get("sellerId");
  const found = offers.filter(
    (offer) =>
      (!q || fold(offer.name).includes(fold(q)) || fold(offer.seller.name).includes(fold(q))) &&
      (!kind || kind.split(",").includes(offer.kind)) &&
      (!sellerId || offer.sellerId === sellerId) &&
      (!minPrice || offer.priceVnd >= Number(minPrice)) &&
      (!maxPrice || offer.priceVnd <= Number(maxPrice)) &&
      (!to || new Date(offer.windowStart) <= new Date(to)) &&
      (!from || new Date(from) < new Date(offer.windowEnd)),
  );
  if (!near) return found;
  // Around a point: only what lies within the radius, nearest first, each with its distance.
  return found
    .map((offer) => ({
      ...offer,
      distanceMeters: metresBetween(near, [
        offer.collectionPoint.latitude,
        offer.collectionPoint.longitude,
      ]),
    }))
    .filter((offer) => offer.distanceMeters <= radiusKm * 1000)
    .toSorted((a, b) => a.distanceMeters - b.distanceMeters);
}

// Signing in (SEC-29), as api/openapi.yaml describes it: the code 123456 is right and any other is not; the
// address limit@example.com has asked for too many codes. A right code sets the session cookie when the web
// asks for it ("session": "cookie"), and otherwise answers the token for the app's Bearer header, as the Go
// server does; GET /accounts/me and sign-out read either, the header first. Google is off unless STUB_GOOGLE_CLIENT_ID is set.
const sessionCookie = "secondbite_session";
// One session per address, so tests running side by side do not sign each other out.
const accounts = new Map();

function problem(response, status, code) {
  const language = requestLanguage.getStore() ?? "vi";
  response.writeHead(status, {
    "content-type": "application/problem+json",
    "content-language": language,
    vary: "Accept-Language",
  });
  response.end(
    JSON.stringify({
      type: `urn:secondbite:failure:${code.toLowerCase().replaceAll("_", "-")}`,
      status,
      detail: failureWords.get(code)?.[language],
      code,
      requestId: "STUB",
    }),
  );
}

function json(response, status, body, headers = {}) {
  response.writeHead(status, { "content-type": "application/json", ...headers });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  let text = "";
  for await (const chunk of request) text += chunk;
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function tokenOf(request) {
  const bearer = /^Bearer (.+)$/.exec(request.headers.authorization ?? "")?.[1];
  if (bearer) return bearer;
  const cookie = request.headers.cookie ?? "";
  return new RegExp(`(?:^|; )${sessionCookie}=([^;]+)`).exec(cookie)?.[1];
}

async function auth(request, response, url) {
  if (request.method === "GET" && url.pathname === "/auth/methods") {
    const clientId = process.env.STUB_GOOGLE_CLIENT_ID;
    json(response, 200, clientId ? { google: { clientId } } : {});
    return true;
  }
  if (request.method === "POST" && url.pathname === "/auth/sign-in-codes") {
    const { email } = await readBody(request);
    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      problem(response, 422, "IDENTITY_EMAIL_INVALID");
    } else if (email === "limit@example.com") {
      problem(response, 429, "IDENTITY_CODE_LIMIT_EXCEEDED");
    } else {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      json(response, 202, { challengeId: `ch-${encodeURIComponent(email)}`, expiresAt });
    }
    return true;
  }
  if (request.method === "POST" && url.pathname === "/auth/sessions") {
    const { challengeId, code, session } = await readBody(request);
    if (code !== "123456") {
      problem(response, 422, "IDENTITY_CODE_INCORRECT");
      return true;
    }
    const email = decodeURIComponent(String(challengeId).slice(3));
    // An address that starts with "admin" is an admin's, as `secondbite admin grant` makes one.
    const role = email.startsWith("admin") ? "admin" : "customer";
    const account = { id: "ac-stub", email, displayName: "", role };
    const token = `stub-${Buffer.from(email).toString("hex")}`;
    accounts.set(token, account);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    if (session === "cookie") {
      json(
        response,
        201,
        { account, expiresAt },
        {
          "set-cookie": `${sessionCookie}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=34560000`,
        },
      );
    } else {
      json(response, 201, { account, expiresAt, token });
    }
    return true;
  }
  if (request.method === "DELETE" && url.pathname === "/auth/sessions/current") {
    accounts.delete(tokenOf(request));
    response.writeHead(204, {
      "set-cookie": `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    });
    response.end();
    return true;
  }
  if (request.method === "GET" && url.pathname === "/accounts/me") {
    const account = accounts.get(tokenOf(request));
    if (account) json(response, 200, account);
    else problem(response, 401, "IDENTITY_SESSION_INVALID");
    return true;
  }
  // The display name (SEC-61), as the server keeps it: trimmed, 1 to 50 characters.
  if (request.method === "PUT" && url.pathname === "/accounts/me") {
    const account = accounts.get(tokenOf(request));
    if (!account) {
      problem(response, 401, "PLATFORM_AUTHENTICATION_REQUIRED");
      return true;
    }
    const name = String((await readBody(request)).displayName ?? "").trim();
    if (name === "" || Array.from(name).length > 50) {
      problem(response, 400, "IDENTITY_DISPLAY_NAME_INVALID");
      return true;
    }
    account.displayName = name;
    json(response, 200, account);
    return true;
  }
  return deletion(request, response, url);
}

// Deleting an account (SEC-37): the deletion code goes to the signed-in account's address; 123456 is right and
// any other is not, and a sign-in challenge cannot delete. A right code ends the session and clears the cookie.
// An address starting with "owner." owns a seller besides those it opened (sellerRoutes), for the warning
// before the deletion and for account settings.
async function deletion(request, response, url) {
  const token = tokenOf(request);
  const account = accounts.get(token);
  if (request.method === "POST" && url.pathname === "/accounts/me/deletion-codes") {
    if (!account) problem(response, 401, "PLATFORM_AUTHENTICATION_REQUIRED");
    else {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      json(response, 202, { challengeId: `del-${encodeURIComponent(account.email)}`, expiresAt });
    }
    return true;
  }
  if (request.method === "POST" && url.pathname === "/accounts/me/deletion") {
    const { challengeId, code } = await readBody(request);
    if (!account) problem(response, 401, "PLATFORM_AUTHENTICATION_REQUIRED");
    else if (challengeId !== `del-${encodeURIComponent(account.email)}`) {
      problem(response, 410, "IDENTITY_CHALLENGE_GONE");
    } else if (code !== "123456") problem(response, 422, "IDENTITY_CODE_INCORRECT");
    else {
      accounts.delete(token);
      response.writeHead(204, {
        "set-cookie": `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      });
      response.end();
    }
    return true;
  }
  return false;
}

// The seller's side (SEC-57), as api/openapi.yaml describes it: a person opens stores, at most five, each active
// at once, and reads the ones they own. Kept per session, like the accounts above.
const storesOf = new Map();
/** Each store's posts, the newest first: the sample ones of a store named like Figma's, then what it posts. */
const postsBy = new Map();

function postsFor(seller) {
  if (!postsBy.has(seller.id)) {
    postsBy.set(
      seller.id,
      seller.name === "Tiệm bánh Pháp"
        ? postsOf(seller)
        : seller.name === "Tiệm có đơn"
          ? postsWithOrders(seller)
          : [],
    );
  }
  return postsBy.get(seller.id);
}

/** A store's posts as GET /sellers/{id}/offers answers: one on sale, one sold out, one over, one withdrawn. */
/** Each store's catalog, the newest dish first: a store named "Tiệm danh mục" starts with the three of Figma Q3b. */
const dishesBy = new Map();

function dishesFor(seller) {
  if (!dishesBy.has(seller.id)) {
    const dish = (n, name, kind, unit, hidden = false) => ({
      id: `di-${n}-${seller.id}`,
      sellerId: seller.id,
      name,
      kind,
      unit,
      description: "",
      ingredients: "",
      photo: {
        id: `ph-${n}`,
        largePath: `/photos/ph-${n}/1600.jpg`,
        smallPath: `/photos/ph-${n}/400.jpg`,
      },
      hidden,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    dishesBy.set(
      seller.id,
      seller.name === "Tiệm danh mục"
        ? [
            {
              ...dish(1, "Túi bánh mì và croissant, 4 chiếc", "bakery", "túi"),
              originalPriceVnd: 95000,
            },
            dish(2, "Cơm sườn nướng, 1 suất", "prepared_food", "suất", true),
            dish(3, "Xôi thập cẩm, 1 hộp", "prepared_food", "hộp"),
          ]
        : [],
    );
  }
  return dishesBy.get(seller.id);
}

/** A store with one live post of which units are ordered, for the screens that lock the price and the hours. */
function postsWithOrders(seller) {
  return postsOf(seller)
    .slice(0, 1)
    .map((post) => ({ ...post, name: "Bánh mì que, 3 chiếc", units: 3, unitsLeft: 1 }));
}

function postsOf(seller) {
  const post = (n, status, name, units, unitsLeft, from, until, extra = {}) => ({
    id: `of-${n}-${seller.id}`,
    sellerId: seller.id,
    status,
    name,
    description: "",
    kind: "bakery",
    unit: "suất",
    units,
    unitsLeft,
    priceVnd: 57000,
    originalPriceVnd: 95000,
    discountPercent: 40,
    photo: {
      id: `ph-${n}`,
      largePath: `/photos/ph-${n}/1600.jpg`,
      smallPath: `/photos/ph-${n}/400.jpg`,
    },
    windowStart: tonight(...from),
    windowEnd: tonight(...until),
    collectionPoint: { latitude: 21.0565, longitude: 105.8964, address: seller.address },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra,
  });
  return [
    post(1, "on_sale", "Túi bánh mì và croissant, 4 chiếc", 3, 3, [20, 30], [21, 30]),
    post(2, "sold_out", "Xôi thập cẩm, 1 hộp", 4, 0, [20, 0], [21, 0]),
    post(3, "closed", "Bánh su kem, 6 cái", 3, 1, [18, 0], [19, 0]),
    post(4, "withdrawn", "Cơm sườn nướng, 1 suất", 2, 2, [18, 0], [19, 0], {
      withdrawnAt: new Date().toISOString(),
    }),
  ];
}

// The seller an address starting with "owner." owns (SEC-37).
function ownerSeller() {
  return {
    id: "se-stub",
    name: "Bánh mì Tasco",
    address: "Tasco Mall, Việt Hưng",
    latitude: 21.0565,
    longitude: 105.8964,
    phone: "0912 345 678",
    status: "active",
    myRole: "owner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function sellerRoutes(request, response, url) {
  const token = tokenOf(request);
  const isSellerRoute =
    url.pathname === "/sellers" ||
    url.pathname === "/sellers/mine" ||
    url.pathname === "/photos" ||
    /^\/sellers\/[\w-]+(\/photo|\/offers|\/dishes)?$/.test(url.pathname) ||
    /^\/offers\/[\w-]+(\/withdraw)?$/.test(url.pathname) ||
    /^\/dishes\/[\w-]+$/.test(url.pathname);
  if (!isSellerRoute) return false;
  if (!accounts.has(token)) {
    problem(response, 401, "IDENTITY_SESSION_INVALID");
    return true;
  }
  const mine = storesOf.get(token) ?? [];
  if (request.method === "GET" && url.pathname === "/sellers/mine") {
    // An address starting with "ending." has its session end between the account and its sellers (SEC-69).
    if (accounts.get(token).email.startsWith("ending.")) {
      problem(response, 401, "IDENTITY_SESSION_INVALID");
      return true;
    }
    const owned = accounts.get(token).email.startsWith("owner.") ? [ownerSeller()] : [];
    json(response, 200, { sellers: [...owned, ...mine] });
    return true;
  }
  if (request.method === "POST" && url.pathname === "/sellers") {
    const body = await readBody(request);
    const digits = String(body.phone ?? "").replace(/\D/g, "");
    if (!String(body.name ?? "").trim() || !String(body.address ?? "").trim()) {
      problem(response, 422, "SELLER_DETAILS_INVALID");
    } else if (digits.length < 9 || digits.length > 15) {
      problem(response, 422, "SELLER_PHONE_INVALID");
    } else if (mine.length >= 5) {
      problem(response, 409, "SELLER_LIMIT_REACHED");
    } else {
      const now = new Date().toISOString();
      const seller = {
        id: `se-${mine.length + 1}-${token.slice(5)}`,
        name: body.name.trim(),
        address: body.address.trim(),
        phone: digits,
        latitude: body.latitude,
        longitude: body.longitude,
        status: "active",
        myRole: "owner",
        createdAt: now,
        updatedAt: now,
      };
      storesOf.set(token, [...mine, seller]);
      json(response, 201, seller);
    }
    return true;
  }
  if (request.method === "POST" && url.pathname === "/photos") {
    for await (const chunk of request) void chunk;
    json(response, 201, {
      id: "ph-upload",
      width: 400,
      height: 400,
      largePath: "/photos/ph-upload/1600.jpg",
      smallPath: "/photos/ph-upload/400.jpg",
    });
    return true;
  }
  const catalog = /^\/sellers\/([\w-]+)\/dishes$/.exec(url.pathname);
  if (catalog) {
    const seller = mine.find((candidate) => candidate.id === catalog[1]);
    if (!seller) {
      problem(response, 404, "SELLER_NOT_FOUND");
    } else if (request.method === "GET") {
      json(response, 200, { dishes: dishesFor(seller) });
    } else if (request.method === "POST") {
      const body = await readBody(request);
      const dishes = dishesFor(seller);
      if (!String(body.name ?? "").trim()) {
        problem(response, 422, "OFFER_DETAILS_INVALID");
      } else if (dishes.length >= 100) {
        problem(response, 409, "OFFER_DISH_LIMIT_REACHED");
      } else {
        const now = new Date().toISOString();
        const dish = {
          id: `di-new-${dishes.length + 1}-${seller.id}`,
          sellerId: seller.id,
          name: body.name.trim(),
          kind: body.kind,
          unit: body.unit || "suất",
          description: body.description ?? "",
          ingredients: body.ingredients ?? "",
          ...(body.originalPriceVnd ? { originalPriceVnd: body.originalPriceVnd } : {}),
          photo: {
            id: body.photoId,
            largePath: `/photos/${body.photoId}/1600.jpg`,
            smallPath: `/photos/${body.photoId}/400.jpg`,
          },
          hidden: Boolean(body.hidden),
          createdAt: now,
          updatedAt: now,
        };
        dishes.unshift(dish);
        json(response, 201, dish);
      }
    }
    return true;
  }
  const dishRoute = /^\/dishes\/([\w-]+)$/.exec(url.pathname);
  if (dishRoute) {
    const own = mine.find((store) => dishesFor(store).some((d) => d.id === dishRoute[1]));
    if (!own) {
      problem(response, 404, "OFFER_DISH_NOT_FOUND");
      return true;
    }
    const dishes = dishesFor(own);
    const dish = dishes.find((d) => d.id === dishRoute[1]);
    if (request.method === "DELETE") {
      dishes.splice(dishes.indexOf(dish), 1);
      response.writeHead(204).end();
    } else if (request.method === "PATCH") {
      const { photoId, ...body } = await readBody(request);
      Object.assign(dish, body, { updatedAt: new Date().toISOString() });
      // 0 takes the original price away.
      if (body.originalPriceVnd === 0) delete dish.originalPriceVnd;
      if (photoId) {
        dish.photo = {
          id: photoId,
          largePath: `/photos/${photoId}/1600.jpg`,
          smallPath: `/photos/${photoId}/400.jpg`,
        };
      }
      json(response, 200, dish);
    }
    return true;
  }
  const one = /^\/sellers\/([\w-]+)(\/offers)?$/.exec(url.pathname);
  if (request.method === "GET" && one) {
    const seller = mine.find((candidate) => candidate.id === one[1]);
    if (!seller) problem(response, 404, "SELLER_NOT_FOUND");
    else if (one[2]) {
      // A store named like the Figma sample has its posts; any other starts empty.
      json(response, 200, { offers: postsFor(seller) });
    } else json(response, 200, seller);
    return true;
  }
  if (request.method === "POST" && one?.[2]) {
    const seller = mine.find((candidate) => candidate.id === one[1]);
    if (!seller) {
      problem(response, 404, "SELLER_NOT_FOUND");
      return true;
    }
    const body = await readBody(request);
    if (body.priceVnd > Math.floor((body.originalPriceVnd * 80) / 100)) {
      problem(response, 422, "OFFER_DISCOUNT_TOO_SMALL");
    } else if (Date.parse(body.windowEnd) <= Date.now()) {
      problem(response, 422, "OFFER_WINDOW_INVALID");
    } else {
      const posted = postsFor(seller);
      const now = new Date().toISOString();
      const offer = {
        ...body,
        id: `of-new-${posted.length + 1}-${seller.id}`,
        sellerId: seller.id,
        status: "on_sale",
        description: body.description ?? "",
        unit: body.unit || "suất",
        unitsLeft: body.units,
        discountPercent: Math.floor(
          ((body.originalPriceVnd - body.priceVnd) * 100) / body.originalPriceVnd,
        ),
        photo: {
          id: body.photoId,
          largePath: `/photos/${body.photoId}/1600.jpg`,
          smallPath: `/photos/${body.photoId}/400.jpg`,
        },
        collectionPoint: { latitude: 21.0565, longitude: 105.8964, address: seller.address },
        createdAt: now,
        updatedAt: now,
      };
      posted.unshift(offer);
      json(response, 201, offer);
    }
    return true;
  }
  const change = /^\/offers\/([\w-]+)(\/withdraw)?$/.exec(url.pathname);
  if (change) {
    const offer = mine.flatMap((store) => postsFor(store)).find((post) => post.id === change[1]);
    if (!offer) {
      problem(response, 404, "OFFER_NOT_FOUND");
      return true;
    }
    const ordered = offer.units - offer.unitsLeft;
    if (request.method === "POST" && change[2]) {
      if (ordered > 0 || offer.status === "closed") {
        problem(response, 409, "OFFER_CHANGE_NOT_ALLOWED");
      } else {
        offer.status = "withdrawn";
        offer.withdrawnAt = new Date().toISOString();
        json(response, 200, offer);
      }
      return true;
    }
    if (request.method === "PATCH") {
      const body = await readBody(request);
      const priceOrHours = ["priceVnd", "originalPriceVnd", "windowStart", "windowEnd"].some(
        (key) => key in body,
      );
      if (ordered > 0 && priceOrHours) {
        problem(response, 409, "OFFER_CHANGE_NOT_ALLOWED");
      } else if (body.units !== undefined && body.units < ordered) {
        problem(response, 422, "OFFER_DETAILS_INVALID");
      } else if (
        body.priceVnd !== undefined &&
        body.priceVnd > Math.floor(((body.originalPriceVnd ?? offer.originalPriceVnd) * 80) / 100)
      ) {
        problem(response, 422, "OFFER_DISCOUNT_TOO_SMALL");
      } else {
        Object.assign(offer, body, { updatedAt: new Date().toISOString() });
        if (body.units !== undefined) offer.unitsLeft = body.units - ordered;
        if (offer.unitsLeft > 0 && offer.status === "sold_out") offer.status = "on_sale";
        json(response, 200, offer);
      }
      return true;
    }
  }
  if (request.method === "PUT") {
    const id = url.pathname.split("/")[2];
    const seller = mine.find((candidate) => candidate.id === id);
    if (!seller) {
      problem(response, 404, "SELLER_NOT_FOUND");
    } else {
      seller.photoId = (await readBody(request)).photoId;
      json(response, 200, seller);
    }
    return true;
  }
  return false;
}

// --- Admin: Tổng quan and Báo cáo (SEC-62, overview worktree) ---
// GET /admin/summary as api/openapi.yaml › AdminSummaryBody describes it, for the dashboard and the reports. The
// range defaults to the 30 days that end today in Vietnam, at most 90; every day of it is in the per-day series,
// its count made up from the day so a test can expect it. An admin only, as the backend answers.
function vietnamDay(date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(date);
}

function shiftDay(day, count) {
  const at = new Date(`${day}T00:00:00Z`);
  at.setUTCDate(at.getUTCDate() + count);
  return at.toISOString().slice(0, 10);
}

/** Posts on a day: 1 to 5, from its day of the month. */
function postsOn(day) {
  return (Number(day.slice(8)) % 5) + 1;
}

/**
 * The stores in each status at the end of a day, rebuilt as the backend's StatusPerDay does: a store counts from
 * the day it was opened, in the status it was opened in until its status changed and in its status now from
 * then; opened in its status now when it never changed, active when blocked now, pending when active or rejected
 * now.
 */
function sellersOnDay(stores, date) {
  const dayEnd = Date.parse(`${shiftDay(date, 1)}T00:00:00+07:00`);
  const opened = { blocked: "active", active: "pending", rejected: "pending" };
  const counts = { date, active: 0, pending: 0, rejected: 0, blocked: 0 };
  for (const store of stores) {
    if (Date.parse(store.createdAt) >= dayEnd) continue;
    const changed = store.statusChangedAt ? Date.parse(store.statusChangedAt) : undefined;
    const status =
      changed === undefined || changed < dayEnd
        ? store.status
        : (opened[store.status] ?? store.status);
    if (status in counts && status !== "date") counts[status] += 1;
  }
  return counts;
}

async function adminSummaryRoutes(request, response, url) {
  if (request.method !== "GET" || url.pathname !== "/admin/summary") return false;
  if (accounts.get(tokenOf(request))?.role !== "admin") {
    problem(response, 403, "PLATFORM_ADMIN_REQUIRED");
    return true;
  }
  const to = url.searchParams.get("to") ?? vietnamDay(new Date());
  const from = url.searchParams.get("from") ?? shiftDay(to, -29);
  const length = Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1;
  if (length < 1) {
    problem(response, 400, "OFFER_SUMMARY_RANGE_REVERSED");
    return true;
  }
  if (length > 90) {
    problem(response, 400, "OFFER_SUMMARY_RANGE_TOO_LONG");
    return true;
  }
  const stores = adminStores(tokenOf(request));
  const storesWith = (status) => stores.filter((seller) => seller.status === status).length;
  const days = Array.from({ length }, (_, index) => shiftDay(from, index));
  const postedPerDay = days.map((date) => ({ date, count: postsOn(date) }));
  const newPerDay = days.map((date) => ({ date, count: Number(date.slice(8)) % 3 }));
  const posted = postedPerDay.reduce((sum, day) => sum + day.count, 0);
  const at = (hour, minute) => `${to}T${String(hour).padStart(2, "0")}:${minute}:00+07:00`;
  json(response, 200, {
    from,
    to,
    sellers: {
      // The same stores the admin's list holds (Admin › Cửa hàng below), so the cards and the list agree.
      active: storesWith("active"),
      pending: storesWith("pending"),
      rejected: storesWith("rejected"),
      blocked: storesWith("blocked"),
      openedInRange: Math.min(length, 4),
      latest: [
        { id: "sl-rau-cu", name: "Rau củ sạch Việt Hưng", openedAt: at(8, "47") },
        { id: "sl-tra-sua", name: "Trà sữa Mây", openedAt: `${shiftDay(to, -2)}T09:30:00+07:00` },
      ],
      perDay: days.map((date) => sellersOnDay(stores, date)),
    },
    offers: {
      postedInRange: posted,
      unitsPostedInRange: posted * 6,
      onSaleNow: 12,
      soldOutNow: 3,
      postedPerDay,
      topSellers: [
        { sellerId: "sl-banh-phap", name: "Tiệm bánh Pháp", offers: Math.ceil(posted / 3) },
        { sellerId: "sl-com-hanh", name: "Cơm nhà Hạnh", offers: Math.ceil(posted / 5) },
        { sellerId: "sl-banh-mi", name: "Bánh mì Hội An", offers: Math.ceil(posted / 8) },
      ],
      latest: [
        {
          id: "of-com-trua",
          name: "Cơm trưa văn phòng",
          postedAt: at(10, "15"),
          sellerId: "sl-com-hanh",
          sellerName: "Cơm nhà Hạnh",
        },
        {
          id: "of-banh-sung-bo",
          name: "Bánh sừng bò",
          postedAt: at(7, "05"),
          sellerId: "sl-banh-phap",
          sellerName: "Tiệm bánh Pháp",
        },
      ],
    },
    accounts: {
      total: 284,
      newInRange: newPerDay.reduce((sum, day) => sum + day.count, 0),
      newPerDay,
    },
  });
  return true;
}
// --- end Admin: Tổng quan and Báo cáo ---
// Admin settings (SEC-62, the settings screens): GET and PUT /admin/offer-settings, as the offer module answers
// them; the email settings are SEC-75's (emailSettingsRoutes). Each admin has settings of their own, so tests
// running side by side do not change each other's. A minimum discount of 77 stands for a value the backend refuses
// at a field; the checks the module makes (settings.go) are made here too. A read
// answers the settings' version in ETag and a save must send it back in If-Match, or is refused with 412 and
// changes nothing (platform/version.go, SEC-75).
const offerSettingsOf = new Map();

/** The version of settings changed at updatedAt, as platform.ETag writes it: microseconds, quoted. */
function versionOf(updatedAt) {
  return `"${Date.parse(updatedAt) * 1000}"`;
}

/** Whether a save names the version it read; refuses it with 412 when it does not. */
function sameVersion(request, response, updatedAt) {
  if (request.headers["if-match"] === versionOf(updatedAt)) return true;
  problem(response, 412, "PLATFORM_CHANGED_SINCE_READ");
  return false;
}

function refusedAt(response, code, pointers) {
  const language = requestLanguage.getStore() ?? "vi";
  const detail = failureWords.get(code)?.[language];
  response.writeHead(400, {
    "content-type": "application/problem+json",
    "content-language": language,
    vary: "Accept-Language",
  });
  response.end(
    JSON.stringify({
      type: `urn:secondbite:failure:${code.toLowerCase().replaceAll("_", "-")}`,
      status: 400,
      detail,
      code,
      requestId: "STUB",
      errors: pointers.map((pointer) => ({ pointer, code, detail })),
    }),
  );
}

async function adminSettingsRoutes(request, response, url) {
  if (url.pathname !== "/admin/offer-settings") return false;
  const account = accounts.get(tokenOf(request));
  if (!account) {
    problem(response, 401, "IDENTITY_SESSION_INVALID");
    return true;
  }
  if (account.role !== "admin") {
    problem(response, 403, "PLATFORM_ADMIN_REQUIRED");
    return true;
  }

  if (url.pathname === "/admin/offer-settings") {
    if (!offerSettingsOf.has(account.email)) {
      offerSettingsOf.set(account.email, {
        minDiscountPercent: 20,
        windowMinMinutes: 30,
        windowMaxMinutes: 360,
        startsWithinHours: 24,
        defaultRadiusKm: 5,
        maxRadiusKm: 30,
        updatedAt: "2026-10-18T02:15:00Z",
        updatedBy: "ac-stub",
      });
    }
    if (request.method === "PUT") {
      if (!sameVersion(request, response, offerSettingsOf.get(account.email).updatedAt))
        return true;
      const body = await readBody(request);
      if (body.minDiscountPercent === 77) {
        refusedAt(response, "OFFER_SETTINGS_INVALID", ["#/minDiscountPercent"]);
        return true;
      }
      const valid =
        body.minDiscountPercent >= 0 &&
        body.minDiscountPercent <= 90 &&
        body.defaultRadiusKm >= 1 &&
        body.maxRadiusKm >= body.defaultRadiusKm &&
        body.maxRadiusKm <= 100 &&
        body.windowMinMinutes >= 15 &&
        body.windowMaxMinutes >= body.windowMinMinutes &&
        body.windowMaxMinutes <= 1440 &&
        body.startsWithinHours >= 1 &&
        body.startsWithinHours <= 72;
      if (!valid) {
        refusedAt(response, "OFFER_SETTINGS_INVALID", []);
        return true;
      }
      offerSettingsOf.set(account.email, {
        ...body,
        updatedAt: new Date().toISOString(),
        updatedBy: "ac-stub",
      });
    }
    const settings = offerSettingsOf.get(account.email);
    json(response, 200, settings, { etag: versionOf(settings.updatedAt) });
    return true;
  }
  return false;
}
// --- Admin settings: Quản trị viên (SEC-62) ---
// GET /admin/admins, POST /admin/admins and POST /admin/admins/{accountId}/revoke, as the identity module answers
// them (identity/admins.go). Each admin session has its own list, the viewer first, so tests running side by side
// do not change each other's. An address starting with "chua." has never signed in with a code
// (409 IDENTITY_ADDRESS_UNPROVEN); the viewer cannot revoke themselves, nor anyone the last admin.
const adminsOf = new Map();

function adminsFor(account) {
  if (!adminsOf.has(account.email)) {
    adminsOf.set(account.email, [
      account,
      { id: "ac-admin-1", email: "quantri@example.com", displayName: "", role: "admin" },
      { id: "ac-admin-2", email: "ngocmai@example.com", displayName: "Ngọc Mai", role: "admin" },
    ]);
  }
  return adminsOf.get(account.email);
}

async function adminAdminsRoutes(request, response, url) {
  const revoke = /^\/admin\/admins\/([\w-]+)\/revoke$/.exec(url.pathname);
  if (url.pathname !== "/admin/admins" && !revoke) return false;
  const account = accounts.get(tokenOf(request));
  if (!account) {
    problem(response, 401, "IDENTITY_SESSION_INVALID");
    return true;
  }
  if (account.role !== "admin") {
    problem(response, 403, "PLATFORM_ADMIN_REQUIRED");
    return true;
  }
  const admins = adminsFor(account);

  if (revoke && request.method === "POST") {
    const target = admins.find((each) => each.id === revoke[1]);
    if (!target) problem(response, 404, "IDENTITY_ACCOUNT_NOT_FOUND");
    else if (target.id === account.id) problem(response, 409, "IDENTITY_ADMIN_SELF");
    else if (admins.length === 1) problem(response, 409, "IDENTITY_LAST_ADMIN");
    else {
      admins.splice(admins.indexOf(target), 1);
      json(response, 200, { ...target, role: "customer" });
    }
    return true;
  }
  if (revoke) return false;
  if (request.method === "GET") {
    json(response, 200, {
      admins: admins.toSorted((a, b) => a.email.localeCompare(b.email)),
    });
    return true;
  }
  if (request.method === "POST") {
    const { email } = await readBody(request);
    const address = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
      problem(response, 422, "IDENTITY_EMAIL_INVALID");
    } else if (address.startsWith("chua.")) {
      problem(response, 409, "IDENTITY_ADDRESS_UNPROVEN");
    } else {
      let granted = admins.find((each) => each.email === address);
      if (!granted) {
        granted = {
          id: `ac-${Buffer.from(address).toString("hex").slice(0, 24)}`,
          email: address,
          displayName: "",
          role: "admin",
        };
        admins.push(granted);
      }
      json(response, 200, granted);
    }
    return true;
  }
  return false;
}
// --- end Admin settings: Quản trị viên ---
// ── Admin › Cửa hàng (SEC-62, the stores screens) ──────────────────────────────────────────────────────────
// What an admin reads and does with stores, as api/openapi.yaml describes it: GET /admin/sellers by status and
// words, a page at a time, POST /admin/sellers/{id}/approve, /reject and /block, the last two with a reason (GET
// /admin/summary above counts these stores), and a
// store's page as an admin reads it (GET /sellers/{id}, /members, /offers, GET /offers/{id}). Each admin
// session has its own copy of the stores below, so tests running side by side do not change each other's.
// Names, phone numbers (0900 000 1xx) and addresses are made up, after Figma AD-Q1. An admin address with
// ".trong." has no stores, one with ".loi." gets a failing list, and one with ".cham." a list that is slow.
const adminStoresOf = new Map();

function adminStores(token) {
  // A new sign-in starts from the same stores again, so a test run after another finds them as they were.
  const account = accounts.get(token);
  if (adminStoresOf.get(token)?.account !== account) {
    const email = account?.email ?? "";
    const daysAgo = (days, hour = 10) => {
      const at = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      at.setUTCHours(hour - 7, 0, 0, 0);
      return at.toISOString();
    };
    const store = (n, name, address, status, changed, photoId) => ({
      id: `se-admin-${n}`,
      name,
      address,
      phone: `0900 000 ${String(100 + n)}`,
      latitude: 21.0565,
      longitude: 105.8964,
      status,
      ...(photoId ? { photoId } : {}),
      ...(status === "active" ? {} : { statusChangedAt: daysAgo(changed, 21) }),
      createdAt: daysAgo(20 + n),
      updatedAt: daysAgo(changed, 10 + (n % 8)),
    });
    adminStoresOf.set(token, {
      account,
      stores: email.includes(".trong.")
        ? []
        : [
            store(
              1,
              "Tiệm bánh Pháp",
              "Tầng 1, Tasco Mall, Việt Hưng",
              "active",
              0,
              "ph-croissant",
            ),
            store(
              2,
              "Cơm nhà Hạnh",
              "Tầng 3, khu ẩm thực, Tasco Mall",
              "active",
              0,
              "ph-com-thit-kho",
            ),
            store(3, "Trà sữa Mây", "Tầng 1, Tasco Mall, Việt Hưng", "active", 0, "ph-tra-sua"),
            store(
              4,
              "Bún chả Phố Hàng",
              "Tầng 3, khu ẩm thực, Tasco Mall",
              "active",
              1,
              "ph-banh-bao",
            ),
            store(5, "Xôi xéo Bà Tư", "Tầng B1, Tasco Mall", "active", 1, "ph-pizza"),
            store(6, "Bánh mì Hội An", "Tầng 1, Tasco Mall, Việt Hưng", "active", 2, "ph-banh-mi"),
            store(7, "Nước ép Xanh", "Tầng 2, Tasco Mall", "active", 2, "ph-bac-xiu"),
            store(8, "Rau củ sạch Việt Hưng", "Tầng B1, Tasco Mall", "active", 3),
            store(9, "Há cảo Panda", "Tầng 3, khu ẩm thực, Tasco Mall", "active", 4, "ph-ha-cao"),
            store(10, "Gà rán Tasco", "Tầng 2, Tasco Mall", "active", 5, "ph-combo-nhom"),
            store(
              11,
              "Bánh ngọt Eclair",
              "Tầng 1, Tasco Mall, Việt Hưng",
              "active",
              6,
              "ph-eclair",
            ),
            store(12, "Phở bò Gánh", "Tầng 3, khu ẩm thực, Tasco Mall", "pending", 10),
            store(13, "Cơm tấm Sài Gòn", "Tầng 3, khu ẩm thực, Tasco Mall", "pending", 12),
            {
              ...store(14, "Chè Thái Lan", "Tầng 2, Tasco Mall", "blocked", 1, "ph-tra-sua"),
              statusReason: "Bán chè đã quá hạn sử dụng cho khách.",
            },
            {
              ...store(15, "Bánh cuốn Thanh Trì", "Tầng B1, Tasco Mall", "rejected", 3),
              statusReason: "Ảnh cửa hàng chưa phải ảnh quầy tại Tasco Mall.",
            },
          ],
    });
  }
  return adminStoresOf.get(token).stores;
}

/** The people of a store an admin opens: its owner, and a staff member for the first one. */
function adminMembers(seller) {
  const addedAt = seller.createdAt;
  const owner = {
    accountId: `ac-owner-${seller.id}`,
    email: "chu.cua.hang@example.com",
    role: "owner",
    addedAt,
  };
  return seller.id === "se-admin-1"
    ? [owner, { accountId: "ac-staff-1", email: "nhan.vien@example.com", role: "staff", addedAt }]
    : [owner];
}

/** A store's posts as an admin reads them: the Figma sample's four for the first store, none for the others. */
function adminPosts(seller) {
  return seller.id === "se-admin-1" ? postsFor(seller) : [];
}

async function adminSellerRoutes(request, response, url) {
  const isAdminRoute = url.pathname.startsWith("/admin/sellers");
  const isStoreRead =
    request.method === "GET" &&
    (/^\/sellers\/se-admin-[\w-]+(\/members|\/offers)?$/.test(url.pathname) ||
      /^\/offers\/of-\d+-se-admin-[\w-]+$/.test(url.pathname));
  if (!isAdminRoute && !isStoreRead) return false;
  const token = tokenOf(request);
  const account = accounts.get(token);
  if (!account) {
    problem(response, 401, "PLATFORM_AUTHENTICATION_REQUIRED");
    return true;
  }
  if (account.role !== "admin") {
    if (isAdminRoute) problem(response, 403, "PLATFORM_ADMIN_REQUIRED");
    else
      problem(
        response,
        404,
        url.pathname.startsWith("/offers") ? "OFFER_NOT_FOUND" : "SELLER_NOT_FOUND",
      );
    return true;
  }
  const stores = adminStores(token);
  if (request.method === "GET" && url.pathname === "/admin/sellers") {
    if (account.email.includes(".loi.")) {
      problem(response, 500, "PLATFORM_INTERNAL_FAILURE");
      return true;
    }
    if (account.email.includes(".cham.")) await new Promise((resolve) => setTimeout(resolve, 3000));
    // `status` comes once per value or as one comma-separated value; every status when absent.
    const statuses = url.searchParams.getAll("status").flatMap((value) => value.split(","));
    const words = fold((url.searchParams.get("q") ?? "").trim().toLowerCase());
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 25);
    const known = ["pending", "active", "rejected", "blocked"];
    if (
      statuses.some((status) => !known.includes(status)) ||
      words.length > 100 ||
      !(page >= 1) ||
      !(size >= 1 && size <= 100)
    ) {
      problem(response, 400, "SELLER_LIST_INVALID");
      return true;
    }
    // The pending ones first, the oldest first; then the latest change first.
    const matched = stores
      .filter((seller) => statuses.length === 0 || statuses.includes(seller.status))
      .filter(
        (seller) =>
          !words ||
          [seller.name, seller.address, seller.phone].some((text) =>
            fold(text.toLowerCase()).includes(words),
          ),
      )
      .toSorted((a, b) => {
        const pending = Number(b.status === "pending") - Number(a.status === "pending");
        if (pending) return pending;
        if (a.status === "pending") return Date.parse(a.createdAt) - Date.parse(b.createdAt);
        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      });
    const items = matched
      .slice((page - 1) * size, page * size)
      .map((seller) => ({ ...seller, ownerEmail: "chu.cua.hang@example.com" }));
    json(response, 200, { items, page, pageSize: size, total: matched.length });
    return true;
  }
  const change = /^\/admin\/sellers\/([\w-]+)\/(approve|reject|block)$/.exec(url.pathname);
  if (request.method === "POST" && change) {
    const seller = stores.find((candidate) => candidate.id === change[1]);
    if (!seller) {
      problem(response, 404, "SELLER_NOT_FOUND");
      return true;
    }
    const [, , action] = change;
    const from = {
      approve: ["pending", "rejected", "blocked"],
      reject: ["pending"],
      block: ["active"],
    };
    if (!from[action].includes(seller.status)) {
      problem(response, 409, "SELLER_STATUS_CHANGE_NOT_ALLOWED");
      return true;
    }
    let reason;
    if (action !== "approve") {
      reason = String((await readBody(request)).reason ?? "").trim();
      if (reason.length < 10 || reason.length > 500) {
        problem(response, 400, "SELLER_REASON_INVALID");
        return true;
      }
    }
    const now = new Date().toISOString();
    const status = { approve: "active", reject: "rejected", block: "blocked" }[action];
    Object.assign(seller, { status, statusChangedAt: now, updatedAt: now });
    if (reason) seller.statusReason = reason;
    else delete seller.statusReason;
    json(response, 200, seller);
    return true;
  }
  const read = /^\/sellers\/([\w-]+)(\/members|\/offers)?$/.exec(url.pathname);
  if (read) {
    const seller = stores.find((candidate) => candidate.id === read[1]);
    if (!seller) problem(response, 404, "SELLER_NOT_FOUND");
    else if (read[2] === "/members") json(response, 200, { members: adminMembers(seller) });
    else if (read[2] === "/offers") {
      const status = url.searchParams.get("status");
      json(response, 200, {
        offers: adminPosts(seller).filter((offer) => !status || offer.status === status),
      });
    } else json(response, 200, seller);
    return true;
  }
  const offerId = url.pathname.split("/")[2];
  const offer = stores.flatMap(adminPosts).find((post) => post.id === offerId);
  if (offer) json(response, 200, offer);
  else problem(response, 404, "OFFER_NOT_FOUND");
  return true;
}
// ── end of Admin › Cửa hàng ──────────────────────────────────────────────────────────────────────────────
// Orders (SEC-15, SEC-76), as api/openapi.yaml describes them: placed with a name, a phone number and an
// Idempotency-Key, signed in or not; read and cancelled until the window opens by the account that placed them
// or with the access answered to whoever placed them; listed for the account. The stub takes no units away,
// so the home's tests keep their counts.
const orders = [];
const ordersByKey = new Map();
let nextOrder = 10001;
const PHONE = /^0[0-9]{9}$/;

function offerById(id) {
  return [...offers, laterOffer].find((offer) => offer.id === id);
}

function shown(order) {
  const open = order.status === "confirmed" || order.status === "ready";
  const expired = open && new Date(order.windowEnd) <= new Date();
  const status = expired ? "expired" : order.status;
  const { owner: _owner, ...rest } = order;
  return { ...rest, status };
}

/** Whether the request comes from whoever placed the order: its account, or its access. */
function placedBy(request, account, order) {
  return (
    (account && order.owner === account.email) || request.headers["order-access"] === order.access
  );
}

async function ordersApi(request, response, url) {
  const offerMatch = /^\/offers\/([\w-]+)$/.exec(url.pathname);
  if (request.method === "GET" && offerMatch) {
    const offer = offerById(offerMatch[1]);
    if (!offer) problem(response, 404, "OFFER_NOT_FOUND");
    else {
      const { seller: _seller, ...body } = offer;
      json(response, 200, body);
    }
    return true;
  }
  if (!url.pathname.startsWith("/orders")) return false;
  const account = accounts.get(tokenOf(request));

  if (request.method === "POST" && url.pathname === "/orders") {
    const { lines, name, phone, checkoutId } = await readBody(request);
    const contact = {
      name: typeof name === "string" ? name.trim() : "",
      phone: typeof phone === "string" ? phone.replace(/[\s.-]/g, "").replace(/^\+84/, "0") : "",
    };
    if (!contact.name || contact.name.length > 50 || !PHONE.test(contact.phone)) {
      problem(response, 400, "ORDER_CONTACT_INVALID");
      return true;
    }
    const key = `${account?.email ?? contact.phone} ${request.headers["idempotency-key"] ?? ""}`;
    const earlier = ordersByKey.get(key);
    if (earlier) {
      json(response, 201, shown(earlier));
      return true;
    }
    const wanted = (Array.isArray(lines) ? lines : []).map((line) => ({
      ...line,
      offer: offerById(line.offerId),
    }));
    if (wanted.length === 0 || wanted.some(({ offer }) => !offer || offer.status !== "on_sale")) {
      problem(response, 409, "ORDER_OFFER_UNAVAILABLE");
      return true;
    }
    if (wanted.some(({ units, offer }) => units > offer.unitsLeft)) {
      problem(response, 409, "ORDER_OFFER_SOLD_OUT");
      return true;
    }
    const { offer } = wanted[0];
    const number = nextOrder++;
    const order = {
      id: randomUUID(),
      number: `SB-${number}`,
      owner: account?.email,
      checkoutId: typeof checkoutId === "string" && checkoutId ? checkoutId : randomUUID(),
      access: randomUUID().replaceAll("-", ""),
      customerName: contact.name,
      customerPhone: contact.phone,
      status: "confirmed",
      seller: {
        id: offer.seller.id,
        name: offer.seller.name,
        address: offer.seller.address,
        latitude: 21.0565,
        longitude: 105.8964,
      },
      lines: wanted.map(({ units, offer: each }) => ({
        offerId: each.id,
        name: each.name,
        unit: each.unit,
        priceVnd: each.priceVnd,
        originalPriceVnd: each.originalPriceVnd,
        units,
        photo: each.photo,
      })),
      totalVnd: wanted.reduce((sum, { units, offer: each }) => sum + each.priceVnd * units, 0),
      windowStart: offer.windowStart,
      windowEnd: offer.windowEnd,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(order);
    ordersByKey.set(key, order);
    json(response, 201, shown(order));
    return true;
  }
  if (request.method === "GET" && url.pathname === "/orders") {
    if (!account) {
      problem(response, 401, "PLATFORM_AUTHENTICATION_REQUIRED");
      return true;
    }
    const state = url.searchParams.get("state");
    const checkout = url.searchParams.get("checkout");
    const all = orders
      .filter(
        (order) => order.owner === account.email && (!checkout || order.checkoutId === checkout),
      )
      .map(shown);
    const open = (order) => order.status === "confirmed" || order.status === "ready";
    json(response, 200, {
      orders: all.filter((order) => !state || (state === "open" ? open(order) : !open(order))),
    });
    return true;
  }
  const orderMatch = /^\/orders\/([\w-]+)(\/cancel)?$/.exec(url.pathname);
  const order = orderMatch
    ? orders.find((found) => found.id === orderMatch[1] && placedBy(request, account, found))
    : undefined;
  if (orderMatch && !order) {
    problem(response, 404, "ORDER_NOT_FOUND");
    return true;
  }
  if (request.method === "GET" && orderMatch && !orderMatch[2]) {
    json(response, 200, shown(order));
    return true;
  }
  if (request.method === "POST" && orderMatch?.[2]) {
    const status = shown(order).status;
    if (
      (status !== "confirmed" && status !== "ready") ||
      new Date(order.windowStart) <= new Date()
    ) {
      problem(response, 409, "ORDER_CANCEL_TOO_LATE");
      return true;
    }
    const { reason } = await readBody(request);
    order.status = "cancelled";
    order.cancelledAt = new Date().toISOString();
    if (typeof reason === "string" && reason) order.cancelReason = reason;
    json(response, 200, shown(order));
    return true;
  }
  return false;
}

const server = createServer((request, response) =>
  requestLanguage.run(languageOf(request.headers["accept-language"]), () =>
    answer(request, response),
  ),
);

// The admin's pages (SEC-75): the admins, and the log of what they did, as api/openapi.yaml describes it.
// The log is made up from the stores above: a week of approvals, blocks and setting changes by two admins,
// the latest first, filtered and paged as the server does.
const stubAdmins = [
  { id: "ac-admin-minh", email: "minh.admin@example.com", displayName: "", role: "admin" },
  { id: "ac-admin-thu", email: "thu.admin@example.com", displayName: "", role: "admin" },
];

function auditLog() {
  const stores = Object.values(sellers);
  const events = [];
  const start = Date.parse("2026-10-20T21:30:00+07:00");
  for (let i = 0; i < 30; i++) {
    const store = stores[i % stores.length];
    const admin = stubAdmins[i % 2];
    const occurredAt = new Date(start - i * 5 * 60 * 60 * 1000).toISOString();
    const base = {
      id: `ev-${String(i).padStart(2, "0")}`,
      occurredAt,
      actorId: admin.id,
      actorLabel: admin.email,
    };
    if (i === 1) {
      events.push({
        ...base,
        action: "offer_settings.change",
        resourceType: "offer_settings",
        resourceId: "current",
        details: { changes: [{ field: "minDiscountPercent", from: "20", to: "30" }] },
      });
    } else if (i === 4) {
      events.push({
        ...base,
        action: "email_settings.change",
        resourceType: "email_settings",
        resourceId: "current",
        details: {
          provider: "smtp",
          changes: [
            { field: "senderName", from: "Second Bite", to: "Second Bite Tasco" },
            { field: "smtpPassword" },
          ],
        },
      });
    } else if (i === 7) {
      events.push({
        ...base,
        actorId: undefined,
        actorLabel: undefined,
        action: "admin.grant",
        resourceType: "account",
        resourceId: "ac-admin-thu",
        resourceLabel: "thu.admin@example.com",
        details: { source: "command_line" },
      });
    } else {
      const [action, details] =
        i % 3 === 0
          ? ["seller.block", { reason: "Bán đồ quá hạn nhiều lần, khách đã báo" }]
          : i % 3 === 1
            ? ["seller.unblock", {}]
            : ["seller.approve", {}];
      events.push({
        ...base,
        action,
        resourceType: "seller",
        resourceId: store.id,
        resourceLabel: store.name,
        details,
      });
    }
  }
  return events;
}

function adminRoutes(request, response, url) {
  if (!url.pathname.startsWith("/admin/")) return false;
  const account = accounts.get(tokenOf(request));
  if (!account) {
    problem(response, 401, "PLATFORM_AUTHENTICATION_REQUIRED");
    return true;
  }
  if (account.role !== "admin") {
    problem(response, 403, "PLATFORM_ADMIN_REQUIRED");
    return true;
  }
  if (request.method === "GET" && url.pathname === "/admin/admins") {
    json(response, 200, { admins: stubAdmins });
    return true;
  }
  if (request.method === "GET" && url.pathname === "/admin/audit-events") {
    const actions = url.searchParams.getAll("action").flatMap((a) => a.split(","));
    const actor = url.searchParams.get("actorId");
    const since = url.searchParams.get("since");
    const until = url.searchParams.get("until");
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const size = Number(url.searchParams.get("size") ?? 25);
    const matching = auditLog().filter(
      (e) =>
        (actions.length === 0 || actions.includes(e.action)) &&
        (!actor || e.actorId === actor) &&
        (!since || Date.parse(e.occurredAt) >= Date.parse(since)) &&
        (!until || Date.parse(e.occurredAt) < Date.parse(until)) &&
        (!q ||
          (e.actorLabel ?? "").toLowerCase().includes(q) ||
          (e.resourceLabel ?? "").toLowerCase().includes(q) ||
          e.resourceId === q),
    );
    json(response, 200, {
      items: matching.slice((page - 1) * size, page * size),
      page,
      pageSize: size,
      total: matching.length,
    });
    return true;
  }
  return false;
}

// The email settings, one per admin so tests side by side keep apart. An admin whose address names "unset"
// starts with none saved (Figma AD-CS6); the others with SMTP saved (AD-E1). The version is the time saved.
const emailSettings = new Map();

function emailSettingsOf(account) {
  if (!emailSettings.has(account.email)) {
    emailSettings.set(
      account.email,
      account.email.includes("unset")
        ? undefined
        : {
            provider: "smtp",
            senderAddress: "noreply@example.com",
            senderName: "Second Bite",
            smtpHost: "smtp.example.com",
            smtpPort: 587,
            smtpSecurity: "starttls",
            smtpUsername: "mailer@example.com",
            smtpPasswordSet: true,
            brevoApiKeySet: false,
            updatedAt: "2026-10-19T07:20:00.000Z",
          },
    );
  }
  return emailSettings.get(account.email);
}

const etagOf = (settings) => `"${settings.updatedAt}"`;

async function emailSettingsRoutes(request, response, url) {
  if (!url.pathname.startsWith("/admin/email-settings")) return false;
  const account = accounts.get(tokenOf(request));
  if (account?.role !== "admin") return false;
  const current = emailSettingsOf(account);

  if (request.method === "GET" && url.pathname === "/admin/email-settings") {
    if (!current) problem(response, 503, "NOTIFICATION_EMAIL_NOT_CONFIGURED");
    else json(response, 200, current, { etag: etagOf(current) });
    return true;
  }
  if (request.method === "PUT" && url.pathname === "/admin/email-settings") {
    const ifMatch = request.headers["if-match"];
    const ifNoneMatch = request.headers["if-none-match"];
    if (!ifMatch && ifNoneMatch !== "*") {
      problem(response, 400, "PLATFORM_VERSION_REQUIRED");
      return true;
    }
    if (
      (ifMatch && (!current || ifMatch !== etagOf(current))) ||
      (ifNoneMatch === "*" && current)
    ) {
      problem(response, 412, "PLATFORM_CHANGED_SINCE_READ");
      return true;
    }
    const body = await readBody(request);
    const sameServer =
      current &&
      current.smtpHost === (body.smtpHost ?? "") &&
      current.smtpPort === (body.smtpPort ?? 0) &&
      current.smtpSecurity === (body.smtpSecurity ?? "starttls") &&
      current.smtpUsername === (body.smtpUsername ?? "");
    emailSettings.set(account.email, {
      provider: body.provider,
      senderAddress: body.senderAddress,
      senderName: body.senderName,
      smtpHost: body.smtpHost ?? "",
      smtpPort: body.smtpPort ?? 0,
      smtpSecurity: body.smtpSecurity ?? "starttls",
      smtpUsername: body.smtpUsername ?? "",
      smtpPasswordSet: Boolean(body.smtpPassword) || Boolean(sameServer && current.smtpPasswordSet),
      brevoApiKeySet: Boolean(body.brevoApiKey) || Boolean(current?.brevoApiKeySet),
      updatedAt: new Date().toISOString(),
    });
    response.writeHead(204).end();
    return true;
  }
  if (request.method === "POST" && url.pathname === "/admin/email-settings/test") {
    const { to } = await readBody(request);
    if (!current) problem(response, 503, "NOTIFICATION_EMAIL_NOT_CONFIGURED");
    // A mailbox whose address names "refused" stands for a provider that refuses the settings.
    else if ((to ?? "").includes("refused"))
      problem(response, 409, "NOTIFICATION_TEST_EMAIL_REFUSED");
    else response.writeHead(204).end();
    return true;
  }
  return false;
}

async function answer(request, response) {
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);
  if (url.pathname === "/health") {
    response.writeHead(204).end();
    return;
  }
  // A search for this word stands for a server that fails, for the error screen's test.
  if (url.pathname === "/offers" && url.searchParams.get("q") === "loi-may-chu") {
    problem(response, 500, "PLATFORM_INTERNAL_FAILURE");
    return;
  }
  if (request.method === "GET" && url.pathname === "/offers") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ offers: search(url) }));
    return;
  }
  // GET /offers/{id} answers OfferBody: the offer without its seller or distance.
  const offerMatch = /^\/offers\/([\w-]+)$/.exec(url.pathname);
  if (request.method === "GET" && offerMatch) {
    const found = offers.find((offer) => offer.id === offerMatch[1]);
    if (!found) return problem(response, 404, "OFFER_NOT_FOUND");
    const { seller: _seller, ...offer } = found;
    return json(response, 200, offer);
  }
  if (await auth(request, response, url)) return;
  if (await adminSellerRoutes(request, response, url)) return;
  if (await sellerRoutes(request, response, url)) return;
  if (await adminSummaryRoutes(request, response, url)) return;
  if (await adminSettingsRoutes(request, response, url)) return;
  if (await adminAdminsRoutes(request, response, url)) return;
  if (await emailSettingsRoutes(request, response, url)) return;
  if (adminRoutes(request, response, url)) return;
  if (await ordersApi(request, response, url)) return;
  const photoMatch = /^\/photos\/([\w-]+)\/(400|1600)\.jpg$/.exec(url.pathname);
  if (request.method === "GET" && photoMatch) {
    const { type, body } = await photo(photoMatch[1]);
    response.writeHead(200, { "content-type": type });
    response.end(body);
    return;
  }
  problem(response, 404, "PLATFORM_ROUTE_NOT_FOUND");
}

server.listen(port, () => console.log(`Stub backend on http://localhost:${port}`));
