"use client";

import { signOut, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const UserAccountAvatar = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const isImageNull = session?.user.image === null

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 rounded-full border-2 border-gray-200" size="icon" variant="outline">
                        <Avatar>
                            <AvatarImage
                                className='cursor-pointer'
                                src={`${isImageNull ? "/avatar-placeholder.jpg" : session?.user.image}`}
                                width={25}
                                height={25}
                                alt='User Profile' />
                            <AvatarFallback>User Profile</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    <DropdownMenuItem className="flex flex-col text-start justify-start items-start">
                        {session?.user.name && (
                            <p className="font-medium text-[15px]">
                                {session?.user.name}
                            </p>
                        )}
                        {session?.user.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {session?.user.email}
                            </p>
                        )}
                    </DropdownMenuItem>


                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                        <Link href="/settings">My Account</Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* <div className="md:block hidden">
                <div
                    onClick={toggleOpen}
                    className="flex flex-row items-center rounded-full cursor-pointer hover:shadow-md transition"
                >
                    <div className="hidden md:block max-md:block">
                        <Avatar>
                            <AvatarImage
                                className='cursor-pointer'
                                src={`${isImageNull ? "/avatar-placeholder.jpg" : session?.user.image}`}
                                width={25}
                                height={25}
                                alt='User Profile' />
                            <AvatarFallback>User Profile</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div> */}

            {/* {isOpen && (
                <div className="">
                    <div className="flex flex-col space-y-1 leading-none">
                        {session ? (
                            <>
                                {session?.user.name && (
                                    <p className="font-medium text-[15px]">
                                        {session?.user.name}
                                    </p>
                                )}
                                {session?.user.email && (
                                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                                        {session?.user.email}
                                    </p>
                                )}

                                <Separator />

                                <div className="cursor-pointer">
                                    <Link href={"/discussion/profile"}>
                                        <div className="py-3 hover:bg-neutral-100 dark:hover:text-black transition rounded-md px-2">
                                            Test
                                        </div>
                                    </Link>
                                    <Link href={"/order-status"}>
                                        <div className="py-3 hover:bg-neutral-100 dark:hover:text-black transition rounded-md px-2">
                                            Test
                                        </div>
                                    </Link>
                                    <Link href={"/termsPolicy"} className="">
                                        <div className="py-3 hover:bg-neutral-100 dark:hover:text-black transition rounded-md px-2">
                                            Test
                                        </div>
                                    </Link>
                                    <Link href={"/termsPolicy"} className="md:hidden block">
                                        <div className="py-3 hover:bg-neutral-100 dark:hover:text-black transition rounded-md px-2">
                                            Test
                                        </div>
                                    </Link>
                                    <Link href={"/settings"} className="md:hidden block">
                                        <div className="py-3 hover:bg-neutral-100 dark:hover:text-black transition rounded-md px-2">
                                            Test
                                        </div>
                                    </Link>
                                    <div className="py-3 hover:bg-neutral-100 dark:hover:text-black transition rounded-md px-2">
                                        Test
                                    </div>
                                    <Separator />

                                    <div onClick={() => signOut()}>Log Out</div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )} */}
        </>
    )
}
