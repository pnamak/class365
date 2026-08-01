import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { healthRecords } from "@/lib/data";
import { HeartPulse, ShieldAlert, Stethoscope, Syringe } from "lucide-react";

export default function HealthPage() {
  const allergies = healthRecords.filter((r) => r.type === "allergy").length;
  const plans = healthRecords.filter((r) => r.type === "plan").length;
  const high = healthRecords.filter((r) => r.severity === "high").length;

  return (
    <div>
      <PageHeader
        eyebrow="Health records"
        title="Student wellbeing & medical notes"
        description="Confidential health profiles for Kindy–Year 13 — immunisations, allergies, medications, sick-bay visits, and care plans."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add health note
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active records"
          value={String(healthRecords.length)}
          icon={HeartPulse}
        />
        <StatTile
          label="Allergy flags"
          value={String(allergies)}
          icon={ShieldAlert}
          accent="coral"
        />
        <StatTile
          label="Care plans"
          value={String(plans)}
          icon={Stethoscope}
          accent="amber"
        />
        <StatTile
          label="High priority"
          value={String(high)}
          hint="Requires staff awareness"
          icon={Syringe}
          accent="coral"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <p className="text-sm text-slate">
            Sensitive records are marked private. Access is role-restricted in a
            production deployment.
          </p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Year</th>
                <th>Type</th>
                <th>Summary</th>
                <th>Severity</th>
                <th>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((record) => (
                <tr key={record.id}>
                  <td className="font-medium text-ink">{record.studentName}</td>
                  <td>{record.yearLevel}</td>
                  <td>
                    <StatusPill status={record.type} />
                  </td>
                  <td>
                    <p className="max-w-md text-sm text-ink">{record.summary}</p>
                    <p className="text-xs text-slate">
                      {record.recordedBy}
                      {record.privateNote ? " · Private" : ""}
                    </p>
                  </td>
                  <td>
                    <StatusPill status={record.severity} />
                  </td>
                  <td>{record.recordedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
