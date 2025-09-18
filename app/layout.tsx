"use client"; // This makes it a Client Component

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global styles
import { CartProvider } from "@/contexts/cart-context"; // Your Cart Context Provider
import { Toaster } from "@/components/ui/toaster"; // Your Toaster component
import { ChatbotTrigger } from "@/components/chatbot-trigger"; // Your ChatbotTrigger component
import { usePathname } from 'next/navigation'; // Hook to get the current path

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current client-side path
  // Condition to show the chatbot: show if the path does NOT start with '/free-samples'
  const shouldShowChatbot = !pathname.startsWith('/free-samples');

  return (
    <html lang="en">
      <head>
        {/* REMOVED BOTH TITLE AND DESCRIPTION - Let individual pages handle all meta tags */}
        <meta
          name="keywords"
          content="bulk rice straws, eco-friendly straws, biodegradable straws, sustainable straws, plastic alternative, B2B straws, restaurant supplies, cafe supplies, hotel supplies, wholesale straws"
        />
        <meta name="generator" content="v0.dev" />

        {/* Other essential head tags */}
        <link rel="canonical" href="https://rootwave.org" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#16a34a" />
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
