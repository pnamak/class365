import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatVatu, CURRENCY_LABEL } from "@/lib/currency";
import { invoices } from "@/lib/data";
import { SCHOOL } from "@/lib/locale";
import { AlertTriangle, CircleDollarSign, Wallet } from "lucide-react";

export default function BillingPage() {
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "overdue").length;
  const paidCycle = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Billing · Vanuatu Vatu (VT)"
        title="School fees & levies"
        description={`Invoice families in ${CURRENCY_LABEL} for ${SCHOOL.shortName} — Kindy to Year 13 term fees, deposits, and levies.`}
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Create invoice
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Open balance"
          value={formatVatu(outstanding)}
          hint="Pending + overdue"
          icon={CircleDollarSign}
          accent="amber"
        />
        <StatTile
          label="Overdue invoices"
          value={String(overdue)}
          icon={AlertTriangle}
          accent="coral"
        />
        <StatTile
          label="Paid this cycle"
          value={formatVatu(paidCycle)}
          hint={`${SCHOOL.city} campus ledger`}
          icon={Wallet}
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <p className="text-sm text-slate">
            All amounts are shown in Vanuatu Vatu (VT). Vatu has no decimal
            subdivision.
          </p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Student</th>
                <th>Year</th>
                <th>Description</th>
                <th>Due</th>
                <th>Amount (VT)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="font-medium text-ink">{invoice.id}</td>
                  <td>{invoice.studentName}</td>
                  <td>{invoice.yearLevel}</td>
                  <td>{invoice.description}</td>
                  <td>{invoice.dueDate}</td>
                  <td className="font-semibold text-ink">
                    {formatVatu(invoice.amount)}
                  </td>
                  <td>
                    <StatusPill status={invoice.status} />
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
