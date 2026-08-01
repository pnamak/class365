import type { LucideIcon } from "lucide-react";

export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent = "teal",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "teal" | "amber" | "coral" | "ink";
}) {
  const accents = {
    teal: "from-teal/15 to-teal-bright/10 text-teal",
    amber: "from-amber/20 to-amber/5 text-[#b7791f]",
    coral: "from-coral/20 to-coral/5 text-coral",
    ink: "from-ink/10 to-ink/5 text-ink",
  };

  return (
    <div className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(16,42,67,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate">{label}</p>
          <p className="display mt-2 text-3xl text-ink">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate">{hint}</p> : null}
        </div>
        <div
          className={`rounded-2xl bg-gradient-to-br p-3 ${accents[accent]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
