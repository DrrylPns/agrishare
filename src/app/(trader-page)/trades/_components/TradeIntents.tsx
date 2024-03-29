"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TradeWithTradeeTraders } from '@/lib/types'
import Image from 'next/image'
import React from 'react'

interface TradeIntentsProps {
    trades: TradeWithTradeeTraders[]
}


export const TradeIntents: React.FC<TradeIntentsProps> = ({
    trades
}) => {

    return (
        trades.map((trade) => (
            <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2">
                    <Avatar>
                        <AvatarImage
                            className='cursor-pointer'
                            src={`${trade.trader.image ? trade.trader.image : "/avatar-placeholder.jpg"}`}
                            width={25}
                            height={25}
                            alt='User Profile' />
                        <AvatarFallback>Trader Profile</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-semibold mt-4">{trade.trader.name} {" "} {trade.trader.lastName}</h2>
                    {/* <div className="flex items-center mt-1">
                        <StarIcon className="text-yellow-400 w-5 h-5" />
                        <StarIcon className="text-yellow-400 w-5 h-5" />
                        <StarIcon className="text-yellow-400 w-5 h-5" />
                        <StarIcon className="text-yellow-400 w-5 h-5" />
                        <StarIcon className="text-yellow-400 w-5 h-5" />
                        <span className="text-gray-500 ml-2">5 Reviews</span>
                    </div> */}
                </div>
                <hr className="my-6 border-gray-300" />
                <div className="flex flex-col items-center">
                    <Image
                        alt="Product Image"
                        className="w-48 h-48"
                        height="200"
                        src={`${trade.image}`}
                        style={{
                            aspectRatio: "200/200",
                            objectFit: "cover",
                        }}
                        width="200"
                    />
                    <p className="text-center text-gray-600 mt-4">
                        {trade.description}
                    </p>
                    <span className="text-2xl font-semibold mt-4">x{trade.quantity}</span>
                </div>
                <hr className="my-6 border-gray-300" />
                <div className="flex justify-center gap-4">
                    {/* implement also the send accept notification. Notify the trader that the tradee has accepted their request and to send proof */}
                    <Button className=" px-6 py-2 rounded-full" variant="primary">Accept</Button>
                    <Button className=" px-6 py-2 rounded-full" variant="destructive">Decline</Button>
                </div>
            </div>
        ))
    )
}
