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

        // add  subcategory for 
        const { donatee, name, product, image, quantity, subcategory, category } = DonationSchema.parse(body)

        const user = await getUserById(session.user.id)

        if (!user) {
            return new NextResponse("Error: No user found!", { status: 402 })
        }

        const calculatedPointsToGain = 0

        const donation = await prisma.donation.create({
            data: {
                donatee,
                name,
                product,
                image: image as string,
                donatorId: user.id,
                quantity,
                pointsToGain: calculatedPointsToGain,
                subcategory,
                category,
            }
        })

        if (donation) {

            let ptsEquivalent
            let conditionRate = 1.5

            if (subcategory === "FRUIT_VEGETABLES") {
                ptsEquivalent = 0.18
            } else if (subcategory === "HERBS_VEGETABLES") {
                ptsEquivalent = 0.17
            } else if (subcategory === "LEAFY_VEGETABLES") {
                ptsEquivalent = 0.15
            } else if (subcategory === "PODDED_VEGETABLES") {
                ptsEquivalent = 0.25
            } else if (subcategory === "ROOT_VEGETABLES") {
                ptsEquivalent = 0.20
            } else {
                ptsEquivalent = 0.15
            }

            const calculatedPointsWithPE = (10 / ptsEquivalent) * quantity * conditionRate

            await prisma.donation.update({
                data: {
                    pointsToGain: calculatedPointsWithPE
                },
                where: {
                    id: donation.id
                }
            })
        }

        return new NextResponse("Donation sent", { status: 200 });
    } catch (error) {
        return new NextResponse(`Error: ${error}`, { status: 500 })
    }
}