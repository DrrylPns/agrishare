import { NextAuthOptions, getServerSession } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./db"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/',
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Enter a valid email or password")
                }

                const dbUser = await prisma.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                })

                if (!dbUser || !dbUser?.hashedPassword) {
                    throw new Error("No user found")
                }

                const passwordMatch = await bcrypt.compare(credentials.password, dbUser.hashedPassword)

                if (!passwordMatch) {
                    throw new Error("Incorrect Password")
                }

                return dbUser
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.image = token.picture
                session.user.role = token.role
                session.user.name = token.name
            }

            return session;
        },
        async jwt({ token, user }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token.email
                },
            })

            if (!dbUser) {
                token.id = user!.id
                return token
            }

            return {
                id: dbUser.id,
                email: dbUser.email,
                picture: dbUser.image,
                role: dbUser.role,
                name: dbUser.name,
            }
        },
    }
}

export const getAuthSession = () => getServerSession(authOptions)