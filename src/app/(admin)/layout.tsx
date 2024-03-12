import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/lib/styles/globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";

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
            <body className={`${inter.className} overflow-x-hidden bg-gray-100`}>
                <Providers>
                    <Sidebar />
                    <div className="md:ml-[256px] md:mt-[62px] md:mr-[30px] mx-5">
                        {children}
                    </div>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}