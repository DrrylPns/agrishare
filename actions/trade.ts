"use server"
import prisma from "@/lib/db";
import { TradeSchema, TradeType } from "@/lib/validations/trade";
import { getUserById } from "../data/user";
import { auth } from "../auth";
import { StatusType, Subcategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendTradeNotification } from "@/lib/mail";


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

    const { description, item, value, weight, quantity, shelfLife, category, subcategory } = validatedFields.data

    if (quantity <= 0) return { error: "Quantity can't be less than 0" }

    if (value <= 0) return { error: "Value can't be less than 0" }

    if (weight <= 0) return { error: "Weight can't be less than 0" }

    const trade = await prisma.trade.create({
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
            category,
            subcategory
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

export const handleTrade = async (status: StatusType, tradeId: string, tradeeId: string, traderId: string, tradeeQty: number, traderQty: number, postId: string, traderSubcategory: Subcategory | null, tradeeSubcategory: Subcategory | null) => {
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

        let ptsEquivalentTrader
        let ptsEquivalentTradee
        let conditionRate = 1.5

        if (traderSubcategory === "FRUIT_VEGETABLES") {
            ptsEquivalentTrader = 0.18
        } else if (traderSubcategory === "HERBS_VEGETABLES") {
            ptsEquivalentTrader = 0.17
        } else if (traderSubcategory === "LEAFY_VEGETABLES") {
            ptsEquivalentTrader = 0.15
        } else if (traderSubcategory === "PODDED_VEGETABLES") {
            ptsEquivalentTrader = 0.25
        } else if (traderSubcategory === "ROOT_VEGETABLES") {
            ptsEquivalentTrader = 0.20
        } else {
            ptsEquivalentTrader = 0.15
        }

        if (tradeeSubcategory === "FRUIT_VEGETABLES") {
            ptsEquivalentTradee = 0.18
        } else if (tradeeSubcategory === "HERBS_VEGETABLES") {
            ptsEquivalentTradee = 0.17
        } else if (tradeeSubcategory === "LEAFY_VEGETABLES") {
            ptsEquivalentTradee = 0.15
        } else if (tradeeSubcategory === "PODDED_VEGETABLES") {
            ptsEquivalentTradee = 0.25
        } else if (tradeeSubcategory === "ROOT_VEGETABLES") {
            ptsEquivalentTradee = 0.20
        } else {
            ptsEquivalentTradee = 0.15
        }

        //fetch PE (subcategory) of tradee and trader
        const tradeeCalculatedPoints = (6 / ptsEquivalentTradee) * tradeeQty * conditionRate
        const traderCalculatedPoints = (6 / ptsEquivalentTrader) * tradeeQty * conditionRate

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

        await prisma.transaction.create({
            data: {
                type: "TRADE",
                points: tradeeCalculatedPoints,
                userId: tradeeId,
                postId,
            }
        })

        await prisma.transaction.create({
            data: {
                type: "TRADE",
                points: traderCalculatedPoints,
                userId: traderId,
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
            tradeeId: user.id
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