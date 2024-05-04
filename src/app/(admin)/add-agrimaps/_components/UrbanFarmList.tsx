"use client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Coordinates } from '@prisma/client'
import { MapPinIcon, Plus } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


interface Props {
    coordinates: Coordinates[]
}

export const UrbanFarmList = ({ coordinates }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-3 w-full'>
            {coordinates.map((coordinate, index) => (
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle
                            className='cursor-pointer flex flex-row justify-between gap-3 text-lg items-center w-full'
                        >
                            <div className='flex flex-row gap-2 truncate'>
                                <MapPinIcon />
                                {coordinate.name}
                            </div>

                            <div>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger>
                                        <Plus className='text-lime-600' />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>

                        </CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}
