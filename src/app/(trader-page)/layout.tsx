import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/lib/styles/globals.css";
import Providers from "@/components/providers";
import Navbar from "./_components/Navbar";
import SideNav from "./_components/SideNav";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Agrishare",
    description: "Share to care, Trade to aid",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} overflow-x-hidden`}>
                <Providers>
                    <Suspense fallback={<Loading />}>
                        <Navbar />
                        <div className="flex justify-around w-full min-h-dvh mt-[7%] transition-all duration-500 ease-in-out">

                            <SideNav />

                            {children}
                        </div>
                        <Toaster />
                    </Suspense>
                </Providers>
            </body>
        </html>
    );
}