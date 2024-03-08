import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'

export const PageNF = () => {
    return (
        <div className='h-screen w-full flex flex-col items-center justify-center space-y-3'>
            <Image alt='page not found' src={"/notfound.svg"} width={200} height={200} />
            <div className=''>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Page Not Found</h1>
            </div>

            <div className='text-neutral-500 text-center'>
                The page you are looking for does not exist. Users must be logged in to continue. But you can click the button below to go back to the site.
            </div>

            <Link href={"/sign-in"} className={cn(buttonVariants({
                variant: "primary"
            }))}>
                Go Back
            </Link>
        </div>
    )
}
