import { Card } from '@tremor/react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info } from 'lucide-react'

import { PageNF } from '@/components/not-found'
import { fetchUser } from '../../../../actions/users'
import { User } from '@prisma/client'
import { CTAButtons } from './_components/CTAButtons'

const page = async () => {

  const user = await fetchUser() as User

  if (!user) return <PageNF />

  return (
    <Card className='max-w-5xl h-full drop-shadow-md bg-[#BCF6BE] outline-none border-none p-0 space-y-3 relative mt-[60px] lg:mt-5 xl:mt-0'>

      <div className='w-full flex flex-col justify-center items-center mt-5'>
        <p>My points</p>
        <p className='font-extrabold text-[24px]'>{user.points}</p>
      </div>

      <Dialog>
        <DialogTrigger className='absolute top-5 right-0 mr-5'>
          <Info />
        </DialogTrigger>
        <DialogContent className='lg:max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='md:text-[48px] font-semibold mb-6 w-full justify-center items-center text-center'>Ways to Earn Points</DialogTitle>
            <DialogDescription className='grid grid-flow-col grid-rows-4 md:gap-5 gap-1'>
              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn1.png" alt='ways2earn1' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                By making a donation, you can gather points through participation in this activity. The number of points you acquire depends on the quantity donated and moderator approval, ensuring successful transfer to the intended beneficiary.
              </div>

              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn2.png" alt='ways2earn2' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                Engaging in trading activities can also earn you points, and the basis for your accumulated points will depend on the quantity or kilograms of the items you trade with other agrizens.
              </div>

              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn3.png" alt='ways2earn3' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                You can accumulate points not just through trading and donations; your best chance to earn points is by browsing today's news!
              </div>

              <div className='text-muted-foreground flex md:flex-row flex-col md:gap-5 lg:gap-7 items-center justify-center gap-0'>
                <Image src="/images/WaysToEarn4.png" alt='ways2earn4' width={100} height={100} className='w-[40px] h-[40px] md:w-[100px] md:h-[100px]' />
                Now that your account is verified, unlocking additional features is not the only benefit; you also have the opportunity to earn points. What a fantastic way to kick off your journey as an Agritizens!
              </div>


            </DialogDescription>
          </DialogHeader>   
        </DialogContent>
      </Dialog>

      <div className={`bg-[url(https://utfs.io/f/6cab600f-5d4b-4c30-94da-7af722f07000-cm65r5.png)] bg-no-repeat h-[400px] relative flex flex-col gap-[40px]`}>
        <div className='flex flex-col justify-start items-center w-full gap-3'>
          {user.points >= 3000 ? (
            <Image src="/images/seedling5.svg" alt="seedling5" width={200} height={200} className='max-h-[200px] max-w-[200px]' />
          ) : user.points >= 1000 ? (
            <Image src="/images/seedling4.svg" alt="seedling4" width={200} height={200} className='max-h-[200px] max-w-[200px]' />
          ) : user.points >= 500 ? (
            <Image src="/images/seedling3.svg" alt="seedling3" width={200} height={200} className='max-h-[200px] max-w-[200px]' />
          ) : user.points >= 100 ? (
            <Image src="/images/seedling2.svg" alt="seedling2" width={200} height={200} className='max-h-[200px] max-w-[200px]' />
          ) : (
            <Image src="/images/seedling1.svg" alt="seedling1" width={200} height={200} className='max-h-[200px] max-w-[200px]' />
          )}
        </div>

        <CTAButtons />
      </div>



      {/* <Image src="/images/PointsDesign.png" alt='points bg image' width={1200} height={1200} className='w-full h-full' /> */}
    </Card>
  )
}

export default page