"use client";

import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
} from "react";
import {
  DEMO_USERS,
  isUserRole,
  type SafeUser,
  type UserRole,
} from "@/lib/auth";

interface AuthContextValue {
  user: SafeUser | null;
  ready: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInAs: (
    role: UserRole,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthContextBridge({ children }: { children: React.ReactNode }) {
  const { data, status, update } = useSession();
  const ready = status !== "loading";

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        return { ok: false as const, error: "Invalid email or password." };
      }
      // Critical: sync SessionProvider before navigating to RequireAuth routes.
      await update();
      return { ok: true as const };
    },
    [update],
  );

  const handleSignInAs = useCallback(
    async (role: UserRole) => {
      const demo = DEMO_USERS.find((item) => item.role === role);
      if (!demo) {
        return { ok: false as const, error: "Demo account not found." };
      }
      return handleSignIn(demo.email, demo.password);
    },
    [handleSignIn],
  );

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    await update();
  }, [update]);

  const role = data?.user?.role;
  const user: SafeUser | null =
    data?.user && isUserRole(role)
      ? {
          id: data.user.id,
          name: data.user.name ?? "User",
          email: data.user.email ?? "",
          role,
          title: data.user.title || "",
          avatar: data.user.avatar || "",
        }
      : null;

  const value: AuthContextValue = {
    user,
    ready,
    status,
    signIn: handleSignIn,
    signInAs: handleSignInAs,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <AuthContextBridge>{children}</AuthContextBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
