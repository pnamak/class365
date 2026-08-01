import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { courses } from "@/lib/data";

export default function ClassesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Classes & learning"
        title="Class catalog with credits"
        description="Core, pathway, and elective classes for Kindy–Year 13 — each with credit value, seats, and delivery mode."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Create class
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((classItem) => (
          <article key={classItem.id} className="panel flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">
                  {classItem.code}
                </p>
                <h2 className="display mt-2 text-2xl text-ink">
                  {classItem.title}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusPill status={classItem.kind} />
                <StatusPill status={classItem.mode} />
              </div>
            </div>
            <p className="mt-3 text-sm text-slate">
              {classItem.teacher} · {classItem.schedule}
            </p>
            <p className="mt-1 text-sm text-slate">
              {classItem.band} · {classItem.yearLevels.join(", ")}
            </p>
            <p className="mt-1 text-sm text-slate">
              {classItem.credits} credits · {classItem.students}/
              {classItem.seats} seats · {classItem.term}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate">
                <span>Term progress</span>
                <span>{classItem.progress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${classItem.progress}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
