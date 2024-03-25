"use server"

import prisma from "@/lib/db"
import { AgriQuestSchema, AgriquestType } from "@/lib/validations/agriquest"
import { auth } from "../auth"
import { getUserById } from "../data/user"

export const createAgriquest = async (values: AgriquestType) => {
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
            color,
            description,
            harvestDate,
            name,
            quantity,
            shelfLife,
            subcategory,
            weight,
            image,
        } = validatedFields.data

        await prisma.agriquest.create({
            data: {
                category,
                color,
                description,
                harvestDate,
                image: image as string,
                name,
                shelfLife,
                subcategory,
                weight,
                quantity,
                createdById: user.id,
            }
        })

        return { success: "Agriquest created" }
    } catch (error) {
        throw new Error(`Error:, ${error}`)
    }

}