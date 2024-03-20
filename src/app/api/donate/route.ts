import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { DonationSchema } from "@/lib/validations/donation";
import { getUserById } from "../../../../data/user";

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user && !session) {
            return new NextResponse("Error: No session found!", { status: 401 })
        }

        const body = await req.json()

        const { date, donatee, name, product, image, quantity } = DonationSchema.parse(body)

        const user = await getUserById(session.user.id)

        if (!user) {
            return new NextResponse("Error: No user found!", { status: 402 })
        }

        const calculatedPointsToGain = 10 * quantity

        await prisma.donation.create({
            data: {
                date,
                donatee,
                name,
                product,
                image: image as string,
                donatorId: user.id,
                quantity,
                pointsToGain: calculatedPointsToGain
            }
        })

        return new NextResponse("Donation sent", { status: 200 });
    } catch (error) {
        return new NextResponse(`Error: ${error}`, { status: 500 })
    }
}