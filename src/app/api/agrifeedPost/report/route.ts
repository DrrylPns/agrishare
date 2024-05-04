import { CancelDonationSchema } from "@/lib/validations/donation";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AgrifeedReportSchema } from "@/lib/validations/agrifeed";
import PreviousMap from "postcss/lib/previous-map";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await req.json()
        const { postId, type } = AgrifeedReportSchema.parse(body)

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return new NextResponse('Post not found', { status: 404 });
        }
        
        const alreadyReported = await prisma.report.findFirst({
            where:{
                userId: session.user.id,
                postId: postId
            }
        })
        if(alreadyReported){
            throw new axios.Cancel(`You already reported this post!`);
        } else {
            const reportPost = await prisma.report.create({
                data: {
                    reportType: "POST",
                    issue: type,
                    userId: session.user.id,
                    postId: post.id
                }
            })
            return new Response(JSON.stringify(reportPost));
        }

    } catch (error) {
        // Handle the Axios error
        if (axios.isCancel(error)) {
            return new Response(JSON.stringify(error.message), { status: 401 });
        } else {
            // Handle other errors
            console.error('Error:', error);
            return new Response(JSON.stringify('An error occurred.'), { status: 500 });
        }
    }
}
