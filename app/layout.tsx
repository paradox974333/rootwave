import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { ChatbotTrigger } from "@/components/chatbot-trigger"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rootwave - Bulk Eco-Friendly Rice Straws | B2B Sustainable Solutions",
  description:
    "Leading bulk supplier of eco-friendly rice straws for restaurants, cafes, hotels. Minimum order 10,000 straws. Biodegradable, edible, sustainable alternative to plastic straws.",
  keywords:
    "bulk rice straws, eco-friendly straws, biodegradable straws, sustainable straws, plastic alternative, B2B straws, restaurant supplies, cafe supplies, hotel supplies, wholesale straws",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://rootwave.org" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster />
          <ChatbotTrigger />
        </CartProvider>
      </body>
    </html>
  )
}
