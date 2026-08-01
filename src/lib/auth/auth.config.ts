import type { NextAuthConfig } from "next-auth";
import { applyAuthUrlFromEnv } from "@/lib/auth/public-url";
import { resolveAuthSecret } from "@/lib/auth/secret";

// Prevent Auth.js `TypeError: Invalid URL` when BASE_URL/AUTH_URL are unset
// (Node would otherwise coerce assignments to the string "undefined").
applyAuthUrlFromEnv();

const { secret } = resolveAuthSecret();

/** Edge-safe Auth.js config (no Prisma) — Sea Notes middleware pattern. */
export const authConfig = {
  // Required behind DigitalOcean App Platform's reverse proxy.
  trustHost: true,
  secret,
  providers: [],
  pages: {
    signIn: "/signin",
    // Keep users on our branded page instead of Auth.js HTML error screen.
    error: "/signin",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      if (pathname.startsWith("/api/auth")) return true;
      if (pathname === "/api/health" || pathname === "/api/system-status") {
        return true;
      }
      if (pathname === "/" || pathname === "/signin") return true;

      // Protect platform + API data routes
      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/students") ||
        pathname.startsWith("/api/students") ||
        pathname.startsWith("/api/classes") ||
        pathname.startsWith("/api/invoices") ||
        pathname.startsWith("/api/electives") ||
        pathname.startsWith("/api/notes") ||
        (!pathname.startsWith("/api") &&
          pathname !== "/" &&
          pathname !== "/signin")
      ) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.title = (user as { title?: string }).title;
        token.avatar = (user as { avatar?: string }).avatar;
        token.name = user.name;
        token.email = user.email;
      }
      // Keep a safe default so RequireAuth never blocks forever on a missing role.
      if (!token.role) token.role = "teacher";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.role =
          (token.role as "admin" | "teacher" | "student" | "parent") ||
          "teacher";
        session.user.title = (token.title as string) || "";
        session.user.avatar = (token.avatar as string) || "";
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  logger: {
    error(error) {
      console.error("[auth:error]", error);
    },
    warn(code) {
      console.warn("[auth:warn]", code);
    },
  },
} satisfies NextAuthConfig;
