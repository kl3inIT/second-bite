import { expect, test, type Locator, type Page, type WebSocketRoute } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test places an order or opens a store first, and the polling test waits for the socket to give up.
test.setTimeout(90_000);

const ORDER_URL = /\/vi\/orders\/[0-9a-f-]{36}$/;
const WIDTHS = [390, 768, 1440];

/**
 * The live socket of the page, answered the way the server does: each ticket confirms the topic it opens. A notice
 * is pushed once the page has subscribed to its order, as one sent before would be lost.
 */
type Notice = { type: string; orderId: string; [field: string]: unknown };
type Live = {
  /**
   * Pushes the notice, and again every few seconds until `shown` is visible, so a notice that reached the page in
   * the middle of another read does not fail the test.
   */
  pushUntil: (notice: Notice, shown: Locator) => Promise<void>;
};

async function liveSocket(page: Page): Promise<Live> {
  const sockets = new Map<WebSocketRoute, Set<string>>();
  await page.routeWebSocket(/\/api\/live$/, (socket) => {
    const topics = new Set<string>();
    sockets.set(socket, topics);
    socket.onClose(() => sockets.delete(socket));
    socket.onMessage((raw) => {
      const frame = JSON.parse(String(raw)) as { type: string; ticket: string };
      if (frame.type !== "subscribe") return;
      const topic = frame.ticket.replace(/^tk-/, "");
      topics.add(topic);
      socket.send(JSON.stringify({ type: "subscribed", topic }));
    });
  });
  return {
    pushUntil: async (notice, shown) => {
      const topic = `order:${notice.orderId}`;
      await expect(async () => {
        await expect
          .poll(() => [...sockets.values()].some((topics) => topics.has(topic)))
          .toBe(true);
        for (const [socket, topics] of sockets) {
          if (topics.has(topic)) socket.send(JSON.stringify(notice));
        }
        await expect(shown).toBeVisible({ timeout: 4000 });
      }).toPass({ timeout: 30_000 });
    },
  };
}

/** A socket that never opens, so the pages fall back to polling after three tries (design decision 29). */
async function refuseLive(page: Page) {
  await page.routeWebSocket(/\/api\/live$/, (socket) => void socket.close({ code: 1011 }));
}

async function placeOrder(page: Page, phone: string): Promise<string> {
  await page.goto("/vi/sellers/se-la-paris");
  await (
    await hydrated(page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }))
  ).click();
  await page.goto("/vi/cart");
  await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
  const sheet = page.getByRole("dialog", { name: "Người đến nhận" });
  await sheet.getByLabel("Tên").fill("Lan");
  await sheet.getByLabel("Số điện thoại").fill(phone);
  await sheet.getByRole("button", { name: "Tiếp tục" }).click();
  await page
    .getByRole("alertdialog", { name: "Xác nhận đặt đơn với số điện thoại" })
    .getByRole("button", { name: "Đúng, đặt món" })
    .click();
  await expect(page).toHaveURL(ORDER_URL);
  return page.url().split("/").at(-1) ?? "";
}

/** The seller's side, played through the stub: a message from them, as their app would send it. */
const sellerSays = (page: Page, orderId: string, text: string) =>
  page.request.post(`/api/__stub/chat/${orderId}`, { data: { from: "seller", text } });

// SEC-117 › live pages, unread counts and the order's chat (Figma K7, K7b, WK8, Q5m, Q7), against the stub backend.
test.describe("the live order pages", () => {
  test("turn ready and then collected as the notices arrive, with no reload", async ({ page }) => {
    const live = await liveSocket(page);
    const orderId = await placeOrder(page, "0900000011");
    await page.request.post(`/api/orders/${orderId}/ready`);
    await live.pushUntil(
      { type: "order", orderId, status: "ready" },
      page.getByText("Món đã sẵn sàng"),
    );
    await expect(page.getByText(/^Đưa mã QR cho quầy quét/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Huỷ đơn" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await page.request.post(`/api/orders/${orderId}/hand-over`);
    await live.pushUntil(
      { type: "order", orderId, status: "collected" },
      page.getByText(/^Đã nhận món lúc/),
    );
  });

  test("follow the order by polling when the socket cannot open", async ({ page }) => {
    await refuseLive(page);
    const orderId = await placeOrder(page, "0900000012");

    await page.request.post(`/api/orders/${orderId}/ready`);
    // Three failed tries take about seven seconds; the page then reads every fifteen.
    await expect(page.getByText("Món đã sẵn sàng")).toBeVisible({ timeout: 40_000 });
  });
});

for (const width of WIDTHS) {
  test.describe(`the chat of an order at ${width} px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test("is reached from the order, writes both ways and shows what was seen", async ({
      page,
    }) => {
      const live = await liveSocket(page);
      const orderId = await placeOrder(page, `09000000${width % 100}`);

      await sellerSays(page, orderId, "Quán đã chuẩn bị xong rồi nhé.");
      await live.pushUntil(
        { type: "message", orderId, seq: 1, from: "seller" },
        page.getByText("Quán vừa nhắn"),
      );
      await expect(page.getByText("“Quán đã chuẩn bị xong rồi nhé.”")).toBeVisible();

      await page.getByRole("link", { name: /^Xem tin/ }).click();
      await expect(page).toHaveURL(new RegExp(`/vi/orders/${orderId}/chat$`));
      const log = page.getByRole("region", { name: "Tin nhắn của đơn" });
      await expect(log.getByText("Quán đã chuẩn bị xong rồi nhé.")).toBeVisible();
      await expectNoSeriousA11yViolations(page);

      const input = await hydrated(page.getByRole("textbox"));
      await input.fill("Mình đến lúc 20:30 nhé");
      await page.getByRole("button", { name: "Gửi tin nhắn" }).click();
      await expect(log.getByText("Mình đến lúc 20:30 nhé")).toBeVisible();
      await expect(input).toHaveValue("");

      // The quick replies send at once.
      await page.getByRole("button", { name: "Mình đang tới" }).click();
      await expect(log.getByText("Mình đang tới")).toBeVisible();

      await sellerSays(page, orderId, "Cảm ơn bạn!");
      await live.pushUntil(
        { type: "message", orderId, seq: 4, from: "seller" },
        log.getByText("Cảm ơn bạn!"),
      );
      await expectNoSeriousA11yViolations(page);
    });

    test("reads what is new by polling when the socket cannot open", async ({ page }) => {
      await refuseLive(page);
      const orderId = await placeOrder(page, `09000001${width % 100}`);
      await page.goto(`/vi/orders/${orderId}/chat`);
      await hydrated(page.getByRole("textbox"));

      await sellerSays(page, orderId, "Có tin mới nè");
      await expect(page.getByText("Có tin mới nè")).toBeVisible({ timeout: 40_000 });
    });

    test("stays writable once collected, and is only read once the order is cancelled", async ({
      page,
    }) => {
      await liveSocket(page);
      const collected = await placeOrder(page, `09000002${width % 100}`);
      await sellerSays(page, collected, "Cảm ơn bạn đã đến");
      await page.request.post(`/api/orders/${collected}/ready`);
      await page.request.post(`/api/orders/${collected}/hand-over`);
      await page.goto(`/vi/orders/${collected}`);
      await expect(page.getByRole("link", { name: "Nhắn quán" })).toBeVisible();

      const cancelled = await placeOrder(page, `09000003${width % 100}`);
      await sellerSays(page, cancelled, "Quán xin lỗi, hết món");
      await page.reload();
      await (await hydrated(page.getByRole("button", { name: /^Huỷ đơn/ }))).click();
      const cancel = page.getByRole("alertdialog", { name: /Huỷ đơn SB-\d+\?/ });
      await cancel.getByRole("button", { name: "Không đến kịp" }).click();
      await cancel.getByRole("button", { name: "Huỷ đơn" }).click();
      await expect(page.getByText(/^Đã huỷ lúc/)).toBeVisible();
      await page.getByRole("link", { name: "Xem tin nhắn" }).click();
      await expect(page.getByRole("textbox")).toHaveCount(0);
      await expect(page.getByText("Đơn đã kết thúc, chỉ xem lại tin nhắn.")).toBeVisible();
      await expectNoSeriousA11yViolations(page);
    });
  });
}
