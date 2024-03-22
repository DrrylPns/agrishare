"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { DonationStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const fetchDonations = async () => {
    const donations = await prisma.donation.findMany({
        include: {
            donator: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return donations
}

export const fetchDonationsByUser = async () => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const donations = await prisma.donation.findMany({
        include: {
            donator: true
        },
        orderBy: {
            createdAt: "desc"
        },
        where: { id: session.user.id }
    })

    return donations
}

export const handleDonations = async (status: DonationStatus, pointsToGain: number, donationId: string, donatorId: string) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    if (!status || !(status in DonationStatus)) return { error: "Invalid status." }

    const currentDonation = await prisma.donation.findUnique({
        where: { id: donationId }
    })

    if (!currentDonation) return { error: "Donation not found." };

    const donator = await prisma.user.findUnique({
        where: { id: donatorId }
    })

    if (!donator) return { error: "No donator found!" }

    if (status === "APPROVED" && currentDonation.status === "APPROVED") {
        return { error: "Donation is already completed." };
    }

    if (status === "CANCELLED" && currentDonation.status === "CANCELLED") {
        return { error: "Donation is already cancelled." };
    }

    if (status === "CANCELLED" && currentDonation.status === "APPROVED") {
        return { error: "Invalid action, the trade is already cancelled." }
    }

    if (status === "APPROVED" && currentDonation.status === "CANCELLED") {
        return { error: "Invalid action, the trade is already confirmed." }
    }

    const processDonate = await prisma.donation.update({
        data: { status },
        where: { id: currentDonation.id }
    })

    if (status === "APPROVED") {

        if (processDonate) {
            await prisma.user.update({
                data: {
                    points: donator.points + pointsToGain
                },
                where: { id: donator.id }
            })
        }



        await prisma.transaction.create({
            data: {
                type: "DONATE",
                points: pointsToGain,
                userId: donator.id,
                dn: currentDonation.dn
            }
        })

        revalidatePath("/transactions")
        return { success: "Confirmed the donation." }
    }

    if (status === "CANCELLED") {

        // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

        // magccreate pa rin ng transaction pero cancelled at walang maggain na points?

        revalidatePath("/transactions")
        return { success: "Cancelled the donation" }
    }
}