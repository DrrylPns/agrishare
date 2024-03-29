"use client"

import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import React from 'react'
import { TransferForm } from './TransferForm'

export const CTAButtons = () => {
    return (
        <div className='flex flex-row gap-[40px] mx-2 md:mx-0 md:gap-[60px] items-center justify-center max-sm:mt-6'>
            <Card className='relative drop-shadow-md cursor-pointer w-fit p-1'>
                <Image src="/images/qr.png" alt="qr" width={90} height={90} />
                <p className='absolute -bottom-7 left-[27px] max-sm:left-[20px] font-semibold text-white'>Scan</p>
            </Card>

            <Dialog>
                <DialogTrigger>
                    <Card className='drop-shadow-md cursor-pointer w-fit p-1'>
                        <Image src="/images/transfer.png" alt="transfer" width={90} height={90} />
                        <p className='absolute -bottom-7 left-[20px] max-sm:left-[7px] font-semibold text-white'>Transfer</p>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer</DialogTitle>
                        <DialogDescription>
                            <TransferForm />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Card className='drop-shadow-md cursor-pointer w-fit p-1'>
                <Image src="/images/earn.png" alt="earn" width={90} height={90} />
                <p className='absolute -bottom-7 left-[27px] max-sm:left-[20px] font-semibold text-white'>Earn</p>
            </Card>
        </div>
    )
}
