import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {

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

        return new NextResponse(JSON.stringify(users))
    } catch (error) {
        return new NextResponse(`Error fetching users ${error}`, { status: 500 })
    }
}