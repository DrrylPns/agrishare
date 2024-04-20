"use client"

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { AgrichangeSchema, AgrichangeType } from "@/lib/validations/agriquest"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { Category, Subcategory, Types } from '@prisma/client'
import { createAgrichange } from "../../../../../actions/agrichange"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { UploadDropzone } from "@/lib/uploadthing"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, sub } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import AdminTitle from "@/components/AdminTitle"

export const AgrichangeForm = () => {
    const [isPending, startTransition] = useTransition()
    const [chosenCategory, setChosenCategory] = useState("")
    const [imageUrl, setImageUrl] = useState<string>("")
    const [size, setSize] = useState("")
    const [selectedSubcategory, setSelectedSubcategory] = useState("")

    const imageIsEmpty = imageUrl.length === 0

    const form = useForm<AgrichangeType>({
        resolver: zodResolver(AgrichangeSchema),
    })

    useEffect(() => {
        setSelectedSubcategory("")
    }, [chosenCategory])

    function onSubmit(values: AgrichangeType) {
        startTransition(() => {
            createAgrichange(values, imageUrl, size).then((callback) => {
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

                    <AdminTitle entry="1" title="Agrichange Info" />

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
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Red" {...field} />
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

                        {/* <FormField
                            control={form.control}
                            name="subcategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subcategory..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {chosenCategory === Category.VEGETABLES && (
                                                <>
                                                    <SelectItem value={Subcategory.LEAFY_VEGETABLES}>Leafy Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.PODDED_VEGETABLES}>Podded Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.FRUIT_VEGETABLES}>Fruit Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.ROOT_VEGETABLES}>Root Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.HERBS_VEGETABLES}>Herbs Vegetables</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.FRESH_FRUIT && (
                                                <>
                                                    <SelectItem value={Subcategory.FRUIT1}>Fruit 1</SelectItem>
                                                    <SelectItem value={Subcategory.FRUIT2}>Fruit 2</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.EQUIPMENTS && (
                                                <>
                                                    <SelectItem value={Subcategory.SMALL}>Small</SelectItem>
                                                    <SelectItem value={Subcategory.MEDIUM}>Medium</SelectItem>
                                                    <SelectItem value={Subcategory.LARGE}>Large</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.FERTILIZER && (
                                                <>
                                                    <SelectItem value={Subcategory.ORGANIC_FERTILIZER}>Organic Fertilizer</SelectItem>
                                                    <SelectItem value={Subcategory.NOT_ORGANIC_FERTILIZER}>Not Organic Fertilizer</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.SEEDS && (
                                                <>
                                                    <SelectItem value={Subcategory.SEEDS1}>Seeds 1</SelectItem>
                                                    <SelectItem value={Subcategory.SEEDS2}>Seeds 2</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.TOOLS && (
                                                <>
                                                    <SelectItem value={Subcategory.SMALL}>Small</SelectItem>
                                                    <SelectItem value={Subcategory.MEDIUM}>Medium</SelectItem>
                                                    <SelectItem value={Subcategory.LARGE}>Large</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.SOILS && (
                                                <>
                                                    <SelectItem value={Subcategory.ORGANIC_SOIL}>Organic Soil</SelectItem>
                                                    <SelectItem value={Subcategory.NOT_ORGANIC_SOIL}>Not Organic Soil</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="subcategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select onValueChange={(newValue) => {
                                        field.onChange(newValue)
                                        setSelectedSubcategory(newValue)
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subcategory..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {chosenCategory === Category.VEGETABLES && (
                                                <>
                                                    <SelectItem value={Subcategory.LEAFY_VEGETABLES}>Leafy Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.PODDED_VEGETABLES}>Podded Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.FRUIT_VEGETABLES}>Fruit Vegetables</SelectItem>
                                                    <SelectItem value={Subcategory.ROOT_VEGETABLES}>Root Vegetables</SelectItem>
                                                    {/* <SelectItem value={Subcategory.HERBS_VEGETABLES}>Herbs Vegetables</SelectItem> */}
                                                </>
                                            )}
                                            {chosenCategory === Category.FRESH_FRUIT && (
                                                <>
                                                    <SelectItem value={Subcategory.CITRUS_FRUITS}>Citrus Fruits</SelectItem>
                                                    <SelectItem value={Subcategory.COCONUT}>Coconut</SelectItem>
                                                    <SelectItem value={Subcategory.TROPICAL_FRUIT}>Tropical Fruit</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.EQUIPMENTS && (
                                                <>
                                                    <SelectItem value={Subcategory.SMALL}>Small</SelectItem>
                                                    <SelectItem value={Subcategory.MEDIUM}>Medium</SelectItem>
                                                    <SelectItem value={Subcategory.LARGE}>Large</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.FERTILIZER && (
                                                <>
                                                    <SelectItem value={Subcategory.ORGANIC_FERTILIZER}>Organic Fertilizer</SelectItem>
                                                    <SelectItem value={Subcategory.NOT_ORGANIC_FERTILIZER}>Not Organic Fertilizer</SelectItem>
                                                </>
                                            )}
                                            {/* {chosenCategory === Category.SEEDS && (
                        <>
                          <SelectItem value={Subcategory.SEEDS1}>Seeds 1</SelectItem>
                          <SelectItem value={Subcategory.SEEDS2}>Seeds 2</SelectItem>
                        </>
                      )} */}
                                            {chosenCategory === Category.TOOLS && (
                                                <>
                                                    <SelectItem value={Subcategory.WHEEL_BARROW}>Wheel Barrow</SelectItem>
                                                    <SelectItem value={Subcategory.WATER_HOSE}>Water Hose</SelectItem>
                                                    <SelectItem value={Subcategory.GARDEN_POTS}>Garden Pots</SelectItem>
                                                    <SelectItem value={Subcategory.BUCKET}>Bucket</SelectItem>
                                                    <SelectItem value={Subcategory.GLOVES}>Gloves</SelectItem>
                                                    <SelectItem value={Subcategory.HAND_PRUNES}>Hand Prunes</SelectItem>
                                                    <SelectItem value={Subcategory.KALAYKAY}>Kalaykay</SelectItem>
                                                    <SelectItem value={Subcategory.HOES}>Hoes</SelectItem>
                                                    <SelectItem value={Subcategory.SHOVEL}>Shovel</SelectItem>
                                                </>
                                            )}
                                            {chosenCategory === Category.SOILS && (
                                                <>
                                                    <SelectItem value={Subcategory.ORGANIC_SOIL}>Organic Soil</SelectItem>
                                                    <SelectItem value={Subcategory.NOT_ORGANIC_SOIL}>Not Organic Soil</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {(chosenCategory === Category.VEGETABLES || chosenCategory === Category.FRESH_FRUIT) && (
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(newValue) => {
                                                chosenCategory === Category.VEGETABLES ||
                                                    chosenCategory === Category.FRESH_FRUIT
                                                    ? field.onChange(newValue)
                                                    : form.unregister("type")
                                            }} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a type..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={Types.ORGANIC}>Organic</SelectItem>
                                                    <SelectItem value={Types.NOT_ORGANIC}>Not Organic</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="mt-8">
                            {selectedSubcategory === Subcategory.WATER_HOSE ? (
                                <Select onValueChange={(newValue) => setSize(newValue)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                    <SelectContent className="">
                                        <SelectGroup>
                                            <SelectLabel>Sizes</SelectLabel>
                                            <SelectItem value="1/4">1/4</SelectItem>
                                            <SelectItem value="1/2">1/2</SelectItem>
                                            <SelectItem value="3/4">3/4</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : selectedSubcategory === Subcategory.GARDEN_POTS ? (
                                <Select onValueChange={(newValue) => setSize(newValue)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Sizes</SelectLabel>
                                            <SelectItem value="SmallGarden">Small</SelectItem>
                                            <SelectItem value="MediumGarden">Medium</SelectItem>
                                            <SelectItem value="LargeGarden">Large</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : selectedSubcategory === Subcategory.BUCKET ? (
                                <Select onValueChange={(newValue) => setSize(newValue)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Sizes</SelectLabel>
                                            <SelectItem value="SmallBucket">Small</SelectItem>
                                            <SelectItem value="MediumBucket">Medium</SelectItem>
                                            <SelectItem value="LargeBucket">Large</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : selectedSubcategory === Subcategory.KALAYKAY ? (
                                <Select onValueChange={(newValue) => setSize(newValue)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Sizes</SelectLabel>
                                            <SelectItem value="SmallKalaykay">Small</SelectItem>
                                            <SelectItem value="LargeKalaykay">Large</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : selectedSubcategory === Subcategory.SHOVEL ? (
                                <Select onValueChange={(newValue) => setSize(newValue)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Sizes</SelectLabel>
                                            <SelectItem value="SmallShovel">Small</SelectItem>
                                            <SelectItem value="LargeShovel">Large</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : ""}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
                        {(chosenCategory === Category.VEGETABLES || chosenCategory === Category.FRESH_FRUIT) && (
                            <FormField
                                control={form.control}
                                name="harvestDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Harvest Date</FormLabel>
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
                                                            <span>Pick a date</span>
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
                                                        date > new Date() ||
                                                        date < sub(new Date(), { days: 3 }) // Limit to the last 3 days
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {/* <FormField
                            control={form.control}
                            name="harvestDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Harvest Date</FormLabel>
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
                                                        <span>Pick a date</span>
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
                                                    date > new Date() ||
                                                    date < sub(new Date(), { days: 3 }) // Limit to the last 3 days
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="pointsNeeded"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter points needed to claim this item" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="qtyPerTrade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity per claim</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter quantity per claim" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
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
