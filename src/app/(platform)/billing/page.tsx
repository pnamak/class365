import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { invoices } from "@/lib/data";
import { AlertTriangle, CircleDollarSign, Wallet } from "lucide-react";

export default function BillingPage() {
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Tuition & fees"
        description="Generate invoices, track installments, and surface overdue balances tied to Kindy–Year 13 SIS records."
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
          value={`$${outstanding.toLocaleString()}`}
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
          value="$420"
          hint="Sample demo ledger"
          icon={Wallet}
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Student</th>
                <th>Year</th>
                <th>Description</th>
                <th>Due</th>
                <th>Amount</th>
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
                  <td>${invoice.amount.toLocaleString()}</td>
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
