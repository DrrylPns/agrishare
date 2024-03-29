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

export const dynamic = 'force-dynamic';

const page = async () => {

  const trades = await fetchTradeByUser()
  const donations = await fetchDonationsByUser()
  const transactions = await fetchTransactionByUser()
  const claims = await fecthAgriChangeTransactionsByUser()
  const quests = await fecthAgriQuestTransactionsByUser()

  return (
    <div className='max-w-[1260px]'>
      <div className='my-5 flex flex-row items-center gap-3'>
        <h1 className='text-[#1C2A53] text-xl font-semibold'>History</h1>
      </div>

      <Card className="mx-auto max-w-[1260px] h-full drop-shadow-lg">
        <TabGroup>
          <TabList className="mt-4">
            <Tab>Trade</Tab>
            <Tab>Donation</Tab>
            <Tab>Points</Tab>
            <Tab>Claims</Tab>
            <Tab>Agriquest</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <DataTable
                //@ts-ignore
                data={trades}
                columns={columnTradeByUser}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <DataTable
                //@ts-ignore
                data={donations}
                columns={columnDonationByUser}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <DataTable
                //@ts-ignore
                data={transactions}
                columns={columnPointsByUser}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <DataTable
                //@ts-ignore
                data={claims}
                columns={columnClaimsByUser} />
            </TabPanel>
            <TabPanel>
              <DataTable
                //@ts-ignore
                data={quests}
                columns={columnQuestByUser} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  )
}

export default page