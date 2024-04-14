import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { DonationSchema } from "@/lib/validations/donation";
import { getUserById } from "../../../../data/user";
import { generateDonationHistoryID } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user && !session) {
            return new NextResponse("Error: No session found!", { status: 401 })
        }

        const body = await req.json()

        // add  subcategory for 
        const { name, product, image, quantity, subcategory, category, pickUpDate } = DonationSchema.parse(body)

        const user = await getUserById(session.user.id)

        if (!user) {
            return new NextResponse("Error: No user found!", { status: 402 })
        }

        const dn = generateDonationHistoryID()

        // const donation =
         await prisma.donation.create({
            data: {
                // donatee,
                dn,
                name,
                product,
                image: image as string,
                donatorId: user.id,
                quantity,
                pointsToGain: 0,
                subcategory,
                category,
                pickUpDate,
            }
        })

        // if (donation) {

        //     let ptsEquivalent
        //     let conditionRate = 1.5

        //     if (subcategory === "FRUIT_VEGETABLES") {
        //         ptsEquivalent = 0.18
        //     } else if (subcategory === "HERBS_VEGETABLES") {
        //         ptsEquivalent = 0.17
        //     } else if (subcategory === "LEAFY_VEGETABLES") {
        //         ptsEquivalent = 0.15
        //     } else if (subcategory === "PODDED_VEGETABLES") {
        //         ptsEquivalent = 0.25
        //     } else if (subcategory === "ROOT_VEGETABLES") {
        //         ptsEquivalent = 0.20
        //     } else if (subcategory === "ORGANIC_FERTILIZER") {
        //         ptsEquivalent = 0.9
        //     } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
        //         ptsEquivalent = 0.45
        //     } else if (subcategory === "ORGANIC_SOIL") {
        //         ptsEquivalent = 0.95
        //     } else if (subcategory === "NOT_ORGANIC_SOIL") {
        //         ptsEquivalent = 0.50
        //     } else if (category === "SEEDS") {
        //         ptsEquivalent = 0.65
        //     } else {
        //         ptsEquivalent = 0.15
        //     } // todo: tools
        //     // Formula: (PFD or PFT / Points equivalent x quantity x condition rate = points Earned)

        //     const calculatedPointsWithPE = (10 / ptsEquivalent) * quantity * conditionRate

        //     await prisma.donation.update({
        //         data: {
        //             pointsToGain: calculatedPointsWithPE
        //         },
        //         where: {
        //             id: donation.id
        //         }
        //     })
        // }

        return new NextResponse("Donation sent", { status: 200 });
    } catch (error) {
        return new NextResponse(`Error: ${error}`, { status: 500 })
    }
}