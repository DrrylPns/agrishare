import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { AccountSchema } from "@/lib/validations/user-settings";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const session = await getAuthSession()

    try {
        const body = await req.json()

        const { name, lastName, image, phoneNumber } = AccountSchema.parse(body)

        const phoneNumberExists = await prisma.user.findFirst({
            where: { phoneNumber: phoneNumber }
        })

        if (phoneNumberExists && phoneNumberExists.id !== session?.user.id) {
            return new Response("Error: Bad Request, phone number is already in use by another user.", { status: 401 })
        }

        await prisma.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                name,
                lastName,
                image,
                phoneNumber,
            }
        })

        return new NextResponse(`Successfully updated account settings!`)
    } catch (error) {
        return new NextResponse('Could not update account settings' + error, { status: 500 })
    }
}