import { PageHeader } from "@/components/ui/PageHeader";
import { grades } from "@/lib/data";

function letterGrade(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  return "C-";
}

export default function GradebookPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gradebook management"
        title="Assessments & scoring"
        description="Weighted assignments across courses with transparent scoring for teachers, students, and advisors."
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
                <th>Course</th>
                <th>Assignment</th>
                <th>Weight</th>
                <th>Score</th>
                <th>Letter</th>
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
                    <td>{entry.course}</td>
                    <td>
                      <p>{entry.assignment}</p>
                      <p className="text-xs text-slate">
                        Submitted {entry.submittedAt}
                      </p>
                    </td>
                    <td>{entry.weight}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span>
                          {entry.score}/{entry.maxScore}
                        </span>
                        <div className="progress-track w-20">
                          <div
                            className="progress-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-ink">
                      {letterGrade(entry.score, entry.maxScore)}
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
