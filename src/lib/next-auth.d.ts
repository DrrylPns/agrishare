import { UserRole } from 'prisma/prisma-client'
import type { Session, User } from 'next-auth'
import type { JWT } from "next-auth/jwt"
import 'next-auth/jwt'

type UserId = string

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
        role: UserRole
        isTwoFactorEnabled: boolean
    }
}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId
            role: UserRole
            isTwoFactorEnabled: boolean
        }
    }
}

import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}