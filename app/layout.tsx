"use client"; // This makes it a Client Component

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global styles
import { CartProvider } from "@/contexts/cart-context"; // Your Cart Context Provider
import { Toaster } from "@/components/ui/toaster"; // Your Toaster component
import { ChatbotTrigger } from "@/components/chatbot-trigger"; // Your ChatbotTrigger component
import { usePathname } from 'next/navigation'; // Hook to get the current path
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current client-side path
  
  // Condition to show the chatbot: show if the path does NOT start with '/free-samples'
  const shouldShowChatbot = !pathname.startsWith('/free-samples');
  
  // Only apply default SEO if NOT on blogs page
  const shouldApplyDefaultSEO = !pathname.startsWith('/blogs');

  return (
    <html lang="en">
      <head>
        {/* Conditional SEO - only apply if not on blogs page */}
        {shouldApplyDefaultSEO && (
          <>
            <title>Rootwave Premium Eco Rice Straw — 100% Biodegradable Luxury</title>
            <meta 
              name="description" 
              content="Discover our rice straw product line — premium eco-friendly, 100% biodegradable, crafted for luxury & sustainability. Bulk wholesale for restaurants &cafés"
            />
          </>
        )}
        
        {/* Universal meta tags for all pages */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="bulk rice straws, eco-friendly straws, biodegradable straws, sustainable straws, plastic alternative, B2B straws, restaurant supplies, cafe supplies, hotel supplies, wholesale straws, edible straws, zero waste straws, premium straws, eco luxury straws, rice straw manufacturer, sustainable dining, green restaurant supplies"
        />
        <meta name="generator" content="v0.dev" />
        <meta name="author" content="Rootwave" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />

        {/* Open Graph Meta Tags - only if not blogs page */}
        {shouldApplyDefaultSEO && (
          <>
            <meta property="og:title" content="Rootwave - Premium Eco-Friendly Rice Straws | Bulk Wholesale" />
            <meta property="og:description" content="Transform your business with premium eco-friendly rice straws. 100% biodegradable, edible, and sustainable. Trusted by 500+ establishments worldwide." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://shop.rootwave.org" />
            <meta property="og:image" content="https://shop.rootwave.org/Leonardo_Phoenix_10_In_a_visually_striking_commercial_ad_shoot_0.jpg" />
            <meta property="og:site_name" content="Rootwave" />
            <meta property="og:locale" content="en_IN" />
          </>
        )}
        
        {/* Twitter Card Meta Tags - only if not blogs page */}
        {shouldApplyDefaultSEO && (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Rootwave - Premium Eco-Friendly Rice Straws" />
            <meta name="twitter:description" content="Transform your business with premium eco-friendly rice straws. 100% biodegradable, edible, and sustainable." />
            <meta name="twitter:image" content="https://shop.rootwave.org/Leonardo_Phoenix_10_In_a_visually_striking_commercial_ad_shoot_0.jpg" />
          </>
        )}

        {/* Structured Data - only if not blogs page */}
        {shouldApplyDefaultSEO && (
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Rootwave",
                "description": "Premium eco-friendly rice straws manufacturer and wholesale supplier",
                "url": "https://shop.rootwave.org",
                "logo": "https://shop.rootwave.org/logo icon -svg-01.png",
                "foundingDate": "2023",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91-77600-21026",
                  "contactType": "Customer Service",
                  "email": "info@rootwave.org",
                  "availableLanguage": ["English", "Hindi"]
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "IN"
                },
                "sameAs": [
                  "https://wa.me/917760021026"
                ],
                "products": [
                  {
                    "@type": "Product",
                    "name": "Rice Straws 6.5mm",
                    "description": "Premium eco-friendly rice straws - 6.5mm diameter",
                    "category": "Restaurant Supplies",
                    "brand": {
                      "@type": "Brand",
                      "name": "Rootwave"
                    }
                  },
                  {
                    "@type": "Product", 
                    "name": "Rice Straws 8mm",
                    "description": "Premium eco-friendly rice straws - 8mm diameter",
                    "category": "Restaurant Supplies",
                    "brand": {
                      "@type": "Brand",
                      "name": "Rootwave"
                    }
                  },
                  {
                    "@type": "Product",
                    "name": "Rice Straws 10mm", 
                    "description": "Premium eco-friendly rice straws - 10mm diameter",
                    "category": "Restaurant Supplies",
                    "brand": {
                      "@type": "Brand",
                      "name": "Rootwave"
                    }
                  },
                  {
                    "@type": "Product",
                    "name": "Rice Straws 13mm",
                    "description": "Premium eco-friendly rice straws - 13mm diameter",
                    "category": "Restaurant Supplies", 
                    "brand": {
                      "@type": "Brand",
                      "name": "Rootwave"
                    }
                  }
                ]
              })
            }}
          />
        )}

        {/* Other essential head tags */}
        <link rel="canonical" href="https://shop.rootwave.org" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo icon -svg-01.png" />
        <meta name="theme-color" content="#16a34a" />
        
        {/* Additional SEO enhancements */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
