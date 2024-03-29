"use server"

import prisma from "@/lib/db"
import { AgrichangeSchema, AgrichangeType } from "@/lib/validations/agriquest"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { revalidatePath } from "next/cache"
import { ClaimStatus, Status } from "@prisma/client"
import { generateClaimedHistoryID } from "@/lib/utils"

export const createAgrichange = async (values: AgrichangeType, image: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "Invalid action, can't create agriquest if you are not an admin!" }

        const validatedFields = AgrichangeSchema.safeParse(values)

        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const {
            category,
            color,
            type,
            description,
            harvestDate,
            name,
            quantity,
            shelfLife,
            subcategory,
            weight,
            pointsNeeded,
        } = validatedFields.data


        // let PE: number = 0;
        // let TV: number = 0;

        // if (category === "SEEDS") {
        //     PE = 0.65
        //     TV = 0.65
        // } else if (category === "TOOLS") {
        //     PE = 0.9
        //     TV = 0.52
        // } else if (subcategory === "LEAFY_VEGETABLES") {
        //     PE = 0.15
        //     TV = 0.15
        // } else if (subcategory === "PODDED_VEGETABLES") {
        //     PE = 0.25
        //     TV = 0.25
        // } else if (subcategory === "FRUIT_VEGETABLES") {
        //     PE = 0.18
        //     TV = 0.18
        // } else if (subcategory === "ROOT_VEGETABLES") {
        //     PE = 0.15
        //     TV = 0.15
        // } else if (name === "shovel" && subcategory === "SMALL") {
        //     PE = 0.11
        //     TV = 0.33
        // } else if (name === "shovel" && subcategory === "LARGE") {
        //     PE = 0.067
        //     TV = 0.52
        // } else if (name === "hoes") {
        //     PE = 0.067
        //     TV = 0.52
        // } else if (name === "kalaykay" && subcategory === "SMALL") {
        //     PE = 0.11
        //     TV = 0.33
        // } else if (name === "kalaykay" && subcategory === "LARGE") {
        //     PE = 0.067
        //     TV = 0.52
        // } else if (name === "pruening shears") {
        //     PE = 0.067
        //     TV = 0.513
        // } else if (name === "gloves") {
        //     PE = 0.12
        //     TV = 0.24
        // } else if (name === "bucket" && subcategory === "SMALL") {
        //     PE = 0.10
        //     TV = 0.2
        // } else if (name === "bucket" && subcategory === "MEDIUM") {
        //     PE = 0.09
        //     TV = 0.27
        // } else if (name === "bucket" && subcategory === "LARGE") {
        //     PE = 0.08
        //     TV = 0.32
        // } else if (name === "garden pot" && subcategory === "SMALL") {
        //     PE = 0.09
        //     TV = 0.27
        // } else if (name === "garden pot" && subcategory === "MEDIUM") {
        //     PE = 0.08
        //     TV = 0.35
        // } else if (name === "garden pot" && subcategory === "LARGE") {
        //     PE = 0.07
        //     TV = 0.7
        // } else if (name === "wheel barrow") {
        //     PE = 0.0125
        //     TV = 2
        // } else if (subcategory === "ORGANIC_FERTILIZER") {
        //     PE = 0.9
        //     TV = 0.36
        // } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
        //     PE = 0.45
        //     TV = 0.9
        // } else if (subcategory === "ORGANIC_SOIL") {
        //     PE = 1.5
        //     TV = 0.75
        // } else if (subcategory === "NOT_ORGANIC_SOIL") {
        //     PE = 0.5
        //     TV = 0.75
        // } else if (category === "FRESH_FRUIT") {
        //     PE = 0.5
        //     TV = 0.75
        // }
        // Formula: (TV / Points equivalent = pointsNeeded)

        // let pointsNeeded: number = 0;
        // if (category === "SEEDS") {
        //     pointsNeeded = (6 / 0.65);
        // } else if (category === "TOOLS") {
        //     pointsNeeded = (6 / 0.9);
        // } else if (category === "FRESH_FRUIT") {
        //     pointsNeeded = (6 / 0.5);
        // } else if (subcategory === "LEAFY_VEGETABLES") {
        //     pointsNeeded = (6 / 0.15);
        // } else if (subcategory === "PODDED_VEGETABLES") {
        //     pointsNeeded = (6 / 0.25);
        // } else if (subcategory === "FRUIT_VEGETABLES") {
        //     pointsNeeded = (6 / 0.18);
        // } else if (subcategory === "ROOT_VEGETABLES") {
        //     pointsNeeded = (6 / 0.15);
        // } else if (subcategory === "ORGANIC_FERTILIZER") {
        //     pointsNeeded = (10 / 0.9);
        // } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
        //     pointsNeeded = (10 / 0.45);
        // } else if (subcategory === "ORGANIC_SOIL") {
        //     pointsNeeded = (10 / 1.5);
        // } else if (subcategory === "NOT_ORGANIC_SOIL") {
        //     pointsNeeded = (10 / 0.5);
        // } else if (name === "shovel" && subcategory === "SMALL") {
        //     pointsNeeded = (6 / 0.11);
        // } else if (name === "shovel" && subcategory === "LARGE") {
        //     pointsNeeded = (6 / 0.067);
        // } else if (name === "hoes") {
        //     pointsNeeded = (6 / 0.067);
        // } else if (name === "kalaykay" && subcategory === "SMALL") {
        //     pointsNeeded = (6 / 0.11);
        // } else if (name === "kalaykay" && subcategory === "LARGE") {
        //     pointsNeeded = (6 / 0.067);
        // } else if (name === "pruening shears") {
        //     pointsNeeded = (6 / 0.067);
        // } else if (name === "gloves") {
        //     pointsNeeded = (6 / 0.12);
        // } else if (name === "bucket" && subcategory === "SMALL") {
        //     pointsNeeded = (6 / 0.10);
        // } else if (name === "bucket" && subcategory === "MEDIUM") {
        //     pointsNeeded = (6 / 0.09);
        // } else if (name === "bucket" && subcategory === "LARGE") {
        //     pointsNeeded = (6 / 0.08);
        // } else if (name === "garden pot" && subcategory === "SMALL") {
        //     pointsNeeded = (6 / 0.09);
        // } else if (name === "garden pot" && subcategory === "MEDIUM") {
        //     pointsNeeded = (6 / 0.08);
        // } else if (name === "garden pot" && subcategory === "LARGE") {
        //     pointsNeeded = (6 / 0.07);
        // } else if (name === "wheel barrow") {
        //     pointsNeeded = (6 / 0.0125);
        // }
        // pointsNeeded = Math.round((pointsNeeded + Number.EPSILON) * 100) / 100
        let status: Status;

        if (quantity > 5) {
            status = Status.INSTOCK
        } else if (quantity >= 1 && quantity <= 4) {
            status = Status.LOWSTOCK
        } else {
            status = Status.OUTOFSTOCK
        }

        await prisma.agriChange.create({
            data: {
                category,
                color,
                description,
                harvestDate,
                image: image,
                name,
                shelfLife,
                type,
                status,
                // @ts-ignore
                subcategory,
                weight,
                quantity,
                pointsNeeded, // calculate points needed dpende sa value ng category / subcategory
                userId: user.id,
            }
        })

        revalidatePath("/add-agrichange")
        return { success: "Agrichange created" }
    } catch (error) {
        throw new Error(`Error:, ${error}`)
    }

}

export const claimAgrichange = async (id: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const itm = generateClaimedHistoryID()

        const currentAgriChange = await prisma.agriChange.findUnique({
            where: { id }
        })

        if (!currentAgriChange) return { error: "No agrichange item found!" }

        await prisma.claim.create({
            data: {
                itm,
                agriChangeId: currentAgriChange.id,
                userId: user.id,
            }
        })

        revalidatePath("/history")
        return { success: "Agrichange claiming intent is now being reviewed!" }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fecthAgriChangeTransactionsByUser = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const transactions = await prisma.claim.findMany({
            include: {
                agriChange: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            where: { userId: session.user.id }
        })

        return transactions
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchAgriChangeTransactions = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const transactions = await prisma.claim.findMany({
            include: {
                agriChange: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        })

        return transactions

    } catch (error: any) {
        throw new Error(error)
    }
}

export const handleClaim = async (status: ClaimStatus, claimId: string, userId: string, points: number) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const currentClaim = await prisma.claim.findUnique({
            where: { id: claimId }
        })

        if (!currentClaim) return { error: "Claim intent not found." };

        const claimer = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!claimer) return { error: "No claimer found!" }

        if (status === "APPROVED" && currentClaim.status === "APPROVED") {
            return { error: "Claim is already completed." };
        }

        if (status === "DECLINED" && currentClaim.status === "DECLINED") {
            return { error: "Claim is already declined." };
        }

        if (status === "DECLINED" && currentClaim.status === "APPROVED") {
            return { error: "Invalid action, the claim intent is already approved." }
        }

        if (status === "APPROVED" && currentClaim.status === "DECLINED") {
            return { error: "Invalid action, the claim intent is already declined." }
        }

        const processClaim = await prisma.claim.update({
            data: { status },
            where: { id: currentClaim.id }
        })

        if (status === "APPROVED") {

            if (processClaim) {
                await prisma.user.update({
                    data: {
                        points: claimer.points - points
                    },
                    where: { id: claimer.id }
                })
            }

            await prisma.transaction.create({
                data: {
                    type: "CLAIM",
                    points: points,
                    userId: claimer.id,
                    itm: currentClaim.itm,
                }
            })

            revalidatePath("/transactions")
            return { success: "Approved the claim intent." }
        }

        if (status === "DECLINED") {

            // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

            // magccreate pa rin ng transaction pero cancelled at walang maggain na points?

            revalidatePath("/transactions")
            return { success: "Cancelled the claim intent" }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}