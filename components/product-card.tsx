"use client"

import { useState, useMemo, useCallback, memo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Star, Zap } from "lucide-react"
import Image from "next/image"
import Head from "next/head"

interface ProductCardProps {
  id: string
  name: string
  diameter: string
  price: number
  description: string
  bestFor: string
  image: string
  images?: string[]
}

// Memoized constants to prevent re-creation on every render
const COLORS = [
  { name: "White", value: "white", emoji: "⚪" },
  { name: "Orange", value: "orange", emoji: "🟠" },
  { name: "Green", value: "green", emoji: "🟢" },
  { name: "Black", value: "black", emoji: "⚫" },
  { name: "Red", value: "red", emoji: "🔴" },
] as const

const BULK_QUANTITIES = [
  { value: 1000, label: "1000 straws", badge: "Starter" },
  { value: 2500, label: "2500 straws", badge: "Popular" },
  { value: 5000, label: "5000 straws", badge: "Business" },
  { value: 10000, label: "10000 straws", badge: "Enterprise" },
  { value: 25000, label: "25000 straws", badge: "Premium" },
  { value: 50000, label: "50000 straws", badge: "Wholesale" },
] as const

const DISCOUNT_TIERS = [
  { threshold: 25000, discount: 20 },
  { threshold: 10000, discount: 15 },
  { threshold: 5000, discount: 10 },
] as const

// Memoized star rating component
const StarRating = memo(() => (
  <div className="flex items-center">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
))
StarRating.displayName = 'StarRating'

// Memoized image indicators
const ImageIndicators = memo(({ 
  count, 
  currentIndex, 
  onIndexChange 
}: { 
  count: number
  currentIndex: number
  onIndexChange: (index: number) => void 
}) => (
  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
    {Array.from({ length: count }, (_, index) => (
      <button
        key={index}
        onClick={() => onIndexChange(index)}
        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
          index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
        }`}
        aria-label={`Go to image ${index + 1}`}
        type="button"
      />
    ))}
  </div>
))
ImageIndicators.displayName = 'ImageIndicators'

// Optimized navigation button component
const NavButton = memo(({ 
  direction, 
  onClick, 
  className = "" 
}: { 
  direction: 'prev' | 'next'
  onClick: () => void
  className?: string 
}) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 ${className}`}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} image`}
    type="button"
  >
    {direction === 'prev' ? '←' : '→'}
  </button>
))
NavButton.displayName = 'NavButton'

// Main component with React.memo for props comparison
export const ProductCard = memo<ProductCardProps>(({ 
  id, 
  name, 
  diameter, 
  price, 
  description, 
  bestFor, 
  image, 
  images 
}) => {
  const [selectedColor, setSelectedColor] = useState("white")
  const [quantity, setQuantity] = useState(1000)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { dispatch } = useCart()
  const { toast } = useToast()

  // Optimized image array creation
  const cardImages = useMemo(() => {
    if (images && images.length > 0) return images
    return [image, image, image]
  }, [images, image])

  const currentImage = cardImages[currentImageIndex]

  // Memoized navigation handlers
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % cardImages.length)
  }, [cardImages.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + cardImages.length) % cardImages.length)
  }, [cardImages.length])

  const handleImageIndicatorClick = useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  // Optimized discount calculation with corrected logic
  const { discountPercentage, discountedPrice, totalSavings } = useMemo(() => {
    const tier = DISCOUNT_TIERS.find(t => quantity >= t.threshold)
    const percentage = tier?.discount || 0
    const newPrice = price * (1 - percentage / 100)
    const savings = (price - newPrice) * quantity
    
    return { 
      discountPercentage: percentage, 
      discountedPrice: newPrice,
      totalSavings: savings
    }
  }, [quantity, price])

  // Memoized formatted values to prevent recalculation
  const formattedValues = useMemo(() => ({
    quantityString: quantity.toLocaleString(),
    originalPrice: price.toFixed(2),
    finalPrice: discountedPrice.toFixed(2),
    savings: totalSavings.toFixed(2)
  }), [quantity, price, discountedPrice, totalSavings])

  
  

  // Optimized add to cart handler
  const addToCart = useCallback(() => {
    const cartItem = {
      id: `${id}-${selectedColor}`,
      name,
      diameter,
      price,
      quantity,
      color: selectedColor,
      image,
    }

    dispatch({
      type: "ADD_ITEM",
      payload: cartItem,
    })

    toast({
      title: "🎉 Added to cart!",
      description: `${formattedValues.quantityString}x ${name} (${diameter}, ${selectedColor}) added to your cart.`,
    })
  }, [dispatch, toast, id, name, diameter, price, quantity, selectedColor, image, formattedValues.quantityString])

  // Memoized color change handler
  const handleColorChange = useCallback((value: string) => {
    setSelectedColor(value)
  }, [])

  // Memoized quantity change handler
  const handleQuantityChange = useCallback((value: string) => {
    setQuantity(Number.parseInt(value, 10))
  }, [])

  return (
    <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-white to-green-50">
      <CardHeader className="pb-4">
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden group">
          <Image
            key={currentImage}
            src={currentImage || "/Leonardo_Phoenix_10_In_a_visually_striking_commercial_ad_shoot_0.jpg"}
            alt={`${name} - view ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
          
          <NavButton direction="prev" onClick={prevImage} className="left-2" />
          <NavButton direction="next" onClick={nextImage} className="right-2" />
          
          <ImageIndicators 
            count={cardImages.length}
            currentIndex={currentImageIndex}
            onIndexChange={handleImageIndicatorClick}
          />
          
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full z-10">
            <StarRating />
          </div>

          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-700 text-lg">{diameter}</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              10cm length
            </Badge>
          </div>
          <CardDescription className="font-semibold text-gray-700">{bestFor}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              {discountPercentage > 0 ? (
                <div className="space-y-1">
                  <span className="text-lg line-through text-gray-400">₹{formattedValues.originalPrice}</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600">₹{formattedValues.finalPrice}</span>
                    <Zap className="w-4 h-4 text-yellow-500 ml-1" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    Save ₹{formattedValues.savings} total
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-green-600">₹{formattedValues.originalPrice}</span>
              )}
              <span className="text-sm text-gray-500 block">per straw</span>
            </div>
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white">Save {discountPercentage}%</Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor={`${id}-color-select`} className="text-sm font-medium mb-2 block text-gray-700">
              🎨 Color
            </label>
            <Select value={selectedColor} onValueChange={handleColorChange}>
              <SelectTrigger id={`${id}-color-select`} className="border-gray-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{color.emoji}</span>
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor={`${id}-quantity-select`} className="text-sm font-medium mb-2 block text-gray-700">
              📊 Bulk Quantity (Minimum 1000)
            </label>
            <Select value={quantity.toString()} onValueChange={handleQuantityChange}>
              <SelectTrigger id={`${id}-quantity-select`} className="border-gray-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BULK_QUANTITIES.map((qty) => (
                  <SelectItem key={qty.value} value={qty.value.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{qty.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {qty.badge}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={addToCart}
          type="button"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          🛒 Add {formattedValues.quantityString} to Cart
        </Button>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium text-sm mb-2">💰 Bulk Pricing Benefits</p>
          <div className="space-y-1 text-xs text-blue-700">
            {DISCOUNT_TIERS.map((tier) => (
              <div key={tier.threshold} className="flex justify-between">
                <span>• {tier.threshold.toLocaleString()}+:</span>
                <span className="font-semibold">{tier.discount}% discount</span>
              </div>
            ))}
          </div>
          {quantity >= 5000 && discountPercentage > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="text-green-700 font-semibold text-xs">
                🎉 You're saving {discountPercentage}% on this order! (₹{formattedValues.savings} total)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'
