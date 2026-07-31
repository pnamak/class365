import type { NextAuthConfig } from "next-auth";
import { applyAuthUrlFromEnv } from "@/lib/auth/public-url";

// Prevent Auth.js `TypeError: Invalid URL` when BASE_URL/AUTH_URL are unset
// (Node would otherwise coerce assignments to the string "undefined").
applyAuthUrlFromEnv();

/** Edge-safe Auth.js config (no Prisma) — Sea Notes middleware pattern. */
export const authConfig = {
  // Required behind DigitalOcean App Platform's reverse proxy.
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [],
  pages: {
    signIn: "/signin",
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
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "admin"
          | "teacher"
          | "student"
          | "parent";
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
} satisfies NextAuthConfig;
