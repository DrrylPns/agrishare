"use client"
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { SendDonationType, sendDonationSchema } from '@/lib/validations/donation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { findDonation, sendDonation } from '../../../../../actions/donate'

interface Props {
    coordinateId: string
}

export const UFListDialog = ({
    coordinateId
}: Props) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [findError, setFindError] = useState<string | undefined>("");
    const [findSuccess, setFindSuccess] = useState<string | undefined>("");

    const [donatorName, setDonatorName] = useState("")
    const [productName, setProductName] = useState("")

    console.log(`Coordinate ID: ${coordinateId}`)

    const [invalidDonationId, setInvalidDonationId] = useState(true)

    const form = useForm<z.infer<typeof sendDonationSchema>>({
        resolver: zodResolver(sendDonationSchema)
    })

    const onSubmit = (values: SendDonationType) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            sendDonation(values, coordinateId).then((callback) => {
                if (callback.error) {
                    setError(callback.error)
                }

                if (callback.success) {
                    setSuccess(callback.success)
                }
            })
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Plus className='text-lime-600' />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Donation</DialogTitle>
                    <DialogDescription>
                        Please put the exact information of the donation.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className='grid grid-cols-2 items-center gap-3'>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="dn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Donation ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="dn#" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div
                                className={cn(
                                    buttonVariants({
                                        variant: "primary"
                                    }),
                                    "cursor-pointer mt-7"
                                )}
                                onClick={() => {
                                    const donationId = form.getValues("dn")
                                    setFindError("")
                                    setFindSuccess("")

                                    startTransition(() => {
                                        findDonation(donationId).then((callback) => {
                                            if (callback.error) {
                                                setFindError(callback.error)
                                                setInvalidDonationId(true)
                                            }

                                            if (callback.success) {
                                                setFindSuccess(callback.success)
                                                setInvalidDonationId(false)
                                                // setCoordinateId(coordinate.id);
                                            }

                                            if (callback.currentDonation) {
                                                form.setValue("name", callback.currentDonation.name)
                                                form.setValue("item", callback.currentDonation.subcategory as string)
                                                setDonatorName(callback.currentDonation.name)
                                                setProductName(callback.currentDonation.subcategory as string)
                                            }
                                        })
                                    })
                                }}
                            >
                                Find Donation
                            </div>
                        </div>

                        <div>
                            <FormError message={findError} />
                            <FormSuccess message={findSuccess} />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name of Donator</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            {...field}
                                            disabled={true}
                                            value={donatorName}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="item"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            {...field}
                                            disabled={true}
                                            value={productName}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            type="submit"
                            disabled={invalidDonationId}
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
