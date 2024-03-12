"use client";

import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAccountAvatar } from "@/components/user-account-avatar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator";


const Navbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setIsOpenChange] = useState(false);
    const { data: session, status } = useSession()

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScrollPos, visible]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav
            className={` bg-white fixed flex justify-around items-center z-50 top-0 left-0 w-full h-[70px] px-4 sm:px-20 py-4 shadow transition-color duration-500 ${visible ? "" : "opacity-0"
                }`}
        >

            <Logo />

            <div className="flex flex-row justify-center w-full max-lg:hidden space-x-16">
                <Button
                    onClick={() => scrollToSection("home")}
                    className="text-[16px] font-normal"
                    variant="ghost"
                >
                    Home
                </Button>
                <Button
                    onClick={() => scrollToSection("aboutus")}
                    className="text-[16px] font-normal"
                    variant="ghost"
                >
                    About Us
                </Button>
                <Button
                    onClick={() => scrollToSection("news")}
                    className="text-[16px] font-normal"
                    variant="ghost"
                >
                    News
                </Button>
                <Button
                    onClick={() => scrollToSection("contactus")}
                    className="text-[16px] font-normal"
                    variant="ghost"
                >
                    Contact Us
                </Button>
            </div>

            {status === "unauthenticated" ? (
                <div className="flex flex-row gap-3 max-lg:hidden">
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
                <div className="max-lg:hidden">
                    <UserAccountAvatar />
                </div>
            ) : status === "loading" ? (
                <div className="max-lg:hidden">Loading...</div>
            ) : (<></>)}

            <Popover open={open} onOpenChange={setIsOpenChange}>
                <PopoverTrigger className="lg:hidden block">
                    <BiMenu className="text-[32px]" onClick={() => setIsOpenChange(true)} />
                </PopoverTrigger>

                {/* Mobile dropdown menu */}

                <PopoverContent className="flex flex-col items-start justify-start lg:hidden">
                    <div className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                        onClick={() => {
                            scrollToSection("home")
                            setIsOpenChange(false)
                        }}
                    >Home</div>
                    <div className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                        onClick={() => {
                            scrollToSection("aboutus")
                            setIsOpenChange(false)
                        }}
                    >About Us</div>
                    <div className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                        onClick={() => {
                            scrollToSection("news")
                            setIsOpenChange(false)
                        }}
                    >News</div>
                    <div className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                        onClick={() => {
                            scrollToSection("contactus")
                            setIsOpenChange(false)
                        }}
                    >Contact Us</div>

                    <Separator />

                    {status === "unauthenticated" ? (
                        <div className="grid grid-cols-2 mt-5 gap-5 justify-center items-center">
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
                        <div className="w-full flex justify-center items-center mt-5">
                            <UserAccountAvatar />
                        </div>
                    ) : status === "loading" ? (
                        <div className="w-full flex justify-center items-center mt-5">Loading...</div>
                    ) : (<></>)}
                </PopoverContent >
            </Popover >



        </nav >
    )
}

export default Navbar