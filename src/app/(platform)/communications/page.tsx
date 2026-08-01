import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { messages } from "@/lib/data";
import { BellRing, Mail, MessagesSquare, Smartphone } from "lucide-react";

export default function CommunicationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Communication tools"
        title="Reach families across Kindy–Year 13"
        description="Send targeted notices by school band, year level, class, or individual family — via app, email, SMS, or parent portal."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Compose message
          </button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          {
            title: "App notifications",
            copy: "Instant alerts for attendance and events.",
            icon: BellRing,
          },
          {
            title: "Email digests",
            copy: "Weekly learning updates by year level.",
            icon: Mail,
          },
          {
            title: "SMS urgent",
            copy: "Time-sensitive family confirmations.",
            icon: Smartphone,
          },
          {
            title: "Portal posts",
            copy: "Kindy learning stories and class notes.",
            icon: MessagesSquare,
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
          <h2 className="display text-2xl text-ink">Message centre</h2>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>From</th>
                <th>Audience</th>
                <th>Channel</th>
                <th>Opens</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <p className="font-medium text-ink">{message.subject}</p>
                    <p className="text-xs text-slate">
                      {new Date(message.sentAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td>{message.from}</td>
                  <td>
                    <p className="capitalize">
                      {message.audience.replace("-", " ")}
                    </p>
                    <p className="text-xs text-slate">{message.target}</p>
                  </td>
                  <td className="uppercase text-xs font-semibold tracking-[0.08em] text-slate">
                    {message.channel}
                  </td>
                  <td>{message.opens}</td>
                  <td>
                    <StatusPill status={message.status} />
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
