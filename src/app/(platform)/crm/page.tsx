import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { leads } from "@/lib/data";

const stages = [
  "inquiry",
  "tour",
  "application",
  "accepted",
  "enrolled",
  "lost",
] as const;

export default function CrmPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Customer Relationship Management"
        title="Admissions CRM"
        description="Score and nurture prospective families for Kindy through Year 13 entry points."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add lead
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((stage) => {
          const count = leads.filter((lead) => lead.stage === stage).length;
          return (
            <div key={stage} className="panel px-4 py-4 text-center">
              <p className="text-2xl font-semibold text-ink">{count}</p>
              <p className="mt-1 text-xs tracking-[0.08em] text-slate uppercase">
                {stage}
              </p>
            </div>
          );
        })}
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Year level</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Score</th>
                <th>Last contact</th>
                <th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <p className="font-medium text-ink">{lead.name}</p>
                    <p className="text-xs text-slate">{lead.email}</p>
                  </td>
                  <td>{lead.yearLevel}</td>
                  <td>{lead.source}</td>
                  <td>{lead.interest}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="progress-track w-20">
                        <div
                          className="progress-fill"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{lead.score}</span>
                    </div>
                  </td>
                  <td>{lead.lastContact}</td>
                  <td>
                    <StatusPill status={lead.stage} />
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
