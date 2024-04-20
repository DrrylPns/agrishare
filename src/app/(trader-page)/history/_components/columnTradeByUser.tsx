"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { TradeWithTradeeTraders } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useRef, useState, useTransition } from "react"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckIcon, FolderSyncIcon, MoreHorizontalIcon } from "lucide-react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import Link from "next/link"
import Image from "next/image"
import { UploadDropzone } from "@/lib/uploadthing"
import { handleTradeProof } from "../../../../../actions/trade"
import { conditionRates, formattedSLU } from "@/lib/utils"
import { RadioGroup } from "@headlessui/react"
// import { handleTrade } from "../../../actions/trade"

export const columnTradeByUser: ColumnDef<TradeWithTradeeTraders>[] = [
    {
        accessorKey: "trd",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADE ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.trd

            return <div
                className=""
            >
                {id}
            </div>
        },
    },
    {
        accessorKey: "item",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ITEM" />
            )
        },
        cell: ({ row }) => {
            const item = row.original.item

            return <div
                className=""
            >
                {item}
            </div>
        },
    },
    {
        accessorKey: "trader",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADER" />
            )
        },
        cell: ({ row }) => {
            const user = row.original.trader.name

            return <div
                className=""
            >
                {user}
            </div>
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="DATE" />
            )
        },
        cell: ({ row }) => {
            const date = row.original.createdAt


            return <div
                className=""
            >
                {format(date, "PPP")}
            </div>
        },
    },
    {
        accessorKey: "tradedQuantity",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TOTAL" />
            )
        },
        cell: ({ row }) => {
            const qty = row.original.tradedQuantity

            return <div
                className=""
            >
                {qty} items
            </div>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="STATUS" />
            )
        },
        cell: ({ row }) => {
            const status = row.original.status

            return <div
                className=""
            >
                {status}
            </div>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const [isReviewOpen, setIsReviewOpen] = useState<boolean>()
            const [isProofOpen, setIsProofOpen] = useState<boolean>()
            const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>()
            const [imageUrl, setImageUrl] = useState<string>("")
            const [isPending, startTransition] = useTransition()
            const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
            const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false)
            const [selectedRate, setSelectedRate] = useState(0)
            const [selectRateError, setSelectRateError] = useState<boolean>(false)


            const tradeId = row.original.id;
            const traderId = row.original.trader.id
            const tradeeId = row.original.tradee.id
            const postId = row.original.post.id
            const proofTradeeimage = row.original.proofTradee

            const traderName = row.original.trader.name
            const traderLastName = row.original.trader.lastName
            const traderImage = row.original.trader.image
            const traderItem = row.original.item
            const traderQty = row.original.quantity
            const traderPts = row.original.trader.points
            const traderShelfLife = row.original.shelfLife
            const traderSubcategory = row.original.subcategory
            const proofTraderimage = row.original.proofTrader
            const traderCategory = row.original.category
            const traderSize = row.original.size
            const traderConditionRate = row.original.traderConditionRate

            const tradeeName = row.original.tradee.name
            const tradeeLastName = row.original.tradee.lastName
            const tradeeImage = row.original.tradee.image
            const tradeeItem = row.original.post.name
            const tradeeQty = row.original.tradedQuantity
            const tradeePts = row.original.tradee.points
            const tradeeSubcategory = row.original.post.subcategory
            const tradeeCategory = row.original.post.category
            const tradeeSize = row.original.post.size
            const tradeeConditionRate = row.original.tradeeConditionRate

            const tradeeShelfLifeDuration = row.original.post.shelfLifeDuration
            const tradeeShelfLifeUnit = row.original.post.shelfLifeUnit
            const formattedShelfLifeUnit = formattedSLU(tradeeShelfLifeDuration, tradeeShelfLifeUnit)

            const tradeStatus = row.original.status
            const tradeDate = row.original.createdAt

            const firstLetterOfTraderName = traderName?.charAt(0);
            const firstLetterOfTraderLastName = traderLastName?.charAt(0);

            const firstLetterOfTradeeName = tradeeName?.charAt(0);
            const firstLetterOfTradeeLastName = tradeeLastName?.charAt(0);

            // const imageIsEmpty = row.original.proofTradee?.length === 0 && row.original.proofTrader?.length === 0
            const imageIsEmpty = imageUrl.length === 0
            const checkStatus = tradeStatus === "PROCESSING"
            const isCompleted = tradeStatus === "COMPLETED"
            // const imageIsEmpty = imageUrl.length === 0
            // kalkulasyon at rebolusyon

            let ptsEquivalentTrader
            let ptsEquivalentTradee

            // if (traderSubcategory === "FRUIT_VEGETABLES") {
            //     ptsEquivalentTrader = 0.18
            // } else if (traderSubcategory === "HERBS_VEGETABLES") {
            //     ptsEquivalentTrader = 0.17
            // } else if (traderSubcategory === "LEAFY_VEGETABLES") {
            //     ptsEquivalentTrader = 0.15
            // } else if (traderSubcategory === "PODDED_VEGETABLES") {
            //     ptsEquivalentTrader = 0.25
            // } else if (traderSubcategory === "ROOT_VEGETABLES") {
            //     ptsEquivalentTrader = 0.20
            // } else {
            //     ptsEquivalentTrader = 0.15
            // }

            if (traderSubcategory === "FRUIT_VEGETABLES") {
                ptsEquivalentTrader = 0.18
            } else if (traderSubcategory === "HERBS_VEGETABLES") {
                ptsEquivalentTrader = 0.17
            } else if (traderSubcategory === "LEAFY_VEGETABLES") {
                ptsEquivalentTrader = 0.15
            } else if (traderSubcategory === "PODDED_VEGETABLES") {
                ptsEquivalentTrader = 0.25
            } else if (traderSubcategory === "ROOT_VEGETABLES") {
                ptsEquivalentTrader = 0.20
            } else if (traderSubcategory === "ORGANIC_FERTILIZER") {
                ptsEquivalentTrader = 0.9
            } else if (traderSubcategory === "NOT_ORGANIC_FERTILIZER") {
                ptsEquivalentTrader = 0.45
            } else if (traderSubcategory === "ORGANIC_SOIL") {
                ptsEquivalentTrader = 0.95
            } else if (traderSubcategory === "NOT_ORGANIC_SOIL") {
                ptsEquivalentTrader = 0.50
            } else if (traderSubcategory === "CITRUS_FRUITS") {
                ptsEquivalentTrader = 0.13
            } else if (traderSubcategory === "COCONUT") {
                ptsEquivalentTrader = 0.054
            } else if (traderSubcategory === "TROPICAL_FRUIT") {
                ptsEquivalentTrader = 0.041
            } else if (traderSubcategory === "WATER_HOSE" && traderSize === "1/4") {
                ptsEquivalentTrader = 0.55
            } else if (traderSubcategory === "WATER_HOSE" && traderSize === "1/2") {
                ptsEquivalentTrader = 0.45
            } else if (traderSubcategory === "WATER_HOSE" && traderSize === "3/4") {
                ptsEquivalentTrader = 0.35
            } else if (traderSubcategory === "GARDEN_POTS" && traderSize === "Small") {
                ptsEquivalentTrader = 0.09
            } else if (traderSubcategory === "GARDEN_POTS" && traderSize === "Medium") {
                ptsEquivalentTrader = 0.08
            } else if (traderSubcategory === "GARDEN_POTS" && traderSize === "Large") {
                ptsEquivalentTrader = 0.078
            } else if (traderSubcategory === "BUCKET" && traderSize === "Small") {
                ptsEquivalentTrader = 0.10
            } else if (traderSubcategory === "BUCKET" && traderSize === "Medium") {
                ptsEquivalentTrader = 0.9
            } else if (traderSubcategory === "BUCKET" && traderSize === "Large") {
                ptsEquivalentTrader = 0.085
            } else if (traderSubcategory === "KALAYKAY" && traderSize === "Small") {
                ptsEquivalentTrader = 0.11
            } else if (traderSubcategory === "KALAYKAY" && traderSize === "Large") {
                ptsEquivalentTrader = 0.067
            } else if (traderSubcategory === "SHOVEL" && traderSize === "Small") {
                ptsEquivalentTrader = 0.11
            } else if (traderSubcategory === "SHOVEL" && traderSize === "Large") {
                ptsEquivalentTrader = 0.067
            } else if (traderSubcategory === "HOES" || traderSubcategory === "HAND_PRUNES") {
                ptsEquivalentTrader = 0.067
            } else if (traderSubcategory === "GLOVES") {
                ptsEquivalentTrader = 0.12
            } else if (traderSubcategory === "WHEEL_BARROW") {
                ptsEquivalentTrader = 0.0125
            } else if (traderCategory === "SEEDS") {
                ptsEquivalentTrader = 0.65
            } else {
                ptsEquivalentTrader = 0.15
            }

            if (tradeeSubcategory === "FRUIT_VEGETABLES") {
                ptsEquivalentTradee = 0.18
            } else if (tradeeSubcategory === "HERBS_VEGETABLES") {
                ptsEquivalentTradee = 0.17
            } else if (tradeeSubcategory === "LEAFY_VEGETABLES") {
                ptsEquivalentTradee = 0.15
            } else if (tradeeSubcategory === "PODDED_VEGETABLES") {
                ptsEquivalentTradee = 0.25
            } else if (tradeeSubcategory === "ROOT_VEGETABLES") {
                ptsEquivalentTradee = 0.20
            } else if (tradeeSubcategory === "ORGANIC_FERTILIZER") {
                ptsEquivalentTradee = 0.9
            } else if (tradeeSubcategory === "NOT_ORGANIC_FERTILIZER") {
                ptsEquivalentTradee = 0.45
            } else if (tradeeSubcategory === "ORGANIC_SOIL") {
                ptsEquivalentTradee = 0.95
            } else if (tradeeSubcategory === "NOT_ORGANIC_SOIL") {
                ptsEquivalentTradee = 0.50
            } else if (tradeeSubcategory === "CITRUS_FRUITS") {
                ptsEquivalentTradee = 0.13
            } else if (tradeeSubcategory === "COCONUT") {
                ptsEquivalentTradee = 0.054
            } else if (tradeeSubcategory === "TROPICAL_FRUIT") {
                ptsEquivalentTradee = 0.041
            } else if (tradeeSubcategory === "WATER_HOSE" && tradeeSize === "1/4") {
                ptsEquivalentTradee = 0.55
            } else if (tradeeSubcategory === "WATER_HOSE" && tradeeSize === "1/2") {
                ptsEquivalentTradee = 0.45
            } else if (tradeeSubcategory === "WATER_HOSE" && tradeeSize === "3/4") {
                ptsEquivalentTradee = 0.35
            } else if (tradeeSubcategory === "GARDEN_POTS" && tradeeSize === "Small") {
                ptsEquivalentTradee = 0.09
            } else if (tradeeSubcategory === "GARDEN_POTS" && tradeeSize === "Medium") {
                ptsEquivalentTradee = 0.08
            } else if (tradeeSubcategory === "GARDEN_POTS" && tradeeSize === "Large") {
                ptsEquivalentTradee = 0.078
            } else if (tradeeSubcategory === "BUCKET" && tradeeSize === "Small") {
                ptsEquivalentTradee = 0.10
            } else if (tradeeSubcategory === "BUCKET" && tradeeSize === "Medium") {
                ptsEquivalentTradee = 0.9
            } else if (tradeeSubcategory === "BUCKET" && tradeeSize === "Large") {
                ptsEquivalentTradee = 0.085
            } else if (tradeeSubcategory === "KALAYKAY" && tradeeSize === "Small") {
                ptsEquivalentTradee = 0.11
            } else if (tradeeSubcategory === "KALAYKAY" && tradeeSize === "Large") {
                ptsEquivalentTradee = 0.067
            } else if (tradeeSubcategory === "SHOVEL" && tradeeSize === "Small") {
                ptsEquivalentTradee = 0.11
            } else if (tradeeSubcategory === "SHOVEL" && tradeeSize === "Large") {
                ptsEquivalentTradee = 0.067
            } else if (tradeeSubcategory === "HOES" || tradeeSubcategory === "HAND_PRUNES") {
                ptsEquivalentTradee = 0.067
            } else if (tradeeSubcategory === "GLOVES") {
                ptsEquivalentTradee = 0.12
            } else if (tradeeSubcategory === "WHEEL_BARROW") {
                ptsEquivalentTradee = 0.0125
            } else if (tradeeCategory === "SEEDS") {
                ptsEquivalentTradee = 0.65
            } else {
                ptsEquivalentTradee = 0.15
            }


            // if (tradeeSubcategory === "FRUIT_VEGETABLES") {
            //     ptsEquivalentTradee = 0.18
            // } else if (tradeeSubcategory === "HERBS_VEGETABLES") {
            //     ptsEquivalentTradee = 0.17
            // } else if (tradeeSubcategory === "LEAFY_VEGETABLES") {
            //     ptsEquivalentTradee = 0.15
            // } else if (tradeeSubcategory === "PODDED_VEGETABLES") {
            //     ptsEquivalentTradee = 0.25
            // } else if (tradeeSubcategory === "ROOT_VEGETABLES") {
            //     ptsEquivalentTradee = 0.20
            // } else {
            //     ptsEquivalentTradee = 0.15
            // }

            const tradeeCalculatedPoints = traderConditionRate === null ? 0 : (6 / ptsEquivalentTradee) * tradeeQty * traderConditionRate
            const traderCalculatedPoints = tradeeConditionRate === null ? 0 : (6 / ptsEquivalentTrader) * tradeeQty * tradeeConditionRate

            const pdfRef = useRef<HTMLDivElement>(null);

            const downloadPDF = () => {
                const input = pdfRef.current;
                if (!input) {
                    console.error("PDF reference is not available");
                    return;
                }
                html2canvas(input).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png')
                    const pdf = new jsPDF('p', 'mm', 'a4', true);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
                    const imgX = (pdfWidth - imgWidth * ratio) / 2;
                    const imgY = 30;
                    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                    pdf.save('Reciept.pdf')

                })
            }

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {isCompleted && (
                                <DropdownMenuItem className="cursor-pointer"
                                    onClick={() => setIsDownloadOpen(true)}
                                >
                                    Download
                                </DropdownMenuItem>

                            )}

                            {tradeStatus === "PROCESSING" && (
                                <DropdownMenuItem
                                    onClick={() => setIsProofOpen(true)}
                                >
                                    Upload Proof
                                </DropdownMenuItem>

                            )}

                            <DropdownMenuItem
                                onClick={() => setIsReviewOpen(true)}
                            >
                                Review
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                        <DialogContent className="lg:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {/* <AdminTitle entry="4" title="Trade Review" /> */}
                                    <p className="">Status: {tradeStatus}</p>
                                </DialogTitle>
                                <DialogDescription>
                                    <>
                                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
                                            <div className="flex flex-col items-center md:items-start">
                                                <Avatar>
                                                    <AvatarImage src={traderImage as string} alt="profile" />
                                                    <AvatarFallback>{firstLetterOfTraderName}{firstLetterOfTraderLastName}</AvatarFallback>
                                                </Avatar>
                                                <div className="mt-4 text-sm text-center md:text-left">
                                                    {/* <p className="font-semibold">Trade ID: {id}</p> */}
                                                    <p>Name: {traderName} {" "} {traderLastName}</p>
                                                    <p>Item: {traderItem}</p>
                                                    <p>Quantity: {traderQty}</p>

                                                    <p>
                                                        Accumulated Points: <span className="text-green-500">{traderCalculatedPoints.toFixed(0)} Point(s)</span>
                                                    </p>
                                                    <p>Shelf Life: {traderShelfLife}</p>
                                                    <p>Date: {format(tradeDate, "PPP")}</p>
                                                    {proofTradeeimage !== null ? (
                                                        <a target="_blank" className="text-blue-500" href={proofTradeeimage}>
                                                            Proof: See Proof
                                                        </a>
                                                    ) : (
                                                        <></>
                                                    )}

                                                </div>
                                            </div>

                                            <FolderSyncIcon className="text-green-500 self-center mx-0 my-4 md:mx-8" />

                                            <div className="flex flex-col items-center md:items-start">
                                                <Avatar>
                                                    <AvatarImage src={tradeeImage as string} alt="profile" />
                                                    <AvatarFallback>{firstLetterOfTradeeName}{firstLetterOfTradeeLastName}</AvatarFallback>
                                                </Avatar>
                                                <div className="mt-4 text-sm text-center md:text-left">
                                                    <p>Name: {tradeeName} {" "} {tradeeLastName}</p>
                                                    <p>Item: {tradeeItem}</p>
                                                    <p>Quantity: {tradeeQty}</p>
                                                    <p>
                                                        Accumulated Points: <span className="text-green-500">{tradeeCalculatedPoints.toFixed(0)} Point(s)</span>
                                                    </p>
                                                    <p>Shelf Life: {formattedShelfLifeUnit}</p>
                                                    <p>Date: {format(tradeDate, "PPP")}</p>
                                                    {proofTraderimage !== null ? (
                                                        <a target="_blank" className="text-blue-500" href={proofTraderimage}>
                                                            Proof: See Proof
                                                        </a>
                                                    ) : (
                                                        <></>
                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="flex gap-3 mt-3">
                                            <Button
                                                variant="primary"
                                                isLoading={isPending}
                                                onClick={() => setIsConfirmOpen(true)}
                                            >Confirm</Button>
                                            <Button
                                                variant="destructive"
                                                isLoading={isPending}
                                                onClick={() => setIsRejectOpen(true)}
                                            >Decline</Button>
                                        </div> */}
                                    </>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
                        <DialogContent className="lg:max-w-2xl">
                            <div>
                                <DialogHeader>
                                    <DialogTitle>
                                        {/* <AdminTitle entry="4" title="Trade Review" /> */}
                                        <p className="">Status: {tradeStatus}</p>
                                    </DialogTitle>
                                    <DialogDescription ref={pdfRef}>
                                        <>
                                            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
                                                <div className="flex flex-col items-center md:items-start">
                                                    <Avatar>
                                                        <AvatarImage src={traderImage as string} alt="profile" />
                                                        <AvatarFallback>{firstLetterOfTraderName}{firstLetterOfTraderLastName}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="mt-4 text-sm text-center md:text-left">
                                                        {/* <p className="font-semibold">Trade ID: {id}</p> */}
                                                        <p>Name: {traderName} {" "} {traderLastName}</p>
                                                        <p>Item: {traderItem}</p>
                                                        <p>Quantity: {traderQty}</p>
                                                        <p>
                                                            Accumulated Points: <span className="text-green-500">{traderCalculatedPoints.toFixed(0)} Point(s)</span>
                                                        </p>
                                                        <p>Shelf Life: {traderShelfLife}</p>
                                                        <p>Date: {format(tradeDate, "PPP")}</p>
                                                        {proofTradeeimage !== null ? (
                                                            <Image
                                                                src={proofTradeeimage}
                                                                alt=""
                                                                width={100}
                                                                height={100}
                                                                className=""
                                                            />
                                                        ) : (
                                                            <></>
                                                        )}

                                                    </div>
                                                </div>

                                                <FolderSyncIcon className="text-green-500 self-center mx-0 my-4 md:mx-8" />

                                                <div className="flex flex-col items-center md:items-start">
                                                    <Avatar>
                                                        <AvatarImage src={tradeeImage as string} alt="profile" />
                                                        <AvatarFallback>{firstLetterOfTradeeName}{firstLetterOfTradeeLastName}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="mt-4 text-sm text-center md:text-left">
                                                        <p>Name: {tradeeName} {" "} {tradeeLastName}</p>
                                                        <p>Item: {tradeeItem}</p>
                                                        <p>Quantity: {tradeeQty}</p>
                                                        <p>
                                                            Accumulated Points: <span className="text-green-500">{tradeeCalculatedPoints.toFixed(0)} Point(s)</span>
                                                        </p>
                                                        <p>Shelf Life: {formattedShelfLifeUnit}</p>
                                                        <p>Date: {format(tradeDate, "PPP")}</p>
                                                        {proofTraderimage !== null ? (
                                                            <Image
                                                                src={proofTraderimage}
                                                                alt=""
                                                                width={100}
                                                                height={100}
                                                                className=""
                                                            />
                                                        ) : (
                                                            <></>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="flex gap-3 mt-3">
                                            <Button
                                                variant="primary"
                                                isLoading={isPending}
                                                onClick={() => setIsConfirmOpen(true)}
                                            >Confirm</Button>
                                            <Button
                                                variant="destructive"
                                                isLoading={isPending}
                                                onClick={() => setIsRejectOpen(true)}
                                            >Decline</Button>
                                        </div> */}
                                        </>
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <Button variant={'primary'} onClick={downloadPDF}>Download</Button>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                        {/* <AlertDialogTrigger>Confirm Report</AlertDialogTrigger> */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to confirm the transaction?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Note: Once confirmed, this action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className='bg-[#00B207] hover:bg-[#00B207]/80'
                                    onClick={
                                        async () => {
                                            startTransition(() => {
                                                // handleTrade("COMPLETED", tradeId, tradeeId, traderId, tradeeQty, traderQty, postId, traderSubcategory, tradeeSubcategory).then((callback) => {
                                                //     if (callback?.error) {
                                                //         toast({
                                                //             description: callback.error,
                                                //             variant: "destructive"
                                                //         })
                                                //     }

                                                //     if (callback?.success) {
                                                //         toast({
                                                //             description: callback.success
                                                //         })
                                                //     }
                                                // })
                                            })
                                        }
                                    }
                                >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                        {/* <AlertDialogTrigger>Reject Report</AlertDialogTrigger> */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to cancel the transaction?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Note: Once confirmed, this action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className='bg-[#00B207] hover:bg-[#00B207]/80'
                                    onClick={
                                        async () => {
                                            startTransition(() => {
                                                // handleTrade("CANCELLED", tradeId, tradeeId, traderId, tradeeQty, traderQty, postId, traderSubcategory, tradeeSubcategory).then((callback) => {
                                                //     if (callback?.error) {
                                                //         toast({
                                                //             description: callback.error,
                                                //             variant: "destructive"
                                                //         })
                                                //     }

                                                //     if (callback?.success) {
                                                //         toast({
                                                //             description: callback.success
                                                //         })
                                                //     }
                                                // })
                                            })
                                        }
                                    }
                                >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>


                    <Dialog open={isProofOpen} onOpenChange={setIsProofOpen}>
                        <DialogContent className="lg:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {/* <AdminTitle entry="4" title="Trade Review" /> */}
                                    <p className="">Status: {tradeStatus}</p>
                                    <p className="text-sm text-muted-foreground">Kindly upload your proof so we can review it.</p>
                                </DialogTitle>
                                <DialogDescription>
                                    <>
                                        {imageUrl.length ? <div className="w-full flex flex-col items-center justify-center mt-5">
                                            <Image
                                                alt='Done Upload'
                                                src={"/done.svg"}
                                                width={250}
                                                height={250}
                                                className='mb-3'
                                            />
                                            <h1 className='text-xl text-muted-foreground'>Image Uploaded!</h1>
                                        </div> : <UploadDropzone
                                            className="text-green"
                                            appearance={{
                                                button: "bg-[#00B207] p-2 mb-3",
                                                label: "text-green",
                                                allowedContent: "flex h-8 flex-col items-center justify-center px-2 text-green",
                                            }}
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                console.log('Files: ', res);
                                                if (res && res.length > 0 && res[0].url) {
                                                    setImageUrl(res[0].url);
                                                } else {
                                                    console.error('Please input a valid image:', res);
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast({
                                                    title: 'Error!',
                                                    description: error.message,
                                                    variant: 'destructive',
                                                })
                                            }}
                                        />
                                        }
                                        {tradeStatus === "PROCESSING" ? (
                                            <div className="mt-5 ">
                                                <div className="mb-10">
                                                    <RadioGroup value={selectedRate} onChange={setSelectedRate}>
                                                        <div className="flex justify-center items-center gap-x-5">
                                                            <RadioGroup.Label>Condition : </RadioGroup.Label>
                                                            {conditionRates.map((rate) => (
                                                                <RadioGroup.Option
                                                                    key={rate}
                                                                    value={rate}
                                                                    onClick={() => setSelectRateError(false)}
                                                                    className="flex gap-3 items-center ui-active:whte ui-active:text-gray-700 text-sm w-24 py-1 px-2 outline-1 outline outline-gray-300 shadow-sm drop-shadow-sm  ui-not-active:bg-white ui-not-active:text-black"
                                                                >
                                                                    <CheckIcon className="hidden ui-checked:block" height={20} width={20} />
                                                                    {rate === 0.5 && "Poor"}
                                                                    {rate === 1 && "Neutral"}
                                                                    {rate === 1.5 && "Good"}
                                                                </RadioGroup.Option>
                                                            ))}
                                                        </div>
                                                    </RadioGroup>
                                                    {selectRateError && (
                                                        <h1 className="text-red-500 text-xs text-center mt-3">*Select codition rate first!</h1>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            null
                                        )}

                                        <div className="flex gap-3 mt-3">
                                            <Button
                                                variant="primary"
                                                disabled={imageIsEmpty}
                                                isLoading={isPending}
                                                onClick={() => {
                                                    startTransition(() => {
                                                        if (selectedRate === 0) {
                                                            setSelectRateError(true)
                                                        } else {
                                                            handleTradeProof(imageUrl, tradeId, selectedRate).then((callback) => {
                                                                if (callback?.error) {
                                                                    toast({
                                                                        description: callback.error,
                                                                        variant: "destructive"
                                                                    })
                                                                }
                                                                if (callback?.success) {
                                                                    setIsProofOpen(false)
                                                                    toast({
                                                                        description: callback.success
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }}
                                            >Confirm</Button>
                                        </div>
                                    </>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    }
]