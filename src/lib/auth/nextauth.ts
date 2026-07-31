import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { toAppRole } from "@/lib/auth/roles";
import { applyAuthUrlFromEnv } from "@/lib/auth/public-url";
import { serverConfig } from "@/lib/settings";
import { authConfig } from "@/lib/auth/auth.config";

applyAuthUrlFromEnv();

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        if (
          user.emailVerified === false &&
          serverConfig.enableEmailIntegration
        ) {
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: toAppRole(user.role),
          title: user.title ?? "",
          avatar: user.avatar ?? "",
        };
      },
    }),
  ],
});
