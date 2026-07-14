import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { liveSessions } from "@/lib/data";
import { MonitorPlay, Radio, Video } from "lucide-react";

export default function LearningPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Distance learning"
        title="Live & asynchronous tools"
        description="Host remote cohorts, office hours, and hybrid workshops with attendance that rolls back into the SIS."
        actions={
          <button
            type="button"
            className="rounded-full bg-coral px-4 py-2.5 text-sm font-semibold text-white"
          >
            Start live room
          </button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Live classrooms",
            copy: "HD sessions with roster sync and recording archives.",
            icon: Video,
          },
          {
            title: "Presence tracking",
            copy: "Join/leave events feed automated attendance rules.",
            icon: Radio,
          },
          {
            title: "Resource hubs",
            copy: "Assignments, slides, and replays per course section.",
            icon: MonitorPlay,
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

      <section className="panel p-6">
        <h2 className="display text-2xl text-ink">Session schedule</h2>
        <div className="mt-5 space-y-3">
          {liveSessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col gap-3 rounded-2xl border border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{session.title}</p>
                  <StatusPill status={session.status} />
                </div>
                <p className="mt-1 text-sm text-slate">
                  {session.course} · Hosted by {session.host}
                </p>
              </div>
              <div className="text-sm text-slate">
                {new Date(session.startsAt).toLocaleString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                · {session.duration}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
