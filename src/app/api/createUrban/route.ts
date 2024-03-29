import prisma from "@/lib/db";
import { UrbanFarmerSchema } from "@/lib/validations/user-settings";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { auth } from "../../../../auth";
import { generateUserId } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session) {
            return new NextResponse("Unauthorized", { status: 404 })
        }

        const isAdmin = await prisma.user.findFirst({
            where: {
                id: session.user.id
            }
        })

        if (!isAdmin) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()

        const {
            confirmPassword,
            lastName,
            middleInitial,
            name,
            password,
            phoneNumber,
            userId,
            email,
        } = UrbanFarmerSchema.parse(body)

        const emailExists = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (emailExists) {
            return new NextResponse("Email already taken", { status: 409 })
        }

        const phoneNumberExists = await prisma.user.findFirst({
            where: { phoneNumber: phoneNumber }
        })

        if (phoneNumberExists && phoneNumberExists.id !== session?.user.id) {
            return new NextResponse("Phone number already taken.", { status: 408 })
        }

        const userIdExists = await prisma.user.findFirst({
            where: {
                userId
            }
        })

        if (userIdExists) {
            return new NextResponse("User id already taken.", { status: 407 })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const urbanFarmer = await prisma.user.create({
            data: {
                name,
                lastName,
                middleInitial,
                hashedPassword,
                email,
                phoneNumber,
                userId,
                role: "TRADER",
            }
        })

        return NextResponse.json(urbanFarmer)
    } catch (error) {
        return new NextResponse(`Error creating urban farmer: ${error}`, { status: 500 })
    }
}