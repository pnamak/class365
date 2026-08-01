import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { StatusPill } from "@/components/ui/StatusPill";
import { socialPosts } from "@/lib/data";
import { HeartHandshake, MessagesSquare, Sparkles, Users } from "lucide-react";

export default function SocialLearningPage() {
  const discussions = socialPosts.filter((p) => p.type === "discussion").length;
  const projects = socialPosts.filter((p) => p.type === "project").length;

  return (
    <div>
      <PageHeader
        eyebrow="Social learning"
        title="Collaborate across Kindy–Year 13"
        description="Discussion spaces, peer review, project teams, and clubs that keep learning social — with year-level safe communities."
        actions={
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            Start a space
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active spaces"
          value={String(socialPosts.length)}
          icon={Users}
        />
        <StatTile
          label="Discussions"
          value={String(discussions)}
          icon={MessagesSquare}
          accent="teal"
        />
        <StatTile
          label="Projects"
          value={String(projects)}
          icon={Sparkles}
          accent="amber"
        />
        <StatTile
          label="Community likes"
          value={String(socialPosts.reduce((sum, p) => sum + p.likes, 0))}
          icon={HeartHandshake}
          accent="coral"
        />
      </div>

      <section className="panel overflow-hidden">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Space / topic</th>
                <th>Year</th>
                <th>Type</th>
                <th>Author</th>
                <th>Engagement</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {socialPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <p className="font-medium text-ink">{post.title}</p>
                    <p className="text-xs text-slate">{post.space}</p>
                  </td>
                  <td>{post.yearLevel}</td>
                  <td>
                    <StatusPill status={post.type} />
                  </td>
                  <td>{post.author}</td>
                  <td className="text-sm text-slate">
                    {post.replies} replies · {post.likes} likes
                  </td>
                  <td className="text-sm text-slate">
                    {new Date(post.updatedAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
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
