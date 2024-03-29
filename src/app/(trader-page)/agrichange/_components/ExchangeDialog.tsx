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

export default function ExchangeDialog({
    selectedItem
}: {
    selectedItem: Agrichange
}) {
    const [isPending, startTransition] = useTransition()

    return (
        <Dialog>
            <DialogTrigger><span ><LiaExchangeAltSolid /></span></DialogTrigger>
            <DialogContent className="min-h-[50%] max-w-xl">
                <div className="flex flex-col text-center justify-center items-center w-full font-poppins font-semibold text-sm md:text-xl">
                    <h1 className="my-auto">Are you sure you want this item?</h1>
                    <Image src={selectedItem.image} alt="" width={100} height={100} className="object-contain" />
                    <h1 className="">{selectedItem.name}</h1>
                </div>
                <div className="relative w-full flex justify-center gap-10">
                    <Button
                        variant='default'
                        className="rounded-full px-10"
                        isLoading={isPending}
                        onClick={() => {
                            startTransition(() => {
                                claimAgrichange(selectedItem.id).then((data) => {
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
                        }}
                    >
                        Yes
                    </Button>
                    <DialogClose asChild>
                        <Button variant={'destructive'} className="rounded-full px-10">No</Button>
                    </DialogClose>
                    <Image src={HearthwihGirl} alt="" width={100} height={400} className="absolute top-0 right-0" />
                </div>
            </DialogContent>
        </Dialog>
    )
}
