"use server"

import prisma from "@/lib/db"

export const fetchTransaction = async () => {
    const transactions = await prisma.transaction.findMany({
        include: {
            post: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    })

    return transactions
}