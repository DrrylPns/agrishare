import { CancelDonationSchema } from "@/lib/validations/donation";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CancelType } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await req.json()
        const { tradeId, type } = body

        const trade = await prisma.trade.findUnique({
            where: {
                id: tradeId,
            },
        });

        if (!trade) {
            return new NextResponse('Transaction not found', { status: 404 });
        }

        const cancelOrderById = await prisma.trade.update({
            where: {
                id: trade.id,
            },
            data: {
                cancelType: type,
                status: "CANCELLED"
            }
        })

        // if (cancelOrderById) {
        //     await prisma.notification.create({
        //         data: {
        //             type: "CANCELLED",
        //             userId: cancelOrderById.buyerId,
        //             communityId: cancelOrderById.sellerId,
        //             transactionId: cancelOrderById.id
        //         },
        //     })

        //     if (transaction.buyer.isNotificationsEnabled) {
        //         sendCancelledNotification(transaction.buyer.email as string, cancelOrderById.id, transaction.seller.name, cancelOrderById.cancelReason, cancelOrderById.cancelType)
        //     }
        // }

        revalidatePath("/history")
        return new Response(JSON.stringify(cancelOrderById));
    } catch (error) {
        console.error("Error updating transaction:", error);
        return new NextResponse(`Could not update transaction: ${error}`, { status: 500 });
    }
}
