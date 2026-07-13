"use client";

import { useState } from "react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { CalendarDay } from "@/lib/cashflow-calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CashFlowGrid({ days }: { days: CalendarDay[] }) {
  const [selected, setSelected] = useState<CalendarDay | null>(
    days.find((d) => d.isToday) ?? null,
  );

  return (
    <div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-ink-800 bg-ink-800">
        {WEEKDAYS.map((w) => (
          <div key={w} className="bg-ink-900 px-2 py-1.5 text-center font-mono text-[11px] uppercase tracking-wide text-paper-600">
            {w}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelected(day)}
            className={cn(
              "flex min-h-[76px] flex-col items-start gap-1 bg-ink-950 p-1.5 text-left transition-colors hover:bg-ink-900",
              !day.inMonth && "opacity-30",
              selected?.date === day.date && "ring-1 ring-inset ring-emerald-600",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                day.isToday ? "bg-emerald-600 text-paper-50" : "text-paper-400",
              )}
            >
              {day.dayOfMonth}
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              {day.events.slice(0, 2).map((e, i) => (
                <span
                  key={i}
                  className={cn(
                    "truncate text-[11px] leading-tight",
                    e.amount >= 0 ? "text-emerald-400" : "text-paper-500",
                  )}
                >
                  {e.amount >= 0 ? "+" : ""}
                  {formatCurrency(e.amount)}
                </span>
              ))}
              {day.events.length > 2 && (
                <span className="text-[11px] text-paper-600">+{day.events.length - 2} more</span>
              )}
            </div>
            {day.inMonth && day.tight && (
              <span className="h-1.5 w-1.5 self-end rounded-full bg-amber-500" title="Tight day" />
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-4 rounded-lg border border-ink-700 bg-ink-900/60 p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-paper-100">{formatDate(selected.date, { weekday: "long", month: "long", day: "numeric" })}</p>
            <span className={cn("tabular-nums text-sm", selected.tight ? "text-amber-400" : "text-paper-400")}>
              Projected balance: {formatCurrency(selected.runningBalance)}
            </span>
          </div>
          {selected.events.length === 0 ? (
            <p className="mt-2 text-sm text-paper-600">Nothing due or landing this day.</p>
          ) : (
            <div className="mt-2 flex flex-col gap-1">
              {selected.events.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-paper-300">{e.name}</span>
                  <span className={cn("tabular-nums", e.amount >= 0 ? "text-emerald-400" : "text-paper-100")}>
                    {formatCurrency(e.amount, { signed: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
          {selected.tight && (
            <p className="mt-3 text-xs text-amber-400">
              Projected balance dips below $300 here — worth watching before it happens.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
