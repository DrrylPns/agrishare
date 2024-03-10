import { Card, Grid, } from '@tremor/react';
import { UsersRound } from 'lucide-react';
import PieChart from './_components/PieChart';
import AdminTitle from '@/components/AdminTitle';

const DashboardPage = () => {
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
                150
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
                50
              </div>
            </div>

            <div className='my-auto text-neutral-500'>
              <UsersRound />
            </div>
          </Card>
        </Grid>

        {/* PIE CHART */}
        <PieChart />
      </Card>
    </div>
  )
}

export default DashboardPage