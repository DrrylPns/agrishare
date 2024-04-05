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

        if (user.role !== "ADMIN") return { error: "Invalid action, can't create agrichange if you are not an admin!" }

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

export const updateAgrichange = async (values: AgrichangeType, image: string, id: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "Invalid action, can't update agrichange if you are not an admin!" }

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

        let status: Status;

        if (quantity > 5) {
            status = Status.INSTOCK
        } else if (quantity >= 1 && quantity <= 4) {
            status = Status.LOWSTOCK
        } else {
            status = Status.OUTOFSTOCK
        }

        await prisma.agriChange.update({
            where: { id },
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
                subcategory,
                weight,
                quantity,
                pointsNeeded,
            }
        })

        revalidatePath("/add-agrichange")
        return { success: "Agrichange updated" }
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

        if (user.points < currentAgriChange.pointsNeeded) return { error: "Insufficient points" }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: user.points - currentAgriChange.pointsNeeded
            }
        })

        await prisma.claim.create({
            data: {
                itm,
                agriChangeId: currentAgriChange.id,
                userId: user.id,
            }
        })

        await prisma.notification.create({
            data: {
                type: "PROCESSING",
                userId: user.id,
            }
        })

        revalidatePath("/agrichange")
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

            // if (processClaim) {
            //     await prisma.user.update({
            //         data: {
            //             points: claimer.points - points
            //         },
            //         where: { id: claimer.id }
            //     })
            // }

            await prisma.transaction.create({
                data: {
                    type: "CLAIM",
                    points: points,
                    userId: claimer.id,
                    itm: currentClaim.itm,
                }
            })

            await prisma.notification.create({
                data: {
                    userId: claimer.id,
                    type: "COMPLETED",
                }
            })

            revalidatePath("/transactions")
            return { success: "Approved the claim intent." }
        }

        if (status === "DECLINED") {

            // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

            // magccreate pa rin ng transaction pero cancelled at walang maggain na points?

            // ibalik yung onhold points if declined
            await prisma.user.update({
                data: {
                    points: claimer.points + points
                },
                where: { id: claimer.id }
            })

            await prisma.notification.create({
                data: {
                    userId: claimer.id,
                    type: "CANCELLED",
                }
            })

            revalidatePath("/transactions")
            return { success: "Cancelled the claim intent" }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchAgrichange = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const agrichange = await prisma.agriChange.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return agrichange
    } catch (error: any) {
        throw new Error(error)
    }
}