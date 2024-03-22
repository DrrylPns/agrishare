"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TradeWithTradeeTraders } from '@/lib/types'
import Image from 'next/image'
import React, { useState, useTransition } from 'react'
import { tradeIntent } from '../../../../../actions/trade'
import { toast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'


interface SingleTradeProps {
    trade: TradeWithTradeeTraders
}

export const SingleTrade: React.FC<SingleTradeProps> = ({ trade }) => {
    const [isPending, startTransition] = useTransition()
    const [isAcceptOpen, setIsAcceptOpen] = useState<boolean>(false)
    const [isDeclineOpen, setIsDeclineOpen] = useState<boolean>(false)

    const first = trade.trader.name?.charAt(0)
    const last = trade.trader.lastName?.charAt(0)

    const email = trade.trader.email as string

    const isNotPending = trade.status !== "PENDING"

    return (
        <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
                <Avatar className='flex items-center justify-center'>
                    <AvatarImage
                        className='cursor-pointer'
                        src={trade.trader.image as string}
                        width={70}
                        height={70}
                        alt='User Profile' />
                    <AvatarFallback>{first}{last}</AvatarFallback>
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
            <div className="flex flex-col items-center justify-center">
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
                <p className="text-center text-muted-foreground mt-4">
                    {trade.description}
                </p>
                <span className="text-2xl font-semibold mt-4">x{trade.quantity}</span>
            </div>
            <hr className="my-6 border-gray-300" />
            <div className="flex justify-center gap-4">
                {isNotPending ?
                    <div className='text-muted-foreground'>This trade can no longer be accepted or declined.</div>
                    :
                    <>
                        <Button
                            className=" px-6 py-2 rounded-full"
                            variant="primary"
                            isLoading={isPending}
                            onClick={() => {
                                setIsAcceptOpen(true)
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            className=" px-6 py-2 rounded-full"
                            variant="destructive"
                            isLoading={isPending}
                            onClick={() => {
                                setIsDeclineOpen(true)
                            }}
                        >
                            Decline
                        </Button>

                        <AlertDialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        By clicking accept, you confirm that you want to process this trade.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className='bg-[#00B207] hover:bg-[#00B207]/80'
                                            onClick={() => {
                                                startTransition(() => {
                                                    tradeIntent("PROCESSING", trade.id, email).then((callback) => {
                                                        if (callback.error) {
                                                            toast({
                                                                description: callback.error,
                                                                variant: "destructive"
                                                            })
                                                        }

                                                        if (callback.success) {
                                                            toast({
                                                                description: callback.success,
                                                            })
                                                        }
                                                    })
                                                })
                                            }}
                                        >
                                            Accept
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogHeader>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={isDeclineOpen} onOpenChange={setIsDeclineOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        By clicking decline, you confirm that you don't want to process this trade.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className='bg-rose-500 hover:bg-rose-500/80'
                                            onClick={() => {
                                                startTransition(() => {
                                                    tradeIntent("CANCELLED", trade.id, email).then((callback) => {
                                                        if (callback.error) {
                                                            toast({
                                                                description: callback.error,
                                                                variant: "destructive"
                                                            })
                                                        }

                                                        if (callback.success) {
                                                            toast({
                                                                description: callback.success,
                                                            })
                                                        }
                                                    })
                                                })
                                            }}
                                        >
                                            Decline
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogHeader>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                }

            </div>
        </div>
    )
}
