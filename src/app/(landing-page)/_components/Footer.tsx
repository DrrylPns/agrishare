import Image from 'next/image'
import React from 'react'
import AgriShare from './images/AgriShare.png'
import Link from 'next/link'

function Footer() {
  return (
    <footer className='flex flex-col justify-between h-[50vh] text-[0.3rem] md:text-sm bg-[#1A1A1A] px-5 sm:px-32'>
        <div className='flex w-full gap-x-10 '>
            <div className='w-[30%] text-white'>
                <Image
                    src={AgriShare}
                    alt='AgriShare'
                    className='md:mt-[-3rem]'
                />
                <p className='text-[#808080] md:mt-[-4rem] mb-4'>Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.</p>
                <span>(219) 555-0114</span><span> or </span><span>Proxy@gmail.com</span>
            </div>
            <div className='w-[70%] flex justify-between items-start mt-10 text-white'>
                <div className='flex flex-col gap-3'>
                    <h1>My Account</h1>
                    <Link href={'/'} className='text-[#808080] text-xs'>My Account</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Trade History</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Wishlist</Link>
                </div>
                <div className='flex flex-col gap-3'>
                    <h1>Helps</h1>
                    <Link href={'/'} className='text-[#808080] text-xs'>Contact</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Faqs</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Terms & Condition</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Privacy Policy</Link>
                </div>
                <div className='flex flex-col gap-3'>
                    <h1>Proxy</h1>
                    <Link href={'/'} className='text-[#808080] text-xs'>About</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Form</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Product</Link>
                </div>
                <div className='flex flex-col gap-3'>
                    <h1>Categories</h1>
                    <Link href={'/'} className='text-[#808080] text-xs'>Fruits & Vegetables</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Fish</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Tools</Link>
                    <Link href={'/'} className='text-[#808080] text-xs'>Seeds</Link>
                </div>
                
            </div>
        </div>
        <div className='w-full text-center text-[#808080] border-t-2 border-t-[#808080] mt-auto'>
            <h1>AGRISHARE © 2024 All Rights Reserved</h1>
        </div>
    </footer>
  )
}

export default Footer