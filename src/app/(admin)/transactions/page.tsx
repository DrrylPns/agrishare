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

export const dynamic = 'force-dynamic';

const page = async () => {

  const trades = await fetchTrades()
  const donations = await fetchDonations()
  const transactions = await fetchTransaction()
  const claims = await fetchAgriChangeTransactions()
  const requests = await fetchAgriQuestTransactions()

  return (
    <div className=''>
      <AdminTitle entry='4' title='History' />

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
                columns={columnTrade}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <AdminTitle entry='2' title='Donations' />
              <DataTable
                //@ts-ignore
                data={donations}
                columns={columnDonation}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <AdminTitle entry='3' title='Points' />
              <DataTable
                data={transactions}
                columns={columnPoints}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <AdminTitle entry='4' title='Claims' />
              <DataTable
                //@ts-ignore
                data={claims}
                columns={columnClaims}
                isHistory
              />
            </TabPanel>
            <TabPanel>
              <AdminTitle entry='5' title='Agriquests' />
              <DataTable
                //@ts-ignore
                data={requests}
                columns={columnQuest}
                isHistory
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  )
}

export default page