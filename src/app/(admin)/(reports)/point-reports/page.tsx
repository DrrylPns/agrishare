"use client"
import { TradesWithRelations, TransactionWithRelations } from '@/app/(trader-page)/agrifeed/_components/_types'
import AdminTitle from '@/components/AdminTitle'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Card } from '@tremor/react'
import { format } from 'date-fns'
import { CalendarIcon, DownloadIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { fetchTradesByDateRange } from '../../../../../actions/trade'
import { DataTable } from '../../users/_components/data-table'
import { ColumnTradeReports } from '../_components/ColumnTradeReports'
import { fetchTransactionByDateRange } from '../../../../../actions/transaction'
import { ColumnPointsReports } from '../_components/ColumnPointsReports'
import { CardHeader } from '@/components/ui/card'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const TradeReportsPage = () => {
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [trades, setTrades] = useState<TransactionWithRelations[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                let startDate: Date | undefined;
                let endDate: Date | undefined;

                if (date && date.from && date.to) {
                    startDate = date.from;
                    endDate = date.to;
                } else {
                    // Default to current year if date range not selected
                    const today = new Date();
                    startDate = new Date(today.getFullYear(), 0, 1); // Start date is first day of current year
                    endDate = new Date(today.getFullYear(), 11, 31); // End date is last day of current year
                }

                const data = await fetchTransactionByDateRange(startDate, endDate);
                setTrades(data as TransactionWithRelations[])
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchData();
    }, [date]);

    const pdfRef = useRef<HTMLDivElement>(null);

    const downloadPDF = () => {
        const input = pdfRef.current;
        if (!input) {
            console.error("PDF reference is not available");
            return;
        }
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 2; // Adjust the Y position to start from the top with a 20px crop
            const imgHeightAdjusted = imgHeight * ratio + 30; // Adjusted height to fit the entire page with the crop
            pdf.addImage(imgData, 'PNG', imgX, imgY, pdfWidth, imgHeightAdjusted);
            pdf.save('Points-Report.pdf');
        });
    }

    return (
        <div>
          
            <div className='flex justify-between items-center'>
                <AdminTitle entry='1' title='Point Reports' />
                <div> <DownloadIcon onClick={downloadPDF} className='cursor-pointer' /></div>
            </div>
            <Card className='mx-auto max-w-full h-full drop-shadow-lg' ref={pdfRef}>
                <CardHeader>
                <h1 className='text-center w-full font-semibold mb-10'>Points</h1>
                </CardHeader>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full md:w-fulljustify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                <DataTable
                    //@ts-ignore
                    data={trades}
                    columns={ColumnPointsReports}
                    isHistory
                />
            </Card>
        </div>
    )
}

export default TradeReportsPage