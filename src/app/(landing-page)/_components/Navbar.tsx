"use client";

import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { UserAccountAvatar } from "@/components/user-account-avatar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";

const Navbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            className={`bg-white fixed flex justify-around items-center z-50 top-0 left-0 w-full h-[70px] px-4 sm:px-20 py-4 shadow transition-color duration-500 ${visible ? "" : "opacity-0"
                }`}
        >
            <div>
                <Logo />
            </div>

            <div className="flex flex-row gap-7 justify-evenly max-sm:hidden">
                <button
                    onClick={() => scrollToSection("home")}
                    className="text-[16px] font-normal"
                >
                    Home
                </button>
                <button
                    onClick={() => scrollToSection("aboutus")}
                    className="text-[16px] font-normal"
                >
                    About Us
                </button>
                <button
                    onClick={() => scrollToSection("news")}
                    className="text-[16px] font-normal"
                >
                    News
                </button>
                <button
                    onClick={() => scrollToSection("contactus")}
                    className="text-[16px] font-normal"
                >
                    Contact Us
                </button>
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
                <div className="max-sm:hidden">
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
                                scrollToSection("home");
                                toggleMobileMenu();
                            }}
                        >
                            Home
                        </li>
                        <li
                            className="my-5"
                            onClick={() => {
                                scrollToSection("aboutus");
                                toggleMobileMenu();
                            }}
                        >
                            About Us
                        </li>
                        <li
                            className="my-5"
                            onClick={() => {
                                scrollToSection("news");
                                toggleMobileMenu();
                            }}
                        >
                            News
                        </li>
                        <li
                            className="my-5"
                            onClick={() => {
                                scrollToSection("contactus");
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