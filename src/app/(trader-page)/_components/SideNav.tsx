'use client';
import { Loading } from '@/components/Loading';
import { LogoutButton } from '@/components/LogoutButton';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { CiLogout, CiSettings } from 'react-icons/ci';
import { FaRegFileAlt } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoWaterOutline } from "react-icons/io5";
import { MdDashboard, MdHistory } from 'react-icons/md';
import { TbClover2 } from "react-icons/tb";

function SideNav() {
    const pathname = usePathname();
    const { data: session, status } = useSession()

    if (status === "loading") return <Loading />

    return (
        <div className={`w-[25%] hidden ${pathname.startsWith("/history") || pathname.startsWith("/message") ? "hidden" : "md:block"}`}>
            <div className={` ${pathname === '/agrifeed/'} border border-gray-300 shadow-sm drop-shadow-sm bg-white`}>
                <h1 className='mx-5 py-2 mt-5 text-gray-500 text-xl font-poppins font-extralight '>Navigation</h1>
                <div className='text-gray-500 transition-all duration-700 ease-in-out mt-3'>
                    {session?.user.role === 'DONATOR' ? (
                        <></>
                    ) : (
                        <>
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
                        </>
                    )}
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
                        href={'/agrimaps'}
                        className={`link ${pathname === '/agrimaps' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                    >
                        <span><FaRegFileAlt /></span>
                        <h1>Agrimaps</h1>
                    </Link>
                    <Link
                        href={'/agrichange'}
                        className={`link ${pathname === '/agrichange' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                    >
                        <span><FiRefreshCw /></span>
                        <h1>Agrichange</h1>

                    </Link>
                    {session?.user.role === 'DONATOR' ? (
                        <></>
                    ) : (
                        <Link
                            href={'/agriquest'}
                            className={`link ${pathname === '/agriquest' ? "border-l-2 border-primary-green bg-[#e6e6e671]" : ""} flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3`}
                        >
                            <span><IoWaterOutline /></span>
                            <h1>Agriquest</h1>
                        </Link>
                    )}
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
                    {/* {status === 'loading' && (
                        <></>
                    )} */}
                    {status === 'authenticated' && (
                        <LogoutButton>
                            <Button
                                variant={'outline'}
                                className='flex gap-3 w-full items-center justify-center hover:bg-[#e6e6e671] py-3'
                            >
                                <span><CiLogout /></span>
                                <h1>Logout</h1>
                            </Button>
                        </LogoutButton>
                    )}

                </div>

            </div>
        </div>
    )
}

export default SideNav