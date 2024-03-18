import prisma from "@/lib/db";
import { RegisterSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (session?.user) {
            return new Response("Error: Already Logged In", { status: 403 })
        }

        const body = await req.json();

        const {
            email,
            password,
            lastName,
            name,
            confirmPassword,
            terms,
        } = RegisterSchema.parse(body)

        const userExists = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (userExists) {
            return new Response("Email already exists. Please use a different one.", { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                lastName,
                hashedPassword,
            }
        });

        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid POST request data passed", { status: 422 })
        }
        return new Response(`${error}, Could not create an account`, { status: 500 });
    }
}