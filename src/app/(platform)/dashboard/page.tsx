"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  MonitorPlay,
  TrendingUp,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { ROLE_META, type UserRole } from "@/lib/auth";
import {
  activityFeed,
  applications,
  dashboardStats,
  liveSessions,
} from "@/lib/data";

const copyByRole: Record<
  UserRole,
  { title: string; description: string; primaryHref: string; primaryLabel: string; secondaryHref: string; secondaryLabel: string }
> = {
  admin: {
    title: "Campus pulse for Harbor Academy",
    description:
      "SIS, LMS, and CRM signals in one view — from today’s attendance to open enrollments and live distance sessions.",
    primaryHref: "/enrollment",
    primaryLabel: "Review enrollments",
    secondaryHref: "/reports",
    secondaryLabel: "Open reports",
  },
  teacher: {
    title: "Your teaching workspace",
    description:
      "Today’s classes, attendance sync, gradebook updates, and live distance sessions in one place.",
    primaryHref: "/gradebook",
    primaryLabel: "Open gradebook",
    secondaryHref: "/attendance",
    secondaryLabel: "Take attendance",
  },
  student: {
    title: "Welcome back, Maya",
    description:
      "Check your courses, grades, attendance, and upcoming distance learning sessions.",
    primaryHref: "/courses",
    primaryLabel: "My courses",
    secondaryHref: "/learning",
    secondaryLabel: "Join live class",
  },
  parent: {
    title: "Family portal",
    description:
      "Follow Maya Chen’s attendance, grades, courses, and tuition status at Harbor Academy.",
    primaryHref: "/gradebook",
    primaryLabel: "View grades",
    secondaryHref: "/billing",
    secondaryLabel: "View billing",
  },
};

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const copy = copyByRole[user.role];
  const showAdminPanels = user.role === "admin";
  const showEnrollment = user.role === "admin";
  const showLearning = user.role !== "parent";

  return (
    <div>
      <PageHeader
        eyebrow={`${ROLE_META[user.role].label} dashboard`}
        title={copy.title}
        description={copy.description}
        actions={
          <>
            <Link
              href={copy.primaryHref}
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              {copy.primaryLabel}
            </Link>
            <Link
              href={copy.secondaryHref}
              className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
            >
              {copy.secondaryLabel}
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {user.role === "admin" || user.role === "teacher" ? (
          <>
            <StatTile
              label="Active students"
              value={dashboardStats.activeStudents.toLocaleString()}
              hint="Across all programs"
              icon={GraduationCap}
              accent="teal"
            />
            <StatTile
              label="Pending enrollments"
              value={String(dashboardStats.pendingEnrollments)}
              hint="Pre-admission pipeline"
              icon={UserPlus}
              accent="amber"
            />
            <StatTile
              label="Attendance today"
              value={`${dashboardStats.attendanceToday}%`}
              hint="Auto-synced campus-wide"
              icon={ClipboardCheck}
              accent="teal"
            />
            <StatTile
              label={user.role === "admin" ? "Outstanding billing" : "Live sessions"}
              value={
                user.role === "admin"
                  ? `$${(dashboardStats.outstandingBilling / 1000).toFixed(0)}k`
                  : String(dashboardStats.liveSessions)
              }
              hint={
                user.role === "admin"
                  ? "Invoices pending or overdue"
                  : "Distance learning today"
              }
              icon={user.role === "admin" ? CreditCard : MonitorPlay}
              accent={user.role === "admin" ? "coral" : "amber"}
            />
          </>
        ) : null}

        {user.role === "student" ? (
          <>
            <StatTile
              label="GPA"
              value="3.92"
              hint="STEM Honors"
              icon={GraduationCap}
            />
            <StatTile
              label="Attendance"
              value="98%"
              hint="This term"
              icon={ClipboardCheck}
              accent="teal"
            />
            <StatTile
              label="Courses"
              value="5"
              hint="Spring 2026"
              icon={TrendingUp}
              accent="amber"
            />
            <StatTile
              label="Live now"
              value={String(dashboardStats.liveSessions)}
              hint="Distance sessions"
              icon={MonitorPlay}
              accent="coral"
            />
          </>
        ) : null}

        {user.role === "parent" ? (
          <>
            <StatTile
              label="Student GPA"
              value="3.92"
              hint="Maya Chen"
              icon={GraduationCap}
            />
            <StatTile
              label="Attendance"
              value="98%"
              hint="This term"
              icon={ClipboardCheck}
              accent="teal"
            />
            <StatTile
              label="Open balance"
              value="$2,450"
              hint="Installment 3 pending"
              icon={CreditCard}
              accent="amber"
            />
            <StatTile
              label="Courses"
              value="5"
              hint="In progress"
              icon={TrendingUp}
            />
          </>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {showEnrollment ? (
          <section className="panel p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="display text-2xl text-ink">Enrollment pipeline</h2>
                <p className="mt-1 text-sm text-slate">
                  Latest pre-admission applications
                </p>
              </div>
              <Link
                href="/enrollment"
                className="text-sm font-semibold text-teal hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app.id}>
                      <td>
                        <p className="font-medium text-ink">{app.applicant}</p>
                        <p className="text-xs text-slate">{app.id}</p>
                      </td>
                      <td>
                        Grade {app.grade} · {app.program}
                      </td>
                      <td>
                        <StatusPill status={app.status} />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="progress-track w-24">
                            <div
                              className="progress-fill"
                              style={{ width: `${app.completeness}%` }}
                            />
                          </div>
                          <span className="text-sm text-ink">
                            {app.completeness}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="panel p-6">
            <div className="mb-5">
              <h2 className="display text-2xl text-ink">
                {user.role === "teacher"
                  ? "Class highlights"
                  : user.role === "student"
                    ? "Your week"
                    : "Family updates"}
              </h2>
              <p className="mt-1 text-sm text-slate">
                Recent activity relevant to your role
              </p>
            </div>
            <ul className="space-y-4">
              {activityFeed
                .filter((item) => {
                  if (user.role === "teacher") {
                    return ["attendance", "gradebook", "lms"].includes(item.type);
                  }
                  if (user.role === "student") {
                    return ["gradebook", "lms", "attendance"].includes(item.type);
                  }
                  return ["gradebook", "billing", "attendance"].includes(item.type);
                })
                .map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-line pb-4 last:border-none last:pb-0"
                  >
                    <p className="text-sm leading-relaxed text-ink">{item.text}</p>
                    <p className="mt-1 text-xs text-slate">
                      {item.time} · {item.type}
                    </p>
                  </li>
                ))}
            </ul>
          </section>
        )}

        <section className="panel p-6">
          <h2 className="display text-2xl text-ink">Live activity</h2>
          <p className="mt-1 text-sm text-slate">Cross-module events</p>
          <ul className="mt-5 space-y-4">
            {activityFeed.slice(0, showAdminPanels ? 5 : 4).map((item) => (
              <li
                key={item.id}
                className="border-b border-line pb-4 last:border-none last:pb-0"
              >
                <p className="text-sm leading-relaxed text-ink">{item.text}</p>
                <p className="mt-1 text-xs text-slate">
                  {item.time} · {item.type}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {showLearning ? (
          <section className="panel p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="display text-2xl text-ink">Distance sessions</h2>
                <p className="mt-1 text-sm text-slate">
                  LMS live rooms for hybrid and remote cohorts
                </p>
              </div>
              <Link
                href="/learning"
                className="text-sm font-semibold text-teal hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-mist/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{session.title}</p>
                      <StatusPill status={session.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate">
                      {session.course} · {session.host} · {session.duration}
                    </p>
                  </div>
                  <div className="text-sm text-slate">
                    {session.status === "live"
                      ? `${session.attendees} live now`
                      : new Date(session.startsAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="panel p-6 lg:col-span-2">
            <h2 className="display text-2xl text-ink">Billing snapshot</h2>
            <p className="mt-1 text-sm text-slate">
              Tuition and fees for Maya Chen
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-line bg-mist/70 px-4 py-4">
                <p className="font-semibold text-ink">
                  Spring 2026 Tuition — Installment 3
                </p>
                <p className="mt-1 text-sm text-slate">Due Jul 20 · $2,450 pending</p>
              </div>
              <div className="rounded-2xl border border-line bg-mist/70 px-4 py-4">
                <p className="font-semibold text-ink">IB Exam Registration</p>
                <p className="mt-1 text-sm text-slate">Paid Jun 30 · $420</p>
              </div>
            </div>
          </section>
        )}

        <section className="panel p-6">
          <h2 className="display text-2xl text-ink">Quick links</h2>
          <div className="mt-5 space-y-2">
            {(user.role === "admin"
              ? [
                  { href: "/crm", label: "Admissions CRM", icon: Users },
                  {
                    href: "/attendance",
                    label: "Automated attendance",
                    icon: ClipboardCheck,
                  },
                  { href: "/gradebook", label: "Gradebook", icon: TrendingUp },
                  {
                    href: "/learning",
                    label: "Distance learning",
                    icon: MonitorPlay,
                  },
                  { href: "/alumni", label: "Alumni tracking", icon: UsersRound },
                ]
              : user.role === "teacher"
                ? [
                    {
                      href: "/attendance",
                      label: "Attendance",
                      icon: ClipboardCheck,
                    },
                    { href: "/gradebook", label: "Gradebook", icon: TrendingUp },
                    { href: "/courses", label: "My courses", icon: GraduationCap },
                    {
                      href: "/learning",
                      label: "Distance learning",
                      icon: MonitorPlay,
                    },
                  ]
                : user.role === "student"
                  ? [
                      {
                        href: "/courses",
                        label: "My courses",
                        icon: GraduationCap,
                      },
                      {
                        href: "/gradebook",
                        label: "My grades",
                        icon: TrendingUp,
                      },
                      {
                        href: "/attendance",
                        label: "Attendance",
                        icon: ClipboardCheck,
                      },
                      {
                        href: "/learning",
                        label: "Live classes",
                        icon: MonitorPlay,
                      },
                    ]
                  : [
                      {
                        href: "/gradebook",
                        label: "Grades",
                        icon: TrendingUp,
                      },
                      {
                        href: "/attendance",
                        label: "Attendance",
                        icon: ClipboardCheck,
                      },
                      {
                        href: "/billing",
                        label: "Billing",
                        icon: CreditCard,
                      },
                      {
                        href: "/courses",
                        label: "Courses",
                        icon: GraduationCap,
                      },
                    ]
            ).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-ink transition hover:bg-foam"
                >
                  <Icon size={18} className="text-teal" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
