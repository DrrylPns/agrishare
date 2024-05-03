"use server"

import prisma from "@/lib/db"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { redirect } from "next/navigation"

export const fetchUsers = async (searchUsers?: string) => {
    try {
        const session = await auth();

        if (!session) return { error: "Unauthorized" };

        if (searchUsers) {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: searchUsers, mode: 'insensitive' } },
                        { lastName: { contains: searchUsers, mode: 'insensitive' } }
                    ]
                }
            });

            return users;
        } else {
            const chatRooms = await prisma.chatRoom.findMany({
                where: {
                    participants: {
                        some: {
                            id: session.user.id
                        }
                    }
                },
                include: {
                    messages: true,
                    participants: true
                },
                orderBy: {
                    updatedAt: "desc"
                },
            });

            return chatRooms;
        }
    } catch (error: any) {
        throw new Error(error);
    }
}


export const inspectChatRoom = async (user2Id: string) => {
    // note user2Id is the one who the trader is chatting with
    const session = await auth()

    if (!session) return { error: "Unauthorized" }

    const currentUser = await getUserById(session.user.id)

    if (!currentUser) return { error: "No user found!" }

    if (!user2Id) return { error: "No user found!" }

    const existingChatroom = await prisma.chatRoom.findFirst({
        where: {
            AND: [
                { participants: { some: { id: currentUser.id } } },
                { participants: { some: { id: user2Id } } },
            ],
        },
    });

    if (existingChatroom) {
        redirect(`/message/${existingChatroom.id}`)
    } else {
        const newChatRoom = await prisma.chatRoom.create({
            data: {
                participants: {
                    connect: [
                        { id: currentUser.id },
                        { id: user2Id }
                    ]
                }
            }
        })

        // if (newChatRoom) {
        //     await prisma.message.create({
        //         data: {
        //             content: `
        //             Welcome to our "Barangay ${currentCommunity?.name} live chat! We're available on weekdays from 8:00 AM to 5:00 PM and Saturdays from 8:00 AM to 12:00 PM. We're closed on Sundays. Please leave us a message if you reach out outside of these hours, and we'll respond promptly during our next available time slot. Thank you for choosing our barangay office for assistance!
        //             `,
        //             communityId,
        //             chatRoomId: newChatRoom.id,
        //         }
        //     })
        // }

        redirect(`/message/${newChatRoom.id}`)
    }
}

export const fetchMessages = async (id: string, page: number, limit: number) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const skip = page * limit;

        const messages = await prisma.message.findMany({
            where: {
                chatRoomId: id
            },
            take: limit,
            skip: skip,
            orderBy: {
                createdAt: "desc"
            }
        })

        const count = await prisma.message.count({
            where: {
                chatRoomId: id,
            },
        });

        const hasMore = skip + limit < count;

        return { messages, nextPage: hasMore ? page + 1 : null };

    } catch (error: any) {
        throw new Error(error)
    }
}

export const sendMessage = async (
    chatRoomId: string,
    senderId: string,
    content: string,
    image: string
) => {
    try {
        const session = await auth();

        if (!session) return { error: "Unauthorized" };

        const user = await getUserById(senderId);

        if (!user) return { error: "User not found!" };

        if (content.length < 1) return { error: "Please enter a message!" };

        if (content.length >= 1000) return { error: "Content too long..." };


        const newMessage = await prisma.message.create({
            data: {
                chatRoomId,
                senderId,
                content,
                image,
            },
        });

        if (newMessage) {
            const currentChatRoom = await prisma.chatRoom.findUnique({
                where: { id: chatRoomId },
                include: {
                    participants: true,
                }
            })

            await prisma.chatRoom.update({
                where: {
                    id: currentChatRoom?.id
                },
                data: {
                    updatedAt: new Date()
                }
            })
        }
        //     const otherParticipant = currentChatRoom?.participants.find(participant => participant.id !== senderId);

        //     if (!otherParticipant) {
        //         return { error: "Other participant not found!" };
        //     }

        //     const otherUser = await prisma.user.findUnique({
        //         where: {
        //             id: otherParticipant.id
        //         }
        //     })

        //     if (!otherUser) return { error: "No participant found!" }

        //     await prisma.user.update({
        //         where: { id: otherUser.id },
        //         data: {
        //             updatedAt: new Date(),
        //         }
        //     })
        // }

        // await pusherServer.trigger(chatRoomId, 'messages:new', newMessage);

        return { success: "Message sent" };
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteMessage = async (id: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized" }

        if (!id) return { error: "Message not found!" }

        await prisma.message.delete({
            where: { id }
        })

        return { success: "Message deleted!" }
    } catch (error: any) {
        throw new Error(error)
    }
}