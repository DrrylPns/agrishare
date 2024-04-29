import Image from 'next/image'
import React from 'react'
import AgriShare from './images/AgriShare.png'
import Link from 'next/link'

function Footer() {
    return (
        <footer className='flex flex-col justify-between h-full md:text-sm bg-[#1A1A1A] px-5 sm:px-32'>
            <div className='flex w-full gap-x-10 flex-col lg:flex-row items-center'>
                <div className='md:w-[30%] text-white'>
                    <Image
                        src={AgriShare}
                        alt='AgriShare'
                        className='md:mt-[-3rem]'
                    />
                    {/* <p className='text-[#808080] md:mt-[-4rem] mb-4'>Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.</p> */}
                    {/* <span>(219) 555-0114</span><span> or </span><span>Proxy@gmail.com</span> */}
                </div>
                <div className='w-[70%] grid grid-cols-2 md:grid-cols-4 mt-10 text-white mb-10 gap-6'>
                    <div className='flex flex-col gap-3'>
                        <h1>Account</h1>
                        <Link href={'/settings'} className='text-[#808080] text-xs'>My Account</Link>
                        <Link href={'/history'} className='text-[#808080] text-xs'>Trade History</Link>
                        <Link href={'/agrineeds'} className='text-[#808080] text-xs'>Wishlist</Link>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1>Helps</h1>
                        <Link href={'/'} className='text-[#808080] text-xs'>Contact</Link>
                        <Link href={'/'} className='text-[#808080] text-xs'>Faqs</Link>
                        <Link href={'/terms-and-condition'} className='text-[#808080] text-xs'>Terms & Condition</Link>
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
        // <footer className="bg-[#1a1a1a] text-white p-6">
        //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        //         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-gray-700">
        //             <div>
        //                 <h5 className="uppercase font-bold mb-2.5">AGRI</h5>
        //                 <p className="text-sm mb-4">
        //                     Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna consequat nec.
        //                 </p>
        //                 <p className="text-sm">(219) 555-0114</p>
        //                 <p className="text-sm">Proxy@gmail.com</p>
        //             </div>
        //             <div>
        //                 <h5 className="uppercase font-bold mb-2.5">My Account</h5>
        //                 <ul className="space-y-1 text-sm">
        //                     <li>My Account</li>
        //                     <li>Trade History</li>
        //                     <li>Wishlist</li>
        //                 </ul>
        //             </div>
        //             <div>
        //                 <h5 className="uppercase font-bold mb-2.5">Helps</h5>
        //                 <ul className="space-y-1 text-sm">
        //                     <li>Contact</li>
        //                     <li>Faqs</li>
        //                     <li>Terms & Condition</li>
        //                     <li>Privacy Policy</li>
        //                 </ul>
        //             </div>
        //             <div>
        //                 <h5 className="uppercase font-bold mb-2.5">Categories</h5>
        //                 <ul className="space-y-1 text-sm">
        //                     <li>Fruit & Vegetables</li>
        //                     <li>Fish</li>
        //                     <li>Tools</li>
        //                     <li>Seeds</li>
        //                 </ul>
        //             </div>
        //         </div>
        //         <div className="py-4 text-sm text-center text-gray-500">AGRISHARE © 2023. All Rights Reserved</div>
        //     </div>
        // </footer>
    )
}

export default Footer