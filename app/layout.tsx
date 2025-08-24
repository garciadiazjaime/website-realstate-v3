import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google'

import "./globals.css";

import Menu from '@/app/shared/components/Menu';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redfin Selling Home Visualizer",
  description: "UI Tool to visualize Redfin data for selling homes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{
          fontFamily: 'Arial, sans-serif',
          margin: '0 auto',
          padding: '16px',
          backgroundColor: '#f9f9f9',
        }}>
          <GoogleTagManager gtmId="G-8PLPTP51Z6" />
          <Menu />
          {children}
        </div>
      </body>
    </html>
  );
}
