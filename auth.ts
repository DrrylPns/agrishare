import prisma from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role } from "@prisma/client"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { getAccountByUserId } from "./data/account"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getUserById } from "./data/user"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  callbacks: {
    async signIn({ user, account }) {

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified || !existingUser?.hashedPassword) return false;

      // 2FA Code
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
        session.user.lastName = token.lastName as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.picture = existingUser.image;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.lastName = existingUser.lastName;

      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig
})