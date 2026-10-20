// What the web asks the Go server, answered for the browser tests and for local work on screens whose
// endpoint is not built yet (`pnpm stub:backend`, then SECONDBITE_API_ORIGIN=http://localhost:3190).
// GET /offers answers as api/openapi.yaml describes it; the sellers and dishes are sample kinds of food from Tasco
// Mall, labelled as samples (docs/guidelines/figma.md › Content). Adapted from BeyondPilot's
// web/tests/e2e/stub-backend.mjs.
import { createServer } from "node:http";

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
  bakery: { id: "se-bakery", name: "Tiệm bánh Pháp", address: "Tầng 1" },
  rice: { id: "se-rice", name: "Quầy cơm", address: "Tầng hầm" },
  deli: { id: "se-deli", name: "Quầy deli siêu thị", address: "Tầng hầm" },
};

const offers = [
  sample({
    id: "of-bread",
    name: "Túi bánh mì và croissant, 4 chiếc",
    kind: "bakery",
    price: 39000,
    originalPrice: 95000,
    unitsLeft: 3,
    unit: "túi",
    from: tonight(21, 0),
    until: tonight(21, 45),
    seller: sellers.bakery,
  }),
  sample({
    id: "of-com-tam",
    name: "Cơm sườn nướng, 1 suất",
    kind: "prepared_food",
    price: 30000,
    originalPrice: 50000,
    unitsLeft: 0,
    unit: "suất",
    from: tonight(21, 0),
    until: tonight(21, 30),
    seller: sellers.rice,
  }),
  sample({
    id: "of-xoi",
    name: "Xôi thập cẩm, 1 hộp",
    kind: "prepared_food",
    price: 20000,
    originalPrice: 35000,
    unitsLeft: 5,
    unit: "hộp",
    from: tonight(21, 15),
    until: tonight(21, 45),
    seller: sellers.deli,
  }),
];

const photoColours = {
  "ph-bread": ["#C8935A", "#E9C99A"],
  "ph-com-tam": ["#B9763E", "#F1D7A8"],
  "ph-xoi": ["#D9B45A", "#F6E7B8"],
};

/** A placeholder in the dish's colours: the stub serves no real photographs. */
function photo(id) {
  const [deep, light] = photoColours[id] ?? ["#B9763E", "#F1D7A8"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="160" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#1C1A17" opacity="0.5">sample</text></svg>`;
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
    response.writeHead(200, { "content-type": "image/svg+xml" });
    response.end(photo(photoMatch[1]));
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
