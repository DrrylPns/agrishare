"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"

export const fetchUser = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        return user;
        
    } catch (error) {
        return { error: `${error}` }
    }
}