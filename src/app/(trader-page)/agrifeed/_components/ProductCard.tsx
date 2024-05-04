'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardTitle
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';
import { formattedCategory, formattedSLU } from '@/lib/utils';
import { MoreHorizontalIcon } from "lucide-react";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { deleteAgrifeed } from '../../../../../actions/agrifeed';
import { ReviewsType } from './Products';
import { Post, User } from './_types';
import UpdateAgrifeedForm from "./UpdateAgrifeedForm";
import RelativeDate from "@/components/RelativeDate";
import { TiMessages } from "react-icons/ti";
import { inspectChatRoom } from "../../../../../actions/chat";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CancelDonationSchema, FormType } from "@/lib/validations/donation";
import axios, { AxiosError } from "axios";
import { AgrifeedReportSchema, AgrifeedReportType } from "@/lib/validations/agrifeed";
import { Issue } from "@prisma/client";


function ProductCard({
    id,
    productImage,
    name,
    productName,
    description,
    category,
    status,
    reviews,
    lastName,
    user,
    product
}: {
    id: string;
    name: string | null;
    productImage: string;
    productName: string;
    description: string;
    category: string;
    status: string;
    lastName: string | null;
    reviews: ReviewsType[];
    user: User;
    product: Post;
}) {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isReportOpen, setIsReportOpen] = useState<boolean>(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()

    const formattedShelfLifeUnit = formattedSLU(product.shelfLifeDuration, product.shelfLifeUnit)

    const form = useForm<z.infer<typeof AgrifeedReportSchema>>({
        resolver: zodResolver(AgrifeedReportSchema),
    })

    const { mutate: handleReport, isLoading } = useMutation({
        mutationFn: async ({ postId, type }: AgrifeedReportType) => {
            const payload: AgrifeedReportType = {
                postId,
                type,
            }
            const { data } = await axios.post("/api/agrifeedPost/report", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 404) {
                    toast({
                        description: "No Post found!",
                        variant: 'destructive',
                    });
                } else if (err.response?.status === 401) {
                    // Display the error message returned from the server
                    toast({
                        description: err.response.data,
                        variant: 'destructive',
                    });
                }
            } else {
                return toast({
                    title: 'Something went wrong.',
                    description: "Error",
                    variant: 'destructive',
                });
            }
        },
        onSuccess: (data) => {
            if(data === 'You already reported this post!'){
                toast({
                    description: data,
                    variant: 'destructive',
                })
            }
            toast({
                description: `Successfully report the post.`,
                variant: 'default',
            })

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    })
    
    function onSubmit(values: AgrifeedReportType, postId: string) {
        const payload: AgrifeedReportType = {
            postId: postId,
            type: values.type as Issue,
        }

        handleReport(payload)
    }


    return (
        <Card className='transition-all duration-700 ease-in-out border-gray-400 border p-5 sm:p-10 rounded-2xl drop-shadow-md hover:drop-shadow-md hover:shadow-xl font-poppins'>

            <div className='flex justify-between'>
                <div className="flex justify-between w-full pr-10">
                    <CardTitle className='text-xl sm:text-4xl font-semibold'>{name} {" "} {lastName}</CardTitle>
                    <h1 className='text-[0.6rem] sm:text-sm text-gray-700 my-1 sm:my-3'><span className='text-gray-500'><RelativeDate dateString={product.createdAt.toString()}/></span></h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    {session?.user.id === user.id && (
                        <>
                            <DropdownMenuItem
                                className='cursor-pointer'
                                onClick={() => setIsUpdateOpen(true)}
                            >
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className='cursor-pointer text-rose-500'
                                onClick={() => setIsOpen(true)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                    {session?.user.id !== user.id && (
                        <DropdownMenuItem
                            className='cursor-pointer text-rose-500'
                            onClick={() => setIsReportOpen(true)}
                        >
                            Report
                        </DropdownMenuItem>
                    )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <UpdateAgrifeedForm
                    product={product}
                    isUpdateOpen={isUpdateOpen}
                    setIsUpdateOpen={setIsUpdateOpen}
                />
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your post.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    startTransition(() => {
                                        deleteAgrifeed(user.id, id)
                                            .then((data) => {
                                                if (data.error) toast({
                                                    description: data.error,
                                                    variant: "destructive"
                                                })

                                                if (data.success) {
                                                    toast({
                                                        description: data.success
                                                    })
                                                }
                                            })
                                    })
                                }}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                        <DialogContent>
                            <DialogHeader className='flex flex-col items-start gap-1'>
                                <DialogTitle>Why are you reporting this trader?</DialogTitle>
                                <DialogDescription className="w-full">
                                    Please provide a reason for the reporting. This will help our admin validate your report.
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit((values) => onSubmit(values,id))} className="w-2/3 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className='font-bold'>Reason</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="InnapropirateImage" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Innapropirate Image
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="DisrespecfulPost" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Disrespecful Post
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="WrongInformation" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Wrong Information
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="GraphicViolence" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Graphic Violence
                                                            </FormLabel>
                                                        </FormItem>

                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Harassment" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Harassment
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Bullying" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Bullying
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Others" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Others
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className=' bg-primary-green hover:bg-primary-green/80' isLoading={isLoading}>Submit</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
            </div>

            <div className='flex justify-around gap-5 mt-5'>
                <Link href={`/agrifeed/${id}`} className='w-2/5'>
                    <Image
                        src={productImage}
                        alt={productName}
                        width={300}
                        height={300}
                        className=' w-full h-40 md:h-72  object-center border border-gray-300'
                    />
                </Link>
                <div className='w-1/2'>

                    <Link href={`/agrifeed/${id}`} className='flex items-center gap-5 mb-1 sm:mb-3'>
                        <h1 className='text-xl sm:text-3xl font-medium'>{productName}</h1>
                    </Link>
                    <Link href={`/agrifeed/${id}`}>
                        <CardDescription className='text-[0.6rem] min-h-10 sm:min-h-24 font-bold'>

                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Weight:</h1>
                                <span className='text-gray-400'>{product.weight}</span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Color: </h1>
                                <span className='text-gray-400'>{product.color}</span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Type: </h1>
                                <span className='text-gray-400'>{product.type}</span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Category: </h1>
                                <span className='text-gray-400'>{formattedCategory(product.category)}</span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Kg: </h1>
                                <span className='text-gray-400'>{product.quantity}</span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Shelf Life: </h1>
                                <span className='text-gray-400'>{formattedShelfLifeUnit}</span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Harvest Date: </h1>
                                <span className='text-gray-400'>
                                    {product.harvestDate && <RelativeDate dateString={product.harvestDate.toString()} />}
                                </span>
                            </div>
                            <div className='flex gap-2'>
                                <h1 className='w-1/3'>Prefered Offers: </h1>
                                <span className='text-gray-400'>{product.preferedOffers}</span>
                            </div>

                        </CardDescription>
                    </Link>

                    <div className="flex flex-col md:flex-row gap-3 my-2">
                        <Link href={{ pathname: `/agrifeed/${id}` }} className=''>
                            <Button variant={'default'} className='rounded-full py-2 px-3'>
                                Trade
                                <span className='ml-3'><LiaExchangeAltSolid /></span>
                            </Button>
                        </Link>

                        <Button variant='default' className='rounded-full py-2 px-3' onClick={() => inspectChatRoom(user.id)}>
                            Message
                            <span className='ml-3'><TiMessages /></span>
                        </Button>
                    </div>

                    <h1 className='text-[0.6rem] sm:text-sm text-gray-700 my-1 sm:my-3'>Category: <span className='text-gray-500'>{formattedCategory(category)}</span></h1>
                    
                </div>
            </div>
        </Card>
    )
}

export default ProductCard