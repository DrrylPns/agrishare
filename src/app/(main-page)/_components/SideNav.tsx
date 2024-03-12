'use client';
import Link from 'next/link';
import React from 'react'
import { MdDashboard, MdHistory } from 'react-icons/md';
import { GiHamburgerMenu } from "react-icons/gi";
import { BiSolidDonateHeart } from 'react-icons/bi';
import { TbClover2 } from "react-icons/tb";
import { CiHeart, CiLogout, CiSettings } from 'react-icons/ci';
import { FaRegFileAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

function SideNav() {
    const pathname = usePathname();
    const { data: session, status } = useSession()
    return (
        <div className={` ${pathname === '/agrifeed/'} border border-gray-300 shadow-sm drop-shadow-sm bg-white`}>
            <h1 className='mx-5 py-2 mt-5 text-gray-500 text-xl font-poppins font-extralight '>Navigation</h1>
            <div className='text-gray-500 transition-all duration-700 ease-in-out mt-3'>
                <Link
                    href={'/agrifeed'}
                    className={`link ${pathname === '/agrifeed' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><MdDashboard /></span>
                    <h1>Agrifeed</h1>

                </Link>
                <Link
                    href={'/catergories'}
                    className={`link ${pathname === '/catergories' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><GiHamburgerMenu /></span>
                    <h1>Catergories</h1>
                </Link>
                <Link
                    href={'/donation'}
                    className={`link ${pathname === '/donation' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><BiSolidDonateHeart /></span>
                    <h1>Donation</h1>

                </Link>
                <Link
                    href={'/points'}
                    className={`link ${pathname === '/points' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><TbClover2 /></span>
                    <h1>Points</h1>

                </Link>
                <Link
                    href={'/agrineeds'}
                    className={`link ${pathname === '/agrineeds' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><CiHeart /></span>
                    <h1>Agrineeds</h1>
                </Link>
                <Link
                    href={'/news'}
                    className={`link ${pathname === '/news' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><FaRegFileAlt /></span>
                    <h1>News</h1>
                </Link>
                <Link
                    href={'/history'}
                    className={`link ${pathname === '/history' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><MdHistory /></span>
                    <h1>History</h1>
                </Link>
                <Link
                    href={'/settings'}
                    className={`link ${pathname === '/settings' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                >
                    <span><CiSettings /></span>
                    <h1>Settings</h1>
                </Link>
                {status === 'loading' && (
                    <></>
                )}
                {status === 'authenticated' && (
                    <Button
                        onClick={() => { signOut() }}
                        variant={'outline'}
                        className='flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3'
                    >
                        <span><CiLogout /></span>
                        <h1>Logout</h1>
                    </Button>
                )}

            </div>

        </div>
    )
}

export default SideNav