import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { AgrifeedSchema } from "@/lib/validations/agrifeed";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getAuthSession()

    try {
        const body = await req.json()

        const {
            category,
            color,
            description,
            harvestDate,
            name,
            preferedOffers,
            quantity,
            shelfLife,
            type,
            weight,
            image,
        } = AgrifeedSchema.parse(body)

        let status: Status;

        if (quantity > 5) {
            status = Status.INSTOCK
        } else if (quantity >= 1 && quantity <= 4) {
            status = Status.LOWSTOCK
        } else {
            status = Status.OUTOFSTOCK
        }

        await prisma.post.create({
            data: {
                category,
                color,
                description,
                harvestDate,
                image: image as string,
                name,
                preferedOffers,
                quantity,
                shelfLife,
                type,
                weight,
                status,
                userId: session?.user.id as string,
            }
        })
        return new NextResponse(`Successfully posted a product!`)
    } catch (error) {
        return new NextResponse('Could not post' + error, { status: 500 })
    }
}