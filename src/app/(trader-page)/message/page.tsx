
import { redirect } from 'next/navigation'
import { auth } from '../../../../auth'
import prisma from '@/lib/db'
import ChatComponent from './_components/ChatComponent'

const MessagePage = async () => {

    const session = await auth()

    if (!session) redirect("/discussion")

    const user = await prisma.user.findUnique({
        where: { id: session?.user.id }
    })

    return (
        <div className='w-full p-3'>
            <ChatComponent currentUser={user!} />
        </div>
    )
}

export default MessagePage