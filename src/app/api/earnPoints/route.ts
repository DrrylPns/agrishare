import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { PointsSchema } from "@/lib/validations/points";
import { TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getAuthSession()
    try {

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()

        const { points, type } = PointsSchema.parse(body)

        if (!Object.values(TransactionType).includes(type)) {
            return new NextResponse(`Invalid transaction type: ${type}`, { status: 400 });
          }

        if (type === "EARN" || type === "DONATE") {
            await prisma.transaction.create({
                data: {
                    userId: session.user.id,
                    type,
                    points,
                }
            })

            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    points: {
                        increment: points
                    }
                }
            })
        } else if (type === "TRADE") {
            await prisma.transaction.create({
                data: {
                    userId: session.user.id,
                    type,
                    points: -points,
                },
            })

            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    points: {
                        decrement: points
                    }
                }
            })
        }


        return new NextResponse(`Successfully gained points.`)
    } catch (error: any) {
        return new NextResponse(`Error earning points: ${error.message}`, { status: 500 });
    }
}

export async function GET() {
    const session = await getAuthSession()

    try {
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                userId: session.user.id,
                type: "EARN"
            }
        })

        return new NextResponse(JSON.stringify(transactions))
    } catch (error) {
        return new NextResponse(`Error fetching points ${error}`, { status: 500 })
    }
}