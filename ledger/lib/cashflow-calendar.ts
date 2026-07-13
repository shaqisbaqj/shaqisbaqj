import type { CashFlowEvent } from "@/types/database";

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  inMonth: boolean;
  isToday: boolean;
  events: CashFlowEvent[];
  netForDay: number;
  runningBalance: number;
  tight: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const TIGHT_THRESHOLD = 300;

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Expands one event's recurrence rule into concrete dates within [rangeStart, rangeEnd]. */
function occurrencesInRange(event: CashFlowEvent, rangeStart: Date, rangeEnd: Date): string[] {
  const anchor = new Date(event.event_date + "T00:00:00Z");
  const dates: string[] = [];

  if (event.recurrence === "once") {
    if (anchor >= rangeStart && anchor <= rangeEnd) dates.push(toISODate(anchor));
    return dates;
  }

  const stepDays = { weekly: 7, biweekly: 14, semimonthly: 15, monthly: null } as const;

  if (event.recurrence === "monthly") {
    const cursor = new Date(rangeStart);
    cursor.setUTCDate(anchor.getUTCDate());
    if (cursor < rangeStart) cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    while (cursor <= rangeEnd) {
      if (cursor >= anchor) dates.push(toISODate(cursor));
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return dates;
  }

  const step = stepDays[event.recurrence as "weekly" | "biweekly" | "semimonthly"] ?? 30;
  let cursor = new Date(anchor);
  // fast-forward to first occurrence at/after rangeStart
  if (cursor < rangeStart) {
    const periods = Math.floor((rangeStart.getTime() - cursor.getTime()) / (step * DAY_MS));
    cursor = new Date(cursor.getTime() + periods * step * DAY_MS);
  }
  while (cursor < rangeStart) cursor = new Date(cursor.getTime() + step * DAY_MS);
  while (cursor <= rangeEnd) {
    dates.push(toISODate(cursor));
    cursor = new Date(cursor.getTime() + step * DAY_MS);
  }
  return dates;
}

/**
 * Builds a 6-week calendar grid for `year`/`month` (0-indexed), with each
 * event's recurrence expanded and a running balance projected forward from
 * `startingBalance` — the mechanism behind "shows you exactly when you're
 * tight before it happens."
 */
export function buildCashFlowCalendar(
  events: CashFlowEvent[],
  year: number,
  month: number,
  startingBalance: number,
): CalendarDay[] {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const gridStart = new Date(firstOfMonth);
  gridStart.setUTCDate(gridStart.getUTCDate() - firstOfMonth.getUTCDay());
  const gridEnd = new Date(gridStart);
  gridEnd.setUTCDate(gridStart.getUTCDate() + 41); // 6 weeks

  const eventsByDate = new Map<string, CashFlowEvent[]>();
  for (const event of events) {
    for (const date of occurrencesInRange(event, gridStart, gridEnd)) {
      if (!eventsByDate.has(date)) eventsByDate.set(date, []);
      eventsByDate.get(date)!.push(event);
    }
  }

  const todayISO = toISODate(new Date());
  const days: CalendarDay[] = [];
  let running = startingBalance;

  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + i);
    const iso = toISODate(date);
    const dayEvents = eventsByDate.get(iso) ?? [];
    const net = dayEvents.reduce((sum, e) => sum + Number(e.amount), 0);
    running += net;

    days.push({
      date: iso,
      dayOfMonth: date.getUTCDate(),
      inMonth: date.getUTCMonth() === month,
      isToday: iso === todayISO,
      events: dayEvents,
      netForDay: net,
      runningBalance: running,
      tight: running < TIGHT_THRESHOLD,
    });
  }

  return days;
}
