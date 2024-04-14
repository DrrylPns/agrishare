"use client"

import AdminTitle from "@/components/AdminTitle"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { UploadDropzone } from "@/lib/uploadthing"
import { AgriQuestSchema, AgriquestType } from "@/lib/validations/agriquest"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from '@prisma/client'
import Image from "next/image"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { createAgriquest } from "../../../../../actions/agriquest"

export const AgriquestForm = () => {
    const [isPending, startTransition] = useTransition()
    const [chosenCategory, setChosenCategory] = useState("")
    const [imageUrl, setImageUrl] = useState<string>("")

    const imageIsEmpty = imageUrl.length === 0

    const form = useForm<AgriquestType>({
        resolver: zodResolver(AgriQuestSchema),
    })

    function onSubmit(values: AgriquestType) {
        startTransition(() => {
            createAgriquest(values, imageUrl).then((callback) => {
                if (callback.error) {
                    toast({
                        description: callback.error,
                        variant: "destructive"
                    })
                }

                if (callback.success) {
                    toast({
                        description: callback.success
                    })
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            })
        })
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <AdminTitle entry="1" title="Agriquest Info" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stocks</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="shelfLife"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shelf Life</FormLabel>
                                    <FormControl>
                                        <Input placeholder="5 days" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={(newValue) => {
                                        field.onChange(newValue);
                                        setChosenCategory(newValue);
                                    }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={Category.FRESH_FRUIT}>Fresh Fruit</SelectItem>
                                            <SelectItem value={Category.VEGETABLES}>Vegetables</SelectItem>
                                            <SelectItem value={Category.TOOLS}>Tools</SelectItem>
                                            <SelectItem value={Category.EQUIPMENTS}>Equipments</SelectItem>
                                            <SelectItem value={Category.SEEDS}>Seeds</SelectItem>
                                            <SelectItem value={Category.SOILS}>Soils</SelectItem>
                                            <SelectItem value={Category.FERTILIZER}>Fertilizer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Give the product a little description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="qtyPerTrade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity per quest</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter quantity per quest" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <AdminTitle entry="2" title="Upload" />
                        {imageUrl.length ? <div className="w-full flex flex-col items-center justify-center mt-5">
                            <Image
                                alt='product image'
                                src={imageUrl}
                                width={250}
                                height={250}
                                className='mb-3'
                            />
                            <Button variant="outline" onClick={() => setImageUrl("")}>Change</Button>
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
                                    console.error('Please input a valid image.', res);
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
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                        <Button type="submit" variant="primary" isLoading={isPending} disabled={imageIsEmpty}>Save</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
