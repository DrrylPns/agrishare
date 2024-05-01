"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { Category, DonationStatus, Subcategory } from "@prisma/client"
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
        where: { donatorId: session.user.id }
    })

    return donations
}

export const handleCancelDonation = async (status: DonationStatus, donationId: string, donatorId: string) => {
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

    if (status === "CANCELLED" && currentDonation.status === "CANCELLED") {
        return { error: "Donation is already cancelled." };
    }
    const processDonate = await prisma.donation.update({
        data: { status },
        where: { id: currentDonation.id }
    })

    revalidatePath("/transactions")
    return { success: "Confirmed the donation." }

}

export const handleDonations = async (status: DonationStatus, quantity: number, conditionRate: number, subcategory: Subcategory | null, category: Category, donationId: string, donatorId: string, size: string | null) => {
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

    if (processDonate) {

        let ptsEquivalent

        if (subcategory === "FRUIT_VEGETABLES") {
            ptsEquivalent = 0.09
        } else if (subcategory === "HERBS_VEGETABLES") {
            ptsEquivalent = 0.17
        } else if (subcategory === "LEAFY_VEGETABLES") {
            ptsEquivalent = 0.07
        } else if (subcategory === "PODDED_VEGETABLES") {
            ptsEquivalent = 0.125
        } else if (subcategory === "ROOT_VEGETABLES") {
            ptsEquivalent = 0.07
        } else if (subcategory === "ORGANIC_FERTILIZER") {
            ptsEquivalent = 0.18
        } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
            ptsEquivalent = 0.45
        } else if (subcategory === "ORGANIC_SOIL") {
            ptsEquivalent = 1.5
        } else if (subcategory === "NOT_ORGANIC_SOIL") {
            ptsEquivalent = 0.50
        } else if (subcategory === "CITRUS_FRUITS") {
            ptsEquivalent = 0.13
        } else if (subcategory === "TROPICAL_FRUIT") {
            ptsEquivalent = 0.041
        } else if (subcategory === "COCONUT") {
            ptsEquivalent = 0.054
        } else if (subcategory === "WATER_HOSE" && size === "1/4") {
            ptsEquivalent = 0.55
        } else if (subcategory === "WATER_HOSE" && size === "1/2") {
            ptsEquivalent = 0.45
        } else if (subcategory === "WATER_HOSE" && size === "3/4") {
            ptsEquivalent = 0.35
        } else if (subcategory === "GARDEN_POTS" && size === "Small") {
            ptsEquivalent = 0.09
        } else if (subcategory === "GARDEN_POTS" && size === "Medium") {
            ptsEquivalent = 0.08
        } else if (subcategory === "GARDEN_POTS" && size === "Large") {
            ptsEquivalent = 0.078
        } else if (subcategory === "BUCKET" && size === "Small") {
            ptsEquivalent = 0.10
        } else if (subcategory === "BUCKET" && size === "Medium") {
            ptsEquivalent = 0.9
        } else if (subcategory === "BUCKET" && size === "Large") {
            ptsEquivalent = 0.085
        } else if (subcategory === "KALAYKAY" && size === "Small") {
            ptsEquivalent = 0.11
        } else if (subcategory === "KALAYKAY" && size === "Large") {
            ptsEquivalent = 0.067
        } else if (subcategory === "SHOVEL" && size === "Small") {
            ptsEquivalent = 0.11
        } else if (subcategory === "SHOVEL" && size === "Large") {
            ptsEquivalent = 0.067
        } else if (subcategory === "HOES" || subcategory === "HAND_PRUNES") {
            ptsEquivalent = 0.067
        } else if (subcategory === "GLOVES") {
            ptsEquivalent = 0.12
        } else if (subcategory === "WHEEL_BARROW") {
            ptsEquivalent = 0.0125
        } else if (category === "SEEDS") {
            ptsEquivalent = 0.65
        } else {
            ptsEquivalent = 0.15
        }

        const calculatedPointsWithPE = (10 / ptsEquivalent) * quantity * conditionRate

        // const result = 10 / ptsEquivalent

        // const pts = result * processDonate.quantity

        // const calculatedPointsWithPE = pts * conditionRate

        await prisma.donation.update({
            data: {
                pointsToGain: calculatedPointsWithPE
            },
            where: {
                id: donationId
            }
        })
        if (status === "APPROVED") {
            if (processDonate) {
                await prisma.user.update({
                    data: {
                        points: donator.points + calculatedPointsWithPE
                    },
                    where: { id: donator.id }
                })
            }
            await prisma.transaction.create({
                data: {
                    type: "DONATE",
                    points: calculatedPointsWithPE,
                    userId: donator.id,
                    dn: currentDonation.dn
                }
            })

            await prisma.notification.create({
                data: {
                    type: "DONATIONAPPROVED",
                    userId: donator.id,
                }
            })

            revalidatePath("/transactions")
            return { success: "Confirmed the donation." }
        }

        if (status === "CANCELLED") {

            // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

            // magccreate pa rin ng transaction pero cancelled at walang maggain na points?

            await prisma.notification.create({
                data: {
                    type: "DONATIONCANCELLED",
                    userId: donator.id,
                }
            })

            revalidatePath("/transactions")
            return { success: "Donation cancelled" }
        }
    }
}

export const handleDonationProof = async (img: string, donationId: string) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const findDonator = await prisma.donation.findFirst({
        where: {
            id: donationId,
        }
    })

    if (findDonator) {
        await prisma.donation.update({
            where: { id: findDonator?.id },
            data: {
                proof: img,
            },
        })
    }

    return { success: "Proof uploaded." }
}