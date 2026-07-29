"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  AUTH_STORAGE_KEY,
  authenticate,
  DEMO_USERS,
  toSafeUser,
  type SafeUser,
  type UserRole,
} from "@/lib/auth";

const AUTH_EVENT = "class365-auth-change";

interface AuthContextValue {
  user: SafeUser | null;
  ready: boolean;
  signIn: (
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  signInAs: (role: UserRole) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Cached snapshot so useSyncExternalStore gets a stable Object.is reference. */
let cachedRaw: string | null | undefined;
let cachedUser: SafeUser | null = null;

function parseUser(raw: string | null): SafeUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SafeUser;
    const stillValid = DEMO_USERS.some((u) => u.id === parsed.id);
    if (!stillValid) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function readStoredUser(): SafeUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  cachedUser = parseUser(raw);
  return cachedUser;
}

function subscribe(onStoreChange: () => void) {
  const handler = () => {
    cachedRaw = undefined;
    onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener(AUTH_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(AUTH_EVENT, handler);
  };
}

function getSnapshot() {
  return readStoredUser();
}

function getServerSnapshot(): SafeUser | null {
  return null;
}

function getClientReady() {
  return true;
}

function getServerReady() {
  return false;
}

function persist(next: SafeUser | null) {
  if (next) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
  cachedRaw = undefined;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    () => () => {},
    getClientReady,
    getServerReady,
  );

  const signIn = useCallback((email: string, password: string) => {
    const matched = authenticate(email, password);
    if (!matched) {
      return { ok: false as const, error: "Invalid email or password." };
    }
    persist(toSafeUser(matched));
    return { ok: true as const };
  }, []);

  const signInAs = useCallback((role: UserRole) => {
    const matched = DEMO_USERS.find((u) => u.role === role);
    if (matched) persist(toSafeUser(matched));
  }, []);

  const signOut = useCallback(() => {
    persist(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signInAs, signOut }),
    [user, ready, signIn, signInAs, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
