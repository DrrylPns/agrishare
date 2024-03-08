import { PageNF } from "@/components/not-found";
import Providers from "@/components/providers";
import { getAuthSession } from "@/lib/auth";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/lib/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrishare",
  description: "Share to care, Trade to aid",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  if (session?.user === null) return <div>Loading...</div>

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          {!session?.user ? (
            <>
              <PageNF />
            </>
          ) : (
            <>
              {children}
              <Toaster />
            </>
          )}
        </Providers>
      </body>
    </html>
  )
}
