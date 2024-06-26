"use server"

import prisma from "@/lib/db"
import { generateAgriquestHistoryID } from "@/lib/utils"
import { AgriQuestSchema, AgriquestType, DateOfPickupInAgriquest, DateOfPickupInAgriquestType } from "@/lib/validations/agriquest"
import { ClaimStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "../auth"
import { getUserById } from "../data/user"

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
            qtyPerTrade,
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
                quantityPerTrade: qtyPerTrade,
            }
        })

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                requestLeft: user.requestLeft - 1
            }
        })

        revalidatePath("/add-agriquest")
        return { success: "Agriquest created" }
    } catch (error) {
        throw new Error(`Error:, ${error}`)
    }
}

export const updateAgriquest = async (values: AgriquestType, image: string, id: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "Invalid action, can't update agriquest if you are not an admin!" }

        const validatedFields = AgriQuestSchema.safeParse(values)

        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const {
            category,
            description,
            name,
            quantity,
            shelfLife,
            qtyPerTrade,
        } = validatedFields.data


        await prisma.agriquest.update({
            where: { id },
            data: {
                category,
                description,
                image: image as string,
                name,
                shelfLife,
                quantity,
                quantityPerTrade: qtyPerTrade,
                createdById: user.id,
            },
        })

        revalidatePath("/add-agriquest")
        return { success: "Agriquest updated" }
    } catch (error) {
        throw new Error(`Error:, ${error}`)
    }
}

export const claimAgriquest = async (id: string, data: DateOfPickupInAgriquestType, quantityPerTrade: number) => {
    try {
        const validatedFields = DateOfPickupInAgriquest.safeParse(data)

        if (!validatedFields.success) return { error: "Invalid fields!" }

        const { pickupDate } = validatedFields.data

        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.requestLeft <= 0) return { error: `You can't claim anymore, you have ${user.requestLeft} requests.` }

        const aq = generateAgriquestHistoryID()

        const currentAgriquest = await prisma.agriquest.findUnique({
            where: { id }
        })

        if (!currentAgriquest) return { error: "No agriquest item found!" }

        if (currentAgriquest.quantity < quantityPerTrade) return { error: "Insufficient Stocks" }

        await prisma.agriquest.update({
            where: { id: currentAgriquest.id },
            data: {
                quantity: {
                    decrement: quantityPerTrade
                }
            }
        })

        const agriquestDone = await prisma.request.create({
            data: {
                aq,
                agriquestId: currentAgriquest.id,
                userId: user.id,
                pickUpDate: pickupDate,
            }
        })

        if (agriquestDone) {
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    type: "AGRIQUESTPENDING",
                }
            })

            await prisma.notification.create({
                data: {
                    userId: user.id,
                    type: "AGRIQUEST",
                }
            })
        }

        revalidatePath("/agriquest")
        return { success: "Agriquest claiming intent is now being reviewed!" }
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

export const fetchAgriQuestTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    const trades = prisma.request.findMany({
        where: {
            createdAt: {
                gte: startDate, // greater than or equal to the start date
                lte: endDate,   // less than or equal to the end date
            },
            status: "APPROVED",
        },
        include: {
            agriquest: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    return trades;
};

export const handleRequest = async (status: ClaimStatus, requestId: string, userId: string, agriquestId: string, quantity: number, remarks?: string) => {
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

        if (requester.requestLeft <= 0) return { error: "This user has no requests left!" }

        const agriquest = await prisma.agriquest.findUnique({
            where: { id: agriquestId }
        })

        if (!agriquest) return { error: "No item found!" }

        if (status === "APPROVED") {

            const processRequest = await prisma.request.update({
                data: { status },
                where: { id: currentRequest.id }
            })

            if (processRequest) {
                await prisma.user.update({
                    data: {
                        requestLeft: {
                            decrement: 1
                        }
                    },
                    where: { id: requester.id }
                })

                await prisma.notification.create({
                    data: {
                        userId: requester.id,
                        type: "AGRIQUESTAPPROVED",
                    }
                })

            }

            revalidatePath("/transactions")
            return { success: "Approved the request intent." }
        }

        if (status === "DECLINED") {

            // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

            // magccreate pa rin ng transaction pero cancelled at walang maggain na points?

            if (!remarks) return { error: "Remarks needed!" }

            await prisma.request.update({
                data: {
                    status,
                    remarks,
                },
                where: { id: currentRequest.id }
            })

            await prisma.agriquest.update({
                where: { id: agriquest.id },
                data: {
                    quantity: {
                        increment: quantity
                    }
                }
            })

            await prisma.notification.create({
                data: {
                    userId: requester.id,
                    type: "AGRIQUESTCANCELLED",
                }
            })

            revalidatePath("/transactions")
            return { success: "Cancelled the request intent" }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchAgriquest = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const agriquest = await prisma.agriquest.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return agriquest
    } catch (error: any) {
        throw new Error(error)
    }
}