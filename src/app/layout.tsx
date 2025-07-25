import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import Head from 'next/head'; 
import Image from "next/image"
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akhshad Gorle",
  description: "Design that looks good, works better, and feels unforgettable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
  
     <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" sizes="32x32" href="/AG.png" />
      </Head>
       <body className={bricolage.className}>
        <Header />
        {children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
