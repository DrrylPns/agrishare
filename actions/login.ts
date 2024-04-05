"use server"

import prisma from "@/lib/db"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_ADMIN_REDIRECT, DEFAULT_DONATOR_REDIRECT } from "@/lib/routes"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { LoginSchema, LoginType } from "@/lib/validations/auth"
import { AuthError } from "next-auth"
import { signIn } from "../auth"
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation"
import { getTwoFactorTokenByEmail } from "../data/two-factor-token"
import { getUserByEmail } from "../data/user"

export const login = async (values: LoginType) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Confirmation email sent!" };
    }

    // 2FA Code
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code expired!" };
            }

            await prisma.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            );

            if (existingConfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                });
            }

            await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            );

            return { twoFactor: true };
        }
    }

    try {
        // await signIn("credentials", {
        //     email,
        //     password,
        //     // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        //     redirectTo: DEFAULT_LOGIN_REDIRECT,
        // })
        
        if (existingUser.role === "ADMIN") {
            await signIn("credentials", {
                email,
                password,
                // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
                redirectTo: DEFAULT_ADMIN_REDIRECT,
            })
        }

        if (existingUser.role === "TRADER") {
            await signIn("credentials", {
                email,
                password,
                // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
                redirectTo: DEFAULT_LOGIN_REDIRECT,
            })
        }

        if (existingUser.role === "DONATOR") {
            await signIn("credentials", {
                email,
                password,
                // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
                redirectTo: DEFAULT_DONATOR_REDIRECT,
            })
        }

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }

        throw error;
    }
}
