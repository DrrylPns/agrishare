import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AgrishareLogo from '@/../public/images/Logo.png'

export const Logo = () => {
    return (
        <Link href="/" className='flex justify-center w-full h-full items-center'>
            <Image src={AgrishareLogo} alt='Agrishare Logo' className='w-1/2 h-14'/>
        </Link>
    )
}
