import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/lib/styles/globals.css";
import Navbar from "./_components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Agrishare",
    description: "Agrishare:Where trading and donation happens!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <Navbar />
                {children}
            </body>
        </html>
    );
}