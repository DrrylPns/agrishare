"use client"
import { useQuery } from '@tanstack/react-query';
import { BarChart, Card } from '@tremor/react';
import { fetchDonationCount, fetchDonationCountsForDateRange } from '../../../../../actions/dashboard';
import { format, isSameDay } from 'date-fns';

// const donation = [
//     {
//         date: 'Jan',
//         'Donations': 2488,
//     },
//     {
//         date: 'Feb',
//         'Donations': 1445,
//     },
//     {
//         date: 'Mar',
//         'Donations': 743,
//     },
//     {
//         date: 'Apr',
//         'Donations': 281,
//     },
//     {
//         date: 'May',
//         'Donations': 251,
//     },
//     {
//         date: 'Jun',
//         'Donations': 1541,
//     },
//     {
//         date: 'Jul',
//         'Donations': 289,
//     },
//     {
//         date: 'Aug',
//         'Donations': 678,
//     },
//     {
//         date: 'Sep',
//         'Donations': 987,
//     },
//     {
//         date: 'Oct',
//         'Donations': 2398,
//     },
//     {
//         date: 'Nov',
//         'Donations': 1275,
//     },
//     {
//         date: 'Dec',
//         'Donations': 632,
//     },
// ];

export const DonationChart = () => {
    const startDate = new Date('2024-04-01');
    const endDate = new Date();


    const { data: approvedCounts } = useQuery({
        queryKey: ['approved-donations-counts'],
        queryFn: async () => fetchDonationCountsForDateRange("APPROVED", startDate, endDate),
    });

    const { data: declinedCounts } = useQuery({
        queryKey: ['declined-donations-counts'],
        queryFn: async () => fetchDonationCountsForDateRange("DECLINED", startDate, endDate),
    });

    const { data: cancelledCounts } = useQuery({
        queryKey: ['cancelled-donations-counts'],
        queryFn: async () => fetchDonationCountsForDateRange("CANCELLED", startDate, endDate),
    });


    const donationsData = approvedCounts?.flatMap(({ date, count }) => {
        const cancelledCount = cancelledCounts?.find((c) => isSameDay(c.date, date))?.count ?? 0;
        const declinedCount = declinedCounts?.find((c) => isSameDay(c.date, date))?.count ?? 0;


        if (count > 0 || cancelledCount > 0 || declinedCount > 0) {
            return {
                date: format(date, 'MMMM dd'),
                Approved: count,
                Cancelled: cancelledCount,
                Declined: declinedCount,
            };
        }
        return [];
    });

    return (
        <Card className='mx-auto max-w-6xl h-full drop-shadow-lg my-11'>
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Donations
            </h3>
            <BarChart
                className="mt-6"
                data={donationsData as any} // Pass donations directly
                index="date"
                categories={['Approved', 'Declined', 'Cancelled']}
                colors={['green', 'red', 'orange']}
                yAxisWidth={48}
                showAnimation
                allowDecimals={false}
            />
        </Card>
    );
};