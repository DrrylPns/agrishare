import AdminTitle from '@/components/AdminTitle'
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import React from 'react'
import { DataTable } from '../users/_components/data-table'
import { fetchTrades } from '../../../../actions/trade'
import { columnsTrade } from './_components/columnsTrade'

const page = async () => {

  const trades = await fetchTrades()


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
              <DataTable data={trades} columns={columnsTrade} />
            </TabPanel>
            <TabPanel>
              {/* <DataTable data={ } columns={ } /> */}
            </TabPanel>
            <TabPanel>
              {/* <DataTable data={ } columns={ } /> */}
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