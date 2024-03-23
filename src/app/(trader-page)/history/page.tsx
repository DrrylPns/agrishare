import AdminTitle from '@/components/AdminTitle'
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import React from 'react'
import { DataTable } from '@/app/(admin)/users/_components/data-table'
import { fetchTradeByUser } from '../../../../actions/trade'
import { fetchDonationsByUser } from '../../../../actions/donate'
import { fetchTransactionByUser } from '../../../../actions/transaction'
import { columnTradeByUser } from './_components/columnTradeByUser'
import { columnDonationByUser } from './_components/columnDonationByUser'
import { columnPointsByUser } from './_components/columnPointsByUser'

export const dynamic = 'force-dynamic';

const page = async () => {

  const trades = await fetchTradeByUser()
  const donations = await fetchDonationsByUser()
  const transactions = await fetchTransactionByUser()

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
              {/* <DataTable data={ } columns={ } /> */}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  )
}

export default page