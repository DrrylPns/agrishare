import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/lib/styles/globals.css";
import Providers from "@/components/providers";
import Navbar from "./_components/Navbar";
import SideNav from "./_components/SideNav";

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
            <body className={`${inter.className}`}>
                <Providers>
                    <Navbar/>
                 
                    <div className="flex w-full min-h-dvh mt-[7%] gap-5 mx-5 transition-all duration-500 ease-in-out">
                        <div className="w-[25%]">
                            <SideNav/>
                        </div>
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}