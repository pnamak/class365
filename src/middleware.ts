import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname === "/signin" && req.auth) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // `authorized` callback in authConfig handles protection redirects
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
