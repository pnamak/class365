"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_META } from "@/lib/auth";

export function TopBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  function handleSignOut() {
    signOut();
    router.push("/signin");
  }

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-md pl-12 lg:pl-0">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-16 -translate-y-1/2 text-slate lg:left-4"
        />
        <input
          type="search"
          placeholder="Search students, courses, invoices..."
          className="w-full rounded-2xl border border-line bg-white/80 py-3 pr-4 pl-12 text-sm outline-none ring-teal/30 transition focus:ring-2 lg:pl-11"
        />
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          type="button"
          className="relative rounded-2xl border border-line bg-white/80 p-3 text-ink-soft transition hover:bg-white"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-coral" />
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/80 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white">
            {user.avatar}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-xs text-slate">
              {ROLE_META[user.role].label} · {user.title}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white/80 px-3 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-white hover:text-ink"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Sign out</span>
        </button>
        <Link
          href="/signin"
          className="hidden text-xs font-semibold text-teal hover:underline xl:inline"
        >
          Switch role
        </Link>
      </div>
    </header>
  );
}
