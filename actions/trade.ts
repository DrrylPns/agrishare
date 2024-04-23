"use server"
import prisma from "@/lib/db";
import { TradeSchema, TradeType } from "@/lib/validations/trade";
import { getUserById } from "../data/user";
import { auth } from "../auth";
import { StatusType, Subcategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendAcceptedTradeNotification, sendDeclinedNotification, sendTradeNotification } from "@/lib/mail";
import { generateTRD } from "@/lib/utils";


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

    if (user.id === tradeeId) {
        return { error: "You cannot issue a trade for your own post." };
    }

    const { description, item, 
        // value,
        weight, quantity, shelfLife, category, subcategory } = validatedFields.data

    if (tradedQuantity <= 0) return { error: "Quantity can't be less than 0" }

    if (quantity <= 0) return { error: "Quantity can't be less than 0" }

    // if (value <= 0) return { error: "Value can't be less than 0" }

    if (weight <= 0) return { error: "Weight can't be less than 0" }

    const trd = generateTRD()

    const trade = await prisma.trade.create({
        data: {
            image,
            tradedQuantity,
            description,
            quantity,
            // value,
            weight,
            item,
            tradeeId,
            traderId: user.id,
            postId,
            shelfLife,
            category,
            //@ts-ignore
            subcategory,
            trd
        }
    })

    if (trade) {
        await prisma.notification.create({
            data: {
                userId: tradeeId,
                tradeId: trade.id,
            }
        })

        const tradeeUser = await prisma.user.findFirst({
            where: { id: tradeeId }
        })

        if (!tradeeUser) return { error: "No tradee user found!" }
        // find post then postname

        const post = await prisma.post.findFirst({
            where: { id: postId }
        })

        if (!post) return { error: "No post found!" }

        await sendTradeNotification(
            tradeeUser.email as string,
            user.name as string,
            post.name,
            trade.id,
            description
        )
    }

    revalidatePath("/propose-offer/[id]", 'page')
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

export const fetchTradesByUser = async () => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const trades = prisma.trade.findMany({
        include: {
            tradee: true,
            trader: true,
            post: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        where: { id: session.user.id }
    })

    return trades
}

export const handleTrade = async (tradeeCalculatedPoints: number, traderCalculatedPoints: number, tradeeCondtionRate: number | null, traderConditionRate: number | null, status: StatusType, tradeId: string, tradeeId: string, traderId: string, tradeeQty: number, traderQty: number, postId: string, traderSubcategory: Subcategory | null, tradeeSubcategory: Subcategory | null) => {
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

    if (status === "CANCELLED" && currentTrade.status === "COMPLETED") {
        return { error: "Invalid action, the trade is already cancelled." }
    }

    if (status === "COMPLETED" && currentTrade.status === "CANCELLED") {
        return { error: "Invalid action, the trade is already confirmed." }
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

        await prisma.post.update({
            data: {
                quantity: {
                    decrement: tradeeQty
                }
            },
            where: {
                id: postId
            }
        })

        // pass the generated trade trd to both tradee and trader same lang dapat kasi tradeId yon eh

        await prisma.transaction.create({
            data: {
                type: "TRADE",
                points: tradeeCalculatedPoints,
                userId: tradeeId,
                postId,
                trd: currentTrade.trd
            }
        })

        await prisma.transaction.create({
            data: {
                type: "TRADE",
                points: traderCalculatedPoints,
                userId: traderId,
                trd: currentTrade.trd
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

        // TODO: CREATE TRANSACTION FOR CANCELLED TRADES CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

        revalidatePath("/transactions")
        return { success: "Cancelled the trade." }
    }
}

export const fetchTradeByUser = async () => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const trades = await prisma.trade.findMany({
        include: {
            tradee: true,
            trader: true,
            post: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        where: {
            OR: [
                { tradeeId: user.id },
                { traderId: user.id },
            ]
        }
    })

    return trades
}

export const singleTrade = async (tradeId: string) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const trade = await prisma.trade.findFirst({
        where: { tradeeId: user.id, id: tradeId },
        include: {
            tradee: true,
            trader: true,
            post: true,
        }
    })

    return trade
}

export const tradeIntent = async (status: StatusType, tradeId: string, email: string) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const trade = await prisma.trade.findFirst({
        where: { id: tradeId },
        include: {
            tradee: true,
            post: true
        }
    })

    if (!trade) return { error: "Trade not found." }

    await prisma.trade.update({
        where: {
            id: trade.id
        },
        data: {
            status
        }
    })

    if (status === "PROCESSING") {
        await sendAcceptedTradeNotification(email, trade.tradee.name as string, trade.post.name)
    } else if (status === "CANCELLED") {
        await sendDeclinedNotification(email, trade.tradee.name as string, trade.post.name)
    }

    revalidatePath("/trades/[traderId]")
    return { success: "Trade Accepted." }
}

export const handleTradeProof = async (img: string, tradeId: string, conditionRate: number) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const findTrader = await prisma.trade.findFirst({
        where: {
            id: tradeId,
            traderId: user.id
        },
    })

    const findTradee = await prisma.trade.findFirst({
        where: {
            id: tradeId,
            tradeeId: user.id
        }
    })

    if (findTrader) {
        await prisma.trade.update({
            where: { id: findTrader?.id },
            data: {
                proofTrader: img,
                traderConditionRate: conditionRate
            },
        })
    }

    if (findTradee) {
        await prisma.trade.update({
            where: { id: findTradee?.id },
            data: {
                proofTradee: img,
                tradeeConditionRate: conditionRate
            }
        })
    }

    return { success: "Proof uploaded." }
}