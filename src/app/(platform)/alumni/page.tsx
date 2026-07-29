import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatVatu } from "@/lib/currency";
import { alumni } from "@/lib/data";
import { SCHOOL } from "@/lib/locale";
import { HeartHandshake, MapPinned, Sparkles } from "lucide-react";

export default function AlumniPage() {
  const donated = alumni.reduce((sum, a) => sum + a.donated, 0);
  const high = alumni.filter((a) => a.engagement === "high").length;

  return (
    <div>
      <PageHeader
        eyebrow="Alumni tracking"
        title="Lifelong campus network"
        description={`Follow careers, engagement, and giving in Vanuatu Vatu — keeping ${SCHOOL.shortName} graduates connected across Vanuatu and the region.`}
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Plan reunion
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Tracked alumni"
          value={String(alumni.length)}
          hint={`${SCHOOL.city} cohort`}
          icon={MapPinned}
        />
        <StatTile
          label="High engagement"
          value={String(high)}
          icon={Sparkles}
          accent="teal"
        />
        <StatTile
          label="Giving YTD"
          value={formatVatu(donated)}
          icon={HeartHandshake}
          accent="amber"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Alumnus</th>
                <th>Class</th>
                <th>Program</th>
                <th>Employer</th>
                <th>Location</th>
                <th>Engagement</th>
                <th>Donated (VT)</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((person) => (
                <tr key={person.id}>
                  <td className="font-medium text-ink">{person.name}</td>
                  <td>{person.graduationYear}</td>
                  <td>{person.program}</td>
                  <td>{person.employer}</td>
                  <td>{person.location}</td>
                  <td>
                    <StatusPill status={person.engagement} />
                  </td>
                  <td className="font-semibold text-ink">
                    {formatVatu(person.donated)}
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
