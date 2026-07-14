import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { attendance } from "@/lib/data";
import { Fingerprint, Radar, ScanLine } from "lucide-react";

export default function AttendancePage() {
  const present = attendance.filter((a) => a.status === "present").length;
  const flagged = attendance.filter(
    (a) => a.status === "absent" || a.status === "late",
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Automated attendance"
        title="Daily attendance sync"
        description="Capture presence via auto roster sync, biometric check-in, or manual override — then push alerts to advisors."
        actions={
          <button
            type="button"
            className="rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-white"
          >
            Run sync now
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Present (sample day)"
          value={String(present)}
          icon={ScanLine}
        />
        <StatTile
          label="Flagged"
          value={String(flagged)}
          hint="Absent or late"
          icon={Radar}
          accent="coral"
        />
        <StatTile
          label="Capture methods"
          value="3"
          hint="Auto · biometric · manual"
          icon={Fingerprint}
          accent="amber"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium text-ink">{row.studentName}</td>
                  <td>{row.course}</td>
                  <td>{row.date}</td>
                  <td className="capitalize">{row.method}</td>
                  <td>
                    <StatusPill status={row.status} />
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
