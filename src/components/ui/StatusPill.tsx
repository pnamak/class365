const styles: Record<string, { bg: string; color: string }> = {
  active: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  present: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  paid: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  approved: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  enrolled: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  live: { bg: "rgba(224,122,95,0.18)", color: "#c0564a" },
  overdue: { bg: "rgba(224,122,95,0.18)", color: "#c0564a" },
  absent: { bg: "rgba(224,122,95,0.18)", color: "#c0564a" },
  lost: { bg: "rgba(224,122,95,0.18)", color: "#c0564a" },
  withdrawn: { bg: "rgba(224,122,95,0.18)", color: "#c0564a" },
  pending: { bg: "rgba(232,163,23,0.18)", color: "#b7791f" },
  late: { bg: "rgba(232,163,23,0.18)", color: "#b7791f" },
  draft: { bg: "rgba(98,125,152,0.15)", color: "#486581" },
  review: { bg: "rgba(98,125,152,0.15)", color: "#486581" },
  inquiry: { bg: "rgba(98,125,152,0.15)", color: "#486581" },
  tour: { bg: "rgba(43,145,216,0.15)", color: "#186faf" },
  application: { bg: "rgba(43,145,216,0.15)", color: "#186faf" },
  interview: { bg: "rgba(43,145,216,0.15)", color: "#186faf" },
  documents: { bg: "rgba(232,163,23,0.18)", color: "#b7791f" },
  waitlist: { bg: "rgba(232,163,23,0.18)", color: "#b7791f" },
  accepted: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  alumni: { bg: "rgba(16,42,67,0.1)", color: "#102a43" },
  high: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  medium: { bg: "rgba(232,163,23,0.18)", color: "#b7791f" },
  low: { bg: "rgba(98,125,152,0.15)", color: "#486581" },
  upcoming: { bg: "rgba(43,145,216,0.15)", color: "#186faf" },
  ended: { bg: "rgba(98,125,152,0.15)", color: "#486581" },
  excused: { bg: "rgba(43,145,216,0.15)", color: "#186faf" },
  "in-person": { bg: "rgba(16,42,67,0.1)", color: "#102a43" },
  hybrid: { bg: "rgba(20,184,166,0.15)", color: "#0f766e" },
  online: { bg: "rgba(43,145,216,0.15)", color: "#186faf" },
};

export function StatusPill({ status }: { status: string }) {
  const style = styles[status] ?? styles.draft;
  return (
    <span
      className="status-pill capitalize"
      style={{ background: style.bg, color: style.color }}
    >
      {status.replace("-", " ")}
    </span>
  );
}
