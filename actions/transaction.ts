"use server"

import prisma from "@/lib/db"

export const fetchTransaction = async () => {
    const transactions = await prisma.transaction.findMany({
        include: {
            Post: true,
            user: true,
        }
    })

    return transactions
}