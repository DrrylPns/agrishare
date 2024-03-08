"use client";
import { Logo } from '@/components/logo';
import { buttonVariants } from '@/components/ui/button';
import { UserAccountAvatar } from '@/components/user-account-avatar';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'
import { BiMenu } from 'react-icons/bi';
import { SearchInput } from './SearchInput';
import { CiBellOn, CiHeart } from 'react-icons/ci';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const [visible, setVisible] = useState(true);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  return (
    <nav
    className={`bg-white fixed flex justify-around items-center z-50 top-0 left-0 w-full h-[70px] px-4 sm:px-20 py-4 shadow transition-color duration-500 ${visible ? "" : "opacity-0"
        }`}
>
    <div className="w-1/3 h-14 border border-black">
        <Logo />
    </div>
    <div>
        <SearchInput/>
    </div>
    {status === "unauthenticated" ? (
        <div className="flex flex-row gap-3 max-sm:hidden">
            <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "primary" }), "p-3 px-8 rounded-full")}
            >
                Sign In
            </Link>

            <Link
                href="/sign-up"
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
            <CiBellOn />
            <UserAccountAvatar />
        </div>
    ) : status === "loading" ? (
        <div>Loading...</div>
    ) : (<></>)}



    {/* Mobile dropdown menu */}
    <button
        className="sm:hidden text-black text-[2rem]"
        onClick={toggleMobileMenu}
    >
        <BiMenu />
    </button>

    {isMobileMenuOpen && (
        <div className="sm:hidden fixed left-0 w-full top-[70px] h-[40%] flex items-center justify-center shadow">
            <ul className="text-black text-[16px] text-center">
                <li
                    className=""
                    onClick={() => {
                        toggleMobileMenu();
                    }}
                >
                    Home
                </li>
                <li
                    className="my-5"
                    onClick={() => {
                        toggleMobileMenu();
                    }}
                >
                    About Us
                </li>
                <li
                    className="my-5"
                    onClick={() => {
                        toggleMobileMenu();
                    }}
                >
                    News
                </li>
                <li
                    className="my-5"
                    onClick={() => {
                        toggleMobileMenu();
                    }}
                >
                    Contact Us
                </li>
            </ul>
        </div>
    )}

</nav>
  )
}

export default Navbar