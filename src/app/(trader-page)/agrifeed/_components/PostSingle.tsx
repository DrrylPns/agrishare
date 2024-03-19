"use client"

import Image from 'next/image'
import React, { useState, useTransition } from 'react'
import AddOrSubtractBtn from './AddOrSubtractBtn'
import PostTabs from './PostTabs'
import { Button, buttonVariants } from '@/components/ui/button'
import { LiaExchangeAltSolid } from 'react-icons/lia'
import { cn, formattedCategory } from '@/lib/utils'
import { Post } from './_types'
import Link from 'next/link'



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
            <div className='flex justify-around gap-5 mt-5'>
                <Image
                    src={post.image}
                    alt={post.name}
                    width={300}
                    height={300}
                    className=' w-2/5 h-72  object-center border border-gray-300'
                />
                <div className='w-1/2'>
                    <h1 className='text-3xl font-medium'>{post.name}</h1>
                    <p className='min-h-24 line-clamp-5 text-ellipsis'>{post.description}</p>
                    <div className='flex gap-3  items-center border-y-2 border-gray-300 py-5'>
                        {/* <AddOrSubtractBtn post={post} /> */}

                        {/* <div className='w-1/3 flex items-center justify-evenly '>
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
                        </div> */}

                        <Link className={cn(buttonVariants({
                            variant: "primary"
                        }), "rounded-full w-2/5")}
                            href={`/propose-offer/${post.id}`}
                        >
                            Trade
                            <span className='ml-3'><LiaExchangeAltSolid /></span>
                        </Link>

                        {/* <Button
                            variant="primary"
                            className='w-2/5 rounded-full'
                            disabled={isPending}
                            isLoading={isPending}
                            onClick={async () => {
                                startTransition(() => {

                                })
                            }}
                        >
                            Trade <span className='ml-3'><LiaExchangeAltSolid /></span>
                        </Button> */}
                    </div>
                    <h1 className='text-sm text-gray-700 my-3'>Category: <span className='text-gray-500'>{formattedCategory(post.category)}</span></h1>
                </div>
            </div>
            <div>
                <PostTabs post={post} />
            </div>
        </>
    )
}
