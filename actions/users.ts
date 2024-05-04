"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { User } from "@prisma/client"
import { getUserById } from "../data/user"

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

export const fetchOneUser = async () =>{
    const session = await auth()
        if (!session) return { error: "No user found!" }
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id,
            },
        })
        if (!user) return { error: "No user found!" }

    return user
}

export const updateUserBanStatus = async (userId:string) =>{
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found." }
    
    if (user.role !== "ADMIN") return { error: "Invalid action, can't create agriquest if you are not an admin!" }

        const existingUser: User | null = await prisma.user.findFirst({
            where: { userId: userId },
        });

        if (!existingUser) {
            return { error: "No user found." }
        }

        await prisma.user.update({
            where:{
                userId,
            },
            data:{
                isBanned: true
            }
        })
        // Check if the user is banned
    
            let banDuration: number;
            // Determine ban duration based on ban count
            switch (user.banCount) {
                case 0:
                    banDuration = 1; // 1 day
                    break;
                case 1:
                    banDuration = 3; // 3 days
                    break;
                case 2:
                    banDuration = 7; // 1 week
                    break;
                case 3:
                    banDuration = 3650; // 10 years (approximated)
                    break;
                default:
                    banDuration = 0; // No ban
            }

            // Calculate banUntil date
            const currentDate: Date = new Date();
            const banUntil: Date = new Date(currentDate.getTime() + banDuration * 24 * 60 * 60 * 1000); // Add banDuration days to current date

            // Update user's ban status
            await prisma.user.update({
                where: { userId: userId },
                data: {
                    banUntil: banUntil,
                    banCount: user.banCount + 1,
                    isBanned: true,
                },
            });

            console.log(`User with ID ${userId} has been banned until ${banUntil}.`);
       
        return { success: "Successfully ban the user." }
}