import { NextAuthOptions, getServerSession } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./db"
import bcrypt from "bcrypt"
import { getUserById } from "../../data/user"
import { getTwoFactorConfirmationByUserId } from "../../data/two-factor-confirmation"
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "./mail"
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens"

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

                if (!dbUser || !dbUser?.hashedPassword || !dbUser.email) {
                    throw new Error("No user found")
                }

                if (!dbUser.emailVerified) {
                    const verificationToken = await generateVerificationToken(dbUser.email)

                    await sendVerificationEmail(
                        verificationToken.email,
                        verificationToken.token,
                    )

                    throw new Error("User not verified, we sent a verification to your email.")
                }

                // 2FA CODE
                // if (dbUser.isTwoFactorEnabled && dbUser.email) {
                //     const twoFactorToken = await generateTwoFactorToken(dbUser.email)
                //     await sendTwoFactorTokenEmail(
                //         twoFactorToken.email,
                //         twoFactorToken.token,
                //     );
                // }


                const passwordMatch = await bcrypt.compare(credentials.password, dbUser.hashedPassword)

                if (!passwordMatch) {
                    throw new Error("Incorrect Password")
                }

                return dbUser
            }
        })
    ],
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            const existingUser = await getUserById(user.id)

            if (!existingUser?.emailVerified) return false

            // 2FA CODE
            // if (existingUser.isTwoFactorEnabled) {
            //     const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            //     if (!twoFactorConfirmation) {
            //         return false
            //     }

            //     await prisma.twoFactorConfirmation.delete({
            //         where: { id: twoFactorConfirmation.id }
            //     })
            // }

            return true
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.image = token.picture
                session.user.role = token.role
                session.user.name = token.name
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
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
                isTwoFactorEnabled: dbUser.isTwoFactorEnabled,
            }
        },
    }
}

export const getAuthSession = () => getServerSession(authOptions)
