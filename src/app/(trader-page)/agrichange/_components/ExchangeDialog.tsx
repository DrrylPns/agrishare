"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"
import Image from "next/image"
import { LiaExchangeAltSolid } from "react-icons/lia"
import { Agrichange } from "../../agrifeed/_components/_types"
import HearthwihGirl from './images/image1.png'
import { useTransition } from "react"
import { claimAgrichange } from "../../../../../actions/agrichange"
import { toast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { add, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DateOfPickupInAgrichange, DateOfPickupInAgrichangeType } from "@/lib/validations/agrichange"

export default function ExchangeDialog({
    selectedItem
}: {
    selectedItem: Agrichange
}) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<DateOfPickupInAgrichangeType>({
        resolver: zodResolver(DateOfPickupInAgrichange),
    })

    function onSubmit(data: DateOfPickupInAgrichangeType) {
        startTransition(() => {
            claimAgrichange(selectedItem.id, data).then((data) => {
                if (data.error) {
                    toast({
                        description: data.error,
                        variant: "destructive"
                    })
                }

                if (data.success) {
                    toast({
                        description: data.success,
                    })
                }
            })
        })
    }

    return (
        <Dialog>
            <DialogTrigger><span ><LiaExchangeAltSolid /></span></DialogTrigger>
            <DialogContent className="min-h-[50%] max-w-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col text-center justify-center items-center w-full font-poppins font-semibold text-sm md:text-xl space-y-3">
                            <h1 className="my-auto">Are you sure you want this item?</h1>
                            <Image src={selectedItem.image} alt="" width={100} height={100} className="object-contain" />
                            <h1 className="">{selectedItem.name}</h1>
                            <FormField
                                control={form.control}
                                name="pickupDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        {/* <FormLabel>Pick up date</FormLabel> */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Select pick up date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date() ||
                                                        date > add(new Date(), { days: 7 })
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="relative w-full flex justify-center gap-10">
                            <Button
                                variant='default'
                                className="rounded-full px-10"
                                isLoading={isPending}
                            // onClick={onSubmit}
                            >
                                Yes
                            </Button>
                            <DialogClose asChild>
                                <Button variant={'destructive'} className="rounded-full px-10">No</Button>
                            </DialogClose>
                            <Image src={HearthwihGirl} alt="" width={100} height={400} className="absolute hidden md:block top-0 right-0" />
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
