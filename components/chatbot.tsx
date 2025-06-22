"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
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
  HelpCircle,
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
  type?: "welcome" | "info" | "success" | "warning" | "error" | "order" | "product" | "faq"
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

type Product = {
  id: string
  name: string
  price: number
  emoji: string
  bestFor: string
}

type Color = {
  name: string
  value: string
  emoji: string
  hex: string
}

interface FAQ {
  id: string
  question: string
  keywords: string[]
  answer: string
  type?: Message["type"]
  quickReplies?: string[]
}

// Props for ProductSelectorComponent
interface ProductSelectorProps {
  products: Product[]
  onProductSelect: (productId: string) => void
}

// ProductSelector Component
const ProductSelectorComponent: React.FC<ProductSelectorProps> = ({ products, onProductSelect }) => {
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
            onClick={() => onProductSelect(product.id)}
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

// Props for QuickOrderFormComponent
interface QuickOrderFormProps {
  quickOrder: QuickOrder
  setQuickOrder: React.Dispatch<React.SetStateAction<QuickOrder>>
  products: Product[]
  colors: Color[]
  addMessage: (
    text: string,
    isBot: boolean,
    quickReplies?: string[],
    actions?: any[],
    type?: Message["type"],
    component?: Message["component"],
  ) => void
  toast: ({ title, description, variant }: { title: string; description: string; variant?: "default" | "destructive" | undefined }) => void
}

// QuickOrderForm Component
const QuickOrderFormComponent: React.FC<QuickOrderFormProps> = ({
  quickOrder,
  setQuickOrder,
  products,
  colors,
  addMessage,
  toast,
}) => {
  const selectedProduct = products.find((p) => p.id === quickOrder.product)

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    let discount = 0
    if (quickOrder.quantity >= 25000) discount = 0.2
    else if (quickOrder.quantity >= 10000) discount = 0.15
    else if (quickOrder.quantity >= 5000) discount = 0.1
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
    const orderSummary = `🌾 QUICK ORDER - ROOTWAVE RICE STRAWS\n\n📦 Product: ${selectedProduct.name}\n📊 Quantity: ${quickOrder.quantity.toLocaleString()} straws\n🎨 Color: ${quickOrder.color}\n💰 Total: ₹${calculateTotal().toLocaleString()} (incl. GST & Shipping)\n\n👤 Customer Details:\nName: ${quickOrder.customerInfo.name}\nBusiness: ${quickOrder.customerInfo.business || "Not specified"}\nPhone: ${quickOrder.customerInfo.phone}\nEmail: ${quickOrder.customerInfo.email || "Not specified"}\n\nPlease confirm this order and provide payment details.`
    const whatsappMessage = encodeURIComponent(orderSummary)
    window.open(`https://wa.me/917760021026?text=${whatsappMessage}`, "_blank")
    addMessage("✅ Order sent via WhatsApp! Our team will contact you shortly.", true, ["🛒 Order More", "📞 Call Support"], [], "success")
  }

  return (
    <div className="bg-white p-3 rounded-xl border border-purple-200 mt-3 shadow-sm">
      <h4 className="font-semibold text-purple-800 mb-3 flex items-center text-sm"><ShoppingCart className="w-4 h-4 mr-2" />Complete Your Order</h4>
      <div className="space-y-3">
        {selectedProduct && (
          <div className="bg-green-50 p-2 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"><span className="text-lg">{selectedProduct.emoji}</span><span className="font-medium text-sm">{selectedProduct.name}</span></div>
              <span className="font-bold text-green-600 text-sm">₹{selectedProduct.price}/straw</span>
            </div>
          </div>
        )}
        <div>
          <label className="text-xs font-medium mb-1 block">Quantity</label>
          <Select value={quickOrder.quantity.toString()} onValueChange={(value) => setQuickOrder({ ...quickOrder, quantity: Number.parseInt(value) })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1,000 straws</SelectItem><SelectItem value="2500">2,500 straws</SelectItem>
              <SelectItem value="5000">5,000 straws (10% OFF)</SelectItem><SelectItem value="10000">10,000 straws (15% OFF)</SelectItem>
              <SelectItem value="25000">25,000 straws (20% OFF)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Color</label>
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <Button key={color.value} variant={quickOrder.color === color.value ? "default" : "outline"} size="sm" className={`h-8 p-1 ${quickOrder.color === color.value ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-gray-100"}`} onClick={() => setQuickOrder({ ...quickOrder, color: color.value })}>
                <div className="text-center w-full"><div className="text-sm leading-tight">{color.emoji}</div><div className="text-[10px] leading-tight mt-0.5">{color.name}</div></div>
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium text-gray-800 text-xs">Your Information</h5>
          <div className="grid grid-cols-1 gap-2">
            <Input placeholder="Your Name *" value={quickOrder.customerInfo.name} onChange={(e) => setQuickOrder({ ...quickOrder, customerInfo: { ...quickOrder.customerInfo, name: e.target.value } })} className="h-8 text-xs" />
            <Input placeholder="Business Name" value={quickOrder.customerInfo.business} onChange={(e) => setQuickOrder({ ...quickOrder, customerInfo: { ...quickOrder.customerInfo, business: e.target.value } })} className="h-8 text-xs" />
            <Input placeholder="Phone Number *" value={quickOrder.customerInfo.phone} onChange={(e) => setQuickOrder({ ...quickOrder, customerInfo: { ...quickOrder.customerInfo, phone: e.target.value } })} className="h-8 text-xs" />
            <Input placeholder="Email Address" value={quickOrder.customerInfo.email} onChange={(e) => setQuickOrder({ ...quickOrder, customerInfo: { ...quickOrder.customerInfo, email: e.target.value } })} className="h-8 text-xs" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded-lg border">
          <div className="flex justify-between items-center"><span className="font-semibold text-gray-800 text-xs">Total Amount:</span><span className="text-lg font-bold text-green-600">₹{calculateTotal().toLocaleString()}</span></div>
          <p className="text-xs text-gray-600 mt-1">Includes GST and estimated shipping</p>
        </div>
        <Button onClick={handleCompleteOrder} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-xs h-8" disabled={!selectedProduct || !quickOrder.customerInfo.name || !quickOrder.customerInfo.phone}>
          <CheckCircle className="w-3 h-3 mr-1" />Complete Order via WhatsApp
        </Button>
      </div>
    </div>
  )
}

// Main Chatbot Component
export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [quickOrder, setQuickOrder] = useState<QuickOrder>({
    product: "", quantity: 1000, color: "white",
    customerInfo: { name: "", business: "", phone: "", email: "" },
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { dispatch } = useCart()
  const { toast } = useToast()

  // FAQ Pagination State and Constants
  const [faqPage, setFaqPage] = useState(0);
  const FAQ_TRIGGER_TEXT = "🤔 Ask a Question";
  const FAQ_NEXT_PAGE_PREFIX = "➡️ Next Questions";
  const FAQ_PREV_PAGE_PREFIX = "⬅️ Previous Questions";
  const FAQS_PER_PAGE = 3;


  const products: Product[] = [
    { id: "6.5mm", name: "6.5mm Rice Straw", price: 1.75, emoji: "🥤", bestFor: "Water, Tea, Juice" },
    { id: "8mm", name: "8mm Rice Straw", price: 2.2, emoji: "🥛", bestFor: "Smoothies, Milkshakes" },
    { id: "10mm", name: "10mm Rice Straw", price: 2.99, emoji: "🧋", bestFor: "Thick Drinks, Shakes" },
    { id: "13mm", name: "13mm Rice Straw", price: 4.15, emoji: "🧋", bestFor: "Bubble Tea, Slushies" },
  ]

  const colors: Color[] = [
    { name: "White", value: "white", emoji: "⚪", hex: "#FFFFFF" }, { name: "Orange", value: "orange", emoji: "🟠", hex: "#FF6B35" },
    { name: "Green", value: "green", emoji: "🟢", hex: "#4CAF50" }, { name: "Black", value: "black", emoji: "⚫", hex: "#000000" },
    { name: "Red", value: "red", emoji: "🔴", hex: "#F44336" },
  ]

  const faqs: FAQ[] = [
    { id: "faq-material", question: "What are your straws made of?", keywords: ["made of", "material", "ingredients", "what are straws made from", "composition"], answer: "Our straws are made from 100% natural rice flour and tapioca starch, colored with vegetable and fruit extracts. This makes them completely biodegradable and safe!", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
    { id: "faq-ecofriendly", question: "Are the straws eco-friendly?", keywords: ["eco-friendly", "biodegradable", "environment", "sustainable", "plastic free", "green"], answer: "Absolutely! Our rice straws are 100% biodegradable and compostable. They break down naturally, unlike plastic straws, offering a fantastic, sustainable alternative that helps protect our planet.", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
    { id: "faq-duration", question: "How long do straws last in drinks?", keywords: ["how long", "last", "drink", "duration", "soggy", "dissolve", "durability"], answer: "Our rice straws are designed for durability. They typically last for 1-2 hours in cold drinks and about 30-60 minutes in warm (not hot) drinks without becoming mushy or altering the taste of your beverage.", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
    { id: "faq-edible", question: "Can I eat the straws?", keywords: ["eat", "edible", "taste", "consume"], answer: "While they are made from food-grade ingredients (rice flour, tapioca starch), they are primarily designed for drinking. They are safe if accidentally ingested in small amounts but are not intended as a food product. Their taste is neutral.", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
    { id: "faq-sizes", question: "What sizes do you offer?", keywords: ["sizes", "diameters", "types of straws", "dimensions", "measurements"], answer: "We offer a range of sizes to suit all your beverage needs:\n• 6.5mm: Ideal for juices, water, and thin liquids.\n• 8mm: Perfect for smoothies and milkshakes.\n• 10mm: Great for thicker shakes.\n• 13mm: Best for bubble tea and slushies.\n\nEach size is crafted to enhance your drinking experience!", quickReplies: ["📦 Browse Products", "💰 Get Pricing", FAQ_TRIGGER_TEXT], type: "faq"},
    { id: "faq-colors", question: "What colors are available?", keywords: ["colors", "colours", "shades", "hues", "options"], answer: "Our straws come in a vibrant range of natural colors derived from vegetable and fruit extracts! We offer White ⚪, Orange 🟠, Green 🟢, Black ⚫, and Red 🔴. You can choose a single color or a mix.", quickReplies: ["🛒 Quick Order", "📦 Request Samples", FAQ_TRIGGER_TEXT], type: "faq"},
    { id: "faq-shelf-life", question: "What's the shelf life?", keywords: ["shelf life", "expiry", "storage", "how long do they keep"], answer: "Our rice straws have a shelf life of approximately 18-24 months when stored in a cool, dry place away from direct sunlight and moisture. Proper storage ensures they remain in perfect condition.", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
    { id: "faq-moq", question: "What's the minimum order?", keywords: ["minimum order", "moq", "smallest order", "least i can buy"], answer: "Our minimum order quantity for bulk purchases typically starts from 1,000 straws. We also offer smaller sample packs if you'd like to try them first!", quickReplies: ["📦 Order Sample Pack", "💰 Get Pricing for 1000", FAQ_TRIGGER_TEXT], type: "faq"},
    { id: "faq-shipping-time", question: "How long does shipping take?", keywords: ["shipping time", "delivery time", "how long to receive", "dispatch"], answer: "Shipping times vary based on your location within India. Typically, orders are dispatched within 1-2 business days, and delivery can take 3-7 business days. We'll provide a tracking number once your order is shipped.", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
    { id: "faq-bulk-discount", question: "Do you offer bulk discounts?", keywords: ["bulk discount", "wholesale", "large order", "discount for quantity"], answer: "Yes, we offer attractive discounts for bulk orders! \n🥉 1K-4.9K straws: Standard\n🥈 5K-9.9K: 10% OFF\n🥇 10K-24.9K: 15% OFF\n💎 25K+: 20% OFF\nPlus, FREE shipping on orders over ₹25,000!", quickReplies: ["💰 Get Pricing", "🛒 Quick Order", FAQ_TRIGGER_TEXT], type: "faq"},
    { id: "faq-customization", question: "Can straws be customized?", keywords: ["custom", "branding", "logo", "personalized", "customized"], answer: "We are exploring options for custom branding on packaging for very large orders. For straw customization itself, please contact our sales team to discuss possibilities and minimum order quantities.", quickReplies: ["📞 Talk to Expert", "📧 Send Email", FAQ_TRIGGER_TEXT], type: "faq"},
    { id: "faq-hot-drinks", question: "Are they suitable for hot drinks?", keywords: ["hot drinks", "coffee", "tea", "warm beverages"], answer: "Our rice straws are best suited for cold and warm (not boiling hot) beverages. While they hold up better than paper straws in warm drinks, very hot temperatures can soften them more quickly. For hot drinks, we recommend using them with caution and for shorter durations.", type: "faq", quickReplies: [FAQ_TRIGGER_TEXT, "🛒 Quick Order"]},
  ]

  const scrollToBottom = useCallback(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [])
  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setFaqPage(0); // Reset FAQ page when chat opens fresh
      const welcomeMessage: Message = {
        id: "welcome-" + Date.now(),
        text: "🌟 Welcome! I'm RootBot, your personal ordering assistant!\n\nI can help you place orders, get pricing, or answer your questions.\n\nHow can I assist you today?",
        isBot: true, timestamp: new Date(), type: "welcome",
        quickReplies: ["🛒 Quick Order", "📦 Browse Products", "💰 Get Pricing", FAQ_TRIGGER_TEXT],
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen]) // Removed messages.length to ensure it fires once on open if no messages

  const addMessage = useCallback(
    (text: string, isBot: boolean, quickReplies?: string[], actions?: Message["actions"], type?: Message["type"], component?: Message["component"]) => {
      const newMessage: Message = {
        id: Date.now().toString() + (isBot ? "-bot" : "-user"), text, isBot, timestamp: new Date(), quickReplies, actions, type, component,
      }
      setMessages((prev) => [...prev, newMessage])
    }, [],
  )

  const simulateTyping = useCallback((duration = 1000) => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), duration)
  }, [])

  const getResponse = useCallback((userMessage: string, currentFaqPageToDisplay: number) => {
    const userMessageLower = userMessage.toLowerCase().trim();

    // 1. General FAQ Listing Request
    if (userMessageLower === FAQ_TRIGGER_TEXT.toLowerCase() ||
        userMessageLower === "faq" || userMessageLower === "faqs" || userMessageLower === "help") {
        const paginatedFaqs = faqs.slice(currentFaqPageToDisplay * FAQS_PER_PAGE, (currentFaqPageToDisplay + 1) * FAQS_PER_PAGE);
        const quickRepliesResult: string[] = [];

        if (currentFaqPageToDisplay > 0) {
            quickRepliesResult.push(`${FAQ_PREV_PAGE_PREFIX} (Page ${currentFaqPageToDisplay})`); // Page number is 1-based for user
        }
        quickRepliesResult.push(...paginatedFaqs.map(f => f.question));
        if (faqs.length > (currentFaqPageToDisplay + 1) * FAQS_PER_PAGE) {
            quickRepliesResult.push(`${FAQ_NEXT_PAGE_PREFIX} (Page ${currentFaqPageToDisplay + 2})`); // Next page number
        }

        if (paginatedFaqs.length === 0) { // No FAQs on this page
            if (currentFaqPageToDisplay > 0) { // Was not the first page
                return {
                    text: "Looks like you've seen all the FAQs!",
                    quickReplies: [`${FAQ_PREV_PAGE_PREFIX} (Page ${currentFaqPageToDisplay})`, "🛒 Quick Order", "📞 Talk to Expert"],
                    type: "faq" as const,
                };
            } else { // No FAQs at all
                return {
                    text: "I don't have any FAQs listed at the moment. How else can I help?",
                    quickReplies: ["🛒 Quick Order", "📞 Talk to Expert"],
                    type: "info" as const,
                };
            }
        }
        return {
            text: `Page ${currentFaqPageToDisplay + 1} of FAQs. Select one or navigate:`,
            quickReplies: quickRepliesResult,
            type: "faq" as const,
        };
    }

    // 2. Check for specific FAQ match (keywords or exact question from a quick reply)
    for (const faq of faqs) {
      if (faq.keywords.some(keyword => userMessageLower.includes(keyword)) || userMessageLower === faq.question.toLowerCase()) {
        return {
          text: faq.answer,
          quickReplies: faq.quickReplies || [FAQ_TRIGGER_TEXT, "🛒 Quick Order"],
          type: faq.type || "faq" as const,
        };
      }
    }

    // 3. Other core intents
    if (userMessageLower.includes("order") || userMessageLower.includes("buy") || userMessageLower.includes("🛒")) { return { text: "🚀 Perfect! Let's create your order in 3 simple steps!\n\nFirst, choose your rice straw type:", component: "product-selector" as const, type: "order" as const } }
    if (userMessageLower.includes("product") || userMessageLower.includes("browse") || userMessageLower.includes("📦")) { return { text: "🌾 Here are our rice straws! Each one is 100% biodegradable and eco-friendly:\n\nClick on any product to learn more or start ordering:", component: "product-selector" as const, quickReplies: ["🛒 Order Now", "💰 Get Pricing", "📦 Request Samples"], type: "product" as const } }
    if (userMessageLower.includes("price") || userMessageLower.includes("cost") || userMessageLower.includes("💰")) { return { text: "💰 Great! Our pricing is super competitive with amazing bulk discounts:\n\n🥉 1K-4.9K straws: Standard pricing\n🥈 5K-9.9K straws: 10% OFF\n🥇 10K-24.9K straws: 15% OFF\n💎 25K+ straws: 20% OFF\n\n✨ Plus FREE shipping on orders above ₹25,000!\n\nReady to place an order?", quickReplies: ["🛒 Yes, Order Now!", "📞 Call for Custom Quote", "📦 Request Samples First"], actions: [{ label: "🛒 Start Quick Order", action: "start_order", icon: <ShoppingCart className="w-4 h-4" />, color: "bg-green-600" }, { label: "💬 WhatsApp Quote", action: "whatsapp_quote", icon: <MessageSquare className="w-4 h-4" />, color: "bg-green-600" }], type: "success" as const } }
    if (userMessageLower.includes("expert") || userMessageLower.includes("call") || userMessageLower.includes("📞")) { return { text: "📞 I'll connect you with our expert team right away!\n\n👨‍💼 Our specialists are available:\n• Mon-Sat: 9 AM - 6 PM\n• Instant WhatsApp support\n• Free consultation calls\n\nHow would you like to connect?", quickReplies: ["📱 WhatsApp Now", "📞 Call Now", "📧 Send Email"], actions: [{ label: "📱 WhatsApp Expert", action: "whatsapp_expert", icon: <MessageSquare className="w-4 h-4" />, color: "bg-green-600" }, { label: "📞 Call Now", action: "call_now", icon: <Phone className="w-4 h-4" />, color: "bg-blue-600" }], type: "info" as const } }
    if (userMessageLower.includes("sample") || userMessageLower.includes("try") || userMessageLower.includes("test")) { return { text: "📦 Smart choice! Our sample pack is perfect for testing:\n\n✨ What's included:\n• 50 straws of each size (6.5mm to 13mm)\n• All 5 colors\n• Product info sheets\n• Bulk pricing guide\n\n💰 Sample cost: ₹299\n🎁 100% refundable on first bulk order of 5K+\n🚚 FREE shipping included!", quickReplies: ["📦 Order Sample Pack", "🛒 Skip to Bulk Order", "💬 Ask Questions"], actions: [{ label: "📦 Order Samples Now", action: "order_samples", icon: <Package className="w-4 h-4" />, color: "bg-orange-600" }, { label: "🛒 Go to Bulk Order", action: "start_order", icon: <ShoppingCart className="w-4 h-4" />, color: "bg-green-600" }], type: "info" as const } }

    // 4. Default fallback
    return { text: "🤖 I'm sorry, I didn't quite understand that. I can help with:\n\n🛒 Quick Ordering\n📦 Product Info\n💰 Pricing Details\n📞 Connecting with Experts\n🤔 Answering Common Questions\n\nWhat would you like to do?", quickReplies: ["🛒 Quick Order", FAQ_TRIGGER_TEXT, "💰 Get Pricing", "📞 Talk to Expert"], type: "info" as const }
  }, [faqs]); // faqs is a dependency

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    const currentInput = inputValue;
    addMessage(currentInput, false);
    const newFaqPage = 0; // Reset FAQ page on any new typed message
    setFaqPage(newFaqPage);
    simulateTyping();
    setTimeout(() => {
        const response = getResponse(currentInput, newFaqPage);
        addMessage(response.text, true, response.quickReplies, response.actions, response.type, response.component);
    }, 1000);
    setInputValue("");
    inputRef.current?.focus();
  }, [inputValue, addMessage, simulateTyping, getResponse, setFaqPage]);

  const handleQuickReply = useCallback((reply: string) => {
    addMessage(reply, false); // Add user's click first

    let newFaqPage = faqPage; // Start with current page state
    let skipStandardGetResponse = false;
    let botResponsePayload: Message | null = null; // To hold directly constructed response for pagination

    if (reply.startsWith(FAQ_NEXT_PAGE_PREFIX)) {
        newFaqPage = faqPage + 1;
        skipStandardGetResponse = true;
    } else if (reply.startsWith(FAQ_PREV_PAGE_PREFIX)) {
        newFaqPage = Math.max(0, faqPage - 1);
        skipStandardGetResponse = true;
    } else {
        // Any other quick reply (specific FAQ, order, price etc.) resets page context for next general FAQ trigger
        newFaqPage = 0;
    }
    setFaqPage(newFaqPage); // Update state for next general FAQ trigger or if pagination was used

    simulateTyping();

    setTimeout(() => {
        if (skipStandardGetResponse) { // It was a pagination command
            const paginatedFaqs = faqs.slice(newFaqPage * FAQS_PER_PAGE, (newFaqPage + 1) * FAQS_PER_PAGE);
            const quickRepliesResult: string[] = [];

            if (newFaqPage > 0) {
                quickRepliesResult.push(`${FAQ_PREV_PAGE_PREFIX} (Page ${newFaqPage})`);
            }
            quickRepliesResult.push(...paginatedFaqs.map(f => f.question));
            if (faqs.length > (newFaqPage + 1) * FAQS_PER_PAGE) {
                quickRepliesResult.push(`${FAQ_NEXT_PAGE_PREFIX} (Page ${newFaqPage + 2})`);
            }

            let text;
            if (paginatedFaqs.length === 0) {
                if (newFaqPage > 0) text = "You've reached the end of the FAQs on this side!";
                else text = "No FAQs seem to be listed currently.";
                quickRepliesResult.push("🛒 Quick Order", "📞 Talk to Expert"); // Offer other options
            } else {
                text = `Displaying page ${newFaqPage + 1} of FAQs:`;
            }
             addMessage(text, true, quickRepliesResult, undefined, "faq");

        } else { // Not a pagination command, use standard getResponse
            const response = getResponse(reply, newFaqPage); // newFaqPage is 0 here
            addMessage(response.text, true, response.quickReplies, response.actions, response.type, response.component);
        }
    }, 1000);

    inputRef.current?.focus();
  }, [faqPage, addMessage, simulateTyping, getResponse, faqs, setFaqPage]);


  const handleAction = useCallback((action: string, _data?: any) => {
    setFaqPage(0); // Reset FAQ context if an action button is clicked
    switch (action) {
      case "start_order": addMessage("🛒 I want to place a quick order", false); simulateTyping(); setTimeout(() => { addMessage("🚀 Awesome! Let's get your order ready in 3 simple steps!\n\nStep 1: Choose your rice straw type", true, [], [], "order", "product-selector") }, 1000); break
      case "whatsapp_quote": window.open("https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27d%20like%20to%20get%20a%20quick%20quote%20for%20bulk%20rice%20straws.", "_blank"); break
      case "whatsapp_expert": window.open("https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27d%20like%20to%20speak%20with%20an%20expert.", "_blank"); break
      case "call_now": window.location.href = "tel:+917760021026"; break
      case "order_samples": window.open("https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27d%20like%20to%20order%20a%20sample%20pack.", "_blank"); break
    }
    inputRef.current?.focus()
  }, [addMessage, simulateTyping, setFaqPage])

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }

  const getMessageTypeStyles = (type?: Message["type"]) => {
    switch (type) {
      case "welcome": return "bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
      case "success": return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
      case "info": return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      case "order": return "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
      case "product": return "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200"
      case "faq": return "bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200"
      default: return "bg-gray-50 border-gray-200"
    }
  }

  const handleProductSelection = useCallback((productId: string) => {
    setFaqPage(0); // Reset FAQ context
    setQuickOrder((prev) => ({ ...prev, product: productId }))
    const selectedProduct = products.find((p) => p.id === productId)
    if (selectedProduct) {
      addMessage(`${selectedProduct.emoji} I want ${selectedProduct.name}`, false)
      simulateTyping()
      setTimeout(() => { addMessage(`Great choice! ${selectedProduct.emoji} ${selectedProduct.name} is perfect for ${selectedProduct.bestFor}.\n\nStep 2: Choose quantity and color:`, true, [], [], "order", "quick-order") }, 1000)
    }
  }, [products, addMessage, simulateTyping, setQuickOrder, setFaqPage])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-96 shadow-2xl border-green-300 transition-all duration-300 ${isMinimized ? "h-16" : "h-[600px]"}`}>
        <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"><Bot className="w-5 h-5 text-green-600" /></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center"><Sparkles className="w-2 h-2 text-white" /></div>
              </div>
              <div>
                <CardTitle className="text-base font-bold flex items-center">RootBot<Gift className="w-3 h-3 ml-1 text-yellow-300" /></CardTitle>
                <div className="flex items-center text-green-100 text-xs"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div><span>Easy Ordering Assistant</span></div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:bg-green-700 p-1 h-6 w-6"><span className="text-sm">{isMinimized ? "▲" : "▼"}</span></Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-700 p-1 h-6 w-6"><X className="w-3 h-3" /></Button>
            </div>
          </div>
          {!isMinimized && (
            <div className="mt-2 flex items-center justify-between text-xs text-green-100">
              <div className="flex items-center"><ShoppingCart className="w-3 h-3 mr-1" /><span>Quick Order</span></div>
              <div className="flex items-center"><HelpCircle className="w-3 h-3 mr-1" /><span>FAQs</span></div>
              <div className="flex items-center"><Zap className="w-3 h-3 mr-1 text-yellow-300" /><span>Instant Quote</span></div>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-64px)]">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] ${message.isBot ? `${getMessageTypeStyles(message.type)} border` : "bg-gradient-to-r from-green-600 to-green-700 text-white"} rounded-xl p-3 shadow-lg`}>
                      <div className="flex items-start space-x-2">
                        {message.isBot && (<div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3 h-3 text-white" /></div>)}
                        {!message.isBot && (<div className="order-last ml-2 w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-3 h-3 text-green-600" /></div>)}
                        <div className={`flex-1 ${!message.isBot ? 'order-first' : ''}`}>
                          <div className={`text-xs leading-relaxed ${message.isBot ? "text-gray-800" : "text-white"}`} style={{ whiteSpace: "pre-line" }}>{message.text}</div>
                          <p className={`text-xs mt-1 ${message.isBot ? "text-gray-500" : "text-green-100"} ${!message.isBot ? 'text-right' : ''}`}>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                      {message.component === "product-selector" && (<ProductSelectorComponent products={products} onProductSelect={handleProductSelection} />)}
                      {message.component === "quick-order" && (<QuickOrderFormComponent quickOrder={quickOrder} setQuickOrder={setQuickOrder} products={products} colors={colors} addMessage={addMessage} toast={toast} />)}
                      {message.quickReplies && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {message.quickReplies.map((reply, index) => (<Button key={index} variant="outline" size="sm" className="text-xs h-auto py-1 px-2 bg-white hover:bg-green-50 border-green-300 text-green-700 hover:text-green-800 transition-all duration-200 hover:scale-105 shadow-sm" onClick={() => handleQuickReply(reply)}>{reply}</Button>))}
                        </div>
                      )}
                      {message.actions && (
                        <div className="mt-3 space-y-1">
                          {message.actions.map((action, index) => (<Button key={index} variant="outline" size="sm" className={`w-full text-xs h-7 ${action.color || "bg-green-600"} text-white hover:opacity-90 border-none transition-all duration-200 hover:scale-105 shadow-sm`} onClick={() => handleAction(action.action, action.data)}><div className="flex items-center justify-center">{action.icon && <span className="mr-1">{action.icon}</span>}{action.label}<ArrowRight className="w-3 h-3 ml-1" /></div></Button>))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 max-w-[85%] border shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"><Bot className="w-3 h-3 text-white" /></div>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
            <div className="p-3 border-t bg-gradient-to-r from-gray-50 to-green-50">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message or ask a question..." className="pr-8 border-green-300 focus:border-green-500 bg-white shadow-sm text-xs h-8" disabled={isTyping} />
                  {inputValue && !isTyping && (<div className="absolute right-2 top-1/2 transform -translate-y-1/2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div></div>)}
                </div>
                <Button onClick={handleSendMessage} size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 h-8" disabled={isTyping || !inputValue.trim()}><Send className="w-3 h-3" /></Button>
              </div>
              <div className="flex justify-center space-x-1 mt-2">
                <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6" onClick={() => handleQuickReply("🛒 Quick Order")}><ShoppingCart className="w-3 h-3 mr-1" />Order</Button>
                <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6" onClick={() => handleQuickReply("💰 Get Pricing")}><Calculator className="w-3 h-3 mr-1" />Pricing</Button>
                <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6" onClick={() => handleQuickReply(FAQ_TRIGGER_TEXT)}><HelpCircle className="w-3 h-3 mr-1" />FAQs</Button>
                <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 h-6" onClick={() => handleQuickReply("📞 Talk to Expert")}><Phone className="w-3 h-3 mr-1" />Expert</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}