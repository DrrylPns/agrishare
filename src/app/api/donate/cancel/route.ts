import { CancelDonationSchema } from "@/lib/validations/donation";
import { auth } from "../../../../../auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }
        const body = await req.json()
        const { donationId, type } = CancelDonationSchema.parse(body)

        const donation = await prisma.donation.findUnique({
            where: {
                id: donationId,
            },
        });

        if (!donation) {
            return new NextResponse('Transaction not found', { status: 404 });
        }

        const cancelOrderById = await prisma.donation.update({
            where: {
                id: donation.id,
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

        revalidatePath("/transactions")
        return new Response(JSON.stringify(cancelOrderById));
    } catch (error) {
        console.error("Error updating transaction:", error);
        return new NextResponse(`Could not update transaction: ${error}`, { status: 500 });
    }
}
