"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { getUserById } from "../data/user"

export const fetchNotifications = async () => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session?.user.id)

    if (!user) return { error: "No user found!" }

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        include: {
            user: true,
            trade: {
                include: {
                    post: true,
                    trader: true
                }
            }
        },
    })

    return notifications || []
}

export const notificationRead = async (notificationId: string) => {
    const notificationIsRead = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    })

    return notificationIsRead
}