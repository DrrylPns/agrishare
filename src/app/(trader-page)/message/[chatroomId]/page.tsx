import { redirect } from "next/navigation"
import { auth } from "../../../../../auth"
import prisma from "@/lib/db"
import { ChatRoom } from "../_components/ChatRoom"
import { ChatRoomWithMessages } from "@/lib/types"

interface Props {
    params: { chatroomId: string }
}

const ChatRoomPage = async ({ params }: Props) => {

    const session = await auth()

    if (!session) redirect("/discussion")

    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
    })
    const chatroom = await prisma.chatRoom.findUnique({
        where: {
            id: params.chatroomId,
            participants: {
                some: {
                    id: user?.id
                },
            },
        },
        include: {
            messages: true,
        }
    })

    return (
        <div className='pb-11 rounded-lg'>
            <ChatRoom chatroom={chatroom as ChatRoomWithMessages} userId={user?.id!} />
        </div>
    )
}

export default ChatRoomPage