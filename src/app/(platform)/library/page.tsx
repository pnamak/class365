import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { libraryItems } from "@/lib/data";
import { BookMarked, Clock3, Library, PackageCheck } from "lucide-react";

export default function LibraryPage() {
  const available = libraryItems.filter((i) => i.status === "available").length;
  const onLoan = libraryItems.filter((i) => i.status === "on-loan").length;
  const overdue = libraryItems.filter((i) => i.status === "overdue").length;

  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Campus library & resource loans"
        description="Track books, kits, and study guides for Kindy through Year 13 — availability, reservations, and overdue notices."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Check out item
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Catalog items"
          value={String(libraryItems.length)}
          icon={Library}
        />
        <StatTile
          label="Available"
          value={String(available)}
          icon={PackageCheck}
          accent="teal"
        />
        <StatTile
          label="On loan"
          value={String(onLoan)}
          icon={BookMarked}
          accent="amber"
        />
        <StatTile
          label="Overdue"
          value={String(overdue)}
          icon={Clock3}
          accent="coral"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year levels</th>
                <th>Borrower</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {libraryItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-slate">
                      {item.id} · {item.author}
                    </p>
                  </td>
                  <td>{item.category}</td>
                  <td className="text-sm">{item.yearLevels.join(", ")}</td>
                  <td>{item.borrower}</td>
                  <td>{item.dueDate}</td>
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
