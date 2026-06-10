"use client";

import { useEffect, useState } from "react";
import type { DayAvailability, TimeSlot } from "@/lib/types";
import { fetchAvailability } from "@/lib/api";

interface Props {
  serviceId: number | null;
  onSlotSelect: (slot: TimeSlot | null) => void;
  selectedSlot: TimeSlot | null;
}

function formatDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BookingCalendar({ serviceId, onSlotSelect, selectedSlot }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const todayCopy = new Date();
    todayCopy.setHours(0, 0, 0, 0);
    const start = isoDate(firstDay < todayCopy ? todayCopy : firstDay);
    const end = isoDate(lastDay);

    const run = async () => {
      if (!cancelled) setLoading(true);
      if (!cancelled) setError(null);
      try {
        const data = await fetchAvailability(serviceId, start, end);
        if (!cancelled) setAvailability(data.days);
      } catch {
        if (!cancelled) setError("Could not load availability. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [serviceId, displayMonth, displayYear, refreshKey]);

  const loadAvailability = () => setRefreshKey((k) => k + 1);

  const availByDate = availability.reduce<Record<string, DayAvailability>>(
    (acc, d) => { acc[d.date] = d; return acc; },
    {}
  );

  // Build calendar grid
  const firstOfMonth = new Date(displayYear, displayMonth, 1);
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const startDow = firstOfMonth.getDay(); // 0=Sunday

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDayData = selectedDate ? availByDate[selectedDate] : null;

  const prevMonth = () => {
    setSelectedDate(null);
    onSlotSelect(null);
    if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear(y => y - 1); }
    else setDisplayMonth(m => m - 1);
  };

  const nextMonth = () => {
    setSelectedDate(null);
    onSlotSelect(null);
    if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear(y => y + 1); }
    else setDisplayMonth(m => m + 1);
  };

  const isPast = (day: number) => {
    const d = new Date(displayYear, displayMonth, day);
    return d < today;
  };

  const hasAvailability = (day: number) => {
    const dateStr = isoDate(new Date(displayYear, displayMonth, day));
    return availByDate[dateStr]?.has_availability ?? false;
  };

  const isSelected = (day: number) => {
    return selectedDate === isoDate(new Date(displayYear, displayMonth, day));
  };

  const handleDateClick = (day: number) => {
    if (isPast(day)) return;
    const dateStr = isoDate(new Date(displayYear, displayMonth, day));
    if (!availByDate[dateStr]?.has_availability) return;
    setSelectedDate(dateStr);
    onSlotSelect(null);
  };

  return (
    <div>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-bold text-slate-800 text-base">
          {MONTHS[displayMonth]} {displayYear}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1.5">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
          Loading availability…
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button onClick={loadAvailability} className="text-teal-600 text-sm underline">Retry</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} />;
            const past = isPast(day);
            const avail = hasAvailability(day);
            const sel = isSelected(day);
            return (
              <button
                key={idx}
                disabled={past || !avail}
                onClick={() => handleDateClick(day)}
                className={`
                  relative aspect-square rounded-lg text-sm font-medium transition-all duration-150 flex flex-col items-center justify-center gap-0.5
                  ${sel ? "bg-teal-600 text-white shadow-md shadow-teal-600/30" : ""}
                  ${!sel && avail && !past ? "bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer" : ""}
                  ${past ? "text-slate-300 cursor-not-allowed" : ""}
                  ${!avail && !past ? "text-slate-400 cursor-not-allowed" : ""}
                `}
              >
                {day}
                {avail && !past && !sel && (
                  <span className="w-1 h-1 rounded-full bg-teal-500 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-teal-50 border border-teal-200" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-teal-600" />
          Selected
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100" />
          Unavailable
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Available times on{" "}
            <span className="text-teal-700">
              {formatDate(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </p>
          {selectedDayData && selectedDayData.slots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {selectedDayData.slots.map((slot) => {
                const isSlotSelected =
                  selectedSlot?.date === slot.date &&
                  selectedSlot?.start_time === slot.start_time;
                return (
                  <button
                    key={`${slot.date}-${slot.start_time}`}
                    onClick={() => onSlotSelect(isSlotSelected ? null : slot)}
                    className={`
                      text-sm font-medium py-2 px-3 rounded-lg border transition-all
                      ${isSlotSelected
                        ? "bg-teal-600 text-white border-teal-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-700"
                      }
                    `}
                  >
                    {slot.start_time}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No available slots on this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
