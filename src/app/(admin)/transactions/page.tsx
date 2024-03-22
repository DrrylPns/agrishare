import AdminTitle from '@/components/AdminTitle'
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import React from 'react'
import { DataTable } from '../users/_components/data-table'
import { fetchTrades } from '../../../../actions/trade'
import { fetchDonations } from '../../../../actions/donate'
import { fetchTransaction } from '../../../../actions/transaction'
import { columnTrade } from '@/components/tables/columnTrade'
import { columnDonation } from '@/components/tables/columnDonation'
import { columnPoints } from '@/components/tables/columnPoints'

export const dynamic = 'force-dynamic';

const page = async () => {

  const trades = await fetchTrades()
  const donations = await fetchDonations()
  const transactions = await fetchTransaction()

  return (
    <div className=''>
      <AdminTitle entry='4' title='History' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg">
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
                data={trades}
                columns={columnTrade}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <DataTable
                data={donations}
                columns={columnDonation}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <DataTable
                data={transactions}
                columns={columnPoints}
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