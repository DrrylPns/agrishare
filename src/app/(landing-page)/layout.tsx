import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/lib/styles/globals.css";
import Navbar from "./_components/Navbar";
import Providers from "@/components/providers";
import { auth } from "../../../auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Agrishare",
    description: "Share to care, Trade to aid",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
            <body className={`${inter.className} overflow-x-hidden`}>
                <Providers>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}