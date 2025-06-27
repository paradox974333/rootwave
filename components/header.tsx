"use client"

import { useState } from "react"
import Image from "next/image"; // Import Next.js Image component
import { useRouter } from "next/navigation"; // For App Router navigation
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart } from "lucide-react" // Removed Wheat as it wasn't used in Sheet
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useCart()
  const router = useRouter();

  // Define navigation items with types for handling
  const navigation = [
    { name: "Home", href: "/", type: "pageOrScrollToHome" },
    { name: "About", href: "/#about", type: "scroll" },
    { name: "Products", href: "/#products", type: "scroll" },
    { name: "Blogs", href: "/blogs", type: "page" },
     { name: "Why Rice Straws?", href: "/#comparison", type: "scroll" },
    { name: "Contact", href: "/#contact", type: "scroll" },
    { name: "GET FREE RICE STRAWS !!!", href: "/free-samples", type: "page" },
  ];

  const handleNavClick = (href: string, type: "scroll" | "page" | "pageOrScrollToHome") => {
    setIsMenuOpen(false); // Close mobile menu on any nav click

    if (type === "pageOrScrollToHome") {
        // If current path is already home, try to scroll to #home or top
        if (window.location.pathname === '/' && href === '/') {
            const homeElement = document.getElementById("home"); // Assuming your main page has an id="home" section
            if (homeElement) {
                homeElement.scrollIntoView({ behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
            }
        } else {
            router.push("/"); // Navigate to homepage
        }
        return;
    }

    if (type === "scroll") {
      const currentPath = window.location.pathname;
      const targetHash = href.substring(href.indexOf("#")); // e.g., #about

      if (currentPath === "/") { // If on homepage, just scroll
        const element = document.querySelector(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          console.warn(`Element with selector ${targetHash} not found on homepage.`);
        }
      } else { // If on another page (e.g. /blogs), navigate to homepage and then scroll
        router.push(`/${targetHash}`);
      }
    } else if (type === "page") {
      router.push(href); // Navigate to the specified page (e.g., /blogs)
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">

          {/* Logo and Brand Name - Links to Home */}
          <button
            onClick={() => handleNavClick("/", "pageOrScrollToHome")}
            className="flex items-center space-x-2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-md p-1 -m-1"
            aria-label="Go to homepage"
          >
            <Image
              src="/logo icon -svg-01.png" // Ensure this is in /public directory
              alt="Rootwave Logo"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform duration-200"
              priority // Prioritize loading the logo
            />
            <h1 className="text-xl sm:text-2xl font-bold text-green-700 group-hover:text-green-800 transition-colors">Rootwave</h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href, item.type as "scroll" | "page" | "pageOrScrollToHome")}
                className="text-sm xl:text-base text-gray-600 hover:text-green-600 transition-colors duration-200 cursor-pointer px-2 py-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:bg-green-50"
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full w-9 h-9 sm:w-10 sm:h-10 border-gray-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label={`Open shopping cart, ${state.itemCount} items`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {state.itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1.5 -right-1.5 text-[10px] sm:text-xs w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full p-0 bg-red-600 text-white"
                >
                  {state.itemCount > 99 ? "99+" : state.itemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 border-gray-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px] p-6 bg-white shadow-xl">
                <div className="flex items-center justify-start mb-8"> {/* Changed justify-between to justify-start */}
                    <button
                        onClick={() => handleNavClick("/", "pageOrScrollToHome")}
                        className="flex items-center space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-md p-1 -m-1"
                        aria-label="Go to homepage"
                    >
                        <Image src="/logo icon -svg-01.png" alt="Rootwave Logo" width={36} height={36} className="w-9 h-9 group-hover:scale-105 transition-transform" />
                        <span className="text-xl font-bold text-green-700 group-hover:text-green-800 transition-colors">Rootwave</span>
                    </button>
                </div>
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href, item.type as "scroll" | "page" | "pageOrScrollToHome")}
                        className="text-gray-700 hover:text-green-700 hover:bg-green-50/70 transition-colors text-left py-2.5 px-3 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:bg-green-100"
                        aria-label={`Navigate to ${item.name}`}
                    >
                        {item.name}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}