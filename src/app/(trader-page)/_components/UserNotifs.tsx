"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationWithUser } from '@/lib/types'
import { formatCreatedAt } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CiBellOn } from 'react-icons/ci'
import { GoDotFill } from "react-icons/go"
import { BeatLoader } from 'react-spinners'
import { fetchNotifications, notificationRead } from '../../../../actions/notification'

export const UserNotifs = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<NotificationWithUser[]>([])
    const pathname = usePathname()

    const fetchNotificationsByUser = async () => {
        try {
            const notifs = await fetchNotifications();
            setNotifications(notifs as NotificationWithUser[]);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError(true)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotificationsByUser()
    }, [])


    const hasUnread = notifications.some(notification => notification.isRead == false);

    return (
        <Popover>
            <PopoverTrigger>
                <div className='relative'>
                    <CiBellOn />
                    {hasUnread && (
                        <span className='text-red-600 text-lg absolute right-[-1px] top-[-1px]'><GoDotFill /></span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="p-1 py-4">
                        <h4 className="mb-2 text-[16px] leading-none ml-2 font-semibold">Notifications</h4>

                        {notifications.length === 0 && !loading && !error && (
                            <div className="text-gray-500 text-center">You currently have no notifications yet.</div>
                        )}

                        {loading && <div className="flex items-center justify-center"><BeatLoader /></div>}

                        {error && <div className="text-red-500">Error fetching notifications!</div>}

                        {!loading && !error && (
                            <>


                                {notifications.map((notification) => (
                                    <div key={notification.id} className="grid gap-1 p-1 text-sm">
                                        <Link
                                            className={`flex flex-col items-start p-2 rounded-md dark:bg-gray-800 ${!notification.isRead ? "bg-gray-100" : ""}`}
                                            href={`${notification.type === "PENDING" ? `/trades/${notification.tradeId}` : notification.type === "CANCELLED" ? "/points" : "/history"}`}
                                            onClick={async () => {
                                                notificationRead(notification.id, pathname)
                                            }}
                                        >
                                            <div className='flex items-center'>
                                                {notification.type === "PENDING" && (
                                                    <div> <span className='font-bold'>{notification.trade?.trader.name}</span> has requested a trade to your <span className='font-bold'>{notification.trade?.post.name}</span>.</div>
                                                )}
                                                {notification.type === "TRADEEACCEPTED" && (
                                                    <div> You have accepted the <span className='font-bold'>{notification.trade?.item}</span> trade request of <span className='font-bold'>{notification.trade?.trader.name}</span></div>
                                                )}
                                                {notification.type === "TRADERACCEPTED" && (
                                                    <div> <span className='font-bold'>{notification.trade?.tradee.name}</span> has accepted your trade request to the <span className='font-bold'>{notification.trade?.post.name}</span></div>
                                                )}
                                                {notification.type === "TRADEEDECLINE" && (
                                                    <div> You declined the <span className='font-bold'>{notification.trade?.item}</span> trade request of <span className='font-bold'>{notification.trade?.trader.name}</span></div>
                                                )}
                                                {notification.type === "TRADERDECLINE" && (
                                                    <div>
                                                        <span className='font-bold'>{notification.trade?.tradee.name} {" "}</span>
                                                        has declined your trade request to the <span className='font-bold'>{notification.trade?.post.name}</span></div>
                                                )}
                                                {notification.type === "TRADEECOMPLETE" && (
                                                    <div>
                                                        The trade for <span className='font-bold'>{notification.trade?.item}</span> with <span className='font-bold'>{notification.trade?.trader.name}</span> has been completed successfully!
                                                    </div>
                                                )}
                                                {notification.type === "TRADERCOMPLETE" && (
                                                    <div>
                                                        The trade for <span className='font-bold'>{notification.trade?.post.name}</span> with <span className='font-bold'>{notification.trade?.tradee.name}</span> has been completed successfully!
                                                    </div>
                                                )}
                                                {notification.type === "DONATIONPENDING" && (
                                                    <div>
                                                        Your donation has been sent and is pending for approval. <span className="font-bold">Click here for more information</span>
                                                    </div>
                                                )}
                                                {notification.type === "DONATIONCANCELLED" && (
                                                    <div>
                                                        Your donation has been cancelled. <span className="font-bold">Click here for more information</span>
                                                    </div>
                                                )}
                                                {notification.type === "DONATIONAPPROVED" && (
                                                    <div>
                                                        Your donation has been approved! <span className="font-bold">Click here for more information</span>
                                                    </div>
                                                )}
                                                {notification.type === "AGRIQUESTPENDING" && (
                                                    <div>
                                                        Your agriquest request has been sent and is pending for approval. <span className="font-bold">Click here for more information</span>
                                                    </div>
                                                )}
                                                {notification.type === "AGRIQUESTCANCELLED" && (
                                                    <div>
                                                        Your agriquest request has been cancelled. <span className="font-bold">Click here for more information</span>
                                                    </div>
                                                )}
                                                {notification.type === "AGRIQUESTAPPROVED" && (
                                                    <div>
                                                        Your agriquest request has been approved! <span className="font-bold">Click here for more information</span>
                                                    </div>
                                                )}
                                                {notification.type === "PROCESSING" && (
                                                    <div><span className='font-bold'>Claiming processed!</span> Your current points is on hold!</div>
                                                )}
                                                {notification.type === "CANCELLED" && (
                                                    <div><span className='font-bold'>Claiming cancelled!</span> Your points has been returned!</div>
                                                )}
                                                {notification.type === "COMPLETED" && (
                                                    <div><span className='font-bold'>Claiming successful!</span> Your points has been officialy deducted!</div>
                                                )}
                                            </div>

                                            <time className="text-[13px] text-gray-500 dark:text-gray-400">
                                                {formatCreatedAt(notification.createdAt)}
                                            </time>
                                        </Link>

                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
