"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { CheckoutForm } from "@/components/checkout-form"
import { FloatingScrollButton } from "@/components/floating-cart-button"
import { ContactForm } from "@/components/contact-form"
import {
  CheckCircle,
  Leaf,
  Recycle,
  Heart,
  Shield,
  Phone,
  Mail,
  Star,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  Globe,
  ShoppingCart,
  Crown,
  Gem,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home")

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Edible & Safe to Consume",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      icon: <Recycle className="w-6 h-6" />,
      text: "Zero Waste Technology",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      text: "Advanced Eco-Friendly Materials",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Certified Sustainable Production",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      text: "100% Vegan & Cruelty-Free",
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-200",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      text: "Superior Quality Assurance",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
  ]

  const products = [
    {
      id: "straw-6.5mm",
      name: "Rice Straw 6.5mm",
      diameter: "6.5 mm",
      price: 1,
      description: "Precision-engineered for optimal flow dynamics in thin liquids.",
      bestFor: "Fine beverages, artisanal teas, craft cocktails",
      image: "/DSC03027.JPG?height=200&width=300",
      images: [
        "/DSC03027.JPG?height=200&width=300",
        "/DSC03080.JPG?height=200&width=300",
        "/6.png?height=250&width=350"
      ]
    },
    {
      id: "straw-8mm",
      name: "Rice Straw 8mm",
      diameter: "8 mm",
      price: 1,
      description: "Perfectly balanced for medium-viscosity beverages.",
      bestFor: "Gourmet smoothies, luxury milkshakes, specialty drinks",
      image: "/placeholder.svg?height=200&width=300",
      images: [
        "/DSC02990.JPG?height=200&width=300",
        "/DSC02991.JPG?height=200&width=300",
        "/8.png?height=300&width=500"
      ]
    },
    {
      id: "straw-10mm",
      name: "Rice Straw 10mm",
      diameter: "10 mm",
      price: 1,
      description: "Enhanced diameter for luxurious drinking experience.",
      bestFor: "Thick shakes, artisanal smoothies, craft beverages",
      image: "/placeholder.svg?height=200&width=300",
      images: [
        "/DSC03089.JPG?height=200&width=300",
        "/DSC03093.JPG?height=200&width=300",
        "/10.png?height=200&width=300"
      ]
    },
    {
      id: "straw-13mm",
      name: "Rice Straw 13mm",
      diameter: "13 mm",
      price: 1,
      description: "Ultra-wide design for specialty applications.",
      bestFor: "Luxury bubble tea, gourmet slushies, signature drinks",
      image: "/placeholder.svg?height=200&width=300",
      images: [
        "/DSC03046.JPG?height=200&width=300",
        "/DSC03002.JPG?height=200&width=300",
        "/13.png?height=200&width=300"
      ]
    },
  ]

  const colors = [
    {
      name: "Pearl White",
      symbolism: "Elegance, Purity, Sophistication",
      drinks: "Fine waters, luxury cocktails",
      color: "bg-white border-2 border-gray-200",
      gradient: "from-gray-50 to-white",
      shadow: "shadow-gray-200/50",
    },
    {
      name: "Sunset Orange",
      symbolism: "Energy, Creativity, Warmth",
      drinks: "Artisanal juices, tropical smoothies",
      color: "bg-gradient-to-br from-orange-400 to-orange-500",
      gradient: "from-orange-300 to-orange-600",
      shadow: "shadow-orange-200/50",
    },
    {
      name: "Forest Green",
      symbolism: "Nature, Health, Excellence",
      drinks: "Organic teas, green smoothies, wellness drinks",
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      gradient: "from-green-400 to-emerald-700",
      shadow: "shadow-green-200/50",
    },
    {
      name: "Midnight Black",
      symbolism: "Luxury, Sophistication, Elegance",
      drinks: "Specialty coffee, craft cocktails, luxury beverages",
      color: "bg-gradient-to-br from-gray-800 to-black",
      gradient: "from-gray-700 to-black",
      shadow: "shadow-gray-400/50",
    },
    {
      name: "Ruby Red",
      symbolism: "Passion, Energy, Distinction",
      drinks: "Berry smoothies, signature fruit punches, craft drinks",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      gradient: "from-red-400 to-red-700",
      shadow: "shadow-red-200/50",
    },
  ]

  const teamMembers = [
    {
      name: "Girish SP",
      title: "Founder & Visionary",
      email: "info@rootwave.org",
      phone: "+91 77600 21026",
      whatsapp: "917760021026",
    },
    {
      name: "Arpan Tiwari",
      title: "Head of Operations",
      email: "arpan@rootwave.org",
      phone: "+91 83195 45466",
      whatsapp: "918319545466",
    },
    {
      name: "Prateek P",
      title: "CEO & Chief Marketing Officer",
      email: "prateek@rootwave.org",
      phone: "+91 79838 82050",
      whatsapp: "917983882050",
    },
  ]

  const stats = [
    {
      icon: <Users className="w-10 h-10" />,
      number: "500+",
      label: "Business Partners",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: <Globe className="w-10 h-10" />,
      number: "50M+",
      label: "Straws Delivered",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      icon: <Award className="w-10 h-10" />,
      number: "100%",
      label: "Eco-Certified",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      number: "24hrs",
      label: "Response Time",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
  ]

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50/30 via-transparent to-blue-50/30" />
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-200/50 backdrop-blur-sm shadow-lg">
                <Crown className="w-5 h-5 text-emerald-600 mr-3" />
                <span className="text-sm font-semibold text-emerald-800 tracking-wide">PREMIUM COLLECTION</span>
                <Gem className="w-5 h-5 text-blue-600 ml-3" />
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600">
                    Sustainably
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                    in every sip
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  Elevate your business with our
                  <span className="font-bold text-emerald-600"> eco-luxury</span> rice straws.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Trusted by <span className="font-semibold">500+ establishments</span> worldwide for uncompromising
                  quality and sustainability.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`group relative p-6 ${stat.bg} ${stat.border} border-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 backdrop-blur-sm`}
                  >
                    <div className="text-center space-y-3">
                      <div className={`${stat.color} flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-black text-gray-900">{stat.number}</div>
                      <div className="text-sm font-semibold text-gray-700 tracking-wide">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="relative p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200/50 shadow-xl">
                <Sparkles className="absolute top-4 left-4 w-6 h-6 text-emerald-600" />
                <blockquote className="text-lg text-emerald-800 italic font-medium leading-relaxed pl-8">
                  "From agricultural waste to luxury experience – rice straws are redefining sustainability, one elegant
                  sip at a time."
                </blockquote>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="group relative px-12 py-6 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white text-xl font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105 rounded-2xl"
                  onClick={() => handleScrollToSection("products")}
                >
                  <div className="flex items-center space-x-4">
                    <ShoppingCart className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Shop Now</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10 group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 group-hover:scale-105">
                  <Image
                    src="/Leonardo_Phoenix_10_In_a_visually_striking_commercial_ad_shoot_0.jpg?height=600&width=700"
                    alt="Eco-friendly rice straws"
                    width={700}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 p-6 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-bounce">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">Eco-Certified</p>
                      <p className="text-xs text-gray-600">Premium Quality</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 p-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl shadow-2xl animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Leaf className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">100% Biodegradable</p>
                      <p className="text-sm opacity-90">Decomposes in 90 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200/50 mb-8">
              <Crown className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-sm font-bold text-purple-800 tracking-wider">SIGNATURE COLLECTION</span>
            </div>

            <h2 className="text-6xl font-black mb-8 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Rice Straw
              </span>
              <span className="block text-gray-700 text-4xl font-light mt-4">Collection</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 font-medium">
              Engineered for discerning establishments – Minimum order: 1000 straws
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 rounded-full font-bold">
                Minimum Order: 1000 straws
              </Badge>
              <Badge className="px-6 py-3 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300 rounded-full font-bold">
                Bulk Pricing
              </Badge>
              <Badge className="px-6 py-3 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 rounded-full font-bold">
                B2B Excellence
              </Badge>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: "💼", text: "Wholesale pricing for luxury establishments (10K+ straws)" },
              { icon: "📞", text: "Dedicated account management for orders above 100K" },
              { icon: "🚚", text: "Complimentary white-glove delivery on orders above ₹25,000" },
              { icon: "💎", text: "Elegant packaging and presentation options included" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">{benefit.icon}</div>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="relative p-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200">
            <div className="absolute top-6 right-6">
              <Gem className="w-8 h-8 text-purple-600" />
            </div>

            <h3 className="text-4xl font-black text-center mb-12 text-gray-900">💎 Luxury Pricing Tiers</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Starter", range: "10K - 49K", discount: "Standard", color: "blue", icon: "🥉" },
                { name: "Business", range: "50K - 99K", discount: "10% OFF", color: "emerald", icon: "🥈" },
                { name: "Enterprise", range: "100K - 249K", discount: "15% OFF", color: "purple", icon: "🥇" },
                { name: "Elite", range: "250K+", discount: "20% OFF", color: "amber", icon: "💎" },
              ].map((tier, index) => (
                <Card
                  key={index}
                  className="group relative border-2 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden"
                  style={{
                    borderColor: `var(--${tier.color}-200)`,
                    background: `linear-gradient(to bottom right, var(--${tier.color}-50), var(--${tier.color}-100))`,
                  }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl">{tier.icon}</div>
                    <h4 className="font-black text-2xl">{tier.name}</h4>
                    <p className="text-4xl font-black">{tier.range}</p>
                    <p className="text-sm font-bold">{tier.discount}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section id="customization" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full border border-pink-200/50 mb-8">
              <Sparkles className="w-5 h-5 text-pink-600 mr-3" />
              <span className="text-sm font-bold text-pink-800 tracking-wider">CUSTOMIZATION</span>
            </div>

            <h2 className="text-6xl font-black mb-8 leading-tight">
              <span className="block text-gray-900">Make It</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Uniquely Yours
              </span>
            </h2>
          </div>

          {/* Color Customization */}
          <div className="mb-24">
            <h3 className="text-4xl font-black mb-8 text-center text-gray-900">✨ Signature Color Palette</h3>
            <p className="text-xl text-gray-600 mb-16 text-center font-medium max-w-4xl mx-auto">
              Curated color collection designed to complement your brand aesthetic. All colors included at no additional
              cost.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {colors.map((color, index) => (
                <Card
                  key={index}
                  className="group relative border-2 border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden"
                >
                  <CardContent className="p-6 text-center space-y-6">
                    <div
                      className={`relative w-24 h-24 rounded-full mx-auto ${color.color} ${color.shadow} shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-black text-gray-900 text-xl">{color.name}</h4>
                      <p className="text-sm text-gray-600 font-semibold">{color.symbolism}</p>
                      <p className="text-xs text-gray-500 italic">{color.drinks}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <Badge className="px-8 py-4 text-lg bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 border border-emerald-300 rounded-full font-bold shadow-xl">
                🎨 Color customization included at no extra cost
              </Badge>
            </div>
          </div>

          {/* Custom Branding */}
          <div>
            <h3 className="text-4xl font-black mb-12 text-center text-gray-900">
              👑 Custom Branding
            </h3>
            <Card className="relative border-2 border-emerald-200 hover:border-emerald-300 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-emerald-50">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative order-2 lg:order-1">
                    <div className="relative z-10 group w-full h-80 rounded-3xl overflow-hidden">
                      <Image
                        src="/IMG_4752.jpg"
                        alt="Luxury custom branded pouches"
                        fill
                        className="object-cover shadow-xl hover:shadow-2xl transition-all duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 order-1 lg:order-2">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                      Elevate your brand presence with our luxury custom-printed pouches. Designed for establishments
                      that demand excellence in every detail.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-black mb-4 text-xl text-gray-900 flex items-center">
                          <Crown className="w-5 h-5 text-amber-600 mr-3" />
                          Features
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "Embossed branding with your logo",
                            "Luxury matte finish with spot UV accents",
                            "Perfect for high-end establishments",
                            "Exceptional brand visibility and recognition",
                          ].map((feature, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-black mb-4 text-xl text-gray-900 flex items-center">
                          <Gem className="w-5 h-5 text-purple-600 mr-3" />
                          Investment Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 font-medium leading-relaxed">
                              Setup fee: <span className="font-black text-emerald-600">₹10,000</span> (one-time
                              investment)
                            </span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 font-medium leading-relaxed">
                              Minimum order: <span className="font-black text-emerald-600">1000 straws</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="group w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white text-base font-bold shadow-xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105 rounded-xl"
                        onClick={() => handleScrollToSection("contact")}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                          <span>Inquire About Custom Branding</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-50 to-emerald-50 rounded-full border border-red-200/50 mb-6">
              <Recycle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-sm font-bold text-red-800 tracking-wider">ENVIRONMENTAL IMPACT</span>
            </div>

            <h2 className="text-6xl font-black mb-6 leading-tight">
              <span className="block text-gray-900">Why Choose</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Rice Straws
              </span>
              <span className="block text-gray-700 text-3xl font-light mt-3">Over Alternatives?</span>
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="p-5 text-left font-black text-base">Comparison Factor</th>
                      <th className="p-5 text-left font-black text-base">Plastic</th>
                      <th className="p-5 text-left font-black text-base">Paper</th>
                      <th className="p-5 text-left font-black text-base">Rice Straws</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        factor: "Environmental Cost",
                        plastic: "Devastating long-term impact",
                        paper: "Deforestation & chemical processing",
                        rice: "Carbon-negative production",
                        plasticColor: "text-red-600",
                        paperColor: "text-orange-600",
                        riceColor: "text-emerald-600",
                      },
                      {
                        factor: "Decomposition Time",
                        plastic: "500+ years in landfills",
                        paper: "2-6 weeks (limited conditions)",
                        rice: "90 days complete biodegradation",
                        plasticColor: "text-red-600",
                        paperColor: "text-orange-600",
                        riceColor: "text-emerald-600",
                      },
                      {
                        factor: "Durability",
                        plastic: "Strong but harmful",
                        paper: "Soggy within minutes",
                        rice: "Stays firm for hours",
                        plasticColor: "text-red-600",
                        paperColor: "text-orange-600",
                        riceColor: "text-emerald-600",
                      },
                      {
                        factor: "Health & Safety",
                        plastic: "Microplastic contamination",
                        paper: "Chemical bleaching residues",
                        rice: "Food-grade, edible materials",
                        plasticColor: "text-red-600",
                        paperColor: "text-orange-600",
                        riceColor: "text-emerald-600",
                      },
                      {
                        factor: "User Experience",
                        plastic: "Functional but unsustainable",
                        paper: "Deteriorates quickly",
                        rice: "Premium feel & performance",
                        plasticColor: "text-red-600",
                        paperColor: "text-orange-600",
                        riceColor: "text-emerald-600",
                      },
                    ].map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/70"
                        }`}
                      >
                        <td className="p-5 font-bold text-gray-900 text-sm">{row.factor}</td>
                        <td className={`p-5 font-semibold ${row.plasticColor} text-sm`}>{row.plastic}</td>
                        <td className={`p-5 font-semibold ${row.paperColor} text-sm`}>{row.paper}</td>
                        <td className={`p-5 font-semibold ${row.riceColor} text-sm`}>{row.rice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Impact Statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-l-6 border-red-500 shadow-lg">
              <div className="absolute top-4 right-4">
                <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base">!</span>
                </div>
              </div>
              <blockquote className="text-base text-red-800 italic font-bold leading-relaxed pr-8">
                "Every plastic straw used today becomes tomorrow's environmental burden – lasting centuries beyond its
                minutes of use."
              </blockquote>
            </div>

            <div className="relative p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-l-6 border-orange-500 shadow-lg">
              <div className="absolute top-4 right-4">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base">?</span>
                </div>
              </div>
              <blockquote className="text-base text-orange-800 italic font-bold leading-relaxed pr-8">
                "Paper straws: the compromise solution that compromises your drink experience while still requiring tree resources."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50 mb-8">
              <ShoppingCart className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-bold text-blue-800 tracking-wider">LUXURY CHECKOUT</span>
            </div>

            <h2 className="text-6xl font-black mb-8 leading-tight">
              <span className="block text-gray-900">Complete Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Luxury Order
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">Transform your establishment with eco-luxury</p>
          </div>
          <CheckoutForm />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-200/50 mb-8">
              <MessageCircle className="w-5 h-5 text-emerald-600 mr-3" />
              <span className="text-sm font-bold text-emerald-800 tracking-wider">EXPERT SUPPORT</span>
            </div>

            <h2 className="text-6xl font-black mb-8 leading-tight">
              <span className="block text-gray-900">Let's</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Connect
              </span>
              <span className="block text-gray-700 text-4xl font-light mt-4">& Create Excellence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <ContactForm />

            <div className="space-y-10">
              <div>
                <h3 className="text-4xl font-black mb-10 text-gray-900">Our Expert Team</h3>
                <div className="space-y-8">
                  {teamMembers.map((member, index) => (
                    <Card
                      key={index}
                      className="group relative border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-emerald-50 rounded-3xl overflow-hidden"
                    >
                      <CardContent className="p-10">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-black text-emerald-700 text-2xl">{member.name}</h4>
                            <p className="text-gray-600 font-semibold text-lg">{member.title}</p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-blue-600" />
                              </div>
                              <a
                                href={`mailto:${member.email}`}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors break-all"
                              >
                                {member.email}
                              </a>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-purple-600" />
                              </div>
                              <a
                                href={`tel:${member.phone}`}
                                className="text-purple-600 hover:text-purple-700 font-semibold text-lg transition-colors"
                              >
                                {member.phone}
                              </a>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="w-6 h-6 text-emerald-600" />
                              </div>
                              <a
                                href={`https://wa.me/${member.whatsapp}?text=Hi%20${member.name.split(" ")[0]}%2C%20I%27m%20interested%20in%20Rootwave%27s%20rice%20straws.%20Can%20you%20help%20me%20with%20pricing%20details%3F`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors"
                              >
                                WhatsApp Support
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="relative p-10 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl border border-emerald-200/50 shadow-xl">
                <div className="absolute top-6 right-6">
                  <Crown className="w-8 h-8 text-emerald-600" />
                </div>

                <h4 className="font-black text-emerald-800 mb-8 text-2xl">🌟 Ready for Partnership?</h4>
                <p className="text-emerald-700 mb-8 text-lg leading-relaxed font-medium">
                  Join our exclusive network of establishments committed to luxury sustainability. Let's create an
                  extraordinary future together.
                </p>

                <div className="space-y-6">
                  <Button className="group w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white text-lg font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105 rounded-2xl">
                    <div className="flex items-center justify-center space-x-3">
                      <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <a href="mailto:info@rootwave.org">Email Support</a>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="group w-full py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      <a href="tel:+917760021026">Immediate Consultation</a>
                    </div>
                  </Button>

                  <Button className="group w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white text-lg font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105 rounded-2xl">
                    <div className="flex items-center justify-center space-x-3">
                      <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <a
                        href="https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20your%20eco-luxury%20rice%20straws.%20Can%20you%20provide%20pricing%20details%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp Direct Line
                      </a>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Image src="/logo icon -svg-01.png" alt="Rootwave Logo" width={40} height={40} className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-black">Rootwave</h3>
              </div>
              <p className="text-emerald-200 text-xl font-bold">Sip Sustainably, Live Luxuriously</p>
              <p className="text-emerald-300 text-base leading-relaxed font-medium">
                Pioneering the future of sustainability through innovative agricultural transformation.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-2xl text-white">Quick Access</h4>
              <ul className="space-y-4 text-emerald-200">
                {[
                  { name: "Home", type: "scroll" },
                  { name: "Products", type: "scroll" },
                  { name: "Contact", type: "scroll" },
                  { name: "Blogs", href: "/blogs", type: "page" },
                ].map((item) => (
                  <li key={item.name}>
                    {item.type === "page" ? (
                      <a
                        href={item.href}
                        className="hover:text-white cursor-pointer transition-colors font-semibold text-lg group"
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block">
                          {item.name}
                        </span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleScrollToSection(item.name.toLowerCase())}
                        className="hover:text-white cursor-pointer transition-colors font-semibold text-lg group"
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300 inline-block">
                          {item.name}
                        </span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-2xl text-white">Signature Collection</h4>
              <ul className="space-y-4 text-emerald-200">
                {["6.5mm Rice Straws", "8mm Rice Straws", "10mm Rice Straws", "13mm Rice Straws"].map((item, index) => (
                  <li key={index} className="font-semibold text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-2xl text-white">Expert Support</h4>
              <ul className="space-y-6 text-emerald-200">
                <li className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <a
                    href="mailto:info@rootwave.org"
                    className="hover:text-white transition-colors font-semibold text-lg break-all"
                  >
                    info@rootwave.org
                  </a>
                </li>
                <li className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <a href="tel:+917760021026" className="hover:text-white transition-colors font-semibold text-lg">
                    +91 77600 21026
                  </a>
                </li>
                <li className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <a
                    href="https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20your%20eco-luxury%20rice%20straws."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors font-semibold text-lg"
                  >
                    WhatsApp
                  </a>
                </li>
                <li className="font-bold text-lg">🇮🇳 Proudly Made in India</li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-emerald-600 to-blue-600 h-1 mb-10" />

          <div className="text-center">
            <p className="text-emerald-300 text-base font-bold">
              © {new Date().getFullYear()} Rootwave. All rights reserved. | Sustainable luxury for tomorrow's world.
            </p>
          </div>
        </div>
      </footer>

      <FloatingScrollButton targetId="checkout" />
    </div>
  )
}
