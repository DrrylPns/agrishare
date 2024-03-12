"use client"
import { DonutChart, Legend, Card, Grid } from '@tremor/react';

const sales = [
    {
        name: 'Company',
        sales: 980,
    },
    {
        name: 'Locals',
        sales: 456,
    },
    {
        name: 'Urban Farmers',
        sales: 390,
    },
    {
        name: 'Anonymous',
        sales: 240,
    },
]

const PieChart = () => {

    return (
        <>
            <Grid className="gap-6 mt-11" numItems={1} numItemsLg={1}>
                <div className="flex items-center justify-center space-x-6">
                    <DonutChart
                        data={sales}
                        category="sales"
                        index="name"
                        colors={['orange', 'indigo', 'sky', 'rose']}
                        className="w-40"
                    />
                </div>
            </Grid>

            <Grid className='lg:ml-[33%]' numItemsLg={2}>
                <Legend
                    categories={['Company', 'Urban Farmer',]}
                    colors={['orange', 'sky',]}
                    className='lg:max-w-[150px] mt-3 flex flex-col items-center justify-center'
                />
                <Legend
                    categories={['Locals', 'Anonymous',]}
                    colors={['indigo', 'rose']}
                    className='lg:max-w-[150px] mt-3 flex flex-col items-center justify-center'
                />
            </Grid>

        </>

    )
}

export default PieChart