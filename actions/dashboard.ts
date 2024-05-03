"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { endOfDay, startOfDay } from "date-fns"
import { eachDayOfInterval } from "date-fns"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const fetchUrbanFarmers = async () => {
    try {

        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "You are not an admin!" }

        const urbanFarmers = await prisma.user.count({
            where: {
                role: "TRADER"
            }
        })

        return urbanFarmers
    } catch (error: any) {
        throw new Error(error)
    }
}

export const updateRole = async (uid: string, role: Role) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "You are not an admin!" }

        const editRole = await prisma.user.update({
            where: {
                id: uid,
            },
            data:{
                role: role
            }
        })

        revalidatePath("/users")
        return { success: "Update success!" }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchUrbanDonator = async () => {
    try {

        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "You are not an admin!" }

        const donators = await prisma.user.count({
            where: {
                role: "DONATOR"
            }
        })

        return donators
    } catch (error: any) {
        throw new Error(error)
    }
}

// export const fetchDonationsByDate = async () => {
//     const donations = await prisma.donation.findMany({
//         where: {
//             status: 'APPROVED',
//         },
//         select: {
//             createdAt: true,
//             quantity: true, 
//         },
//     });


//     const donationsByDate = donations.map(donation => ({
//         date: donation.createdAt.toISOString().split('T')[0],
//         'Donations': donation.quantity,
//     }));

//     return donationsByDate;
// };

export const fetchDonationCount = async (status: "APPROVED" | "CANCELLED" | "DECLINED", date: Date) => {
    const count = await prisma.donation.count({
        where: {
            status,
            createdAt: {
                gte: startOfDay(date),
                lt: endOfDay(date),
            },
        },
    });

    return count;
};

export const fetchDonationCountsForDateRange = async (status: "APPROVED" | "CANCELLED" | "DECLINED", startDate: Date, endDate: Date) => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    const counts = await Promise.all(
        dates.map(async (date) => {
            const count = await fetchDonationCount(status, date);
            return { date, count };
        })
    );

    return counts;
};

// // Fetch trades from the database and count them by date
// export const fetchTradesByDate = async () => {
//     const tradesByDate = await prisma.trade.groupBy({
//         by: ['createdAt'],
//         where: {
//             status: 'COMPLETED',
//         },
//         _count: {
//             createdAt: true,
//         },
//         orderBy: {
//             createdAt: 'asc',
//         },
//     });

//     // Transform the data into the required format for the chart
//     const tradesData = tradesByDate.map(trade => ({
//         date: trade.createdAt.toISOString().split('T')[0], // Format the date as needed
//         Trades: trade._count.createdAt, // Get the count of trades for that date
//     }));

//     return tradesData;
// };

export const fetchTradeCount = async (status: "COMPLETED" | "CANCELLED", date: Date) => {
    const count = await prisma.trade.count({
        where: {
            status,
            createdAt: {
                gte: startOfDay(date),
                lt: endOfDay(date),
            },
        },
    });

    return count;
};

export const fetchTradeCountsForDateRange = async (status: "COMPLETED" | "CANCELLED", startDate: Date, endDate: Date) => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    const counts = await Promise.all(
        dates.map(async (date) => {
            const count = await fetchTradeCount(status, date);
            return { date, count };
        })
    );

    return counts;
};