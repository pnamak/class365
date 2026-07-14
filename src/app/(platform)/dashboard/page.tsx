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
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  activityFeed,
  applications,
  dashboardStats,
  liveSessions,
} from "@/lib/data";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Centralized dashboard"
        title="Campus pulse for Harbor Academy"
        description="SIS, LMS, and CRM signals in one view — from today’s attendance to open enrollments and live distance sessions."
        actions={
          <>
            <Link
              href="/enrollment"
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              Review enrollments
            </Link>
            <Link
              href="/reports"
              className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Open reports
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          label="Outstanding billing"
          value={`$${(dashboardStats.outstandingBilling / 1000).toFixed(0)}k`}
          hint="Invoices pending or overdue"
          icon={CreditCard}
          accent="coral"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
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

        <section className="panel p-6">
          <h2 className="display text-2xl text-ink">Live activity</h2>
          <p className="mt-1 text-sm text-slate">Cross-module events</p>
          <ul className="mt-5 space-y-4">
            {activityFeed.map((item) => (
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

        <section className="panel p-6">
          <h2 className="display text-2xl text-ink">Quick links</h2>
          <div className="mt-5 space-y-2">
            {[
              { href: "/crm", label: "Admissions CRM", icon: Users },
              { href: "/attendance", label: "Automated attendance", icon: ClipboardCheck },
              { href: "/gradebook", label: "Gradebook", icon: TrendingUp },
              { href: "/learning", label: "Distance learning", icon: MonitorPlay },
              { href: "/alumni", label: "Alumni tracking", icon: UsersRound },
            ].map((link) => {
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
