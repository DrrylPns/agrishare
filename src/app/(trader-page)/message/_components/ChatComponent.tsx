"use client"
import { Loading } from "@/components/Loading"
import { Card, CardContent } from "@/components/ui/card"
import { ChatRoomWithMessagesAndParticipants, UserWithMessages } from "@/lib/types"
import { User } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { fetchUsers, inspectChatRoom } from "../../../../../actions/chat"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"

interface Props {
    currentUser: User
}

export default function ChatComponent({ currentUser }: Props) {
    const [isPending, startTransition] = useTransition()
    const [userSearch, setUserSearch] = useState("")

    const { data: users, isError, isLoading, refetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => await fetchUsers(userSearch) as ChatRoomWithMessagesAndParticipants[],
        refetchInterval: 2 * 1000,
        staleTime: 2 * 1000,
    });

    if (isError) {
        return <div>Error fetching users</div>;
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div key="1" className="w-full flex bg-white dark:bg-zinc-800 h-[820px] border border-lime-500 rounded-lg ">
            <aside className="w-80 border-r dark:border-zinc-700">
                <div className="p-4 space-y-4 overflow-auto h-[820px] pb-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Messages</h2>
                    </div>

                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="text" placeholder="Search users" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                        <Button
                            type="submit"
                            disabled={isPending}
                            onClick={() => {
                                startTransition(() => {
                                    fetchUsers(userSearch).then((callback) => {
                                        refetch()
                                    })
                                })
                            }}
                        >
                            Search
                        </Button>
                    </div>

                    {users?.map((user) => {

                        const otherParticipant = user.participants?.find(participant => participant.id !== currentUser.id)

                        return (
                            <div className="space-y-2" key={user.id}>
                                <Card className="p-2 cursor-pointer border-lime-500" onClick={() => {
                                    {
                                        userSearch ?
                                            inspectChatRoom(user?.id as string)
                                            :
                                            inspectChatRoom(otherParticipant?.id as string)
                                    }
                                }}>
                                    {/* AVATAR OF COMMUNITY HINGIN NLNG IMAGE LOGO NG MGA COMMUNITY TAS GAWA AVATAR COMPONENT */}
                                    <CardContent>
                                        {/* IF I SEARCH A USER THE OTHER PARTICIPANT DOESN'T EXIST, THUS WHEN I SEARCH I CAN'T SEE ANY NAME AND LAST NAME. HOW CAN I CONDITIONALLY RENDER THIS? */}
                                        {userSearch ? (
                                            //@ts-ignore
                                            <h3 className="font-semibold">{user.name} {" "} {user.lastName}</h3>
                                        ) : (
                                            <h3 className="font-semibold">{otherParticipant?.name} {" "} {otherParticipant?.lastName}</h3>
                                        )}

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
            </aside >

            <section className="flex flex-col w-full">
                <main className="flex-1 overflow-auto p-4">
                    <div className="space-y-4 flex justify-center items-center h-[50vh] flex-col gap-3">
                        <h1 className="font-semibold text-2xl">
                            Communicate with traders, admin and donators!
                        </h1>
                    </div>
                </main>
            </section>
        </div >
    )
}