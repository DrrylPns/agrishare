"use client"

import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import React from 'react'
import { TransferForm } from './TransferForm'

export const CTAButtons = () => {
    return (
        <div className='flex flex-row w-full gap-[20px] mx-2 md:mx-0 md:gap-[30px] items-center justify-center max-sm:mt-6 '>
            {/* <Card className='relative drop-shadow-md cursor-pointer w-fit p-1'>
                <Image src="/images/qr.png" alt="qr" width={90} height={90} />
                <p className='absolute -bottom-7 left-[27px] max-sm:left-[20px] font-semibold text-white'>Scan</p>
            </Card> */}

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

            <Dialog>
        <DialogTrigger className=''>
            <Card className='drop-shadow-md cursor-pointer w-fit p-1'>
                <Image src="/images/earn.png" alt="earn" width={90} height={90} />
                <p className='absolute -bottom-7 left-[27px] max-sm:left-[20px] font-semibold text-white'>Earn</p>
            </Card>
        </DialogTrigger>
        <DialogContent className='lg:max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='md:text-[48px] font-semibold mb-6 w-full justify-center items-center text-center'>Ways to Earn Points</DialogTitle>
            <DialogDescription className='grid grid-flow-col grid-rows-3 md:gap-5 gap-1'>
              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn1.png" alt='ways2earn1' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                By making a donation, you can gather points through participation in this activity. The number of points you acquire depends on the quantity donated and moderator approval, ensuring successful transfer to the intended beneficiary.
              </div>

              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn2.png" alt='ways2earn2' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                Engaging in trading activities can also earn you points, and the basis for your accumulated points will depend on the quantity or kilograms of the items you trade with other agrizens.
              </div>

              {/* <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn3.png" alt='ways2earn3' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                You can accumulate points not just through trading and donations; your best chance to earn points is by browsing today's news!
              </div> */}

              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn4.png" alt='ways2earn4' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                Now that your account is verified, unlocking additional features is not the only benefit; you also have the opportunity to earn points. What a fantastic way to kick off your journey as an Agritizens!
              </div>


            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
        </div>
    )
}
