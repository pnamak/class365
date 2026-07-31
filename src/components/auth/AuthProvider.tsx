"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { DEMO_USERS, type SafeUser, type UserRole } from "@/lib/auth";

interface AuthContextValue {
  user: SafeUser | null;
  ready: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInAs: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthContextBridge({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();
  const ready = status !== "loading";

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { ok: false as const, error: "Invalid email or password." };
    }
    return { ok: true as const };
  }, []);

  const handleSignInAs = useCallback(async (role: UserRole) => {
    const demo = DEMO_USERS.find((item) => item.role === role);
    if (!demo) return;
    await signIn("credentials", {
      email: demo.email,
      password: demo.password,
      redirect: false,
    });
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const value = useMemo(() => {
    const user: SafeUser | null = data?.user
      ? {
          id: data.user.id,
          name: data.user.name ?? "User",
          email: data.user.email ?? "",
          role: data.user.role,
          title: data.user.title || "",
          avatar: data.user.avatar || "",
        }
      : null;

    return {
      user,
      ready,
      signIn: handleSignIn,
      signInAs: handleSignInAs,
      signOut: handleSignOut,
    };
  }, [data?.user, ready, handleSignIn, handleSignInAs, handleSignOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextBridge>{children}</AuthContextBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
