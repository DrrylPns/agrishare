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
import { DownloadIcon, MoreHorizontalIcon } from "lucide-react"
// import AdminTitle from "../AdminTitle"
import Link from "next/link"
import html2canvas from "html2canvas"
import { UploadDropzone } from "@/lib/uploadthing"
import jsPDF from "jspdf"
import { handleTradeProof } from "../../../../../actions/trade"
import Image from "next/image"
import { handleCancelDonation, handleDonationProof } from "../../../../../actions/donate"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CancelDonationSchema, FormType } from "@/lib/validations/donation"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Separator } from "@/components/ui/separator"
import { extractTime } from "@/lib/utils"

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
            const unit = row.original.category
            const donatoryQty = row.original.quantity
            const donationDn = row.original.dn
            const proof = row.original.proof
            const donatorId = row.original.donator.id
            const useId = row.original.donator.userId
            const donationQuantity = row.original.quantity
            const dateDonated = row.original.createdAt
            const donationStatus = row.original.status
            const donationId = row.original.id
            const donatorEMail = row.original.donator.email
            const accumelatedPoints = row.original.pointsToGain

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
                    pdf.save('Receipt.pdf');
                });
            }

            const form = useForm<z.infer<typeof CancelDonationSchema>>({
                resolver: zodResolver(CancelDonationSchema),
            })

            const { mutate: handleCancel, isLoading } = useMutation({
                mutationFn: async ({ donationId, type }: FormType) => {
                    const payload: FormType = {
                        donationId,
                        type,
                    }
                    const { data } = await axios.put("/api/donate/cancel", payload)
                    return data
                },
                onError: (err) => {
                    if (err instanceof AxiosError) {
                        if (err.response?.status === 404) {
                            toast({
                                description: "No transaction found!",
                                variant: 'destructive',
                            })
                        }
                    } else {
                        return toast({
                            title: 'Something went wrong.',
                            description: "Error",
                            variant: 'destructive',
                        })
                    }
                },
                onSuccess: (data) => {
                    toast({
                        description: `Successfully cancelled the transaction.`,
                        variant: 'default',
                    })
        
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            })
            
            function onSubmit(values: FormType, donationId: string) {
                const payload: FormType = {
                    donationId,
                    type: values.type,
                }

                handleCancel(payload)
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
                                Download reciept
                            </DropdownMenuItem>
                            {proof !== null  || donationStatus === "CANCELLED" ? (
                                null
                            ) : (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setIsProofOpen(true)}
                                >
                                    Upload Proof
                                </DropdownMenuItem>
                            )}
                            {donationStatus === 'PENDING' && (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setIsRejectOpen(true)}
                                >
                                    Cancel
                                </DropdownMenuItem>
                            )}
                            
                            
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                        <DialogContent className="lg:max-w-5xl bg-white ui-open:bg-white">
                            <DialogHeader className="bg-white">
                                <DialogTitle className="bg-white">
                                    <DownloadIcon onClick={downloadPDF}/>
                                </DialogTitle>
                                <DialogDescription className="bg-white">
                                    <div ref={pdfRef} className="text-lg font-bold bg-white mt-10 px-5 pb-5">
                                        <div className="text-black text-center">
                                            <h1  className="text-2xl">Donation Receipt</h1>
                                            <h1  className="text-xl">AgriShare : Trading-Donation</h1>
                                        </div>
                                        <div  className="text-black my-3">
                                            <h1>Donation ID:{donationDn}</h1>
                                        </div>
                                        <Separator/>
                                        <div className="text-black my-3 font-semibold">
                                            <h1 >Donator Details</h1> 
                                            <h1 className="text-black text-medium tex-sm">User ID: {useId}</h1>
                                            {/* <h1>User Email: {donatorEmail}</h1> */}
                                            <h1 className="text-black text-medium tex-sm">Transaction Date: {format(dateDonated, "PPP")}</h1>
                                            <h1 className="text-black text-medium tex-sm">Transaction Time: {extractTime(dateDonated.toString())}</h1>

                                        </div>
                                        <Separator/>
                                        <div  className="text-black text-lg my-3 font-semibold">
                                            <h1>Donation Details</h1> 
                                            <h1 className="text-black text-medium tex-sm">Quantity: {donationQuantity}</h1>
                                            <h1 className="text-black text-medium tex-sm">User Email: {donatorEMail}</h1>
                                            <h1 className="text-black text-medium tex-sm">Item: {donatorProduct}</h1>                               
                                            <h1 className="text-black text-medium tex-sm">Unit: {unit === "FRESH_FRUIT" || unit === "VEGETABLES" ? "Kilo/s" : unit === "TOOLS" || unit === "EQUIPMENTS" ? "Piece/s" : "Pack/s"}</h1>                               
                                            <h1 className="text-black text-medium tex-sm">ACcumulated Points: {accumelatedPoints}</h1>                               
                                            
                                        </div>
                                        <Separator/>
                                        <div className="w-full font-semibold">
                                            <h1 className="mb-3 text-lg text-black">Transaction Terms</h1>
                                            <p className="mb-3 text-justify text-xs">This receipt serves as an acknowledgment that the item shall be held by the Center for Urban Agriculture and Innovation (CUAI), the designated entity responsible for managing donations from users of AgriShare: Donation-Trading Web Application. To avoid any potential confusion regarding the location, it is advisable to visit Agrimap for the accurate verification of CUAI's location.</p>
                                            <h1 className="text-sm">Please present this receipt to the administrators of CUAI to confirm your transaction and to facilitate the allocation of corresponding points.</h1>
                                        </div>
                                    </div>
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

                    <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                        <DialogContent>
                            <DialogHeader className='flex flex-col items-start gap-1'>
                                <DialogTitle>Why are you cancelling this donation?</DialogTitle>
                                <DialogDescription className="w-full">
                                    Please provide a reason for the cancellation. This will help us improve our service.
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit((values) => onSubmit(values, donationId))} className="w-2/3 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className='font-bold'>Reason</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="NotAvailable" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Not availble on the given time.
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="ChangeOfMind" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                               Change of mind
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="ChangeOfDonation" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Change of donation details
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="FailedToAppear" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Failed to appear without prior notice
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Others" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Others
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className=' bg-primary-green hover:bg-primary-green/80' isLoading={isLoading}>Submit</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>

                    {/* <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                      
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
                                                handleCancelDonation("CANCELLED", donationId, donatorId).then((callback) => {
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
                    </AlertDialog> */}
                </>
            )
        },
    }
]