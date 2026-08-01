"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { canAccessRoute } from "@/lib/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const { update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [revalidated, setRevalidated] = useState(false);

  // One session revalidation after mount — covers post-login cookie races on
  // DigitalOcean where the JWT cookie exists before SessionProvider catches up.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await update();
      } finally {
        if (!cancelled) setRevalidated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally once on mount for this protected layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "loading" || !revalidated) return;

    if (status === "unauthenticated" || !user) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!canAccessRoute(user.role, pathname)) {
      router.replace("/dashboard");
    }
  }, [status, user, pathname, router, revalidated]);

  if (status === "loading" || !revalidated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="panel px-6 py-5 text-sm text-slate">
          Checking your Class 365 session…
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="panel px-6 py-5 text-sm text-slate">
          Redirecting to sign in…
        </div>
      </div>
    );
  }

  if (!canAccessRoute(user.role, pathname)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="panel px-6 py-5 text-sm text-slate">
          Redirecting to your workspace…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
