"use client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Coordinates } from '@prisma/client'
import { MapPinIcon, Plus } from 'lucide-react'
import React, { useEffect, useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { SendDonationType, sendDonationSchema } from '@/lib/validations/donation'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { findDonation, sendDonation } from '../../../../../actions/donate'
import { toast } from '@/components/ui/use-toast'
import { UFListDialog } from './UFListDialog'

interface Props {
    coordinates: Coordinates[]
}

export const UrbanFarmList = ({ coordinates }: Props) => {

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-3 w-full'>
            {coordinates.map((coordinate, index) => (
                <Card className='w-full' key={coordinate.id}>
                    <CardHeader>
                        <CardTitle
                            className='cursor-pointer flex flex-row justify-between gap-3 text-lg items-center w-full'
                        >
                            <div className='flex flex-row gap-2 truncate'>
                                <MapPinIcon />
                                {coordinate.name}
                            </div>

                            <div>
                                <UFListDialog coordinateId={coordinate.id} />
                            </div>

                        </CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}
