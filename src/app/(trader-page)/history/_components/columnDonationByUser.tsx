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
import { useRef, useState, useTransition } from "react"
import { MoreHorizontalIcon } from "lucide-react"
// import AdminTitle from "../AdminTitle"
import Link from "next/link"
import html2canvas from "html2canvas"
import { UploadDropzone } from "@/lib/uploadthing"
import jsPDF from "jspdf"
import { handleTradeProof } from "../../../../../actions/trade"
import Image from "next/image"
import { handleDonationProof } from "../../../../../actions/donate"
// import { handleDonations } from "../../../actions/donate"

export const columnDonationByUser: ColumnDef<DonationWithDonators>[] = [
    {
        accessorKey: "dn",
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="ID" />
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
            const [isProofOpen, setIsProofOpen] = useState<boolean>()
            const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>()
            const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false)
            const [imageUrl, setImageUrl] = useState<string>("")


            const donatorImage = row.original.donator.image
            const donatorName = row.original.donator.name
            const donatorLastName = row.original.donator.lastName
            const donatorProduct = row.original.product
            const donatoryQty = row.original.quantity
            const donatorPoints = row.original.pointsToGain
            const proof = row.original.proof
            const donatorId = row.original.donator.id

            const dateDonated = row.original.createdAt
            const donationStatus = row.original.status
            const donationId = row.original.id

            const isImageNull = donatorImage === null;
            const imageIsEmpty = imageUrl.length === 0

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
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => setIsReviewOpen(true)}
                            >
                                Download
                            </DropdownMenuItem>
                            {proof !== null ? (
                                null
                            ) : (
                                <DropdownMenuItem
                                    onClick={() => setIsProofOpen(true)}
                                >
                                    Upload Proof
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                        <DialogContent className="lg:max-w-2xl" ref={pdfRef}>
                            <DialogHeader>
                                <DialogTitle>
                                    {/* <AdminTitle entry="4" title="Donations Review" /> */}
                                    <p className="text-center">Status: {donationStatus}</p>
                                </DialogTitle>
                                <DialogDescription>
                                    <div ref={pdfRef}>
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
                                                        Accumulated Points: <span className="text-green-500">{donatorPoints.toFixed(2)} Point(s)</span>
                                                    </p>
                                                    <p>Date: {format(dateDonated, "PPP")}</p>
                                                    {proof !== null ? (
                                                        <a target="_blank" className="text-blue-500" href={proof}>
                                                            Proof: See Proof
                                                        </a>
                                                    ) : (
                                                        <></>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
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
                                                // handleDonations("APPROVED", selectedRate, donationSubCategory, donationCategory, donationId, donatorId, donationSize).then((callback) => {
                                                //     if (callback?.error) {
                                                //         toast({
                                                //             description: callback.error,
                                                //             variant: "destructive"
                                                //         })
                                                //     }

                                                //     if (callback?.success) {
                                                //         toast({
                                                //             description: callback.success,
                                                //             variant: "default",
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
                                    <p className="">Status: {donationStatus}</p>
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

                                        <div className="flex gap-3 mt-3">
                                            <Button
                                                variant="primary"
                                                disabled={imageIsEmpty}
                                                isLoading={isPending}
                                                onClick={() => {
                                                    startTransition(() => {
                                                        handleDonationProof(imageUrl, donationId,).then((callback) => {
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
                                                    )
                                                }}
                                            >Confirm</Button>
                                        </div>
                                    </>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

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
                                                // handleDonations("CANCELLED", donatorPoints, donationId, donatorId).then((callback) => {
                                                //     if (callback?.error) {
                                                //         toast({
                                                //             description: callback.error,
                                                //             variant: "destructive"
                                                //         })
                                                //     }

                                                //     if (callback?.success) {
                                                //         toast({
                                                //             description: callback.success,
                                                //             variant: "default",
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
                </>
            )
        },
    }
]