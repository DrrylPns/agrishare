"use client"
import { Loading } from "@/components/Loading"
import { Card, CardContent } from "@/components/ui/card"
import { UserWithMessages } from "@/lib/types"
import { User } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { fetchUsers, inspectChatRoom } from "../../../../../actions/chat"

interface Props {
    user: User
}

export default function ChatComponent({ user }: Props) {

    const { data: users, isError, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => await fetchUsers() as UserWithMessages[]
    })

    if (isError) {
        return <div>Error fetching users</div>;
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div key="1" className="flex bg-white dark:bg-zinc-800 h-[820px] border border-lime-500 rounded-lg ">
            <aside className="w-80 border-r dark:border-zinc-700">
                <div className="p-4 space-y-4 overflow-auto h-[820px] pb-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Messages</h2>
                    </div>

                    {users?.map((user) => {
                        return (
                            <div className="space-y-2" key={user.id}>
                                <Card className="p-2 cursor-pointer border-lime-500" onClick={() => {
                                    inspectChatRoom(user.id)
                                }}>
                                    {/* AVATAR OF COMMUNITY HINGIN NLNG IMAGE LOGO NG MGA COMMUNITY TAS GAWA AVATAR COMPONENT */}
                                    <CardContent>
                                        <h3 className="font-semibold">{user.name} {" "} {user.lastName}</h3>
                                        {/* {latestMessage && (
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {latestMessage.userId === user.id ? 'You sent: ' : ''}
                                                {latestMessage.content}
                                            </p>
                                        )}
                                        {!latestMessage && (
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                No messages yet
                                            </p>
                                        )} */}
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </aside>

            <section className="flex flex-col w-full">
                <main className="flex-1 overflow-auto p-4">
                    <div className="space-y-4 flex justify-center items-center h-[50vh] flex-col gap-3">
                        <h1 className="font-semibold text-2xl">
                            Communicate with traders, admin and donators!
                        </h1>
                    </div>
                </main>
            </section>
        </div>
    )
}