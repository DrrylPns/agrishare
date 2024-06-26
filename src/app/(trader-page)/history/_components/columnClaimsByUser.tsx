"use client"

import { DataTableColumnHeader } from "@/app/(admin)/users/_components/data-table-column-header"
import { ClaimsWithAgrichangeAndUsers } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
// import AdminTitle from "../AdminTitle"
// import { handleDonations } from "../../../actions/donate"

export const columnClaimsByUser: ColumnDef<ClaimsWithAgrichangeAndUsers>[] = [
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
        accessorKey: "remarks",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Remarks" />
            )
        },
        cell: ({ row }) => {
            const remarks = row.original.remarks

            return <div
                className=""
            >
                {remarks}
            </div>
        },
    },
    // {
    //     id: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => {
    //         const [isReviewOpen, setIsReviewOpen] = useState<boolean>()
    //         const [isPending, startTransition] = useTransition()
    //         const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
    //         const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false)


    //         const donatorImage = row.original.donator.image
    //         const donatorName = row.original.donator.name
    //         const donatorLastName = row.original.donator.lastName
    //         const donatorProduct = row.original.product
    //         const donatoryQty = row.original.quantity
    //         const donatorPoints = row.original.pointsToGain
    //         const donatorId = row.original.donator.id

    //         const dateDonated = row.original.createdAt
    //         const donationStatus = row.original.status
    //         const donationId = row.original.id

    //         const isImageNull = donatorImage === null;
    //         return (
    //             <>
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" className="h-8 w-8 p-0">
    //                             <span className="sr-only">Open menu</span>
    //                             <MoreHorizontalIcon className="h-4 w-4" />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                         <DropdownMenuSeparator />

    //                         <DropdownMenuItem className="cursor-pointer">
    //                             Download
    //                         </DropdownMenuItem>

    //                         <DropdownMenuItem
    //                             onClick={() => setIsReviewOpen(true)}
    //                         >
    //                             Review
    //                         </DropdownMenuItem>

    //                     </DropdownMenuContent>
    //                 </DropdownMenu>

    //                 <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
    //                     <DialogContent className="lg:max-w-2xl">
    //                         <DialogHeader>
    //                             <DialogTitle>
    //                                 {/* <AdminTitle entry="4" title="Donations Review" /> */}
    //                                 <p className="text-center">Status: {donationStatus}</p>
    //                             </DialogTitle>
    //                             <DialogDescription>
    //                                 <>
    //                                     <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-between max-w-fit mx-auto">
    //                                         <div className="flex flex-col items-center md:items-start">
    //                                             <Avatar>
    //                                                 <AvatarImage src={`${isImageNull ? "/avatar-placeholder.jpg" : donatorImage}`} alt="profile" />
    //                                                 <AvatarFallback>CN</AvatarFallback>
    //                                             </Avatar>
    //                                             <div className="mt-4 text-sm text-center md:text-start">
    //                                                 {/* <p className="font-semibold">Trade ID: {id}</p> */}
    //                                                 <p>Name: {donatorName} {" "} {donatorLastName}</p>
    //                                                 <p>Item: {donatorProduct}</p>
    //                                                 <p>Quantity: {donatoryQty}</p>
    //                                                 <p>
    //                                                     Accumulated Points: <span className="text-green-500">{donatorPoints.toFixed(2)} Point(s)</span>
    //                                                 </p>
    //                                                 <p>Date: {format(dateDonated, "PPP")}</p>
    //                                                 {/* redirect to uploadthing when clicked. */}
    //                                                 <Link className="text-blue-500" href="#">
    //                                                     Proof: image.jpg
    //                                                 </Link>
    //                                             </div>
    //                                         </div>
    //                                     </div>

    //                                     <div className="flex gap-3 mt-3">
    //                                         <Button
    //                                             variant="primary"
    //                                             isLoading={isPending}
    //                                             onClick={() => setIsConfirmOpen(true)}
    //                                         >Confirm</Button>
    //                                         <Button
    //                                             variant="destructive"
    //                                             isLoading={isPending}
    //                                             onClick={() => setIsRejectOpen(true)}
    //                                         >Decline</Button>
    //                                     </div>
    //                                 </>
    //                             </DialogDescription>
    //                         </DialogHeader>
    //                     </DialogContent>
    //                 </Dialog>

    //                 <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
    //                     {/* <AlertDialogTrigger>Confirm Report</AlertDialogTrigger> */}
    //                     <AlertDialogContent>
    //                         <AlertDialogHeader>
    //                             <AlertDialogTitle>Are you sure you want to confirm the transaction?</AlertDialogTitle>
    //                             <AlertDialogDescription>
    //                                 Note: Once confirmed, this action cannot be undone.
    //                             </AlertDialogDescription>
    //                         </AlertDialogHeader>
    //                         <AlertDialogFooter>
    //                             <AlertDialogCancel>Cancel</AlertDialogCancel>
    //                             <AlertDialogAction
    //                                 className='bg-[#00B207] hover:bg-[#00B207]/80'
    //                                 onClick={
    //                                     async () => {
    //                                         startTransition(() => {
    //                                             // handleDonations("APPROVED", donatorPoints, donationId, donatorId).then((callback) => {
    //                                             //     if (callback?.error) {
    //                                             //         toast({
    //                                             //             description: callback.error,
    //                                             //             variant: "destructive"
    //                                             //         })
    //                                             //     }

    //                                             //     if (callback?.success) {
    //                                             //         toast({
    //                                             //             description: callback.success,
    //                                             //             variant: "default",
    //                                             //         })
    //                                             //     }
    //                                             // })
    //                                         })
    //                                     }
    //                                 }
    //                             >Continue</AlertDialogAction>
    //                         </AlertDialogFooter>
    //                     </AlertDialogContent>
    //                 </AlertDialog>

    //                 <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
    //                     {/* <AlertDialogTrigger>Reject Report</AlertDialogTrigger> */}
    //                     <AlertDialogContent>
    //                         <AlertDialogHeader>
    //                             <AlertDialogTitle>Are you sure you want to cancel the transaction?</AlertDialogTitle>
    //                             <AlertDialogDescription>
    //                                 Note: Once confirmed, this action cannot be undone.
    //                             </AlertDialogDescription>
    //                         </AlertDialogHeader>
    //                         <AlertDialogFooter>
    //                             <AlertDialogCancel>Cancel</AlertDialogCancel>
    //                             <AlertDialogAction
    //                                 className='bg-[#00B207] hover:bg-[#00B207]/80'
    //                                 onClick={
    //                                     async () => {
    //                                         startTransition(() => {
    //                                             // handleDonations("CANCELLED", donatorPoints, donationId, donatorId).then((callback) => {
    //                                             //     if (callback?.error) {
    //                                             //         toast({
    //                                             //             description: callback.error,
    //                                             //             variant: "destructive"
    //                                             //         })
    //                                             //     }

    //                                             //     if (callback?.success) {
    //                                             //         toast({
    //                                             //             description: callback.success,
    //                                             //             variant: "default",
    //                                             //         })
    //                                             //     }
    //                                             // })
    //                                         })
    //                                     }
    //                                 }
    //                             >Continue</AlertDialogAction>
    //                         </AlertDialogFooter>
    //                     </AlertDialogContent>
    //                 </AlertDialog>
    //             </>
    //         )
    //     },
    // }
]