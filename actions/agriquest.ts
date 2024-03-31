"use server"

import prisma from "@/lib/db"
import { AgriQuestSchema, AgriquestType } from "@/lib/validations/agriquest"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { generateAgriquestHistoryID } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { ClaimStatus } from "@prisma/client"

export const createAgriquest = async (values: AgriquestType, image: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "Invalid action, can't create agriquest if you are not an admin!" }

        const validatedFields = AgriQuestSchema.safeParse(values)

        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const {
            category,
            // color,
            description,
            // harvestDate,
            name,
            quantity,
            shelfLife,
            // subcategory,
            // weight,
        } = validatedFields.data

        await prisma.agriquest.create({
            data: {
                category,
                // color,
                description,
                // harvestDate,
                image: image as string,
                name,
                shelfLife,
                // subcategory,
                // weight,
                quantity,
                createdById: user.id,
            }
        })

        return { success: "Agriquest created" }
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

        const aq = generateAgriquestHistoryID()

        const currentAgriquest = await prisma.agriquest.findUnique({
            where: { id }
        })

        if (!currentAgriquest) return { error: "No agriquest item found!" }

        await prisma.request.create({
            data: {
                aq,
                agriquestId: currentAgriquest.id,
                userId: user.id,
            }
        })

        revalidatePath("/agriquest")
        return { success: "Agrichange claiming intent is now being reviewed!" }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fecthAgriQuestTransactionsByUser = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const transactions = await prisma.request.findMany({
            include: {
                agriquest: true,
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

export const fetchAgriQuestTransactions = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const transactions = await prisma.request.findMany({
            include: {
                agriquest: true,
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

export const handleRequest = async (status: ClaimStatus, requestId: string, userId: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const currentRequest = await prisma.request.findUnique({
            where: { id: requestId }
        })

        if (!currentRequest) return { error: "Request intent not found." };

        const requester = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!requester) return { error: "No requester found!" }

        if (status === "APPROVED" && currentRequest.status === "APPROVED") {
            return { error: "Request is already completed." };
        }

        if (status === "DECLINED" && currentRequest.status === "DECLINED") {
            return { error: "Request is already declined." };
        }

        if (status === "DECLINED" && currentRequest.status === "APPROVED") {
            return { error: "Invalid action, the request intent is already approved." }
        }

        if (status === "APPROVED" && currentRequest.status === "DECLINED") {
            return { error: "Invalid action, the request intent is already declined." }
        }

        const processRequest = await prisma.request.update({
            data: { status },
            where: { id: currentRequest.id }
        })

        if (status === "APPROVED") {

            if (processRequest) {
                await prisma.user.update({
                    data: {
                        requestLeft: {
                            decrement: 1
                        }
                    },
                    where: { id: requester.id }
                })
            }

            // KAYA KO CINOMMENT OUT DAHIL HINDI NIYA NEED MPAUNTA SA TRANSACTION / POINTS HISTORY DAHI LWALA NAMAN NABAWAS OR NADAGDAG NA POINTS KAY USER
            // await prisma.transaction.create({
            //     data: {
            //         type: "",
            //         points: points,
            //         userId: claimer.id,
            //         itm: currentClaim.itm,
            //     }
            // })

            revalidatePath("/transactions")
            return { success: "Approved the request intent." }
        }

        if (status === "DECLINED") {

            // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

            // magccreate pa rin ng transaction pero cancelled at walang maggain na points?

            revalidatePath("/transactions")
            return { success: "Cancelled the request intent" }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}