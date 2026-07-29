"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { classSchedule, SCHOOL_BANDS } from "@/lib/data";
import type { SchoolBand, Weekday } from "@/lib/types";
import { CalendarDays, Clock, DoorOpen, Layers } from "lucide-react";

const days: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function SchedulePage() {
  const [day, setDay] = useState<Weekday | "All">("All");
  const [band, setBand] = useState<SchoolBand | "All">("All");

  const filtered = useMemo(
    () =>
      classSchedule.filter((period) => {
        if (day !== "All" && period.day !== day) return false;
        if (band !== "All" && period.band !== band) return false;
        return true;
      }),
    [day, band],
  );

  const rooms = new Set(classSchedule.map((p) => p.room)).size;

  return (
    <div>
      <PageHeader
        eyebrow="Class schedules"
        title="Weekly timetable"
        description="See periods, rooms, and teachers across Early Childhood, Primary, Intermediate, and Secondary."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Edit timetable
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Scheduled periods"
          value={String(classSchedule.length)}
          icon={CalendarDays}
        />
        <StatTile
          label="Rooms in use"
          value={String(rooms)}
          icon={DoorOpen}
          accent="teal"
        />
        <StatTile
          label="School bands"
          value={String(SCHOOL_BANDS.length)}
          icon={Layers}
          accent="amber"
        />
        <StatTile
          label="Day length"
          value="08:45–15:20"
          icon={Clock}
        />
      </div>

      <section className="panel mb-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="display text-2xl text-ink">Filter timetable</h2>
            <p className="mt-1 text-sm text-slate">
              Narrow by weekday or school band
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold tracking-[0.08em] text-slate uppercase">
                Day
              </span>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as Weekday | "All")}
                className="rounded-xl border border-line bg-white px-3 py-2 outline-none ring-teal/30 focus:ring-2"
              >
                <option value="All">All days</option>
                {days.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold tracking-[0.08em] text-slate uppercase">
                Band
              </span>
              <select
                value={band}
                onChange={(e) => setBand(e.target.value as SchoolBand | "All")}
                className="rounded-xl border border-line bg-white px-3 py-2 outline-none ring-teal/30 focus:ring-2"
              >
                <option value="All">All bands</option>
                {SCHOOL_BANDS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Period</th>
                <th>Time</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Year levels</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((period) => (
                <tr key={period.id}>
                  <td className="font-medium text-ink">{period.day}</td>
                  <td>{period.period}</td>
                  <td>
                    {period.startTime}–{period.endTime}
                  </td>
                  <td>
                    <p className="font-medium text-ink">{period.course}</p>
                    <p className="text-xs text-slate">{period.band}</p>
                  </td>
                  <td>{period.teacher}</td>
                  <td>{period.room}</td>
                  <td className="text-sm">{period.yearLevels.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
