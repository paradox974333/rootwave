"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  MessageSquare,
  Phone,
  ShoppingCart,
  Calculator,
  Package,
  CheckCircle,
  ArrowRight,
  Star,
  Gift,
} from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  quickReplies?: string[]
  actions?: Array<{
    label: string
    action: string
    data?: any
    icon?: React.ReactNode
    color?: string
  }>
  type?: "welcome" | "info" | "success" | "warning" | "error" | "order" | "product"
  component?: "quick-order" | "product-selector" | "order-summary"
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

interface QuickOrder {
  product: string
  quantity: number
  color: string
  customerInfo: {
    name: string
    business: string
    phone: string
    email: string
  }
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [quickOrder, setQuickOrder] = useState<QuickOrder>({
    product: "",
    quantity: 10000,
    color: "white",
    customerInfo: { name: "", business: "", phone: "", email: "" },
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { dispatch } = useCart()
  const { toast } = useToast()

  const products = [
    { id: "6.5mm", name: "6.5mm Rice Straw", price: 1.75, emoji: "🥤", bestFor: "Water, Tea, Juice" },
    { id: "8mm", name: "8mm Rice Straw", price: 2.2, emoji: "🥛", bestFor: "Smoothies, Milkshakes" },
    { id: "10mm", name: "10mm Rice Straw", price: 2.99, emoji: "🧋", bestFor: "Thick Drinks, Shakes" },
    { id: "13mm", name: "13mm Rice Straw", price: 4.15, emoji: "🧋", bestFor: "Bubble Tea, Slushies" },
  ]

  const colors = [
    { name: "White", value: "white", emoji: "⚪", hex: "#FFFFFF" },
    { name: "Orange", value: "orange", emoji: "🟠", hex: "#FF6B35" },
    { name: "Green", value: "green", emoji: "🟢", hex: "#4CAF50" },
    { name: "Black", value: "black", emoji: "⚫", hex: "#000000" },
    { name: "Red", value: "red", emoji: "🔴", hex: "#F44336" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: "🌟 Welcome! I'm RootBot, your personal ordering assistant!\n\nI can help you place orders in just 3 easy steps:\n\n1️⃣ Choose your product\n2️⃣ Select quantity & color\n3️⃣ Confirm your order\n\nLet's get started! What would you like to do?",
        isBot: true,
        timestamp: new Date(),
        type: "welcome",
        quickReplies: ["🛒 Quick Order", "📦 Browse Products", "💰 Get Pricing", "📞 Talk to Expert"],
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  const addMessage = (
    text: string,
    isBot: boolean,
    quickReplies?: string[],
    actions?: any[],
    type?: Message["type"],
    component?: Message["component"],
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      quickReplies,
      actions,
      type,
      component,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = (duration = 1000) => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), duration)
  }

  const getResponse = (userMessage: string) => {
    const userMessageLower = userMessage.toLowerCase().trim()

    // Quick Order Flow
    if (userMessageLower.includes("order") || userMessageLower.includes("buy") || userMessageLower.includes("🛒")) {
      return {
        text: "🚀 Perfect! Let's create your order in 3 simple steps!\n\nFirst, choose your rice straw type:",
        component: "product-selector",
        type: "order" as const,
      }
    }

    // Product Information
    if (
      userMessageLower.includes("product") ||
      userMessageLower.includes("browse") ||
      userMessageLower.includes("📦")
    ) {
      return {
        text: "🌾 Here are our rice straws! Each one is 100% biodegradable and eco-friendly:\n\nClick on any product to learn more or start ordering:",
        component: "product-selector",
        quickReplies: ["🛒 Order Now", "💰 Get Pricing", "📦 Request Samples"],
        type: "product" as const,
      }
    }

    // Pricing Information
    if (userMessageLower.includes("price") || userMessageLower.includes("cost") || userMessageLower.includes("💰")) {
      return {
        text: "💰 Great! Our pricing is super competitive with amazing bulk discounts:\n\n🥉 10K-49K straws: Standard pricing\n🥈 50K-99K straws: 10% OFF\n🥇 100K-249K straws: 15% OFF\n💎 250K+ straws: 20% OFF\n\n✨ Plus FREE shipping on orders above ₹25,000!\n\nReady to place an order?",
        quickReplies: ["🛒 Yes, Order Now!", "📞 Call for Custom Quote", "📦 Request Samples First"],
        actions: [
          {
            label: "🛒 Start Quick Order",
            action: "start_order",
            icon: <ShoppingCart className="w-4 h-4" />,
            color: "bg-green-600",
          },
          {
            label: "💬 WhatsApp Quote",
            action: "whatsapp_quote",
            icon: <MessageSquare className="w-4 h-4" />,
            color: "bg-green-600",
          },
        ],
        type: "success" as const,
      }
    }

    // Contact/Expert
    if (userMessageLower.includes("expert") || userMessageLower.includes("call") || userMessageLower.includes("📞")) {
      return {
        text: "📞 I'll connect you with our expert team right away!\n\n👨‍💼 Our specialists are available:\n• Mon-Sat: 9 AM - 6 PM\n• Instant WhatsApp support\n• Free consultation calls\n\nHow would you like to connect?",
        quickReplies: ["📱 WhatsApp Now", "📞 Call Now", "📧 Send Email"],
        actions: [
          {
            label: "📱 WhatsApp Expert",
            action: "whatsapp_expert",
            icon: <MessageSquare className="w-4 h-4" />,
            color: "bg-green-600",
          },
          { label: "📞 Call Now", action: "call_now", icon: <Phone className="w-4 h-4" />, color: "bg-blue-600" },
        ],
        type: "info" as const,
      }
    }

    // Samples
    if (userMessageLower.includes("sample") || userMessageLower.includes("try") || userMessageLower.includes("test")) {
      return {
        text: "📦 Smart choice! Our sample pack is perfect for testing:\n\n✨ What's included:\n• 50 straws of each size (6.5mm to 13mm)\n• All 5 colors\n• Product info sheets\n• Bulk pricing guide\n\n💰 Sample cost: ₹299\n🎁 100% refundable on first bulk order of 50K+\n🚚 FREE shipping included!",
        quickReplies: ["📦 Order Sample Pack", "🛒 Skip to Bulk Order", "💬 Ask Questions"],
        actions: [
          {
            label: "📦 Order Samples Now",
            action: "order_samples",
            icon: <Package className="w-4 h-4" />,
            color: "bg-orange-600",
          },
          {
            label: "🛒 Go to Bulk Order",
            action: "start_order",
            icon: <ShoppingCart className="w-4 h-4" />,
            color: "bg-green-600",
          },
        ],
        type: "info" as const,
      }
    }

    // Default response
    return {
      text: "🤖 I'm here to make ordering super easy for you!\n\nHere's what I can help with:\n\n🛒 Quick 3-step ordering\n📦 Product information\n💰 Instant pricing\n📞 Connect with experts\n📦 Sample requests\n\nWhat would you like to do?",
      quickReplies: ["🛒 Quick Order", "📦 Browse Products", "💰 Get Pricing", "📞 Talk to Expert"],
      type: "info" as const,
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, false)
    simulateTyping()

    setTimeout(() => {
      const response = getResponse(inputValue)
      addMessage(response.text, true, response.quickReplies, response.actions, response.type, response.component)
    }, 1000)

    setInputValue("")
  }

  const handleQuickReply = (reply: string) => {
    addMessage(reply, false)
    simulateTyping()

    setTimeout(() => {
      const response = getResponse(reply)
      addMessage(response.text, true, response.quickReplies, response.actions, response.type, response.component)
    }, 1000)
  }

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case "start_order":
        addMessage("🛒 I want to place a quick order", false)
        simulateTyping()
        setTimeout(() => {
          addMessage(
            "🚀 Awesome! Let's get your order ready in 3 simple steps!\n\nStep 1: Choose your rice straw type",
            true,
            [],
            [],
            "order",
            "product-selector",
          )
        }, 1000)
        break

      case "whatsapp_quote":
        window.open(
          "https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27d%20like%20to%20get%20a%20quick%20quote%20for%20bulk%20rice%20straws.%20Can%20you%20help%20me%3F",
          "_blank",
        )
        break

      case "whatsapp_expert":
        window.open(
          "https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27d%20like%20to%20speak%20with%20an%20expert%20about%20your%20rice%20straws.%20Can%20you%20help%20me%3F",
          "_blank",
        )
        break

      case "call_now":
        window.location.href = "tel:+917760021026"
        break

      case "order_samples":
        window.open(
          "https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27d%20like%20to%20order%20a%20sample%20pack%20of%20your%20rice%20straws.%20Please%20help%20me%20with%20the%20process.",
          "_blank",
        )
        break

      default:
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const getMessageTypeStyles = (type?: Message["type"]) => {
    switch (type) {
      case "welcome":
        return "bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
      case "success":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
      case "info":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      case "order":
        return "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
      case "product":
        return "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  // Quick Order Product Selector
  const ProductSelector = () => {
    const handleProductSelect = (productId: string) => {
      setQuickOrder({ ...quickOrder, product: productId })
      const selectedProduct = products.find((p) => p.id === productId)

      addMessage(`${selectedProduct?.emoji} I want ${selectedProduct?.name}`, false)
      simulateTyping()

      setTimeout(() => {
        addMessage(
          `Great choice! ${selectedProduct?.emoji} ${selectedProduct?.name} is perfect for ${selectedProduct?.bestFor}.\n\nStep 2: Choose quantity and color:`,
          true,
          [],
          [],
          "order",
          "quick-order",
        )
      }, 1000)
    }

    return (
      <div className="bg-white p-3 rounded-xl border border-purple-200 mt-3 shadow-sm">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center text-sm">
          <Package className="w-4 h-4 mr-2" />
          Choose Your Rice Straw
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {products.map((product) => (
            <Button
              key={product.id}
              variant="outline"
              className="h-auto p-3 text-left hover:bg-green-50 border-green-200 transition-all duration-200 hover:scale-[1.02] text-xs"
              onClick={() => handleProductSelect(product.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{product.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs">{product.name}</div>
                    <div className="text-xs text-gray-600">{product.bestFor}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 text-xs">₹{product.price}</div>
                  <div className="text-xs text-gray-500">per straw</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // Quick Order Form
  const QuickOrderForm = () => {
    const selectedProduct = products.find((p) => p.id === quickOrder.product)

    const calculateTotal = () => {
      if (!selectedProduct) return 0
      let discount = 0
      if (quickOrder.quantity >= 250000) discount = 0.2
      else if (quickOrder.quantity >= 100000) discount = 0.15
      else if (quickOrder.quantity >= 50000) discount = 0.1

      const discountedPrice = selectedProduct.price * (1 - discount)
      const subtotal = discountedPrice * quickOrder.quantity
      const gst = subtotal * 0.18
      const shipping = subtotal > 25000 ? 0 : 500
      return subtotal + gst + shipping
    }

    const handleCompleteOrder = () => {
      if (!selectedProduct || !quickOrder.customerInfo.name || !quickOrder.customerInfo.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name and phone number to complete the order.",
          variant: "destructive",
        })
        return
      }

      const orderSummary = `🌾 QUICK ORDER - ROOTWAVE RICE STRAWS

📦 Product: ${selectedProduct.name}
📊 Quantity: ${quickOrder.quantity.toLocaleString()} straws
🎨 Color: ${quickOrder.color}
💰 Total: ₹${calculateTotal().toLocaleString()}

👤 Customer Details:
Name: ${quickOrder.customerInfo.name}
Business: ${quickOrder.customerInfo.business || "Not specified"}
Phone: ${quickOrder.customerInfo.phone}
Email: ${quickOrder.customerInfo.email || "Not specified"}

Please confirm this order and provide payment details.`

      const whatsappMessage = encodeURIComponent(orderSummary)
      window.open(`https://wa.me/917760021026?text=${whatsappMessage}`, "_blank")

      addMessage("✅ Order sent successfully!", true, ["🛒 Order More", "📞 Call Support"], [], "success")
    }

    return (
      <div className="bg-white p-3 rounded-xl border border-purple-200 mt-3 shadow-sm">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center text-sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Complete Your Order
        </h4>

        <div className="space-y-3">
          {/* Product Summary */}
          {selectedProduct && (
            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{selectedProduct.emoji}</span>
                  <span className="font-medium text-sm">{selectedProduct.name}</span>
                </div>
                <span className="font-bold text-green-600 text-sm">₹{selectedProduct.price}/straw</span>
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="text-xs font-medium mb-1 block">Quantity</label>
            <Select
              value={quickOrder.quantity.toString()}
              onValueChange={(value) => setQuickOrder({ ...quickOrder, quantity: Number.parseInt(value) })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">10,000 straws</SelectItem>
                <SelectItem value="25000">25,000 straws</SelectItem>
                <SelectItem value="50000">50,000 straws (10% OFF)</SelectItem>
                <SelectItem value="100000">100,000 straws (15% OFF)</SelectItem>
                <SelectItem value="250000">250,000 straws (20% OFF)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-xs font-medium mb-1 block">Color</label>
            <div className="grid grid-cols-5 gap-1">
              {colors.map((color) => (
                <Button
                  key={color.value}
                  variant={quickOrder.color === color.value ? "default" : "outline"}
                  size="sm"
                  className={`h-8 p-1 ${quickOrder.color === color.value ? "bg-green-600" : ""}`}
                  onClick={() => setQuickOrder({ ...quickOrder, color: color.value })}
                >
                  <div className="text-center">
                    <div className="text-sm">{color.emoji}</div>
                    <div className="text-xs leading-none">{color.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-2">
            <h5 className="font-medium text-gray-800 text-xs">Your Information</h5>
            <div className="grid grid-cols-1 gap-2">
              <Input
                placeholder="Your Name *"
                value={quickOrder.customerInfo.name}
                onChange={(e) =>
                  setQuickOrder({
                    ...quickOrder,
                    customerInfo: { ...quickOrder.customerInfo, name: e.target.value },
                  })
                }
                className="h-8 text-xs"
              />
              <Input
                placeholder="Business Name"
                value={quickOrder.customerInfo.business}
                onChange={(e) =>
                  setQuickOrder({
                    ...quickOrder,
                    customerInfo: { ...quickOrder.customerInfo, business: e.target.value },
                  })
                }
                className="h-8 text-xs"
              />
              <Input
                placeholder="Phone Number *"
                value={quickOrder.customerInfo.phone}
                onChange={(e) =>
                  setQuickOrder({
                    ...quickOrder,
                    customerInfo: { ...quickOrder.customerInfo, phone: e.target.value },
                  })
                }
                className="h-8 text-xs"
              />
              <Input
                placeholder="Email Address"
                value={quickOrder.customerInfo.email}
                onChange={(e) =>
                  setQuickOrder({
                    ...quickOrder,
                    customerInfo: { ...quickOrder.customerInfo, email: e.target.value },
                  })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded-lg border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 text-xs">Total Amount:</span>
              <span className="text-lg font-bold text-green-600">₹{calculateTotal().toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Includes GST and shipping</p>
          </div>

          {/* Complete Order Button */}
          <Button
            onClick={handleCompleteOrder}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-xs h-8"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Complete Order via WhatsApp
          </Button>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-96 shadow-2xl border-green-300 transition-all duration-300 ${isMinimized ? "h-16" : "h-[600px]"}`}
      >
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-base font-bold flex items-center">
                  RootBot
                  <Gift className="w-3 h-3 ml-1 text-yellow-300" />
                </CardTitle>
                <div className="flex items-center text-green-100 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                  <span>Easy Ordering Assistant</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-green-700 p-1 h-6 w-6"
              >
                <span className="text-sm">{isMinimized ? "▲" : "▼"}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-700 p-1 h-6 w-6">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          {!isMinimized && (
            <div className="mt-2 flex items-center justify-between text-xs text-green-100">
              <div className="flex items-center">
                <ShoppingCart className="w-3 h-3 mr-1" />
                <span>Quick Order</span>
              </div>
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-300" />
                <span>3-Step Process</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-3 h-3 mr-1 text-yellow-300" />
                <span>Instant Quote</span>
              </div>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] ${
                        message.isBot
                          ? `${getMessageTypeStyles(message.type)} border`
                          : "bg-gradient-to-r from-green-600 to-green-700 text-white"
                      } rounded-xl p-3 shadow-lg`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isBot && (
                          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {!message.isBot && (
                          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="w-3 h-3 text-green-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div
                            className={`text-xs leading-relaxed ${message.isBot ? "text-gray-800" : "text-white"}`}
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {message.text}
                          </div>
                          <p className={`text-xs mt-1 ${message.isBot ? "text-gray-500" : "text-green-100"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Components */}
                      {message.component === "product-selector" && <ProductSelector />}
                      {message.component === "quick-order" && <QuickOrderForm />}

                      {/* Quick Replies */}
                      {message.quickReplies && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {message.quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2 bg-white hover:bg-green-50 border-green-300 text-green-700 hover:text-green-800 transition-all duration-200 hover:scale-105 shadow-sm"
                              onClick={() => handleQuickReply(reply)}
                            >
                              {reply}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {message.actions && (
                        <div className="mt-3 space-y-1">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className={`w-full text-xs h-7 ${action.color || "bg-green-600"} text-white hover:opacity-90 border-none transition-all duration-200 hover:scale-105 shadow-sm`}
                              onClick={() => handleAction(action.action, action.data)}
                            >
                              <div className="flex items-center justify-center">
                                {action.icon && <span className="mr-1">{action.icon}</span>}
                                {action.label}
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 max-w-[85%] border shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">RootBot is helping...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Enhanced Input Area */}
            <div className="p-3 border-t bg-gradient-to-r from-gray-50 to-green-50">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="pr-8 border-green-300 focus:border-green-500 bg-white shadow-sm text-xs h-8"
                    disabled={isTyping}
                  />
                  {inputValue && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 h-8"
                  disabled={isTyping || !inputValue.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex justify-center space-x-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6"
                  onClick={() => handleQuickReply("🛒 Quick Order")}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Order
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6"
                  onClick={() => handleQuickReply("💰 Get Pricing")}
                >
                  <Calculator className="w-3 h-3 mr-1" />
                  Pricing
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6"
                  onClick={() => handleQuickReply("📦 Request Samples")}
                >
                  <Package className="w-3 h-3 mr-1" />
                  Samples
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6"
                  onClick={() => handleQuickReply("📞 Talk to Expert")}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Expert
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
