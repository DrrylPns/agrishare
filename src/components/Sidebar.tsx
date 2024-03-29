"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Cog, LayoutDashboard, LogOutIcon, Settings, TicketIcon, UserPlus, UsersIcon, TreePine } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiRefreshCw } from 'react-icons/fi'


export const Sidebar = () => {
    const pathname = usePathname()
    const url = pathname.replace("/", "")


    return (
        <div>
            {/* MOBILE NAV */}
            <div className='w-full border-b shadow-md'>
                <div className='grid grid-cols-5 p-3 items-center justify-center text-center md:hidden'>
                    <Link href="dashboard" className={`mx-auto text-neutral-500 p-1 rounded-lg ${url === "dashboard" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                        <LayoutDashboard />
                    </Link>
                    <Link href="users" className={`mx-auto text-neutral-500 p-1 rounded-lg ${url === "users" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                        <UsersIcon />
                    </Link>
                    <Link href="add-accounts" className={`mx-auto text-neutral-500 p-1 rounded-lg ${url === "add-accounts" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                        <UserPlus />
                    </Link>
                    <Link href="transactions" className={`mx-auto text-neutral-500 p-1 rounded-lg ${url === "transactions" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                        <TicketIcon />
                    </Link>
                    <Link href="add-agrichange" className={`mx-auto text-neutral-500 p-1 rounded-lg ${url === "add-agrichange" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                        <FiRefreshCw />
                    </Link>

                    <Link href="add-agriquest" className={`mx-auto text-neutral-500 p-1 rounded-lg ${url === "add-agriquest" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                        <TreePine />
                    </Link>
                    <Popover>
                        <PopoverTrigger asChild className={`mx-auto text-neutral-500 rounded-lg ${url === "adminSettings" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white p-1 w-[29px] h-[29px]" : "hover:bg-gray-200 text-gray-500"}`}>
                            <Settings />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className='space-y-2'>
                                <Link href="adminSettings" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "adminSettings" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                                    <Cog className='w-4 h-4' />
                                    <span className='text-sm font-medium'>Settings</span>
                                </Link>

                                <div className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-500`}>
                                    <LogOutIcon className='w-4 h-4' />
                                    <span className='text-sm font-medium'>Log Out</span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* DESKTOP NAV */}
            <div className="flex max-md:hidden">
                <aside className="fixed top-0 h-screen w-56 bg-white text-gray-800 p-4">
                    <div className="flex items-center mb-4 space-x-1">
                        <h1 className="text-lg text-[#00B207] font-bold">ADMIN</h1>
                    </div>
                    <nav className="space-y-2">
                        <Link href="dashboard" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "dashboard" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link href="users" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "users" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <UsersIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Users</span>
                        </Link>
                        <Link href="add-accounts" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "add-accounts" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm font-medium">Add Accounts</span>
                        </Link>
                        <Link href="transactions" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "transactions" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <TicketIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">History</span>
                        </Link>
                        <Link href="add-agrichange" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "add-agrichange" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <FiRefreshCw className='w-4 h-4' />
                            <span className="text-sm font-medium">Agrichange</span>
                        </Link>

                        <Link href="add-agriquest" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "add-agriquest" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <TreePine className="w-4 h-4" />
                            <span className="text-sm font-medium">Agriquest</span>
                        </Link>

                    </nav>
                    <div className='space-y-2 absolute bottom-10 w-[85%]'>
                        <Link href="adminSettings" className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg ${url === "adminSettings" ? "bg-[#00B207] hover:bg-[#00B207]/80 text-white" : "hover:bg-gray-200 text-gray-500"}`}>
                            <Cog className='w-4 h-4' />
                            <span className='text-sm font-medium'>Settings</span>
                        </Link>

                        <div className={`w-full flex items-center space-x-2 py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-200 text-gray-500`}>
                            <LogOutIcon className='w-4 h-4' />
                            <span className='text-sm font-medium'>Log Out</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
