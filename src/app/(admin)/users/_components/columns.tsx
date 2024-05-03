"use client"

import { Role, User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { categories } from "@/lib/utils"
import { ChangeEvent, useState, useTransition } from "react"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon } from "lucide-react"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { RadioGroup } from "@headlessui/react"
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io"
import { handleDonations } from "../../../../../actions/donate"
import { updateRole } from "../../../../../actions/dashboard"
import { toast } from "@/components/ui/use-toast"

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
            const [selectedUserRole, setSelectedUserRole] = useState<Role>('TRADER');

            const uid = row.original.id
            const userId = row.original.userId
            const dateJoined = row.original.createdAt
            const formatedDate = format(dateJoined, "PPP")
            const firstName = row.original.name
            const lastName = row.original.lastName
            const fullName = firstName + " " + lastName
            const userRole = row.original.role

            const formatedRole = (role: string)=>{
               const filteredRole = role === "TRADER" ? "Urban Farmer" : "Non-Urban Farmer"
                return filteredRole
            }

            console.log(selectedUserRole)
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
                                 Edit User Role
                                </DialogTitle> 
                                <DialogDescription className="px-5">
                                    <div className="flex w-full mb-3">
                                        <h1 className="text-black w-40">User Id:</h1>
                                        <h1 className="text-black ">{userId}</h1>
                                    </div>
                                    <div className="flex w-full mb-3">
                                        <h1 className="text-black w-40">Full Name: </h1>
                                        <h1 className="text-black">{fullName}</h1>
                                    </div>
                                    <div className="flex w-full mb-3">
                                        <h1 className="text-black w-40">Date Joined: </h1>
                                        <h1 className="text-black">{formatedDate}</h1>
                                    </div>
                                    <div className="flex w-full mb-3">
                                        <h1 className="text-black w-40">Role :</h1>
                                        <div className="">
                                            <RadioGroup value={selectedUserRole} onChange={setSelectedUserRole} className="flex gap-5 ">
                                            {categories.map((category) => (
                                            <RadioGroup.Option key={category.value} value={category.value} className={`flex items-center font-poppins`}>
                                                {({ checked }) => (
                                                <>
                                                    <span className={`${checked && 'text-green-400'}`}>
                                                    {checked ? <IoIosRadioButtonOn /> : <IoIosRadioButtonOff />}
                                                    </span>
                                                    {category.label}
                                                </>
                                                )}
                                            </RadioGroup.Option>
                                            ))}
                                        </RadioGroup>
                                        </div>
                                    </div>
                                </DialogDescription>
                                <div className=" flex justify-end gap-10">
                                    <Button variant={'destructive'} className="w-15" onClick={()=>setIsReviewOpen(false)} >Cancel</Button>
                                    <Button variant={'primary'} className="w-20" onClick={()=>setIsConfirmOpen(true)} >Continue</Button>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                        {/* <AlertDialogTrigger>Confirm Report</AlertDialogTrigger> */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to update the role of this user?</AlertDialogTitle>
                               
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction
                                    className='bg-[#00B207] hover:bg-[#00B207]/80'
                                    onClick={
                                        async() => {
                                        startTransition(() => {
                                            updateRole(uid, selectedUserRole,).then((callback) => {
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
                                        })
                                    }}
                                >Yes</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    }
]