import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { attendance, yearLevelCensus } from "@/lib/data";
import { Fingerprint, Radar, ScanLine, School } from "lucide-react";

export default function AttendancePage() {
  const present = attendance.filter((a) => a.status === "present").length;
  const flagged = attendance.filter(
    (a) => a.status === "absent" || a.status === "late",
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Attendance tracking"
        title="Daily rolls from Kindy to Year 13"
        description="Capture presence by year level and class — auto sync, biometric check-in, or manual override — then alert pastoral care and families."
        actions={
          <button
            type="button"
            className="rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-white"
          >
            Run campus sync
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Present (sample)"
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
        <StatTile
          label="Year levels tracked"
          value={String(yearLevelCensus.length)}
          hint="Kindy through Year 13"
          icon={School}
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Year level</th>
                <th>Class</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium text-ink">{row.studentName}</td>
                  <td>{row.yearLevel}</td>
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
