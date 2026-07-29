"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { SCHOOL_BANDS, students, yearLevelCensus, YEAR_LEVELS } from "@/lib/data";
import { School, Sparkles, UserCheck, Users } from "lucide-react";
import type { SchoolBand, YearLevel } from "@/lib/types";

export default function StudentsPage() {
  const [band, setBand] = useState<SchoolBand | "All">("All");
  const [yearLevel, setYearLevel] = useState<YearLevel | "All">("All");

  const filtered = useMemo(
    () =>
      students.filter((student) => {
        if (band !== "All" && student.band !== band) return false;
        if (yearLevel !== "All" && student.yearLevel !== yearLevel) return false;
        return true;
      }),
    [band, yearLevel],
  );

  const active = students.filter((s) => s.status === "active").length;

  return (
    <div>
      <PageHeader
        eyebrow="Student information management"
        title="Kindy to Year 13 directory"
        description="Central SIS records across Early Childhood, Primary, Intermediate, and Secondary — with guardians, homerooms, and pastoral care."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add student
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active learners"
          value={String(active)}
          hint="Demo campus sample"
          icon={UserCheck}
        />
        <StatTile
          label="Year span"
          value="K–13"
          hint="14 year levels"
          icon={School}
          accent="teal"
        />
        <StatTile
          label="School bands"
          value={String(SCHOOL_BANDS.length)}
          hint="Early Childhood → Secondary"
          icon={Users}
          accent="amber"
        />
        <StatTile
          label="Census (demo)"
          value={yearLevelCensus
            .reduce((sum, row) => sum + row.students, 0)
            .toLocaleString()}
          hint="Full Kindy–Y13 roll"
          icon={Sparkles}
        />
      </div>

      <section className="panel mb-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="display text-2xl text-ink">Year-level structure</h2>
            <p className="mt-1 text-sm text-slate">
              Filter the directory by band or year level
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold tracking-[0.08em] text-slate uppercase">
                Band
              </span>
              <select
                value={band}
                onChange={(e) => {
                  setBand(e.target.value as SchoolBand | "All");
                  setYearLevel("All");
                }}
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
            <label className="text-sm">
              <span className="mb-1 block text-xs font-semibold tracking-[0.08em] text-slate uppercase">
                Year level
              </span>
              <select
                value={yearLevel}
                onChange={(e) =>
                  setYearLevel(e.target.value as YearLevel | "All")
                }
                className="rounded-xl border border-line bg-white px-3 py-2 outline-none ring-teal/30 focus:ring-2"
              >
                <option value="All">All years</option>
                {YEAR_LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {yearLevelCensus.map((row) => (
            <button
              key={row.yearLevel}
              type="button"
              onClick={() => setYearLevel(row.yearLevel)}
              className={`rounded-2xl border px-3 py-3 text-left transition ${
                yearLevel === row.yearLevel
                  ? "border-teal bg-foam"
                  : "border-line bg-mist/60 hover:border-teal/40"
              }`}
            >
              <p className="text-xs font-semibold text-slate">{row.yearLevel}</p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {row.students}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Year / Band</th>
                <th>Homeroom</th>
                <th>Guardian</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foam text-sm font-semibold text-teal">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{student.name}</p>
                        <p className="text-xs text-slate">
                          {student.id} · {student.program}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-medium text-ink">{student.yearLevel}</p>
                    <p className="text-xs text-slate">{student.band}</p>
                  </td>
                  <td>
                    <p>{student.homeroom}</p>
                    <p className="text-xs text-slate">{student.advisor}</p>
                  </td>
                  <td>
                    <p>{student.guardian}</p>
                    <p className="text-xs text-slate">{student.guardianEmail}</p>
                  </td>
                  <td>
                    {student.attendanceRate
                      ? `${student.attendanceRate}%`
                      : "—"}
                  </td>
                  <td>
                    <StatusPill status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
