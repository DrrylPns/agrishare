import prisma from "@/lib/db";
import { TraderSchema } from "@/lib/validations/user-settings";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function PUT(req: Request) {
    const session = await auth()

    try {
        const body = await req.json()

        const { address, city, companyName, country, state, zip } = TraderSchema.parse(body)

        await prisma.user.update({
            where: {
                id: session?.user.id
            },
            data: {
                address,
                city,
                companyName,
                country,
                state,
                zip,
            }
        })

        return new NextResponse(`Successfully updated address settings!`)
    } catch (error) {
        return new NextResponse('Could not update address settings' + error, { status: 500 })
    }
}