"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events: Record<string, string[]> = {
  "2025-12-08": ["No work for today"],
  "2025-12-15": ["Modern villa Design CD"],
  "2025-12-16": ["Modern villa Design CD"],
  "2025-12-17": ["Modern villa Design CD"],
  "2025-12-18": ["Modern villa Design CD"],
  "2025-12-27": ["Modern villa Design CD"],
  "2025-12-28": ["Modern villa Design CD"],
};

const eventColors: Record<string, string> = {
  "Modern villa Design CD": "bg-teal-600",
  "No work for today": "bg-orange-600",
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  const formatDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getEventColor = (event: string) => {
    return eventColors[event] || "bg-blue-600";
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 ">
        <button className="p-2 hover:bg-slate-700 rounded transition">
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <h2 className="text-xl font-bold text-white">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="p-2 hover:bg-slate-700 rounded transition">
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-teal-600 text-white text-center py-2 rounded font-semibold text-sm"
          >
            {day}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-slate-700/30 rounded p-2" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const dateStr = formatDate(day);
          const dayEvents = events[dateStr] || [];

          return (
            <div
              key={day}
              className="bg-slate-700/30 border border-slate-600 rounded p-2 min-h-20 flex flex-col"
            >
              <span className="text-slate-300 text-sm font-semibold mb-1">{day}</span>
              <div className="space-y-1 flex-1">
                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    className={`${getEventColor(event)} text-white text-xs rounded px-2 py-1 truncate`}
                  >
                    {event}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
