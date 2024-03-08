import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AgrishareLogo from '@/../public/images/Logo.png'

type LogoProps = {
    isAuth?: boolean;
}

export const Logo = ({ isAuth }: LogoProps) => {
    return (
        <Link href="/" className='flex justify-center w-full h-full items-center flex-col'>
            <Image src={AgrishareLogo} alt='Agrishare Logo' className={`${!isAuth && "w-1/2 h-14"}`} />
        </Link>
    )
}
