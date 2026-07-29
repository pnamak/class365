import { PageHeader } from "@/components/ui/PageHeader";
import { reportHighlights } from "@/lib/data";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Reporting"
        title="Campus intelligence"
        description="Cross-module KPIs spanning enrollment conversion, attendance, tuition collection, online completion, and alumni engagement."
        actions={
          <button
            type="button"
            className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink"
          >
            Export PDF
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportHighlights.map((item) => (
          <article key={item.label} className="panel p-5">
            <p className="text-sm text-slate">{item.label}</p>
            <p className="display mt-3 text-4xl text-ink">{item.value}</p>
            <p
              className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${
                item.positive ? "text-teal" : "text-coral"
              }`}
            >
              {item.positive ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {item.delta} vs prior term
            </p>
          </article>
        ))}
      </div>

      <section className="panel mt-6 p-6">
        <h2 className="display text-2xl text-ink">Recommended focus</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate">
          <li>
            Tuition collection dipped 2.3% — prioritize overdue notices for Arts
            Lab Fee and Spring Installment 3.
          </li>
          <li>
            Online class completion climbed 6% after distance office hours were
            introduced in DIG-13.
          </li>
          <li>
            CRM response time improved to 4.2 hours; keep tour follow-ups within
            24 hours of open house events.
          </li>
        </ul>
      </section>
    </div>
  );
}
