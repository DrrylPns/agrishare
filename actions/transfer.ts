"use server"

import { TransferSchema, TransferType } from "@/lib/validations/transfer"
import { auth } from "../auth"
import prisma from "@/lib/db"
import { getUserById } from "../data/user"
import bcryptjs from "bcryptjs"
import { revalidatePath } from "next/cache"

export const transferPoints = async (values: TransferType) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const validatedFields = TransferSchema.safeParse(values)

        if (!validatedFields.success) return { error: "Invalid Fields!" }

        const {
            amount,
            password,
            userId,
            purpose,
        } = validatedFields.data

        //check if the amount exceeds the current users points

        if (amount > user.points) return { error: "Insufficient Points: The amount you entered exceeds your current points balance. Please consider earning more points through trades and donations." }

        const passwordMatch = await bcryptjs.compare(password, user.hashedPassword as string);

        if (!passwordMatch) return { error: "Incorrect password!" }

        const successfulTransfer = await prisma.user.update({
            where: { userId },
            data: {
                points: {
                    increment: amount
                }
            }
        })

        if (successfulTransfer) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    points: {
                        decrement: amount
                    }
                }
            })
        }

        revalidatePath("/points")
        return { success: "Points transferred!" }
    } catch (error: any) {
        throw new Error(error)
    }
}