import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { integrations } from "@/lib/data";
import { Link2, RefreshCw, ShieldCheck } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="School system integrations"
        title="Connect Class 365 to your stack"
        description="Keep Kindy–Year 13 student data flowing between MoET Vanuatu, productivity suites, assessment feeds, Vatu fee payments, and campus ID systems."
        actions={
          <button
            type="button"
            className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
          >
            Browse catalog
          </button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Roster sync",
            copy: "Push year-level and class memberships to Google, Microsoft, and learning tools.",
            icon: RefreshCw,
          },
          {
            title: "Secure identity",
            copy: "SSO and student ID linking for attendance kiosks and parent portals.",
            icon: ShieldCheck,
          },
          {
            title: "Vatu payments",
            copy: "Connect local banking rails so school fees settle in Vanuatu Vatu.",
            icon: Link2,
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
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>System</th>
                <th>Category</th>
                <th>Description</th>
                <th>Last sync</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-ink">{item.name}</td>
                  <td>{item.category}</td>
                  <td className="max-w-md text-sm text-slate">
                    {item.description}
                  </td>
                  <td>{item.lastSync}</td>
                  <td>
                    <StatusPill status={item.status} />
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
