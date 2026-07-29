import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  LineChart,
  Users,
} from "lucide-react";

const modules = [
  {
    title: "Student information & health",
    copy: "Kindy–Year 13 records, guardians, health notes, and enrollment in one SIS.",
    icon: GraduationCap,
  },
  {
    title: "Schedules, attendance & grades",
    copy: "Weekly timetables, daily rolls, and assessment from OTJs to NCEA.",
    icon: BookOpenCheck,
  },
  {
    title: "Social learning & library",
    copy: "Peer spaces, clubs, and resource loans that keep campus learning connected.",
    icon: Users,
  },
  {
    title: "Communications & integrations",
    copy: "Family messaging plus connectors for Ministry, Google/Microsoft, and NZQA.",
    icon: LineChart,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <p className="display text-2xl text-white">Class 365</p>
          <nav className="hidden items-center gap-8 text-sm text-white/85 md:flex">
            <a href="#platform" className="hover:text-white">
              Platform
            </a>
            <a href="#modules" className="hover:text-white">
              Modules
            </a>
            <Link
              href="/signin"
              className="rounded-full bg-white px-4 py-2 font-semibold text-ink transition hover:bg-foam"
            >
              Sign in
            </Link>
          </nav>
          <Link
            href="/signin"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink md:hidden"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="mesh-hero relative min-h-[100svh] overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(232,163,23,0.18),transparent_30%)]" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-20 pt-32 md:pb-24">
          <div className="max-w-3xl">
            <p className="animate-rise display text-5xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              Class 365
            </p>
            <h1 className="animate-rise-delay-1 mt-6 max-w-2xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-4xl">
              Student management for Kindy to Year 13.
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Attendance, grades, schedules, social learning, library, health
              records, and school system integrations — Kindy through Year 13.
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
              >
                Sign in to Class 365
                <ArrowRight size={16} />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore modules
              </a>
            </div>
          </div>
          <div className="animate-drift pointer-events-none absolute right-8 bottom-28 hidden h-28 w-28 rounded-full border border-white/25 md:block" />
          <div className="animate-pulse-soft pointer-events-none absolute right-24 bottom-48 hidden h-3 w-3 rounded-full bg-amber md:block" />
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">
            Centralized operations
          </p>
          <h2 className="display mt-3 text-4xl text-ink md:text-5xl">
            Built for Kindy through Year 13
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate md:text-lg">
            One student management platform for Early Childhood, Primary,
            Intermediate, and Secondary — with the tools schools expect day to day.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Know every learner",
              copy: "Student information, guardians, homerooms, and year-level capacity from Kindy intake to Year 13 leavers.",
            },
            {
              title: "Run the school day",
              copy: "Track attendance, manage grades, message families, and keep classes in sync across every band.",
            },
            {
              title: "Connect your systems",
              copy: "Integrate government enrollment, productivity suites, assessment feeds, fees, and campus ID tools.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-line pt-6">
              <h3 className="display text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate md:text-base">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="border-y border-line bg-white/55 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">
              Unified modules
            </p>
            <h2 className="display mt-3 text-4xl text-ink md:text-5xl">
              The student management essentials
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foam text-teal">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      {module.copy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-14">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              Launch Class 365
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
        <p className="display text-xl text-ink">Class 365</p>
        <p>Cloud education management for modern campuses.</p>
      </footer>
    </div>
  );
}
