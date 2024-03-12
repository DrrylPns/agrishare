import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AgrishareLogo from '@/../public/images/Logo.png'

type LogoProps = {
    isAuth?: boolean;
}

export const Logo = ({ isAuth }: LogoProps) => {
    return (
        <Link href="/" className=''>
            <Image src={AgrishareLogo} alt='Agrishare Logo' className={`w-24 h-16`} />
        </Link>
    )
}
