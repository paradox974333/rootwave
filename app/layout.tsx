"use client"; // This makes it a Client Component

import type React from "react";
// import type { Metadata } from "next"; // Cannot export metadata from client component
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/toaster";
import { ChatbotTrigger } from "@/components/chatbot-trigger";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

// METADATA CANNOT BE EXPORTED FROM HERE IF "use client" IS USED
// export const metadata: Metadata = { ... }; // REMOVE THIS EXPORT

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldShowChatbot = !pathname.startsWith('/free-samples');

  return (
    <html lang="en">
      <head>
        {/*
          You can still have static <meta> tags directly in <head> here.
          The `export const metadata` object is for Next.js to automatically
          generate and optimize <meta> tags.
        */}
        <link rel="canonical" href="https://rootwave.org" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#16a34a" />
        {/*
          If you need to set title, description dynamically or per page,
          do it in the respective page.tsx files using `export const metadata`.
          For example, in app/page.tsx:
          export const metadata = {
            title: "Rootwave - Home",
            description: "Your homepage description..."
          }
        */}
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster />
          {shouldShowChatbot && <ChatbotTrigger />}
        </CartProvider>
      </body>
    </html>
  );
}