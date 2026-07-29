"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  HeartPulse,
  Library,
  MessagesSquare,
  MonitorPlay,
  Share2,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatVatu, formatVatuCompact } from "@/lib/currency";
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
    title: "Kindy–Year 13 campus pulse",
    description:
      "Student management across Early Childhood to Secondary — attendance, grades, communications, enrollments, and integrations.",
    primaryHref: "/students",
    primaryLabel: "Student information",
    secondaryHref: "/communications",
    secondaryLabel: "Message families",
  },
  teacher: {
    title: "Your teaching workspace",
    description:
      "Attendance, grade management, class lists, and family communications for your year levels.",
    primaryHref: "/gradebook",
    primaryLabel: "Grade management",
    secondaryHref: "/attendance",
    secondaryLabel: "Take attendance",
  },
  student: {
    title: "Welcome back, Maya",
    description:
      "Year 11 classes, grades, attendance, and messages from Harbour Academy Port Vila.",
    primaryHref: "/classes",
    primaryLabel: "My classes",
    secondaryHref: "/communications",
    secondaryLabel: "Messages",
  },
  parent: {
    title: "Family portal",
    description:
      "Follow Maya Chen (Year 11) — attendance, grades, messages, and fees in VT.",
    primaryHref: "/gradebook",
    primaryLabel: "View grades",
    secondaryHref: "/communications",
    secondaryLabel: "School messages",
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
              hint={dashboardStats.yearSpan}
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
                  ? formatVatuCompact(dashboardStats.outstandingBilling)
                  : String(dashboardStats.liveSessions)
              }
              hint={
                user.role === "admin"
                  ? "Invoices pending or overdue (VT)"
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
              hint="Year 11 · NCEA STEM"
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
              label="Classes"
              value="5"
              hint="Term 2 2026"
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
              value={formatVatu(85000)}
              hint="Installment 2 pending"
              icon={CreditCard}
              accent="amber"
            />
            <StatTile
              label="Classes"
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
                        {app.yearLevel} · {app.program}
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
              School fees in Vanuatu Vatu for Maya Chen
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-line bg-mist/70 px-4 py-4">
                <p className="font-semibold text-ink">
                  Term 2 2026 fees — Installment 2
                </p>
                <p className="mt-1 text-sm text-slate">
                  Due Jul 20 · {formatVatu(85000)} pending
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-mist/70 px-4 py-4">
                <p className="font-semibold text-ink">Senior exam fees</p>
                <p className="mt-1 text-sm text-slate">
                  Paid Jun 30 · {formatVatu(15000)}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="panel p-6">
          <h2 className="display text-2xl text-ink">Quick links</h2>
          <div className="mt-5 space-y-2">
            {(user.role === "admin"
              ? [
                  {
                    href: "/schedule",
                    label: "Class schedules",
                    icon: CalendarDays,
                  },
                  {
                    href: "/social",
                    label: "Social learning",
                    icon: Share2,
                  },
                  {
                    href: "/library",
                    label: "Library",
                    icon: Library,
                  },
                  {
                    href: "/health",
                    label: "Health records",
                    icon: HeartPulse,
                  },
                  {
                    href: "/attendance",
                    label: "Attendance tracking",
                    icon: ClipboardCheck,
                  },
                  {
                    href: "/communications",
                    label: "Communications",
                    icon: MessagesSquare,
                  },
                ]
              : user.role === "teacher"
                ? [
                    {
                      href: "/schedule",
                      label: "Class schedules",
                      icon: CalendarDays,
                    },
                    {
                      href: "/attendance",
                      label: "Attendance",
                      icon: ClipboardCheck,
                    },
                    {
                      href: "/gradebook",
                      label: "Grade management",
                      icon: TrendingUp,
                    },
                    {
                      href: "/social",
                      label: "Social learning",
                      icon: Share2,
                    },
                    {
                      href: "/health",
                      label: "Health records",
                      icon: HeartPulse,
                    },
                  ]
                : user.role === "student"
                  ? [
                      {
                        href: "/schedule",
                        label: "My timetable",
                        icon: CalendarDays,
                      },
                      {
                        href: "/social",
                        label: "Social learning",
                        icon: Share2,
                      },
                      {
                        href: "/library",
                        label: "Library",
                        icon: Library,
                      },
                      {
                        href: "/classes",
                        label: "My classes",
                        icon: GraduationCap,
                      },
                    ]
                  : [
                      {
                        href: "/schedule",
                        label: "Class schedules",
                        icon: CalendarDays,
                      },
                      {
                        href: "/health",
                        label: "Health records",
                        icon: HeartPulse,
                      },
                      {
                        href: "/library",
                        label: "Library",
                        icon: Library,
                      },
                      {
                        href: "/billing",
                        label: "Billing",
                        icon: CreditCard,
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
