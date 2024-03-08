import Providers from "@/components/providers";
import { getAuthSession } from "@/lib/auth";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/lib/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrishare - Terms and Conditions",
  description: "Share to care, Trade to aid",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
