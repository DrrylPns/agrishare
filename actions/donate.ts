"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { Category, DonationStatus, Subcategory } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { SendDonationType, sendDonationSchema } from "@/lib/validations/donation"

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

export const fetchDonationsByDateRange = async (startDate: Date, endDate: Date) => {
    const donations = await prisma.donation.findMany({
        where: {
            createdAt: {
                gte: startDate, // greater than or equal to the start date
                lte: endDate,   // less than or equal to the end date
            },
            status: "APPROVED",
        },
        include: {
            donator: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    const sumPointsToGain = await prisma.donation.aggregate({
        _sum: {
            pointsToGain: true
        },
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
            status: "APPROVED",
        },
    });

    const countDonations = await prisma.donation.count({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
            status: "APPROVED",
        },
    })

    const totalPointsToGain = sumPointsToGain._sum?.pointsToGain || 0;

    const formattedTotalPoints = totalPointsToGain.toLocaleString();

    return { donations, countDonations, formattedTotalPoints };
};

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

export const handleDonations = async (status: DonationStatus, quantity: number, conditionRate: number, subcategory: Subcategory | null, category: Category, donationId: string, donatorId: string, size: string | null, remarks?: string) => {
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

    if (status === "DECLINED" && currentDonation.status === "DECLINED") {
        return { error: "Donation is already cancelled." };
    }

    if (status === "DECLINED" && currentDonation.status === "APPROVED") {
        return { error: "Invalid action, the trade is already cancelled." }
    }

    if (status === "APPROVED" && currentDonation.status === "DECLINED") {
        return { error: "Invalid action, the trade is already confirmed." }
    }

    if (currentDonation.status === "CANCELLED") {
        return { error: "Invalid action, the donator has cancelled its donation." }
    }

    if (remarks) {
        await prisma.donation.update({
            data: {
                status,
                remarks,
            },
            where: {
                id: currentDonation.id
            }
        })
    }

    const processDonate = await prisma.donation.update({
        data: { status },
        where: { id: currentDonation.id }
    })

    if (processDonate) {

        let ptsEquivalent

        if (subcategory === "Eggplant" || subcategory === "Ampalaya" || subcategory === "Tomato" || subcategory === "Chili" || subcategory === "BellPepperGreen" || subcategory === "BellPepperRed" || subcategory === "Squash" || subcategory === "BlueTarnette" || subcategory === "Patola" || subcategory === "Okra") {
            ptsEquivalent = 0.9
        } else if (subcategory === "AmpalayaLeaves" || subcategory === "WaterSpinach" || subcategory === "SweetPotatoLeaves" || subcategory === "MalabarSpinach" || subcategory === "JewsMallow" || subcategory === "ChiliLeaves" || subcategory === "Moringaoleifera" || subcategory === "TaroLeaves" || subcategory === "OnionLeaves" || subcategory === "PetchayNative" || subcategory === "PetchayBaguio" || subcategory === "CabbageRareBall" || subcategory === "CabbageScorpio" || subcategory === "Basil") {
            ptsEquivalent = 1.5
        } else if (subcategory === "Sitao" || subcategory === "BaguioBeans" || subcategory === "GiantPatani") {
            ptsEquivalent = 2.5
        } else if (subcategory === "Carrots" || subcategory === "WhitePotato" || subcategory === "Chayote" || subcategory === "RedOnion" || subcategory === "WhiteOnion" || subcategory === "WhiteOnionImported" || subcategory === "GarlicImported" || subcategory === "GarlicNative" || subcategory === "Ginger") {
            ptsEquivalent = 1.5
        } else if (subcategory === "ORGANIC_FERTILIZER") {
            ptsEquivalent = 1.8
        } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
            ptsEquivalent = 2.5
        } else if (subcategory === "ORGANIC_SOIL") {
            ptsEquivalent = 1.5
        } else if (subcategory === "NOT_ORGANIC_SOIL") {
            ptsEquivalent = 5
        } else if (subcategory === "Calamansi" || subcategory === "MandarinOrange") {
            ptsEquivalent = 1.3
        } else if (subcategory === "Banana" || subcategory === "Mango" || subcategory === "Avocado" || subcategory === "CottonFruit" || subcategory === "Pineapple" || subcategory === "Soursop" || subcategory === "CustardApple" || subcategory === "Papaya" || subcategory === "Lanzones") {
            ptsEquivalent = 1.4
        } else if (subcategory === "COCONUT") {
            ptsEquivalent = 0.54
        } else if (subcategory === "GiantPataniSeed" || subcategory === "BlueTarnetteSeed" || subcategory === "AmpalayaSeed" || subcategory === "PatolaSeed" || subcategory === "OkraSeed" || subcategory === "BasilSeed" || subcategory === "Talong" || subcategory === "Sitaw" || subcategory === "BaguioBeansSeed") {
            ptsEquivalent = 3.25
        } else if (subcategory === "WATER_HOSE" && size === "1/4") {
            ptsEquivalent = 0.55
        } else if (subcategory === "WATER_HOSE" && size === "1/2") {
            ptsEquivalent = 0.45
        } else if (subcategory === "WATER_HOSE" && size === "3/4") {
            ptsEquivalent = 0.35
        } else if (subcategory === "GARDEN_POTS" && size === "Small") {
            ptsEquivalent = 0.9
        } else if (subcategory === "GARDEN_POTS" && size === "Medium") {
            ptsEquivalent = 0.8
        } else if (subcategory === "GARDEN_POTS" && size === "Large") {
            ptsEquivalent = 0.7
        } else if (subcategory === "BUCKET" && size === "Small") {
            ptsEquivalent = 1
        } else if (subcategory === "BUCKET" && size === "Medium") {
            ptsEquivalent = 0.9
        } else if (subcategory === "BUCKET" && size === "Large") {
            ptsEquivalent = 0.8
        } else if (subcategory === "KALAYKAY" && size === "Small") {
            ptsEquivalent = 1.1
        } else if (subcategory === "KALAYKAY" && size === "Large") {
            ptsEquivalent = 0.67
        } else if (subcategory === "SHOVEL" && size === "Small") {
            ptsEquivalent = 1.1
        } else if (subcategory === "SHOVEL" && size === "Large") {
            ptsEquivalent = 0.67
        } else if (subcategory === "HOES" || subcategory === "HAND_PRUNES") {
            ptsEquivalent = 0.67
        } else if (subcategory === "GLOVES") {
            ptsEquivalent = 1.2
        } else if (subcategory === "WHEEL_BARROW") {
            ptsEquivalent = 0.0350
        } else if (category === "SEEDS") {
            ptsEquivalent = 3.25
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

            if (!remarks) return { error: "Remarks needed!" }

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

export const findDonation = async (donationId: string) => {
    try {

        if (!donationId) return { error: "Invalid donation" }

        const currentDonation = await prisma.donation.findUnique({
            where: {
                dn: donationId
            }
        })

        if (!currentDonation) return { error: "Error: Can't find donation id!" }

        return { currentDonation, success: "Donation Found!" }
    } catch (error) {
        throw new Error(error as any)
    }
}

export const sendDonation = async (values: SendDonationType, coordinateId: string) => {
    try {

        const validatedFields = sendDonationSchema.safeParse(values)

        if (!validatedFields.success) return { error: "Invalid fields" }

        const {
            dn,
            item,
            name,
        } = validatedFields.data

        const currentDonation = await prisma.donation.findUnique({
            where: {
                dn
            },
        })

        if (!coordinateId) return { error: "Error: No urban farm found!" }

        if (!currentDonation) return { error: "Error: No donation found!" }

        if (currentDonation?.status === "CANCELLED") return { error: "Error: This donation has been cancelled by the user, you can't send it to urban farms" }

        if (currentDonation?.status === "PENDING") return { error: "Error: This donation is still pending, you can't send it yet to urban farms" }

        if (currentDonation?.status === "DECLINED") return { error: "Error: You already declined this donation, you can't send it to urban farms" }

        const existingCoordinate = await prisma.coordinates.findFirst({
            where: {
                donations: {
                    some: {
                        dn
                    }
                }
            },
        })

        if (existingCoordinate) {
            return { error: "Error: This donation has already been sent to an urban farm!" };
        }

        const successfulDonation = await prisma.coordinates.update({
            where: {
                id: coordinateId
            },
            data: {
                donations: {
                    connect: {
                        dn
                    },
                },
            },
        })

        //create a notification for the user who donated, kung saan napunta

        if (successfulDonation) {
            await prisma.notification.create({
                data: {
                    type: "DONATIONARRIVED",
                    userId: currentDonation.donatorId,
                    urbanFarmName: successfulDonation.name,
                }
            })
        }

        return { success: "Donation sent" }
    } catch (error) {
        throw new Error(error as any)
    }
}

export const countDonations = async () => {
    try {
        const donationCountPerUF = await prisma.coordinates.count({
            where: {
                donations: {
                    some: {}
                }
            }
        })

        return donationCountPerUF
    } catch (error) {
        throw new Error(error as any)
    }
}