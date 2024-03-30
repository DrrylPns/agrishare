"use client"
import { useQuery } from '@tanstack/react-query';
import { BarChart, Card } from '@tremor/react'
import React from 'react'
import { fetchTradesByDate } from '../../../../../actions/dashboard';

// const trades = [
//     {
//         date: 'Jan',
//         'Trades': 488,
//     },
//     {
//         date: 'Feb',
//         'Trades': 445,
//     },
//     {
//         date: 'Mar',
//         'Trades': 1743,
//     },
//     {
//         date: 'Apr',
//         'Trades': 1281,
//     },
//     {
//         date: 'May',
//         'Trades': 251,
//     },
//     {
//         date: 'Jun',
//         'Trades': 151,
//     },
//     {
//         date: 'Jul',
//         'Trades': 2389,
//     },
//     {
//         date: 'Aug',
//         'Trades': 1678,
//     },
//     {
//         date: 'Sep',
//         'Trades': 87,
//     },
//     {
//         date: 'Oct',
//         'Trades': 398,
//     },
//     {
//         date: 'Nov',
//         'Trades': 175,
//     },
//     {
//         date: 'Dec',
//         'Trades': 1632,
//     },
// ];

export const TradeChart = () => {

    const { data: tradesData } = useQuery({
        queryKey: ['trades-by-date'],
        queryFn: async () => fetchTradesByDate(),
    });

    return (
        <Card className='mx-auto max-w-6xl h-full drop-shadow-lg my-11'>
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Trades
            </h3>
            <BarChart
                className="mt-6"
                data={tradesData as any}
                index="date"
                categories={['Trades']}
                colors={['green']}
                yAxisWidth={48}
            />
        </Card>
    )
}
