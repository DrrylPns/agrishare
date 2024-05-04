"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { revalidatePath } from "next/cache"
import { getUserById } from "../data/user"

export const deleteAgrifeed = async (userId: string, agrifeedId: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        if (userId !== session.user.id) return { error: "This post is not yours, you are not authorized to delete it!" }

        await prisma.post.delete({
            where: { id: agrifeedId }
        })

        revalidatePath("/agrifeed")
        return { success: "Your post was deleted." }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchReportedPost = async ()=>{
    
        const session = await auth()

        if (!session) return { error: "Unauthorized" }
    
        const user = await getUserById(session.user.id)
    
        if (!user) return { error: "No user found." }
        
        if (user.role !== "ADMIN") return { error: "Invalid action, can't create agriquest if you are not an admin!" }
        const reportedPosts = await prisma.report.findMany({

            include:{
                post: {
                    include:{
                        User: true,
                    }
                },
                reportedBy: true,
            },
            orderBy:{
                createdAt:'desc'
            }
        })
    
        return reportedPosts
    
}