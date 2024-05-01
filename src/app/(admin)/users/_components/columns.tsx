"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { categories } from "@/lib/utils"
import { useState, useTransition } from "react"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon } from "lucide-react"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "userId",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="User ID" />
            )
        },
        cell: ({ row }) => {
            const id = row.original.userId

            return <div
                className=""
            >
                {id}
            </div>
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Name" />
            )
        },
        cell: ({ row }) => {
            const name = row.original.name
            const lastName = row.original.lastName 

            const words = name?.split(' ');

            const formattedName = words
                ?.map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase())
                .join(' ');

            return <div
                className=""
            >
                {formattedName} {" "} {lastName}
            </div>
        },
    },
    // {
    //     accessorKey: "role",
    //     header: ({ column }) => {
    //         return (
    //             <DataTableColumnHeader column={column} title="Type" />
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const role = row.original.role

    //         const formattedRole = role === "DONATOR" ? "Non-Urban Farmer" : "Urban Farmer"

    //         return <div
    //             className=""
    //         >
    //             {role}
    //         </div>
    //     },
    // },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const category = categories.find(
                (category) => category.value === row.getValue("role")
            );

            if (!category) {
                return null;
            }

            return (
                <div className="flex w-[100px] items-center">
                    <span>{category.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Date Joined" />
            )
        },
        cell: ({ row }) => {
            const dateJoined = row.original.createdAt

            return <div
                className=""
            >
                {format(dateJoined, "PPP")}
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
            const [isProofOpen, setIsProofOpen] = useState<boolean>()
            const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>()
            const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false)
            const [imageUrl, setImageUrl] = useState<string>("")

          

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
                                    className="cursor-pointer"
                                    onClick={() => setIsReviewOpen(true)}
                                >
                                    Edit role
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                        <DialogContent className="lg:max-w-2xl" >
                            <DialogHeader>
                                <DialogTitle>
                                 
                                </DialogTitle>
                                <DialogDescription>
                                    
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                   
                </>
            )
        },
    }
]