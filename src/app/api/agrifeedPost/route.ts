import prisma from "@/lib/db";
import { AgrifeedSchema } from "@/lib/validations/agrifeed";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
    const session = await auth()

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
            shelfLifeDuration,
            shelfLifeUnit,
            type,
            weight,
            image,
            id,
        } = AgrifeedSchema.parse(body)

        if (shelfLifeDuration <= 0) {
            return new NextResponse(`The shelf life duration must be a positive number greater than 0. The value "${shelfLifeDuration}" is invalid.`);
        }

        let status: Status;

        if (quantity > 5) {
            status = Status.INSTOCK
        } else if (quantity >= 1 && quantity <= 4) {
            status = Status.LOWSTOCK
        } else {
            status = Status.OUTOFSTOCK
        }

        await prisma.post.update({
            where: {
                id
            },
            data: {
                category,
                color,
                description,
                harvestDate,
                image: image as string,
                name,
                preferedOffers,
                quantity,
                shelfLifeDuration,
                shelfLifeUnit,
                type,
                weight,
                status,
                userId: session?.user.id as string,
            }
        })
        return new NextResponse(`Successfully update the product!`)
    } catch (error) {
        return new NextResponse('Could not post' + error, { status: 500 })
    }
}