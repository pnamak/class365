import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export const { auth } = NextAuth(authConfig);

// Keep middleware thin — only enforce `authorized` from authConfig.
// Avoid bouncing /signin ↔ /dashboard here; that loop surfaces as a stuck
// "Checking your Class 365 session…" screen when the client session lags.
export default auth((req) => {
  void req;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
