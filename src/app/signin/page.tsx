"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  School,
  Shield,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DEMO_USERS, ROLE_META, type UserRole } from "@/lib/auth";

const roleIcons: Record<UserRole, typeof Shield> = {
  admin: Shield,
  teacher: GraduationCap,
  student: School,
  parent: UsersRound,
};

function SignInForm() {
  const { signIn, signInAs, user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";

  const [email, setEmail] = useState("admin@class365.edu");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, router, next]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.push(next);
  }

  async function quickSignIn(role: UserRole) {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
    setPending(true);
    setError("");
    await signInAs(role);
    router.push("/dashboard");
  }

  if (!ready || user) {
    return (
      <div className="panel mx-auto max-w-md px-6 py-5 text-center text-sm text-slate">
        {user ? "Redirecting to your workspace…" : "Loading sign in…"}
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-teal uppercase">
          Class 365 access
        </p>
        <h1 className="display mt-3 text-4xl text-ink md:text-5xl">
          Sign in to your campus workspace
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate md:text-base">
          Choose a role for a one-click demo session, or sign in with the shared
          demo password <span className="font-semibold text-ink">demo123</span>.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {(Object.keys(ROLE_META) as UserRole[]).map((role) => {
            const meta = ROLE_META[role];
            const Icon = roleIcons[role];
            const demo = DEMO_USERS.find((u) => u.role === role)!;
            return (
              <button
                key={role}
                type="button"
                onClick={() => quickSignIn(role)}
                className="panel group flex flex-col items-start p-4 text-left transition hover:-translate-y-0.5 hover:border-teal/30"
              >
                <div className="mb-3 flex w-full items-center justify-between gap-2">
                  <span className="inline-flex rounded-xl bg-foam p-2.5 text-teal">
                    <Icon size={18} />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.12em] text-slate uppercase">
                    {meta.label}
                  </span>
                </div>
                <p className="font-semibold text-ink">{demo.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate">
                  {meta.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal">
                  Sign in as {meta.label}
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel p-6 sm:p-8">
        <h2 className="display text-2xl text-ink">Email sign in</h2>
        <p className="mt-2 text-sm text-slate">
          Use any demo account below with password <strong>demo123</strong>.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold tracking-[0.08em] text-slate uppercase">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-teal/30 transition focus:ring-2"
              placeholder="you@class365.edu"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold tracking-[0.08em] text-slate uppercase">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-teal/30 transition focus:ring-2"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-60"
          >
            Sign in
            <ArrowRight size={16} />
          </button>
        </form>

        <ul className="mt-6 space-y-2 border-t border-line pt-5 text-xs text-slate">
          {DEMO_USERS.map((demo) => (
            <li key={demo.id} className="flex justify-between gap-3">
              <span className="capitalize">{demo.role}</span>
              <button
                type="button"
                className="font-medium text-teal hover:underline"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword(demo.password);
                  setError("");
                }}
              >
                {demo.email}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <Link href="/" className="display text-2xl text-ink">
          Class 365
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-slate transition hover:text-ink"
        >
          Back to home
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl text-sm text-slate">
            Loading sign in…
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
