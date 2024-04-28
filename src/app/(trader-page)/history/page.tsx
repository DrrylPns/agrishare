import { DataTable } from '@/app/(admin)/users/_components/data-table'
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { fecthAgriChangeTransactionsByUser } from '../../../../actions/agrichange'
import { fecthAgriQuestTransactionsByUser } from '../../../../actions/agriquest'
import { fetchDonationsByUser } from '../../../../actions/donate'
import { fetchTradeByUser } from '../../../../actions/trade'
import { fetchTransactionByUser } from '../../../../actions/transaction'
import { columnClaimsByUser } from './_components/columnClaimsByUser'
import { columnDonationByUser } from './_components/columnDonationByUser'
import { columnPointsByUser } from './_components/columnPointsByUser'
import { columnQuestByUser } from './_components/columnQuestByUser'
import { columnTradeByUser } from './_components/columnTradeByUser'
import { auth } from '../../../../auth'
import prisma from '@/lib/db'
import { getUserById } from '../../../../data/user'
import { BadgeCent, HeartHandshakeIcon, LeafyGreen, ShieldAlert, ShoppingBasketIcon } from 'lucide-react'
import AdminTitle from '@/components/AdminTitle'

export const dynamic = 'force-dynamic';

const page = async () => {

  const trades = await fetchTradeByUser()
  const donations = await fetchDonationsByUser()
  const transactions = await fetchTransactionByUser()
  const claims = await fecthAgriChangeTransactionsByUser()
  const quests = await fecthAgriQuestTransactionsByUser()
  const session = await auth()

  const user = await getUserById(session?.user.id as string)

  return (
    <div className='w-full md:w-[80%] p-6 mb-11 mt-4 md:mt-0'>
      <div className='my-5 flex flex-row items-center gap-3'>
        <h1 className='text-[#1C2A53] text-xl font-semibold'>History</h1>
      </div>
      {user?.role !== "DONATOR" ? (
        <Card className="mx-auto max-w-full h-full drop-shadow-lg">
          <TabGroup>
            <TabList className="mt-4 p-0">
              <Tab>
                <LeafyGreen className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Trade</p>
              </Tab>
              <Tab>
                <HeartHandshakeIcon className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Donation</p>
              </Tab>
              <Tab>
                <BadgeCent className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Points</p>
              </Tab>
              <Tab>
                <ShoppingBasketIcon className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Claims</p>
              </Tab>
              <Tab>
                <ShieldAlert className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Agriquest</p>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AdminTitle entry='1' title='Trades' />
                <DataTable
                  //@ts-ignore
                  data={trades}
                  columns={columnTradeByUser}
                  isHistory
                />
              </TabPanel>
              <TabPanel>
                <AdminTitle entry='2' title='Donations' />
                <DataTable
                  //@ts-ignore
                  data={donations}
                  columns={columnDonationByUser}
                  isHistory
                />
              </TabPanel>
              <TabPanel>
                <AdminTitle entry='3' title='Points' />
                <DataTable
                  //@ts-ignore
                  data={transactions}
                  columns={columnPointsByUser}
                  isHistory
                />
              </TabPanel>
              <TabPanel>
                <AdminTitle entry='4' title='Claims' />
                <DataTable
                  //@ts-ignore
                  data={claims}
                  columns={columnClaimsByUser}
                  isHistory
                />
              </TabPanel>
              <TabPanel>
                <AdminTitle entry='5' title='Agriquests' />
                <DataTable
                  //@ts-ignore
                  data={quests}
                  columns={columnQuestByUser}
                  isHistory
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      ) :
        <Card className="mx-auto max-w-full h-full drop-shadow-lg">
          <TabGroup>
            <TabList className="mt-4 p-0">
              <Tab>
                <HeartHandshakeIcon className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Donation</p>
              </Tab>
              <Tab>
                <BadgeCent className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Points</p>
              </Tab>
              <Tab>
                <ShoppingBasketIcon className='w-4 h-4 block sm:hidden' />
                <p className='hidden sm:block'>Claims</p>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AdminTitle entry='1' title='Donations' />
                <DataTable
                  //@ts-ignore
                  data={donations}
                  columns={columnDonationByUser}
                  isHistory
                />
              </TabPanel>
              <TabPanel>
                <AdminTitle entry='2' title='Points' />
                <DataTable
                  //@ts-ignore
                  data={transactions}
                  columns={columnPointsByUser}
                  isHistory
                />
              </TabPanel>
              <TabPanel>
                <AdminTitle entry='3' title='Claims' />
                <DataTable
                  //@ts-ignore
                  data={claims}
                  columns={columnClaimsByUser}
                  isHistory
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      }

    </div>
  )
}

export default page