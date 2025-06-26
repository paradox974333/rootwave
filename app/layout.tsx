"use client"; // This makes it a Client Component

import type React from "react";
// Metadata object cannot be exported from a Client Component, so the 'type Metadata' import might not be strictly needed here
// unless used for other purposes within this file (which it isn't in this version).
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global styles
import { CartProvider } from "@/contexts/cart-context"; // Your Cart Context Provider
import { Toaster } from "@/components/ui/toaster"; // Your Toaster component
import { ChatbotTrigger } from "@/components/chatbot-trigger"; // Your ChatbotTrigger component
import { usePathname } from 'next/navigation'; // Hook to get the current path

const inter = Inter({ subsets: ["latin"] });

// The 'export const metadata' object has been removed from here to avoid errors
// as this is now a Client Component.
// Metadata should be defined in individual page.tsx files (Server Components)
// or static meta tags can be placed directly in the <head> below.

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
        {/* Static default meta tags. These can be overridden by specific metadata in page.tsx files. */}
        <title>Rootwave - Bulk Eco-Friendly Rice Straws | B2B Sustainable Solutions</title>
        <meta
          name="description"
          content="Leading bulk supplier of eco-friendly rice straws for restaurants, cafes, hotels. Minimum order 10,000 straws. Biodegradable, edible, sustainable alternative to plastic straws."
        />
        <meta
          name="keywords"
          content="bulk rice straws, eco-friendly straws, biodegradable straws, sustainable straws, plastic alternative, B2B straws, restaurant supplies, cafe supplies, hotel supplies, wholesale straws"
        />
        <meta name="generator" content="v0.dev" />

        {/* Other essential head tags */}
        <link rel="canonical" href="https://rootwave.org" />
        <link rel="icon" href="/favicon.ico" /> {/* Ensure favicon.ico is in your /public folder */}
        <meta name="theme-color" content="#16a34a" />

        {/*
          For more specific SEO per page (title, description, Open Graph, etc.),
          use `export const metadata = { ... }` in your `app/some-page/page.tsx` files.
        */}
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children} {/* This is where your page content will be rendered */}
          <Toaster />
          {/* Conditionally render the ChatbotTrigger */}
          {shouldShowChatbot && <ChatbotTrigger />}
        </CartProvider>
      </body>
    </html>
  );
}