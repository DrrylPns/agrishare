"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { revalidatePath } from "next/cache"

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
                    trader: true,
                    tradee: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
    })

    return notifications
}

export const notificationRead = async (notificationId: string, path: string) => {
    const notification = await prisma.notification.findFirst({
        where: { id: notificationId }
    })

    if (!notification) return { error: "Invalid notification." }

    if (!notification.isRead) {
        await prisma.notification.update({
            where: { id: notification.id },
            data: { isRead: true }
        })

        // revalidatePath(`${path}`)
        return { success: "Notification read." }
    }
}

export const fetchAdminNotifications = async () => {
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const user = await getUserById(session?.user.id)

    if (!user) return { error: "No user found!" }

    const notifications = await prisma.notification.findMany({
        where: {
            type: {
                in: ["ADMINDONATION", "AGRICHANGE", "AGRIQUEST"]
            }
        },
        include: {
            user: true,
            trade: {
                include: {
                    post: true,
                    trader: true,
                    tradee: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
    })

    return notifications
}