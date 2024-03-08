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

function ProductCard({
    id,
    productImage,
    user,
    productName,
    description,
    category,
    tag,
    availableStocks,
}:{
    id: number;
    user:{
        id: string;
        name: string;
    } ;
    productImage: string;
    productName: string;
    description: string;
    category: string;
    tag: string[];
    availableStocks: number;
}) {
  return (
    <Card className='transition-all duration-700 ease-in-out p-5 rounded-xl drop-shadow-md hover:drop-shadow-md hover:shadow-xl font-poppins'>
        <CardTitle>{user.name}</CardTitle>

        <div className='flex justify-around gap-5 mt-5'>
            <Image 
            src={productImage} 
            alt={productName}
            width={300}
            height={300}
            className='w-2/5 h-72 object-center border border-gray-300'
            />
            <div className='w-1/2'>
                <div className='flex items-center gap-5'>
                    <h1 className='text-3xl font-semibold'>{productName}</h1>
                    <span className='px-3 py-1 font-bold bg-green-200 text-[0.5rem] text-green-400'>{availableStocks < 1 ? 'Not Available' : "In Stock"}</span>
                </div>
                <CardDescription className='min-h-24 line-clamp-5 text-ellipsis'>{description}</CardDescription>
                <div className='flex gap-3 justify-between items-center border-y-2 border-gray-100 py-5'>
                    <Button variant={'default'} className='rounded-full w-1/3'>
                        Trade 
                        <span className='ml-3'><LiaExchangeAltSolid /></span>
                    </Button>
                    <Button variant={'default'} className='rounded-full w-1/3'>
                        Message 
                        <span className='ml-3'><BiMessageDetail /></span>
                    </Button>
                    <Button variant={'ghost'} className='rounded-full px-3 text-lg font-medium bg-gray-300'> 
                        <span className=''><CiHeart /></span>
                    </Button>
                </div>
                <h1 className='text-sm text-gray-700 my-3'>Categoy: <span className='text-gray-500'>{category}</span></h1>
                <h1 className='text-sm text-gray-700'>Tag: 
                    {tag.length > 0 && tag.map((tag)=>(
                        <span className='text-gray-500'>{tag} </span>
                    ))}</h1>
            </div>
        </div>
    </Card>
  )
}

export default ProductCard