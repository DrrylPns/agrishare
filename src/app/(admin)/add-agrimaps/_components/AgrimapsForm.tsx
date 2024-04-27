"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AgrimapSchema, AgrimapType } from '@/lib/validations/agrimaps'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { createAgrimaps } from '../../../../../actions/agrimaps'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Coordinates } from '@prisma/client'

const AgrimapsForm = () => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<AgrimapType>({
        resolver: zodResolver(AgrimapSchema),
    })

    const onSubmit = (values: AgrimapType) => {
        startTransition(() => {
            createAgrimaps(values).then((callback) => {
                if (callback?.error) {
                    toast({
                        description: callback.error,
                        variant: "destructive"
                    })
                }

                if (callback?.success) {
                    toast({
                        description: callback.success,
                    })

                    window.location.reload()
                }
            })
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

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <FormField
                        control={form.control}
                        name="lat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitute</FormLabel>
                                <FormControl>
                                    <Input placeholder="01234567890" {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lng"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitutde</FormLabel>
                                <FormControl>
                                    <Input placeholder="01234567890" {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button disabled={isPending}>Save</Button>
            </form>
        </Form>
    )
}

export default AgrimapsForm