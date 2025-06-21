"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Wheat, Menu, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useCart()

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Customization", href: "#customization" },
    { name: "Why Rice Straws?", href: "#comparison" },
    { name: "Contact", href: "#contact" },
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    try {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      } else {
        console.warn(`Element with selector ${href} not found`)
      }
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          <button onClick={() => handleNavClick("#home")} className="flex items-center space-x-2 cursor-pointer">
            <img src="/logo icon -svg-01.png" alt="Rootwave Logo" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-green-800">Rootwave</h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button variant="outline" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart className="w-4 h-4" />
              {state.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {state.itemCount > 99 ? "99+" : state.itemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Wheat className="w-6 h-6 text-green-600" />
                    <span className="text-lg font-bold text-green-800">Rootwave</span>
                  </div>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className="text-gray-600 hover:text-green-600 transition-colors text-left"
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
