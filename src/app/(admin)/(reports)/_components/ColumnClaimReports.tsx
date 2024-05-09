"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { ClaimsWithAgrichangeAndUsers, TransactionWithUserAndPost } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useTransition } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { ClaimStatus } from "@prisma/client"
import { handleClaim } from "../../../../../actions/agrichange"
import { toast } from "@/components/ui/use-toast"
import AdminTitle from "@/components/AdminTitle"

export const ColumnClaimReports: ColumnDef<ClaimsWithAgrichangeAndUsers>[] = [
    {
        accessorKey: "itm",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.itm

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
            const item = row.original.agriChange.name

            return <div
                className=""
            >
                {item}
            </div>
        },
    },
    {
        accessorKey: "points",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="POINTS" />
            )
        },
        cell: ({ row }) => {
            const points = row.original.agriChange.pointsNeeded
            const quantity = row.original.quantity

            const overallPts = points * quantity

            return <div
                className=""
            >
                - {overallPts.toFixed(0)} Points
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const [isReviewOpen, setIsReviewOpen] = useState<boolean>()
            const [isPending, startTransition] = useTransition()
            const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
            const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false)

            const userId = row.original.user.id
            const donatorImage = row.original.user.image
            const first = row.original.user.name?.charAt(0)
            const last = row.original.user.lastName?.charAt(0)
            const name = row.original.user.name
            const lastName = row.original.user.lastName

            const points = row.original.agriChange.pointsNeeded
            const qty = row.original.quantity

            const overallPts = points * qty

            const product = row.original.agriChange.name

            // const quantity = row.original.agriChange.quantityPerTrade
            const agriquestId = row.original.agriChange.id

            const dateClaimIntent = row.original.createdAt
            const status = row.original.status
            const claimId = row.original.id

            const isImageNull = donatorImage === null;
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
                                    <AdminTitle entry="4" title="Claim Review" />
                                    <p className="text-center">Status: {status}</p>
                                </DialogTitle>
                                <DialogDescription>
                                    <>
                                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-between max-w-fit mx-auto">
                                            <div className="flex flex-col items-center md:items-start">
                                                <Avatar>
                                                    <AvatarImage src={`${isImageNull ? "/avatar-placeholder.jpg" : donatorImage}`} alt="profile" />
                                                    <AvatarFallback>{first}{last}</AvatarFallback>
                                                </Avatar>
                                                <div className="mt-4 text-sm text-center md:text-start">
                                                    {/* <p className="font-semibold">Trade ID: {id}</p> */}
                                                    <p>Name: {name} {" "} {lastName}</p>
                                                    <p>Item: {product}</p>
                                                    <p>
                                                        Points deduction: <span className="text-rose-500">- {overallPts.toFixed(0)} Point(s)</span>
                                                    </p>
                                                    <p>Date: {format(dateClaimIntent, "PPP")}</p>

                                                </div>
                                            </div>
                                        </div>
                                        {status === 'PENDING' && (
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
                                        )}

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
                                                handleClaim(ClaimStatus.APPROVED, claimId, userId, points, agriquestId).then((callback) => {
                                                    if (callback?.error) {
                                                        toast({
                                                            description: callback.error,
                                                            variant: "destructive"
                                                        })
                                                    }

                                                    if (callback?.success) {
                                                        toast({
                                                            description: callback.success,
                                                            variant: "default",
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
                                                handleClaim(ClaimStatus.DECLINED, claimId, userId, points, agriquestId).then((callback) => {
                                                    if (callback?.error) {
                                                        toast({
                                                            description: callback.error,
                                                            variant: "destructive"
                                                        })
                                                    }

                                                    if (callback?.success) {
                                                        toast({
                                                            description: callback.success,
                                                            variant: "default",
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