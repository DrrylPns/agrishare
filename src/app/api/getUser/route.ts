import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const session = await auth()
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id,
            },
        })

        if(!user){
            return new NextResponse(`Error no user found`, { status: 404 })
        }

        return new NextResponse(JSON.stringify(user))
    } catch (error) {
        return new NextResponse(`Error fetching user ${error}`, { status: 500 })
    }
}