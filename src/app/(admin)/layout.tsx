import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/lib/styles/globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import { auth } from "../../../auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

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
    const session = await auth()

    const user = await prisma.user.findUnique({
        where: {
            id: session?.user.id
        }
    })

    if (user?.role !== "ADMIN") redirect("/agrifeed")

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