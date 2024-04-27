"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AgrichangeSchema, AgrichangeType } from '@/lib/validations/agriquest'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'

const AgrimapsForm = () => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<AgrichangeType>({
        resolver: zodResolver(AgrichangeSchema),
    })

    const onSubmit = () => {
        startTransition(() => {

        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Urban Farm Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter urban farm name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    
                </div>
            </form>
        </Form>
    )
}

export default AgrimapsForm