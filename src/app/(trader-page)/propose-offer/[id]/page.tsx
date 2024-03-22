'use client'
import React, { useEffect, useState, useTransition } from 'react'
import { z } from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { TradeSchema, TradeType } from '@/lib/validations/trade'
import { Post } from '../../agrifeed/_components/_types'
import { fetchPost } from '../../../../../actions/fetchPost'
import { BeatLoader } from 'react-spinners'
import { PageNF } from '@/components/not-found'
import Link from 'next/link'
import { cn, formattedCategory } from '@/lib/utils'
import { LiaExchangeAltSolid } from 'react-icons/lia'
import { trade } from '../../../../../actions/trade'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category, Subcategory } from '@prisma/client'

function Page({
    params
}: {
    params: {
        id: string
    }
}) {
    const [post, setPost] = useState<Post>()
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()
    const [chosenCategory, setChosenCategory] = useState("")
    const [imageUrl, setImageUrl] = useState<string>('')
    const [number, setNumber] = useState<number>(0)
    const [tradeeId, setTradeeId] = useState<string>()
    const [postId, setPostId] = useState<string>()

    const imageIsEmpty = imageUrl.length === 0

    useEffect(() => {
        fetchPostByParams()
    }, [params.id])

    const fetchPostByParams = async () => {
        const post = await fetchPost(params.id)
        setPost(post as Post)
        if (post) {
            setTradeeId(post.User.id);
            setPostId(post.id)
        }
    }

    const handleSubtract = () => {
        if (number > 0) {
            setNumber(prev => prev - 1)
        }
    }

    const handleAdd = () => {
        if (post && number < post.quantity) {
            setNumber(prev => prev + 1)
        }
    }

    const form = useForm<z.infer<typeof TradeSchema>>({
        resolver: zodResolver(TradeSchema),
        defaultValues: {
            item: "",
            quantity: 0,
            value: 0,
            weight: 0,
            description: '',
            shelfLife: '',
        },
    })

    function onSubmit(values: z.infer<typeof TradeSchema>) {
        setError("");
        setSuccess("");

        startTransition(() => {
            trade(values as TradeType, number, tradeeId as string, imageUrl, postId as string).then((data) => {
                if (data?.error) {
                    form.reset()
                    setError(data.error)
                }

                if (data?.success) {
                    form.reset()
                    setImageUrl("")
                    setNumber(0)
                    setSuccess(data.success);
                }
            }).catch(() => setError("Something went wrong"))
        })
    }

    if (post === undefined) return <BeatLoader />

    if (!post) return <PageNF />


    return (
        <div className='flex flex-col w-full h-full items-center space-y-3'>
            <div className='w-full sm:w-3/5 mt-5 sm:mt-0 p-10 border border-gray-300 rounded-xl'>
                <h1 className='text-3xl font-semibold text-center mb-3'>You are currently trading:</h1>

                <div className='flex flex-col lg:flex-row justify-evenly items-center lg:items-start space-x-2'>
                    <Image
                        src={post.image}
                        alt={post.name}
                        width={300}
                        height={300}
                        className='lg:w-2/5 h-72 object-center border border-gray-300'
                    />

                    <div className='md:text-start text-center space-y-3'>
                        <h1 className='text-3xl font-medium'>{post.name}</h1>
                        <p className=''>Remaining stocks: {post.quantity}</p>
                        <h1 className='text-sm text-gray-700'>Category: <span className='text-gray-500'>{formattedCategory(post.category)}</span></h1>
                        <h1>Choose how many {post.name} {" "} do you want to trade:</h1>
                        <div className='flex flex-row items-center justify-center lg:justify-start'>

                            <Button variant={'secondary'}
                                onClick={handleSubtract}
                            >
                                -
                            </Button>
                            <h1 className='px-3'>{number}</h1>
                            <Button variant={'secondary'}
                                onClick={handleAdd}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full sm:w-3/5 mt-5 sm:mt-0 p-10 border border-gray-300 rounded-xl'>
                <h1 className='text-center text-xl font-semibold'>Propose Offer</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {imageUrl.length ? <div
                            className='flex justify-center items-center flex-col'
                        >

                            <Image
                                alt='Done Upload'
                                src={imageUrl}
                                width={250}
                                height={250}
                                className='mb-3'
                            />
                            <h1 className='mt-3 text-gray-500'>Uploaded Successfully</h1>
                        </div> : <UploadDropzone
                            className="text-green"
                            appearance={{
                                button: "bg-[#099073] p-2",
                                label: "text-green",
                                allowedContent: "flex h-8 flex-col items-center justify-center px-2 text-green",
                            }}
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                console.log('Files: ', res);
                                if (res && res.length > 0 && res[0].url) {
                                    setImageUrl(res[0].url);
                                } else {
                                    console.error('Please input a valid product image.', res);
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast({
                                    title: 'Error!',
                                    description: error.message,
                                    variant: 'destructive',
                                })
                            }}
                        />}

                        <FormField
                            control={form.control}
                            name="item"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Item" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

                            <FormField
                                control={form.control}
                                name="shelfLife"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shelf Life</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Shelf life..." {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input placeholder="P" {...field} disabled={isPending} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
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
                                                            <SelectItem value={Subcategory.EQUIPMENTS1}>Equipment 1</SelectItem>
                                                        </>
                                                    )}
                                                    {chosenCategory === Category.FERTILIZER && (
                                                        <>
                                                            <SelectItem value={Subcategory.FERTILIZER1}>Fertilizer 1</SelectItem>
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
                                                            <SelectItem value={Subcategory.TOOLS1}>Tools 1</SelectItem>
                                                        </>
                                                    )}
                                                    {chosenCategory === Category.SOILS && (
                                                        <>
                                                            <SelectItem value={Subcategory.SOILS1}>Soils 1</SelectItem>
                                                            <SelectItem value={Subcategory.SOILS2}>Soils 2</SelectItem>
                                                            <SelectItem value={Subcategory.SOILS3}>Soils 3</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem className='col'>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input placeholder="100" {...field} disabled={isPending} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem className='col'>
                                            <FormLabel>Weight by (kg)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1 Kg" {...field} disabled={isPending} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your item here"
                                                className="resize-none"
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='text-center space-y-2'>
                                <FormError message={error} />
                                <FormSuccess message={success} />
                                <Button type="submit" disabled={imageIsEmpty || isPending}>Send Offer</Button>
                            </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page