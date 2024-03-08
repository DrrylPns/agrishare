import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AgrishareLogo from '@/../public/images/Logo.png'

export const Logo = () => {
    return (
        <div className='flex flex-row items-center'>
            <Link href="/">
                <Image 
                    src={AgrishareLogo} 
                    alt='Agrishare Logo'
                    className='w-full'
                />
            </Link>
        </div>
    )
}
