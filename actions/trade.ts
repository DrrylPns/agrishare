"use server"
import prisma from "@/lib/db";
import { TradeSchema, TradeType } from "@/lib/validations/trade";
import { getUserById } from "../data/user";
import { auth } from "../auth";


export const trade = async (
    values: TradeType,
    tradedQuantity: number,
    tradeeId: string,
    image: string,
) => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const validatedFields = TradeSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid values" }
    }

    const user = await getUserById(session.user.id)

    if (!user) return { error: "No user found." }

    const { description, item, value, weight, quantity } = validatedFields.data

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
        }
    })

    return { success: "Trade issued." }
}