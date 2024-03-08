import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/lib/styles/globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { AuthFooter } from "./_components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrishare",
  description: "Share to care, Trade to aid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          {children}
          <AuthFooter />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
