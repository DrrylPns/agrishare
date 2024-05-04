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
import { fetchAgriChangeTransactions } from '../../../../actions/agrichange'
import { columnClaims } from '@/components/tables/columnClaims'
import { fetchAgriQuestTransactions } from '../../../../actions/agriquest'
import { columnQuest } from '@/components/tables/columnQuest'
import { BadgeCent, HeartHandshakeIcon, LeafyGreen, ShieldAlert, ShoppingBasketIcon } from 'lucide-react'
import { fetchReportedPost } from '../../../../actions/agrifeed'
import { columnReport } from '@/components/tables/columnReport'

export const dynamic = 'force-dynamic';

const page = async () => {

  const reportedPosts = await fetchReportedPost()


  return (
    <div className=''>
      <AdminTitle entry='8' title='Reports'/>
      <Card className="mx-auto max-w-full h-full drop-shadow-lg">
        <TabGroup>
          <TabList className="mt-4 p-0">
            <Tab>
              <BadgeCent className='w-4 h-4 block sm:hidden' />
              <p className='hidden sm:block'>Posts</p>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AdminTitle entry='1' title='Posts' />
              <DataTable
                //@ts-ignore
                data={reportedPosts}
                columns={columnReport}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  )
}

export default page