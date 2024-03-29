"use client";
import { Logo } from '@/components/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { UserAccountAvatar } from '@/components/user-account-avatar';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'
import { BiMenu, BiSolidDonateHeart } from 'react-icons/bi';
import { SearchInput } from './SearchInput';
import { CiBellOn, CiHeart, CiLogout, CiSettings } from 'react-icons/ci';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { usePathname } from 'next/navigation';
import { MdDashboard, MdHistory } from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';
import { TbClover2 } from 'react-icons/tb';
import { FaRegFileAlt } from 'react-icons/fa';
import { UserNotifs } from './UserNotifs';


function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const [visible, setVisible] = useState(true);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const pathname = usePathname()
    return (
        <nav
            className={`bg-white fixed flex justify-around items-center z-50 top-0 left-0 w-full h-[70px] px-4 sm:px-20 py-4 shadow transition-color duration-500 ${visible ? "" : "opacity-0"
                }`}
        >
            <div className='hidden md:block'>
                <Logo />
            </div>

            <div>
                <SearchInput />
            </div>

            {status === "unauthenticated" ? (
                <div className="flex flex-row gap-3 max-sm:hidden">
                    <Link
                        href="/login"
                        className={cn(buttonVariants({ variant: "primary" }), "p-3 px-8 rounded-full")}
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/register"
                        className={cn(buttonVariants({ variant: "primary" }), "p-3 px-8 rounded-full")}
                    >
                        Sign Up
                    </Link>
                </div>
            ) : status === "authenticated" ? (
                <div className="max-sm:hidden flex items-center text-3xl gap-3 ">
                    <Link
                        href={'/agrineeds'}
                        className='hover:scale-105'
                    >
                        <CiHeart />

                    </Link>
                    <UserNotifs />
                    <UserAccountAvatar />
                </div>
            ) : status === "loading" ? (
                <div className='hidden md:block'>Loading...</div>
            ) : (<></>)}



            {/* Mobile dropdown menu */}
            <Sheet>
                <SheetTrigger className='md:hidden block'>
                    <BiMenu className='text-[32px]' />
                </SheetTrigger>
                <SheetContent className=''>
                    <SheetHeader>
                        <SheetTitle className='w-full flex justify-center items-center'>
                            <Logo />
                        </SheetTitle>
                        <SheetDescription>
                            <div className='text-gray-500 transition-all duration-700 ease-in-out mt-3'>
                                <Link
                                    href={'/agrifeed'}
                                    className={`link ${pathname === '/agrifeed' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                                >
                                    <span><MdDashboard /></span>
                                    <h1>Agrifeed</h1>

                                </Link>
                                <Link
                                    href={'/categories'}
                                    className={`link ${pathname === '/categories' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                                >
                                    <span><GiHamburgerMenu /></span>
                                    <h1>Categories</h1>
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
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>





        </nav>
    )
}

export default Navbar