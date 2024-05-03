"use client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Coordinates } from '@prisma/client'
import { MapPinIcon, Plus } from 'lucide-react'
import React, { useState } from 'react'

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

                            <div className=''>
                                <Plus className='text-lime-600' />
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}
