"use server"

import { TraderSchema, TraderType } from "@/lib/validations/user-settings"
import { auth } from "../auth"
import prisma from "@/lib/db"

export const updateSettings = async (values: TraderType, barangay: string, district: string) => {
    try {
        const session = await auth()

        const validatedFields = TraderSchema.safeParse(values)

        if (!validatedFields.success) return { error: "Invalid Fields!" }

        const {
            // brgy,
            // district,
            address,
            city,
            companyName,
            country,
            state,
            zip,
        } = validatedFields.data

        await prisma.user.update({
            where: {
                id: session?.user.id
            },
            data: {
                address,
                city,
                companyName,
                country,
                state,
                zip,
                district,
                brgy: barangay,
            }
        })

        return { success: "Successfully updated address settings!" }
    } catch (error) {
        throw new Error(error as any)
    }
}