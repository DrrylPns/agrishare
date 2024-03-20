"use server"
import prisma from "@/lib/db";
import { TradeSchema, TradeType } from "@/lib/validations/trade";
import { getUserById } from "../data/user";
import { auth } from "../auth";
import { StatusType } from "@prisma/client";
import { revalidatePath } from "next/cache";


export const trade = async (
    values: TradeType,
    tradedQuantity: number,
    tradeeId: string,
    image: string,
    postId: string,
) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const validatedFields = TradeSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid values" }
    }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const { description, item, value, weight, quantity, shelfLife } = validatedFields.data

    if (quantity <= 0) return { error: "Quantity can't be less than 0" }

    await prisma.trade.create({
        data: {
            image,
            tradedQuantity,
            description,
            quantity,
            value,
            weight,
            item,
            tradeeId,
            traderId: user.id,
            postId,
            shelfLife,
        }
    })

    return { success: "Trade issued." }
}

export const fetchTrades = () => {
    const trades = prisma.trade.findMany({
        include: {
            tradee: true,
            trader: true,
            post: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    })

    return trades
}

export const handleTrade = async (status: StatusType, tradeId: string, tradeeId: string, traderId: string, tradeeQty: number, traderQty: number) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    if (!status || !(status in StatusType)) return { error: "Invalid status." }

    const currentTrade = await prisma.trade.findUnique({
        where: {
            id: tradeId
        },
    });

    if (!currentTrade) return { error: "Trade not found." };

    if (currentTrade.status === "PENDING") {
        return { error: "You can't perform an action on this yet because the tradee has not yet accepted the trade." };
    }

    if (status === "COMPLETED" && currentTrade.status === "COMPLETED") {
        return { error: "Trade is already completed." };
    }

    if (status === "CANCELLED" && currentTrade.status === "CANCELLED") {
        return { error: "Trade is already cancelled." };
    }

    await prisma.trade.update({
        data: {
            status
        },
        where: {
            id: tradeId
        },
    })

    if (status === "COMPLETED") {
        const tradee = await prisma.user.findUnique({
            where: {
                id: tradeeId
            }
        })

        const trader = await prisma.user.findUnique({
            where: {
                id: traderId
            }
        })

        if (!tradee || !trader) return { error: "Tradee or trader not found." }

        const tradeeCalculatedPoints = 6 * tradeeQty
        const traderCalculatedPoints = 6 * traderQty

        await prisma.user.update({
            data: {
                points: tradee.points + tradeeCalculatedPoints
            },
            where: {
                id: tradeeId
            }
        })

        await prisma.user.update({
            data: {
                points: trader.points + traderCalculatedPoints
            },
            where: {
                id: traderId
            }
        })

        revalidatePath("/transactions")
        return { success: "Confirmed the trade." }
    }

    if (status === "CANCELLED") {
        // const tradee = await prisma.user.findUnique({
        //     where: {
        //         id: tradeeId
        //     }
        // })

        // const trader = await prisma.user.findUnique({
        //     where: {
        //         id: traderId
        //     }
        // })

        // if (!tradee || !trader) return { error: "Tradee or trader not found." }

        // const tradeeCalculatedPoints = 6 * tradeeQty
        // const traderCalculatedPoints = 6 * traderQty

        // await prisma.user.update({
        //     data: {
        //         points: tradee.points - tradeeCalculatedPoints
        //     },
        //     where: {
        //         id: tradeeId
        //     }
        // })

        // await prisma.user.update({
        //     data: {
        //         points: trader.points - traderCalculatedPoints
        //     },
        //     where: {
        //         id: traderId
        //     }
        // })

        revalidatePath("/transactions")
        return { success: "Cancelled the trade." }
    }
}