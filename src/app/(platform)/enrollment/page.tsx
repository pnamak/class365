import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { applications } from "@/lib/data";
import { CheckCircle2, FileSearch, MessagesSquare } from "lucide-react";

const steps = [
  {
    title: "Inquiry intake",
    copy: "Families submit interest forms; CRM scores and routes each lead.",
    icon: FileSearch,
  },
  {
    title: "Application review",
    copy: "Document checklists, interviews, and waitlists stay in one flow.",
    icon: MessagesSquare,
  },
  {
    title: "Auto-enroll",
    copy: "Accepted applicants become SIS records with billing schedules.",
    icon: CheckCircle2,
  },
];

export default function EnrollmentPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Pre-admission"
        title="Enrollment workspace"
        description="Manage applications from first inquiry through accepted offers — then push clean records into the SIS."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            New application
          </button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="panel p-5">
              <div className="mb-3 inline-flex rounded-2xl bg-foam p-3 text-teal">
                <Icon size={20} />
              </div>
              <h2 className="font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {step.copy}
              </p>
            </div>
          );
        })}
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <h2 className="display text-2xl text-ink">Active applications</h2>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant</th>
                <th>Program</th>
                <th>Submitted</th>
                <th>Completeness</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="font-medium text-ink">{app.id}</td>
                  <td>{app.applicant}</td>
                  <td>
                    Grade {app.grade} · {app.program}
                  </td>
                  <td>{app.submittedAt}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="progress-track w-28">
                        <div
                          className="progress-fill"
                          style={{ width: `${app.completeness}%` }}
                        />
                      </div>
                      <span className="text-sm">{app.completeness}%</span>
                    </div>
                  </td>
                  <td>
                    <StatusPill status={app.status} />
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
