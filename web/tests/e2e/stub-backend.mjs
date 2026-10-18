// What the web asks the Go server, answered for the browser tests and for local work on screens whose
// endpoint is not built yet (`pnpm stub:backend`, then SECONDBITE_API_ORIGIN=http://localhost:3190).
// GET /offers follows the SEC-11 design; the sellers and dishes are sample kinds of food from Tasco
// Mall, labelled as samples (docs/guidelines/figma.md › Content). Adapted from BeyondPilot's
// web/tests/e2e/stub-backend.mjs.
import { createServer } from "node:http";

const port = Number(process.env.STUB_BACKEND_PORT ?? 3190);

/** Today at hh:mm in Vietnam time, as RFC 3339 with its offset. */
function tonight(hour, minute) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  return `${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;
}

const offers = [
  {
    id: "of-bread",
    state: "on_sale",
    name: "Túi bánh mì và croissant, 4 chiếc",
    kind: "bakery",
    price: 39000,
    originalPrice: 95000,
    units: 3,
    unit: "túi",
    collectFrom: tonight(21, 0),
    collectUntil: tonight(21, 45),
    photo: "/photos/ph-bread/400.jpg",
    seller: { id: "se-bakery", name: "Tiệm bánh Pháp", place: "Tầng 1" },
  },
  {
    id: "of-com-tam",
    state: "on_sale",
    name: "Cơm sườn nướng, 1 suất",
    kind: "prepared_food",
    price: 30000,
    originalPrice: 50000,
    units: 0,
    unit: "suất",
    collectFrom: tonight(21, 0),
    collectUntil: tonight(21, 30),
    photo: "/photos/ph-com-tam/400.jpg",
    seller: { id: "se-rice", name: "Quầy cơm", place: "Tầng hầm" },
  },
  {
    id: "of-xoi",
    state: "on_sale",
    name: "Xôi thập cẩm, 1 hộp",
    kind: "prepared_food",
    price: 20000,
    originalPrice: 35000,
    units: 5,
    unit: "hộp",
    collectFrom: tonight(21, 15),
    collectUntil: tonight(21, 45),
    photo: "/photos/ph-xoi/400.jpg",
    seller: { id: "se-deli", name: "Quầy deli siêu thị", place: "Tầng hầm" },
  },
  {
    id: "of-banh-mi",
    state: "announced",
    name: "Bánh mì gà xé",
    kind: "bakery",
    price: 18000,
    originalPrice: 32000,
    units: 6,
    unit: "ổ",
    collectFrom: tonight(21, 0),
    collectUntil: tonight(21, 45),
    photo: "/photos/ph-banh-mi/400.jpg",
    seller: { id: "se-cafe", name: "Quầy cà phê", place: "Tầng 1" },
  },
];

const photoColours = {
  "ph-bread": ["#C8935A", "#E9C99A"],
  "ph-com-tam": ["#B9763E", "#F1D7A8"],
  "ph-xoi": ["#D9B45A", "#F6E7B8"],
  "ph-banh-mi": ["#A86B3C", "#E8C08A"],
};

/** A placeholder in the dish's colours: the stub serves no real photographs. */
function photo(id) {
  const [deep, light] = photoColours[id] ?? ["#B9763E", "#F1D7A8"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="160" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#1C1A17" opacity="0.5">sample</text></svg>`;
}

function fold(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
}

function search(url) {
  const q = url.searchParams.get("q");
  const kind = url.searchParams.get("kind");
  const at = url.searchParams.get("collectAt");
  return offers.filter(
    (offer) =>
      (!q || fold(offer.name).includes(fold(q)) || fold(offer.seller.name).includes(fold(q))) &&
      (!kind || offer.kind === kind) &&
      (!at ||
        (new Date(offer.collectFrom) <= new Date(at) &&
          new Date(at) < new Date(offer.collectUntil))),
  );
}

const server = createServer((request, response) => {
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
