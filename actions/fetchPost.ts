"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export const fetchPost = async (postId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            User: true,
            reviews: {
                include: {
                    User: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
        }
    })

    return post;
}