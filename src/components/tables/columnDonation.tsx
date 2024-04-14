"use client"

import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import { DonationWithDonators } from "@/lib/types"
import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { format } from "date-fns"
import { Fragment, useState, useTransition } from "react"
import { CheckIcon, ChevronsUpDownIcon, MoreHorizontalIcon } from "lucide-react"
import AdminTitle from "../AdminTitle"
import Link from "next/link"
import { handleDonations } from "../../../actions/donate"
import { Listbox, Menu, RadioGroup, Transition } from "@headlessui/react"
import { conditionRates } from "@/lib/utils"

export const columnDonation: ColumnDef<DonationWithDonators>[] = [
    {
        accessorKey: "dn",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="TRADE ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.dn

            return <div
                className=""
            >
                {id}
            </div>
        },
    },
    {
        accessorKey: "product",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ITEM" />
            )
        },
        cell: ({ row }) => {
            const item = row.original.product

            return <div
                className=""
            >
                {item}
            </div>
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="NAME" />
            )
        },
        cell: ({ row }) => {
            const user = row.original.name

            return <div
                className=""
            >
                {user}
            </div>
        },
    },
    {
        accessorKey: "pointsToGain",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="GAINED POINTS" />
            )
        },
        cell: ({ row }) => {
            const points = row.original.pointsToGain.toFixed(0)

            return <div
                className=""
            >
                {points} Points
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
            const [selectedRate, setSelectedRate] = useState(0)
            const [selectRateError, setSelectRateError] = useState<boolean>(false)


            const donatorImage = row.original.donator.image
            const donatorName = row.original.donator.name
            const donatorLastName = row.original.donator.lastName
            const donatorProduct = row.original.product
            const donatoryQty = row.original.quantity
            const donatorPoints = row.original.pointsToGain
            const donationCategory = row.original.category
            const donationSubCategory = row.original.subcategory
            const donatorId = row.original.donator.id
            const donatorProof = row.original.proof

            const dateDonated = row.original.createdAt
            const donationStatus = row.original.status
            const donationId = row.original.id

            const isImageNull = donatorImage === null;
            const isDisable = selectedRate === 0 ? true : false

            const handleConfirm = () => {
                if (selectedRate === 0) {
                    setSelectRateError(true)
                } else {
                    setIsConfirmOpen(true)
                }
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
                                    <AdminTitle entry="4" title="Donations Review" />
                                    <p className="text-center">Status: {donationStatus}</p>
                                </DialogTitle>
                                <DialogDescription>
                                    <>
                                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-between max-w-fit mx-auto">
                                            <div className="flex flex-col items-center md:items-start">
                                                <Avatar>
                                                    <AvatarImage src={`${isImageNull ? "/avatar-placeholder.jpg" : donatorImage}`} alt="profile" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <div className="mt-4 text-sm text-center md:text-start">
                                                    {/* <p className="font-semibold">Trade ID: {id}</p> */}
                                                    <p>Name: {donatorName} {" "} {donatorLastName}</p>
                                                    <p>Item: {donatorProduct}</p>
                                                    <p>Quantity: {donatoryQty}</p>
                                                    <p>
                                                        Accumulated Points: <span className="text-green-500">{donatorPoints} Point(s)</span>
                                                    </p>
                                                    <p>Date: {format(dateDonated, "PPP")}</p>
                                                    {donatorProof !== null ? (
                                                        <Link className="text-blue-500" href="#">
                                                            Proof: See now
                                                        </Link>
                                                    ) : (
                                                        <div className="" >
                                                            Proof: Haven't uploaded yet!
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        {donationStatus === "PENDING" ? (
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
                                                <div className="flex gap-3 mt-3">
                                                    <Button
                                                        variant="primary"
                                                        isLoading={isPending}
                                                        onClick={handleConfirm}
                                                    >Confirm</Button>
                                                    <Button
                                                        variant="destructive"
                                                        isLoading={isPending}
                                                        onClick={() => setIsRejectOpen(true)}
                                                    >Decline</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            null
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
                                    className={`${isDisable ? 'bg-green-300' : 'bg-[#00B207] hover:bg-[#00B207]/80'}`}
                                    disabled={isDisable}
                                    onClick={
                                        async () => {
                                            startTransition(() => {
                                                handleDonations("APPROVED", selectedRate, donationSubCategory, donationCategory, donationId, donatorId).then((callback) => {
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
                                                handleDonations("APPROVED", selectedRate, donationSubCategory, donationCategory, donationId, donatorId).then((callback) => {
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