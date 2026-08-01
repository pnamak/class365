export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
          {eyebrow}
        </p>
        <h1 className="display mt-2 text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate md:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
