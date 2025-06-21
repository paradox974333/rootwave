"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Star, Zap } from "lucide-react"
import Image from "next/image"

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

const colors = [
  { name: "White", value: "white", emoji: "⚪" },
  { name: "Orange", value: "orange", emoji: "🟠" },
  { name: "Green", value: "green", emoji: "🟢" },
  { name: "Black", value: "black", emoji: "⚫" },
  { name: "Red", value: "red", emoji: "🔴" },
]

const bulkQuantities = [
  { value: 10000, label: "10,000 straws", badge: "Starter" },
  { value: 25000, label: "25,000 straws", badge: "Popular" },
  { value: 50000, label: "50,000 straws", badge: "Business" },
  { value: 100000, label: "100,000 straws", badge: "Enterprise" },
  { value: 250000, label: "250,000 straws", badge: "Premium" },
  { value: 500000, label: "500,000 straws", badge: "Wholesale" },
]

export function ProductCard({ id, name, diameter, price, description, bestFor, image, images }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState("white")
  const [quantity, setQuantity] = useState(10000)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const cardImages = images && images.length > 0 ? images : [image, image, image]
  const currentImage = cardImages[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % cardImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + cardImages.length) % cardImages.length)
  }

  const { dispatch } = useCart()
  const { toast } = useToast()

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: `${id}-${selectedColor}`,
        name,
        diameter,
        price,
        quantity,
        color: selectedColor,
        image,
      },
    })

    toast({
      title: "🎉 Added to cart!",
      description: `${quantity.toLocaleString()}x ${name} (${diameter}, ${selectedColor}) added to your cart.`,
    })
  }

  const getDiscountPercentage = (qty: number) => {
    if (qty >= 250000) return 20
    if (qty >= 100000) return 15
    if (qty >= 50000) return 10
    return 0
  }

  const discountPercentage = getDiscountPercentage(quantity)
  const discountedPrice = price * (1 - discountPercentage / 100)

  return (
    <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-white to-green-50">
      <CardHeader className="pb-4">
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden group">
          <Image
            src={currentImage || "/Leonardo_Phoenix_10_In_a_visually_striking_commercial_ad_shoot_0.jpg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            ←
          </button>
          
          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            →
          </button>
          
          {/* Image Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {cardImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
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
                  <span className="text-lg line-through text-gray-400">₹{price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600">₹{discountedPrice.toFixed(2)}</span>
                    <Zap className="w-4 h-4 text-yellow-500 ml-1" />
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold text-green-600">₹{price.toFixed(2)}</span>
              )}
              <span className="text-sm text-gray-500 block">per straw</span>
            </div>
            {discountPercentage > 0 && (
              <div className="text-right">
                <Badge className="bg-red-500 text-white">Save {discountPercentage}%</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">🎨 Color</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="border-gray-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
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
            <label className="text-sm font-medium mb-2 block text-gray-700">📊 Bulk Quantity (Minimum 10,000)</label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
              <SelectTrigger className="border-gray-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bulkQuantities.map((qty) => (
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
        >
          <ShoppingCart className="w-4 h-4 mr-2" />🛒 Add to Cart
        </Button>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium text-sm mb-2">💰 Bulk Pricing Benefits</p>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex justify-between">
              <span>• 50K+:</span>
              <span className="font-semibold">10% discount</span>
            </div>
            <div className="flex justify-between">
              <span>• 100K+:</span>
              <span className="font-semibold">15% discount</span>
            </div>
            <div className="flex justify-between">
              <span>• 250K+:</span>
              <span className="font-semibold">20% discount</span>
            </div>
          </div>
          {quantity >= 50000 && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="text-green-700 font-semibold text-xs">
                🎉 You're saving {discountPercentage}% on this order!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}