"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Layers3,
  School,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  electiveOfferings,
  SCHOOL_BANDS,
  studentEnrollments,
  students,
  yearLevelCensus,
  YEAR_LEVELS,
} from "@/lib/data";
import type { SchoolBand, YearLevel } from "@/lib/types";

type SisTab = "directory" | "courses" | "electives";

export default function StudentsPage() {
  const [tab, setTab] = useState<SisTab>("directory");
  const [band, setBand] = useState<SchoolBand | "All">("All");
  const [yearLevel, setYearLevel] = useState<YearLevel | "All">("All");

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        if (band !== "All" && student.band !== band) return false;
        if (yearLevel !== "All" && student.yearLevel !== yearLevel) return false;
        return true;
      }),
    [band, yearLevel],
  );

  const filteredEnrollments = useMemo(
    () =>
      studentEnrollments.filter((row) => {
        if (yearLevel !== "All" && row.yearLevel !== yearLevel) return false;
        return true;
      }),
    [yearLevel],
  );

  const active = students.filter((s) => s.status === "active").length;
  const creditTracked = students.filter((s) => s.creditsRequired > 0);
  const avgCredits =
    creditTracked.length === 0
      ? 0
      : Math.round(
          creditTracked.reduce((sum, s) => sum + s.creditsEarned, 0) /
            creditTracked.length,
        );
  const openElectiveSeats = electiveOfferings.reduce(
    (sum, item) => sum + Math.max(item.seats - item.enrolled, 0),
    0,
  );
  const waitlisted = studentEnrollments.filter(
    (e) => e.status === "waitlist",
  ).length;

  const tabs: { id: SisTab; label: string }[] = [
    { id: "directory", label: "Student directory" },
    { id: "courses", label: "Courses & credits" },
    { id: "electives", label: "Electives" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Student Information System (SIS)"
        title="Students, electives, courses & credits"
        description="Class 365 handles the administrative load — year-level records, course enrollments, elective requests, and credit progress — so institutions can focus on teaching."
        actions={
          <>
            <button
              type="button"
              className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Manage enrollments
            </button>
            <button
              type="button"
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              Add student
            </button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active learners"
          value={String(active)}
          hint="Kindy–Year 13 SIS roll"
          icon={UserCheck}
        />
        <StatTile
          label="Avg credits earned"
          value={String(avgCredits)}
          hint="Secondary / intermediate tracked"
          icon={Award}
          accent="teal"
        />
        <StatTile
          label="Open elective seats"
          value={String(openElectiveSeats)}
          hint="Across current offerings"
          icon={Layers3}
          accent="amber"
        />
        <StatTile
          label="Waitlisted requests"
          value={String(waitlisted)}
          hint="Needs admin review"
          icon={Sparkles}
          accent="coral"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === item.id
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink hover:bg-foam"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "directory" ? (
        <>
          <section className="panel mb-6 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="display text-2xl text-ink">Year-level structure</h2>
                <p className="mt-1 text-sm text-slate">
                  Filter the SIS directory by band or year level
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
                  <p className="text-xs font-semibold text-slate">
                    {row.yearLevel}
                  </p>
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
                    <th>Credits</th>
                    <th>Electives</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const creditPct =
                      student.creditsRequired === 0
                        ? 0
                        : Math.min(
                            100,
                            Math.round(
                              (student.creditsEarned / student.creditsRequired) *
                                100,
                            ),
                          );
                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foam text-sm font-semibold text-teal">
                              {student.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-ink">
                                {student.name}
                              </p>
                              <p className="text-xs text-slate">
                                {student.id} · {student.program}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="font-medium text-ink">
                            {student.yearLevel}
                          </p>
                          <p className="text-xs text-slate">{student.band}</p>
                        </td>
                        <td>
                          <p>{student.homeroom}</p>
                          <p className="text-xs text-slate">{student.advisor}</p>
                        </td>
                        <td>
                          {student.creditsRequired ? (
                            <div className="min-w-[120px]">
                              <p className="text-sm font-medium text-ink">
                                {student.creditsEarned}/
                                {student.creditsRequired}
                              </p>
                              <div className="progress-track mt-1 w-28">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${creditPct}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate">
                              Pathway N/A
                            </span>
                          )}
                        </td>
                        <td>
                          {student.electiveSlots ? (
                            <span className="text-sm text-ink">
                              {student.electiveFilled}/{student.electiveSlots}{" "}
                              filled
                            </span>
                          ) : (
                            <span className="text-sm text-slate">—</span>
                          )}
                        </td>
                        <td>
                          <StatusPill status={student.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {tab === "courses" ? (
        <section className="panel overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="display text-2xl text-ink">
                  Course enrollments & credit load
                </h2>
                <p className="mt-1 text-sm text-slate">
                  Core, pathway, and elective courses with credit values
                </p>
              </div>
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
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Kind</th>
                  <th>Credits</th>
                  <th>Teacher</th>
                  <th>Term</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <p className="font-medium text-ink">{row.studentName}</p>
                      <p className="text-xs text-slate">
                        {row.studentId} · {row.yearLevel}
                      </p>
                    </td>
                    <td>
                      <p className="font-medium text-ink">{row.courseCode}</p>
                      <p className="text-xs text-slate">{row.courseTitle}</p>
                    </td>
                    <td>
                      <StatusPill status={row.kind} />
                    </td>
                    <td className="font-semibold text-ink">{row.credits}</td>
                    <td>{row.teacher}</td>
                    <td>{row.term}</td>
                    <td>
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "electives" ? (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Request & approve",
                copy: "Students request electives; staff approve against year-level rules and seat caps.",
                icon: BookOpen,
              },
              {
                title: "Balance credits",
                copy: "Each elective carries credit value toward pathway and graduation requirements.",
                icon: Award,
              },
              {
                title: "Admin handled",
                copy: "Waitlists, seat frees, and clashes are managed in SIS so teaching stays focused.",
                icon: School,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="panel p-5">
                  <div className="mb-3 inline-flex rounded-2xl bg-foam p-3 text-teal">
                    <Icon size={20} />
                  </div>
                  <h2 className="font-semibold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm text-slate">{item.copy}</p>
                </div>
              );
            })}
          </div>

          <section className="panel overflow-hidden">
            <div className="border-b border-line px-6 py-4">
              <h2 className="display text-2xl text-ink">Elective offerings</h2>
              <p className="mt-1 text-sm text-slate">
                Seats, waitlists, and credit values for the current term
              </p>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Elective</th>
                    <th>Category</th>
                    <th>Year levels</th>
                    <th>Credits</th>
                    <th>Capacity</th>
                    <th>Waitlist</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {electiveOfferings.map((item) => {
                    const fill = Math.round((item.enrolled / item.seats) * 100);
                    return (
                      <tr key={item.id}>
                        <td>
                          <p className="font-medium text-ink">{item.code}</p>
                          <p className="text-xs text-slate">{item.title}</p>
                        </td>
                        <td>{item.category}</td>
                        <td className="text-sm">
                          {item.yearLevels.join(", ")}
                        </td>
                        <td className="font-semibold text-ink">
                          {item.credits}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">
                              {item.enrolled}/{item.seats}
                            </span>
                            <div className="progress-track w-20">
                              <div
                                className="progress-fill"
                                style={{ width: `${fill}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{item.waitlist}</td>
                        <td>{item.teacher}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
