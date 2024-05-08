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
import { fetchAdminNotifications, notificationRead } from '../../../../actions/notification'

export const AdminNotifs = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<NotificationWithUser[]>([])
    const pathname = usePathname()

    const fetchNotificationsByUser = async () => {
        try {
            const notifs = await fetchAdminNotifications();
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
                <div className='relative text-3xl'>
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
                                        <div
                                            className={`cursor-pointer flex flex-col items-start p-2 rounded-md dark:bg-gray-800 ${!notification.isRead ? "bg-gray-100" : ""}`}
                                            onClick={async () => {
                                                notificationRead(notification.id, pathname)
                                            }}
                                        >
                                            <div className='flex items-center'>
                                                {notification.type === "ADMINDONATION" && (
                                                    <Link
                                                        href="/transactions"
                                                    >
                                                        <span className="font-semibold">{notification.user.name}</span> has donated, check out the donation!
                                                    </Link>
                                                )}
                                                {notification.type === "AGRICHANGE" && (
                                                    <Link
                                                        href="/transactions"
                                                    >
                                                        <span className="font-semibold">{notification.user.name}</span> has request to claim an item, click here for more information!
                                                    </Link>
                                                )}
                                                {notification.type === "AGRIQUEST" && (
                                                    <Link
                                                        href="/transactions"
                                                    >
                                                        <span className="font-semibold">{notification.user.name}</span> filed a request for an item in agriquest, click here for more information!
                                                    </Link>
                                                )}
                                            </div>

                                            <time className="text-[13px] text-gray-500 dark:text-gray-400">
                                                {formatCreatedAt(notification.createdAt)}
                                            </time>
                                        </div>

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
