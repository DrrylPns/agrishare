"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { revalidatePath } from "next/cache"

export const deleteAgrifeed = async (userId: string, agrifeedId: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        if (userId !== session.user.id) return { error: "This post is not yours, you are not authorized to delete it!" }

        await prisma.post.delete({
            where: { id: agrifeedId }
        })

        revalidatePath("/agrifeed")
        return { success: "Your post was deleted." }
    } catch (error: any) {
        throw new Error(error)
    }
}