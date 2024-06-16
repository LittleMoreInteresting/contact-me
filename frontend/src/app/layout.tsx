import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { headers } from 'next/headers'
import "./globals.css";
import {Providers} from "@/app/providers";
import {
  cookieToInitialState,
} from 'wagmi'
 
import AppHeader from '@/app/components/AppHeader'

import Footer from '@/app/components/Footer'
import { wagmiConfig } from "@/app/wagmiConfig"

const inter = Inter({ subsets: ["latin"] });
import { Toaster } from 'sonner';
export const metadata: Metadata = {
  title: "Contrct Me NFT",
  description: "Contrct Me NFT app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get('cookie')
)
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers  initialState={initialState}>
        <div className="flex flex-col items-center justify-between p-15 h-screen">
      <AppHeader />
      <div className="container">
      {children}
      </div>
      <Footer />
    </div>
       
          
          <Toaster position="bottom-right"  expand={true}
                     toastOptions={{
                         classNames: {
                             error: 'bg-red-400',
                             success: 'bg-green-400',
                             warning: 'bg-yellow-400',
                             info: 'bg-blue-400',
                         },
                     }}
          />
        </Providers>
      </body>
    </html>
  );
}
