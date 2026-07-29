import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { courses } from "@/lib/data";

export default function CoursesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Classes & learning"
        title="Course catalog with credits"
        description="Core, pathway, and elective courses for Kindy–Year 13 — each with credit value, seats, and delivery mode."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Create course
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article key={course.id} className="panel flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">
                  {course.code}
                </p>
                <h2 className="display mt-2 text-2xl text-ink">
                  {course.title}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusPill status={course.kind} />
                <StatusPill status={course.mode} />
              </div>
            </div>
            <p className="mt-3 text-sm text-slate">
              {course.teacher} · {course.schedule}
            </p>
            <p className="mt-1 text-sm text-slate">
              {course.band} · {course.yearLevels.join(", ")}
            </p>
            <p className="mt-1 text-sm text-slate">
              {course.credits} credits · {course.students}/{course.seats} seats ·{" "}
              {course.term}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate">
                <span>Term progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
