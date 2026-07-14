import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { students } from "@/lib/data";
import { School, Sparkles, UserCheck } from "lucide-react";

export default function StudentsPage() {
  const active = students.filter((s) => s.status === "active").length;

  return (
    <div>
      <PageHeader
        eyebrow="Student Information System"
        title="Student directory"
        description="Core SIS records for demographics, programs, advisors, GPA, and attendance health."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add student
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Roster size"
          value={String(students.length)}
          hint="Demo campus sample"
          icon={School}
        />
        <StatTile
          label="Active"
          value={String(active)}
          hint="Currently enrolled"
          icon={UserCheck}
          accent="teal"
        />
        <StatTile
          label="Avg GPA"
          value="3.54"
          hint="Active students only"
          icon={Sparkles}
          accent="amber"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Program</th>
                <th>Advisor</th>
                <th>GPA</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foam text-sm font-semibold text-teal">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{student.name}</p>
                        <p className="text-xs text-slate">
                          {student.id} · Grade {student.grade}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{student.program}</td>
                  <td>{student.advisor}</td>
                  <td>{student.gpa ? student.gpa.toFixed(2) : "—"}</td>
                  <td>
                    {student.attendanceRate
                      ? `${student.attendanceRate}%`
                      : "—"}
                  </td>
                  <td>
                    <StatusPill status={student.status} />
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
