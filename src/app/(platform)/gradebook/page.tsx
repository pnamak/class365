import { PageHeader } from "@/components/ui/PageHeader";
import { grades } from "@/lib/data";

function displayScore(entry: (typeof grades)[number]) {
  if (entry.scale === "otj") {
    return `${entry.score}/${entry.maxScore} OTJ`;
  }
  if (entry.scale === "ncea") {
    const pct = (entry.score / entry.maxScore) * 100;
    if (pct >= 90) return "Excellence";
    if (pct >= 80) return "Merit";
    if (pct >= 50) return "Achieved";
    return "Not Achieved";
  }
  return `${entry.score}/${entry.maxScore}`;
}

export default function GradebookPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Grade management"
        title="Assessment across the pathway"
        description="Learning stories and OTJs for Kindy–Primary, numeric marks for Intermediate, and NCEA standards for Year 11–13 — one gradebook for the whole school."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Publish grades
          </button>
        }
      />

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Year</th>
                <th>Course</th>
                <th>Assessment</th>
                <th>Scale</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((entry) => {
                const pct = Math.round((entry.score / entry.maxScore) * 100);
                return (
                  <tr key={entry.id}>
                    <td className="font-medium text-ink">
                      {entry.studentName}
                    </td>
                    <td>{entry.yearLevel}</td>
                    <td>{entry.course}</td>
                    <td>
                      <p>{entry.assignment}</p>
                      <p className="text-xs text-slate">
                        {entry.weight} · {entry.submittedAt}
                      </p>
                    </td>
                    <td className="uppercase text-xs font-semibold tracking-[0.08em] text-slate">
                      {entry.scale}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-ink">
                          {displayScore(entry)}
                        </span>
                        <div className="progress-track w-20">
                          <div
                            className="progress-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
