"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { ReportTypes } from "@/lib/types"
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
import { formatedReason, formattedSLU } from "@/lib/utils"
import Image from "next/image"
import { UserAccountAvatar } from "../user-account-avatar"
import { updateUserBanStatus } from "../../../actions/users"

export const columnReport: ColumnDef<ReportTypes>[] = [
    {
        accessorKey: "Image",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Item Image" />
            )
        },
        cell: ({ row }) => {
            const image = row.original.post.image

            return <div
                className="h-20 w-20"
            >
                <Image src={image} alt="" width={100} height={100} className="object-contain w-full h-full"/>
            </div>
        },
    },
    {
        accessorKey: "item",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Item Name" />
            )
        },
        cell: ({ row }) => {
            const itemName = row.original.post.name

            return <div
                className=""
            >
                {itemName}
            </div>
        },
    },
    {
        accessorKey: "tradee",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Reported By:" />
            )
        },
        cell: ({ row }) => {
            const firstName = row.original.reportedBy.name
            const lastName = row.original.reportedBy.lastName
            const fullName = firstName + " " + lastName


            return <div
                className=""
            >
                {fullName}
            </div>
        },
    },
    {
        accessorKey: "post",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Issue" />
            )
        },
        cell: ({ row }) => {
            const reason = row.original.issue

            return <div
                className=""
            >
                {formatedReason(reason)}
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


            const firstName = row.original.reportedBy.name
            const lastName = row.original.reportedBy.lastName
            const fullName = firstName + " " + lastName
            const img = row.original.post.User.image
            const firstLetterName = row.original.post.User.name?.charAt(0)
            const firstLetterLast = row.original.post.User.lastName?.charAt(0)
            const userId = row.original.post.User.userId
            const product = row.original.post.name
            const reason = row.original.issue

           
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
                                <DialogTitle >
                                    <div className="flex items-center justify-center w-40 h-40 border-black border rounded-full mx-auto">
                                        {/* {img !== null && (
                                            <Image src={img} alt="Post uploader" width={100} height={100} className="object-contain w-full h-full"/>
                                        )}
                                        <UserAccountAvatar */}
                                        <Avatar className="w-full h-full">
                                        <AvatarImage
                                            className='cursor-pointer'
                                            src={img as string}
                                            width={100}
                                            height={100}
                                            alt='User Profile' />
                                        <AvatarFallback className="text-3xl">{firstLetterName}{firstLetterLast}</AvatarFallback>
                                    </Avatar>
                                    </div>
                                </DialogTitle>
                                <DialogDescription>
                                    <h1>User Id: {userId}</h1>
                                    <h1>Product: {product}</h1>
                                    <h1>Trader name: {userId}</h1>
                                    <h1>Reason of Report: {formatedReason(reason)}</h1>
                                </DialogDescription>
                            </DialogHeader>
                            <Button variant={'destructive'} className="" onClick={()=>setIsConfirmOpen(true)}>Ban</Button>
                            <Button variant={'primary'} className="" onClick={()=>setIsReviewOpen(false)}>Cancel</Button>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                        {/* <AlertDialogTrigger>Confirm Report</AlertDialogTrigger> */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to ban this user?</AlertDialogTitle>
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
                                            if(userId !== null){
                                                updateUserBanStatus(userId).then((callback) => {
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
                                            }
                                           
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