"use client"
import AdminTitle from '@/components/AdminTitle'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { fetchAgriquest } from '../../../../actions/agriquest'
import { AgriquestForm } from './_components/AgriquestForm'
import { AgriQuestType } from '@/lib/types'
import { columnAgriquest } from './_components/columnAgriquest'
import { DataTable } from '../users/_components/data-table'
import { Loading } from '@/components/Loading'

const AgriQuestPage = () => {

    const { data: agriquest, isLoading } = useQuery({
        queryKey: ["agriquest"],
        queryFn: async () => await fetchAgriquest()
    })

    if (isLoading) return <Loading />

    return (
        <div className='h-full'>
            <AdminTitle entry='6' title='Agriquest' />

            <Card className="mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11">
                <TabGroup>
                    <TabList className="mt-4">
                        <Tab>Add items</Tab>
                        <Tab>View items</Tab>
                    </TabList>
                    <TabPanels>

                        <TabPanel>
                            <AgriquestForm />
                        </TabPanel>

                        <TabPanel>
                            <DataTable
                                data={agriquest as AgriQuestType[]}
                                columns={columnAgriquest}
                                isHistory
                            />
                        </TabPanel>

                    </TabPanels>
                </TabGroup>

            </Card>
        </div>
    )
}

export default AgriQuestPage