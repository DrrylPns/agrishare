"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"

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

export const fetchTransactionByDateRange = (startDate: Date, endDate: Date) => {
    const transactions = prisma.transaction.findMany({
        where: {
            createdAt: {
                gte: startDate, // greater than or equal to the start date
                lte: endDate,   // less than or equal to the end date
            }
        },
        include: {
            post: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    return transactions;
};

export const fetchTransactionByUser = async () => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const transactions = await prisma.transaction.findMany({
        include: {
            post: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        where: { userId: session.user.id }
    })

    return transactions
}