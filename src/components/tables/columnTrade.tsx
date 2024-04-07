"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { TradeWithTradeeTraders } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useState, useTransition } from "react"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FolderSyncIcon, MoreHorizontalIcon } from "lucide-react"
import AdminTitle from "../AdminTitle"
import Link from "next/link"
import { handleTrade } from "../../../actions/trade"
import { formattedSLU } from "@/lib/utils"

export const columnTrade: ColumnDef<TradeWithTradeeTraders>[] = [
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
                <DataTableColumnHeader column={column} title="USER" />
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
            const [isPending, startTransition] = useTransition()
            const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
            const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false)


            const tradeId = row.original.id;
            const traderId = row.original.trader.id
            const tradeeId = row.original.tradee.id
            const postId = row.original.post.id

            const traderName = row.original.trader.name
            const traderLastName = row.original.trader.lastName
            const traderImage = row.original.trader.image
            const traderItem = row.original.item
            const traderQty = row.original.quantity
            const traderPts = row.original.trader.points
            const traderShelfLife = row.original.shelfLife
            const traderSubcategory = row.original.subcategory
            const traderProof = row.original.proofTrader

            const tradeeName = row.original.tradee.name
            const tradeeLastName = row.original.tradee.lastName
            const tradeeImage = row.original.tradee.image
            const tradeeItem = row.original.post.name
            const tradeeQty = row.original.tradedQuantity
            const tradeePts = row.original.tradee.points
            const tradeeSubcategory = row.original.post.subcategory
            const tradeeProof = row.original.proofTradee

            const tradeeShelfLifeDuration = row.original.post.shelfLifeDuration
            const tradeeShelfLifeUnit = row.original.post.shelfLifeUnit
            const formattedShelfLifeUnit = formattedSLU(tradeeShelfLifeDuration, tradeeShelfLifeUnit)

            const tradeStatus = row.original.status
            const tradeDate = row.original.createdAt

            const firstLetterOfTraderName = traderName?.charAt(0);
            const firstLetterOfTraderLastName = traderLastName?.charAt(0);

            const firstLetterOfTradeeName = tradeeName?.charAt(0);
            const firstLetterOfTradeeLastName = tradeeLastName?.charAt(0);

            // kalkulasyon at rebolusyon

            let conditionRate = 1.5
            let ptsEquivalentTrader
            let ptsEquivalentTradee

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
            } else {
                ptsEquivalentTradee = 0.15
            }

            const tradeeCalculatedPoints = (6 / ptsEquivalentTradee) * tradeeQty * conditionRate
            const traderCalculatedPoints = (6 / ptsEquivalentTrader) * tradeeQty * conditionRate

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

                            <DropdownMenuItem className="cursor-pointer">
                                Download
                            </DropdownMenuItem>

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
                                    <AdminTitle entry="4" title="Trade Review" />
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
                                                        Accumulated Points: <span className="text-green-500">{traderCalculatedPoints.toFixed(2)} Point(s)</span>
                                                    </p>
                                                    <p>Shelf Life: {traderShelfLife}</p>
                                                    <p>Date: {format(tradeDate, "PPP")}</p>
                                                    {/* redirect to uploadthing when clicked. */}
                                                    {traderProof !== null ? (
                                                        <a target="_blank" className="text-blue-500" href={traderProof}>
                                                            Proof: See Proof
                                                        </a>
                                                    ) : (
                                                        <>Proof: Haven't Uploaded yet</>
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
                                                        Accumulated Points: <span className="text-green-500">{tradeeCalculatedPoints.toFixed(2)} Point(s)</span>
                                                    </p>
                                                    <p>Shelf Life: {formattedShelfLifeUnit}</p>
                                                    <p>Date: {format(tradeDate, "PPP")}</p>
                                                    {tradeeProof !== null ? (
                                                        <a target="_blank" className="text-blue-500" href={tradeeProof}>
                                                            Proof: See Proof
                                                        </a>
                                                    ) : (
                                                        <>Proof: Haven't Uploaded yet</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-3">
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
                                        </div>
                                    </>
                                </DialogDescription>
                            </DialogHeader>
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
                                                handleTrade("COMPLETED", tradeId, tradeeId, traderId, tradeeQty, traderQty, postId, traderSubcategory, tradeeSubcategory).then((callback) => {
                                                    if (callback?.error) {
                                                        toast({
                                                            description: callback.error,
                                                            variant: "destructive"
                                                        })
                                                    }

                                                    if (callback?.success) {
                                                        toast({
                                                            description: callback.success
                                                        })
                                                    }
                                                })
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
                                                handleTrade("CANCELLED", tradeId, tradeeId, traderId, tradeeQty, traderQty, postId, traderSubcategory, tradeeSubcategory).then((callback) => {
                                                    if (callback?.error) {
                                                        toast({
                                                            description: callback.error,
                                                            variant: "destructive"
                                                        })
                                                    }

                                                    if (callback?.success) {
                                                        toast({
                                                            description: callback.success
                                                        })
                                                    }
                                                })
                                            })
                                        }
                                    }
                                >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    }
]