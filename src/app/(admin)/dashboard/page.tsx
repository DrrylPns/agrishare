"use client"
import AdminTitle from '@/components/AdminTitle';
import { Card, Grid, } from '@tremor/react';
import { UsersRound } from 'lucide-react';
import { DonationChart } from './_components/DonationChart';
import { TradeChart } from './_components/TradeChart';
import { useQuery } from '@tanstack/react-query';
import { fetchUrbanDonator, fetchUrbanFarmers } from '../../../../actions/dashboard';

const DashboardPage = () => {

  const { data: urbanFarmers } = useQuery({
    queryKey: ["urban-farmers"],
    queryFn: async () => await fetchUrbanFarmers()
  })

  const { data: donators } = useQuery({
    queryKey: ["urban-donators"],
    queryFn: async () => await fetchUrbanDonator()
  })

  return (
    <div className=''>
      <AdminTitle entry='1' title='Analytics' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg">
        <Grid className="gap-6 mt-6" numItems={1} numItemsLg={2}>
          <Card className='flex justify-between shadow-lime-400 drop-shadow-lg'>
            <div>
              <div className=' text-neutral-500 text-sm'>
                Urban Farmers
              </div>
              <div className='text-[#1C2A53] text-[24px] font-bold'>
                {urbanFarmers as number}
              </div>
            </div>

            <div className='my-auto text-neutral-500'>
              <UsersRound />
            </div>

          </Card>

          <Card className='flex justify-between shadow-lime-400 drop-shadow-lg'>
            <div>
              <div className=' text-neutral-500 text-sm'>
                Donator
              </div>
              <div className='text-[#1C2A53] text-[24px] font-bold'>
                {donators as number}
              </div>
            </div>

            <div className='my-auto text-neutral-500'>
              <UsersRound />
            </div>
          </Card>
        </Grid>

        {/* DonationChart */}
        <DonationChart />

        {/* TradeChart */}
        <TradeChart />
      </Card>
    </div>
  )
}

export default DashboardPage