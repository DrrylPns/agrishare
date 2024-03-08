import Image from 'next/image'
import React from 'react'
import HeaderBg from './images/Header.jpg';
import Logo from './images/Logo.png';
import { Button } from '@/components/ui/button';
import { BsArrowRight } from 'react-icons/bs';

function Header() {
  return (
    <div className='relative'>
        <header className={`relative font-poppins w-full text-center tracking-widest`}>
            <div className=' z-50 min-h-dvh'>
                <Image 
                    src={Logo}
                    alt='Logo Image'
                    className='relative z-50 h-[50vh] md:h-[80vh] '
                    />
                <div className='relative mt-[-4rem] md:mt-[-8rem]'>
                    <h1 className='relative z-50 text-white text-lg font-poppins font-medium '>Share to care, Trade to aid.</h1>
                    <Button variant={"default"} className='relative mt-10 z-50 rounded-2xl px-5 text-[0.7rem]'>Start Now!<span className='ml-2 text-lg'><BsArrowRight /></span></Button>
                </div>
            </div>
        </header>
        <div className='absolute z-10 top-0 w-full h-dvh bg-gradient-to-r from-transparent to-transparent-black'>

        </div>
        <div className='absolute top-0 z-0 w-full mx-auto '>
          <Image 
            src={HeaderBg}
            alt='Header Image'
            className='h-dvh z-0'
          />
        </div>
    </div>
  )
}

export default Header