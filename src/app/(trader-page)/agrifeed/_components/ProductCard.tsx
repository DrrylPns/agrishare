'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { BiMessageDetail } from 'react-icons/bi';
import { CiHeart } from 'react-icons/ci';
import { ReviewsType } from './Products';
import Link from 'next/link';
import { formattedCategory } from '@/lib/utils';

function ProductCard({
    id,
    productImage,
    user,
    productName,
    description,
    category,
    status,
    reviews,
    lastName,
}: {
    id: string;
    user: string | null;
    productImage: string;
    productName: string;
    description: string;
    category: string;
    status: string;
    lastName: string | null;
    reviews: ReviewsType[]
}) {
    return (
        <Card className='transition-all duration-700 ease-in-out border-gray-400 border p-10 rounded-2xl drop-shadow-md hover:drop-shadow-md hover:shadow-xl font-poppins'>
            <CardTitle className='text-4xl font-semibold'>{user} {" "} {lastName}</CardTitle>

            <div className='flex justify-around gap-5 mt-5'>
                <Link href={`/agrifeed/${id}`} className='w-2/5'>
                <Image
                    src={productImage}
                    alt={productName}
                    width={300}
                    height={300}
                    className=' w-full h-72  object-center border border-gray-300'
                />
                </Link>
                <div className='w-1/2'>

                    <Link href={`/agrifeed/${id}`} className='flex items-center gap-5 mb-3'>
                        <h1 className='text-3xl font-medium'>{productName}</h1>
                    </Link>
                    <Link href={`/agrifeed/${id}`}>
                        <CardDescription className='min-h-24 line-clamp-5 text-ellipsis'>{description}</CardDescription>
                    </Link>
                    <Link href={{pathname:`/agrifeed/${id}`}} className='flex gap-3 justify-between items-center border-y-2 border-gray-300 py-5'>
                        <Button variant={'default'} className='rounded-full w-2/5'>
                            Trade
                            <span className='ml-3'><LiaExchangeAltSolid /></span>
                        </Button>
                    </Link>
                    <h1 className='text-sm text-gray-700 my-3'>Category: <span className='text-gray-500'>{formattedCategory(category)}</span></h1>
                </div>
            </div>
        </Card>
    )
}

export default ProductCard