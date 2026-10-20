// What the web asks the Go server, answered for the browser tests and for local work on screens whose
// endpoint is not built yet (`pnpm stub:backend`, then SECONDBITE_API_ORIGIN=http://localhost:3190).
// GET /offers answers as api/openapi.yaml describes it, with real shops of Tasco Mall and dishes from their menus;
// tonight's prices and windows are made up. Adapted from BeyondPilot's
// web/tests/e2e/stub-backend.mjs.
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.STUB_BACKEND_PORT ?? 3190);

/** Today at hh:mm in Vietnam time, as RFC 3339 with its offset. */
function tonight(hour, minute) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  return `${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;
}

/** An offer as `GET /offers` answers (api/openapi.yaml › FoundBody), at Tasco Mall. */
function sample({ id, name, kind, price, originalPrice, unitsLeft, unit, from, until, seller }) {
  const status = unitsLeft > 0 ? "on_sale" : "sold_out";
  const photo = `ph-${id.slice(3)}`;
  return {
    id,
    sellerId: seller.id,
    status,
    name,
    description: "",
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

const sellers = {
  laParis: { id: "se-la-paris", name: "La Paris", address: "Tầng 1" },
  pandaChef: { id: "se-panda-chef", name: "Panda Chef", address: "Tầng 3" },
  netHue: { id: "se-net-hue", name: "Nét Huế", address: "Tầng 3" },
  phucLong: { id: "se-phuc-long", name: "Phúc Long", address: "Tầng 1" },
  highlands: { id: "se-highlands", name: "Highlands Coffee", address: "Tầng 1" },
  kfc: { id: "se-kfc", name: "KFC", address: "Tầng hầm" },
  pizzaHut: { id: "se-pizza-hut", name: "Pizza Hut", address: "Tầng 3" },
};

// Dishes from the shops' menus at Tasco Mall, at their menu price, with tonight's price and window made up.
const offers = [
  sample({
    id: "of-croissant",
    name: "Bánh Croissant Truyền Thống",
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
    name: "Bánh Mì Mềm Chà Bông",
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
];

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
};
const imageTypes = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

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
  const maxPrice = url.searchParams.get("maxPrice");
  const found = offers.filter(
    (offer) =>
      (!q || fold(offer.name).includes(fold(q)) || fold(offer.seller.name).includes(fold(q))) &&
      (!kind || kind.split(",").includes(offer.kind)) &&
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
  response.writeHead(status, { "content-type": "application/problem+json" });
  response.end(
    JSON.stringify({
      type: `urn:secondbite:failure:${code.toLowerCase()}`,
      status,
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
    const account = { id: "ac-stub", email, displayName: "", role: "customer" };
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
  return false;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);
  if (url.pathname === "/health") {
    response.writeHead(204).end();
    return;
  }
  // A search for this word stands for a server that fails, for the error screen's test.
  if (url.pathname === "/offers" && url.searchParams.get("q") === "loi-may-chu") {
    response.writeHead(500, { "content-type": "application/problem+json" });
    response.end(
      JSON.stringify({
        type: "urn:secondbite:failure:platform-internal-failure",
        title: "Internal Server Error",
        status: 500,
        code: "PLATFORM_INTERNAL_FAILURE",
        requestId: "STUB",
      }),
    );
    return;
  }
  if (request.method === "GET" && url.pathname === "/offers") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ offers: search(url) }));
    return;
  }
  if (await auth(request, response, url)) return;
  const photoMatch = /^\/photos\/([\w-]+)\/(400|1600)\.jpg$/.exec(url.pathname);
  if (request.method === "GET" && photoMatch) {
    const { type, body } = await photo(photoMatch[1]);
    response.writeHead(200, { "content-type": type });
    response.end(body);
    return;
  }
  response.writeHead(404, { "content-type": "application/problem+json" });
  response.end(
    JSON.stringify({
      type: "urn:secondbite:failure:platform-route-not-found",
      title: "Not Found",
      status: 404,
      code: "PLATFORM_ROUTE_NOT_FOUND",
      requestId: "STUB",
    }),
  );
});

server.listen(port, () => console.log(`Stub backend on http://localhost:${port}`));
