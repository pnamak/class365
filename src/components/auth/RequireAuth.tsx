"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { canAccessRoute } from "@/lib/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!canAccessRoute(user.role, pathname)) {
      router.replace("/dashboard");
    }
  }, [ready, user, pathname, router]);

  if (!ready || !user || !canAccessRoute(user.role, pathname)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="panel px-6 py-5 text-sm text-slate">
          Checking your Class 365 session…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
