import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderAdmin, textOf } from "../testing/render";
import {
  blankCompose,
  campaignDefaults,
  campaignQueryOf,
  type CampaignRow,
  composeProblems,
  outsideQuietHours,
  percentOf,
  withDay,
  withQuiet,
  withTime,
} from "./campaign";
import { ComposeFields } from "./compose";
import { NotificationPreview } from "./notification-preview";
import { CampaignDetails, NotificationsView } from "./notifications-view";

vi.mock("@/i18n/navigation", async () => (await import("../testing/render")).navigationMock);

// Sample campaigns, as Figma AD-MK5 draws them; the page itself has none until a backend sends to groups.
const rows: CampaignRow[] = [
  {
    id: "n1",
    title: "Bánh ngọt giảm 50% tối nay",
    body: "Tiệm bánh Pháp và 3 cửa hàng ở Tasco Mall còn bánh cuối ngày.",
    channel: "push",
    audience: "nearby",
    sent: 1240,
    openRate: 0.384,
    at: "2026-10-20T17:00:00+07:00",
    state: "sent",
  },
  {
    id: "n2",
    title: "Cuối tuần giảm 25% ở Tasco Mall",
    body: "Giảm 25% cho mọi món sau 19:00.",
    channel: "push",
    audience: "nearby",
    sent: null,
    openRate: null,
    at: "2026-10-25T10:00:00+07:00",
    state: "scheduled",
  },
  {
    id: "n3",
    title: "Ưu đãi rau củ sạch cuối ngày",
    body: "Rau củ sạch giảm đến 40%.",
    channel: "email",
    audience: "all",
    sent: null,
    openRate: null,
    at: null,
    state: "draft",
  },
];

describe("the notification history's logic", () => {
  it("reads its filters from the address", () => {
    expect(campaignQueryOf({})).toEqual(campaignDefaults);
    expect(campaignQueryOf({ channel: "email", state: "draft", dir: "asc" })).toMatchObject({
      channel: "email",
      state: "draft",
      dir: "asc",
    });
    expect(campaignQueryOf({ channel: "sms", state: "lost" })).toEqual(campaignDefaults);
    expect(percentOf(0.384)).toBe("38%");
  });

  it("keeps a time out of the quiet hours and a day from today on", () => {
    expect(outsideQuietHours("06:30")).toBe("07:00");
    expect(outsideQuietHours("22:00")).toBe("21:59");
    expect(outsideQuietHours("17:00")).toBe("17:00");

    const now = new Date("2026-10-20T21:30:00+07:00");
    const form = blankCompose(now);
    expect(form).toMatchObject({ day: "2026-10-20", time: "21:59", quiet: true, channel: "push" });
    expect(withTime(form, "23:30").time).toBe("21:59");
    expect(withTime({ ...form, quiet: false }, "23:30").time).toBe("23:30");
    expect(withQuiet({ ...form, quiet: false, time: "05:00" }, true).time).toBe("07:00");
    expect(withDay(form, "2026-10-01", now).day).toBe("2026-10-20");
    expect(withDay(form, "2026-11-01", now).day).toBe("2026-11-01");
    expect(composeProblems(form)).toEqual(["title", "body"]);
    expect(composeProblems({ ...form, title: "Ưu đãi", body: "Giảm 50%" })).toEqual([]);
  });
});

describe("the notification history", () => {
  it("lists each campaign with its channel, audience, reach, time and status", () => {
    const text = textOf(
      renderAdmin(
        createElement(NotificationsView, {
          list: { items: rows, total: 18 },
          query: campaignDefaults,
        }),
      ),
    );
    expect(text).toContain("Thông báo Soạn thông báo");
    expect(text).toContain(
      "Bánh ngọt giảm 50% tối nay Đẩy Khách gần Việt Hưng 1.240 38% 20/10 · 17:00 Đã gửi",
    );
    expect(text).toContain(
      "Cuối tuần giảm 25% ở Tasco Mall Đẩy Khách gần Việt Hưng — — 25/10 · 10:00 Lên lịch",
    );
    expect(text).toContain("Ưu đãi rau củ sạch cuối ngày Email Tất cả khách — — Chưa hẹn giờ Nháp");
    expect(text).toContain("Hiển thị 1–10 trên 18 chiến dịch");
  });

  it("shows its empty state with no campaigns", () => {
    const text = textOf(
      renderAdmin(
        createElement(NotificationsView, {
          list: { items: [], total: 0 },
          query: campaignDefaults,
        }),
      ),
    );
    expect(text).toContain("Chưa gửi thông báo nào");
  });

  it("shows a campaign as people got it", () => {
    const text = textOf(
      renderAdmin(createElement(CampaignDetails, { campaign: rows[0], when: "20/10 · 17:00" })),
    );
    expect(text).toContain(
      "Kênh Đẩy Nhóm nhận Khách gần Việt Hưng Thời gian 20/10 · 17:00 Trạng thái Đã gửi",
    );
    expect(text).toContain("17:00 Thứ Ba, 20/10/2026");
    expect(text).toContain("Second Bite · bây giờ Bánh ngọt giảm 50% tối nay Tiệm bánh Pháp");
  });
});

describe("the composer", () => {
  const form = {
    ...blankCompose(new Date("2026-10-20T16:10:00+07:00")),
    title: "Bánh ngọt giảm 50% tối nay",
    body: "Còn bánh cuối ngày.",
  };

  it("holds the channel, the audience, the words, the day and the time", () => {
    const html = renderAdmin(createElement(ComposeFields, { form, onChange: () => {} }));
    const text = textOf(html);
    expect(text).toContain("Kênh gửi Thông báo đẩy Email");
    expect(text).toContain("Nhóm nhận Tất cả khách Khách gần Việt Hưng Chủ cửa hàng");
    expect(html).toContain('value="Bánh ngọt giảm 50% tối nay"');
    expect(html).toContain('value="2026-10-20"');
    expect(html).toMatch(/max="21:59"[^>]*value="17:00"|value="17:00"[^>]*max="21:59"/);
    expect(text).toContain("Không gửi trong giờ yên lặng (22:00 – 07:00)");
  });

  it("previews a push on the lock screen and an email in the inbox", () => {
    const push = textOf(
      renderAdmin(createElement(NotificationPreview, { ...form, channel: "push" })),
    );
    expect(push).toContain(
      "17:00 Thứ Ba, 20/10/2026 sb Second Bite · bây giờ Bánh ngọt giảm 50% tối nay",
    );
    const email = textOf(
      renderAdmin(createElement(NotificationPreview, { ...form, channel: "email" })),
    );
    expect(email).toContain("Second Bite · Email Bánh ngọt giảm 50% tối nay Còn bánh cuối ngày.");
    expect(email).not.toContain("17:00");
  });
});
