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
        }
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

        revalidatePath("/transactions")
        return { success: "Confirmed the donation." }
    }

    if (status === "CANCELLED") {

        revalidatePath("/transactions")
        return { success: "Cancelled the donation" }
    }
}