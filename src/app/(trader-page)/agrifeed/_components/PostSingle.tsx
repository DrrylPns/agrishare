"use client"

import { buttonVariants } from '@/components/ui/button'
import { cn, formattedCategory } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { LiaExchangeAltSolid } from 'react-icons/lia'
import PostTabs from './PostTabs'
import { Post } from './_types'



type PostSingleProps = {
    post: Post
}

export const PostSingle: React.FC<PostSingleProps> = ({ post }) => {
    const [number, setNumber] = useState<number>(0)

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

    return (
        <>
            <div className='flex justify-around gap-5 px-5 sm:px-0 mt-10 sm:mt-5'>
                <Image
                    src={post.image}
                    alt={post.name}
                    width={300}
                    height={300}
                    className=' w-2/5 h-40 sm:h-72  object-center border border-gray-300'
                />
                <div className='w-1/2'>
                    <h1 className='text-xl sm:text-3xl font-medium'>{post.name}</h1>
                    <p className='min-h-10 sm:min-h-24 text-[0.6rem] text-xs'>{post.description}</p>
                    <div className='flex gap-3  items-center border-y-2 border-gray-300 py-2 sm:py-5'>
                      
                        <Link className={cn(buttonVariants({
                            variant: "primary"
                        }), "rounded-full w-1/2 sm:w-2/5 ")}
                            href={`/propose-offer/${post.id}`}
                        >
                            Trade
                            <span className='ml-3'><LiaExchangeAltSolid /></span>
                        </Link>
                    </div>
                    <h1 className='text-[0.6rem] sm:text-sm text-gray-700 my-1 sm:my-3'>Category: <span className='text-gray-500'>{formattedCategory(post.category)}</span></h1>
                </div>
            </div>
            <div>
                <PostTabs post={post} />
            </div>
        </>
    )
}
