"use client"

import AdminTitle from '@/components/AdminTitle'
import { Loading } from '@/components/Loading'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { fetchAgrichange } from '../../../../actions/agrichange'
import { DataTable } from '../users/_components/data-table'
import { AgrichangeForm } from './_components/AgrichangeForm'
import { columnAgrichange } from './_components/columnAgrichange'
import { AgriChangeType } from '@/lib/types'

const page = () => {

  const { data: agrichange, isLoading } = useQuery({
    queryKey: ["agrichange"],
    queryFn: async () => await fetchAgrichange()
  })

  if (isLoading) return <Loading />

  return (
    <div className='h-full'>
      <AdminTitle entry='5' title='Agrichange' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11">
        <TabGroup>
          <TabList className="mt-4">
            <Tab>Add items</Tab>
            <Tab>View items</Tab>
          </TabList>
          <TabPanels>

            <TabPanel>
              <AgrichangeForm />
            </TabPanel>

            <TabPanel>
              <DataTable
                data={agrichange as AgriChangeType[]}
                columns={columnAgrichange}
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