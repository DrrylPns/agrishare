"use client"
import { BarChart, Card } from '@tremor/react';

const donation = [
    {
        date: 'Jan',
        'Donations': 2488,
    },
    {
        date: 'Feb',
        'Donations': 1445,
    },
    {
        date: 'Mar',
        'Donations': 743,
    },
    {
        date: 'Apr',
        'Donations': 281,
    },
    {
        date: 'May',
        'Donations': 251,
    },
    {
        date: 'Jun',
        'Donations': 1541,
    },
    {
        date: 'Jul',
        'Donations': 289,
    },
    {
        date: 'Aug',
        'Donations': 678,
    },
    {
        date: 'Sep',
        'Donations': 987,
    },
    {
        date: 'Oct',
        'Donations': 2398,
    },
    {
        date: 'Nov',
        'Donations': 1275,
    },
    {
        date: 'Dec',
        'Donations': 632,
    },
];


export const DonationChart = () => {
    return (
        <Card className='mx-auto max-w-6xl h-full drop-shadow-lg my-11'>
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Donations
            </h3>
            <BarChart
                className="mt-6"
                data={donation}
                index="date"
                categories={['Donations']}
                colors={['orange']}
                yAxisWidth={48}
            />
        </Card>

    )
}
