import {
  first,
  oneOf,
  type PageSize,
  pageOf,
  pageSizeOf,
  type SearchParams,
  searchOf,
  type SortDirection,
} from "../list-query";
import { vietnamDateTime, vietnamDay } from "../promotions/schedule";

/** How a notification reaches people (Figma AD-MK5 › Kênh): a push notification or an email. */
export const notificationChannels = ["push", "email"] as const;
export type NotificationChannel = (typeof notificationChannels)[number];

/** Who receives it (Figma AD-MK6 › Nhóm nhận): every customer, customers near Việt Hưng, or store owners. */
export const notificationAudiences = ["all", "nearby", "sellers"] as const;
export type NotificationAudience = (typeof notificationAudiences)[number];

/** Where a campaign stands (Figma AD-MK5 › Trạng thái): "Đã gửi", "Lên lịch", "Nháp". */
export const campaignStates = ["sent", "scheduled", "draft"] as const;
export type CampaignState = (typeof campaignStates)[number];

/** A sent or planned notification as the history lists it (Figma AD-MK5). */
export type CampaignRow = {
  id: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  audience: NotificationAudience;
  /** How many it reached, and the share of them that opened it (0 to 1); nothing before it is sent. */
  sent: number | null;
  openRate: number | null;
  /** When it went or goes out; nothing for a draft without a time. */
  at: string | null;
  state: CampaignState;
};

export type CampaignList = { items: CampaignRow[]; total: number };

export type CampaignQuery = {
  q: string;
  channel: "all" | NotificationChannel;
  state: "all" | CampaignState;
  size: PageSize;
  page: number;
  /** The list is sorted by its time only (Figma: "Thời gian ↓"). */
  dir: SortDirection;
};

export const campaignDefaults: CampaignQuery = {
  q: "",
  channel: "all",
  state: "all",
  size: 10,
  page: 1,
  dir: "desc",
};

/** The history's query from its address; anything unknown falls back to its default. */
export function campaignQueryOf(params: SearchParams): CampaignQuery {
  return {
    q: searchOf(first(params, "q")),
    channel: oneOf(first(params, "channel"), ["all", ...notificationChannels] as const, "all"),
    state: oneOf(first(params, "state"), ["all", ...campaignStates] as const, "all"),
    size: pageSizeOf(first(params, "size")),
    page: pageOf(first(params, "page")),
    dir: oneOf(first(params, "dir"), ["asc", "desc"] as const, "desc"),
  };
}

/** A share of people who opened it, in whole percent: 0.384 is "38%". */
export function percentOf(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/** What the composer holds (Figma AD-MK6). The day and the time are Vietnam wall-clock values. */
export type ComposeForm = {
  channel: NotificationChannel;
  audience: NotificationAudience;
  title: string;
  body: string;
  day: string;
  time: string;
  /** Kept out of the quiet hours, 22:00 to 07:00. */
  quiet: boolean;
};

/** A push notification's title and text fit a phone's lock screen; an email's title is its subject. */
export const composeLimits = { title: 65, body: 240 } as const;

/** The quiet hours: nothing is sent from 22:00 until 07:00. */
export const quietHours = { from: "22:00", until: "07:00", lastMinute: "21:59" } as const;

/** A time held out of the quiet hours: earlier than 07:00 becomes 07:00, from 22:00 it becomes 21:59. */
export function outsideQuietHours(time: string): string {
  if (time < quietHours.until) return quietHours.until;
  if (time >= quietHours.from) return quietHours.lastMinute;
  return time;
}

/** A new notification: a push to every customer, today at the next whole hour, kept out of the quiet hours. */
export function blankCompose(now: Date): ComposeForm {
  const [day, clock] = vietnamDateTime(now).split("T");
  const nextHour = (Number(clock.slice(0, 2)) + 1) % 24;
  return {
    channel: "push",
    audience: "all",
    title: "",
    body: "",
    day,
    time: outsideQuietHours(`${String(nextHour).padStart(2, "0")}:00`),
    quiet: true,
  };
}

/** The form after the day moved: never before today. */
export function withDay(form: ComposeForm, day: string, now: Date): ComposeForm {
  const today = vietnamDay(now);
  return { ...form, day: day < today ? today : day };
}

/** The form after the time moved: out of the quiet hours while they are kept. */
export function withTime(form: ComposeForm, time: string): ComposeForm {
  return { ...form, time: form.quiet ? outsideQuietHours(time) : time };
}

/** The form after the quiet hours were turned on or off; turning them on moves a time inside them out. */
export function withQuiet(form: ComposeForm, quiet: boolean): ComposeForm {
  return { ...form, quiet, time: quiet ? outsideQuietHours(form.time) : form.time };
}

export type ComposeProblem = "title" | "body";

/** What the notification still lacks: a title and a text. */
export function composeProblems(form: ComposeForm): ComposeProblem[] {
  const problems: ComposeProblem[] = [];
  if (form.title.trim() === "") problems.push("title");
  if (form.body.trim() === "") problems.push("body");
  return problems;
}
