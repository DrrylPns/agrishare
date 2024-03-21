"use client"

import React, { useEffect, useState } from 'react'
import { CiBellOn } from 'react-icons/ci'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchNotifications, notificationRead } from '../../../../actions/notification'
import { NotificationWithUser } from '@/lib/types'
import Link from 'next/link'
import { MailIcon } from 'lucide-react'
import { formatCreatedAt } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'
import { Separator } from '@/components/ui/separator'
import { GoDotFill } from "react-icons/go";

export const UserNotifs = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<NotificationWithUser[]>([])

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
                        {/* pag merong isRead false, then render yung pulang notif parang sa add to cart natin sa agreen nature connect pero kahit wag na may number khit pula nlng */}
                        {loading && <div className="flex items-center justify-center"><BeatLoader /></div>}

                        {error && <div className="text-red-500">Error fetching notifications!</div>}

                        {!loading && !error && (
                            <>
                                <h4 className="mb-2 text-[16px] leading-none ml-2 font-semibold">Notifications</h4>

                                {notifications.map((notification) => (
                                    <div key={notification.id} className="grid gap-1 p-1 text-sm">
                                        <Link
                                            className={`flex flex-col items-start p-2 rounded-md dark:bg-gray-800 ${!notification.isRead ? "bg-gray-100" : ""}`}
                                            href={`/trades/${notification.tradeId}`}
                                            onClick={async () => {
                                                notificationRead(notification.id)
                                            }}
                                        >
                                            <div className='flex items-center'>
                                                {/* <MailIcon className="mr-2 h-7 w-7" /> */}
                                                {notification.type === "PENDING" && (
                                                    <div> <span className='font-bold'>{notification.trade.trader.name}</span> has requested a trade to your <span className='font-bold'>{notification.trade.post.name}</span>.</div>
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
