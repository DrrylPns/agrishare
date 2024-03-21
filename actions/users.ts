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

export const fetchDonatorAndTrader = async () => {
    const users = await prisma.user.findMany({
        where: {
            role: {
                in: ["DONATOR", "TRADER"]
            }
        },
        orderBy: {
            createdAt: "desc"
        },
    })

    return users
}