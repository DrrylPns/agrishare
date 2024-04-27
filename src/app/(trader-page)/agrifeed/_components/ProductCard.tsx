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
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()

    const formattedShelfLifeUnit = formattedSLU(product.shelfLifeDuration, product.shelfLifeUnit)

    return (
        <Card className='transition-all duration-700 ease-in-out border-gray-400 border p-5 sm:p-10 rounded-2xl drop-shadow-md hover:drop-shadow-md hover:shadow-xl font-poppins'>

            <div className='flex justify-between'>
                <CardTitle className='text-xl sm:text-4xl font-semibold'>{name} {" "} {lastName}</CardTitle>

                {session?.user.id === user.id && (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontalIcon className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>

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
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <UpdateAgrifeedForm
                            product={product}
                            isUpdateOpen={isUpdateOpen}
                            setIsUpdateOpen={setIsUpdateOpen}
                        />
                    </>
                )}

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
                        <CardDescription className='text-[0.6rem] min-h-10 sm:min-h-24 '>

                            <div className='flex'>
                                <h1 className='w-1/3'>Weight:</h1>
                                <span className='text-gray-400'>{product.weight}</span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Color: </h1>
                                <span className='text-gray-400'>{product.color}</span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Type: </h1>
                                <span className='text-gray-400'>{product.type}</span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Category: </h1>
                                <span className='text-gray-400'>{formattedCategory(product.category)}</span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Quantity: </h1>
                                <span className='text-gray-400'>{product.quantity}</span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Shelf Life: </h1>
                                <span className='text-gray-400'>{formattedShelfLifeUnit}</span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Harvest Date: </h1>
                                <span className='text-gray-400'>
                                    {product.harvestDate && <RelativeDate dateString={product.harvestDate.toString()} />}
                                </span>
                            </div>
                            <div className='flex'>
                                <h1 className='w-1/3'>Prefered Offers: </h1>
                                <span className='text-gray-400'>{product.preferedOffers}</span>
                            </div>

                        </CardDescription>
                    </Link>

                    <div className="flex flex-row gap-3 my-2">
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