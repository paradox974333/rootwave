"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Phone, Truck, Building, Mail, MessageCircle, CheckCircle, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"

interface FormData {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  orderMethod: string
  businessName: string
  gstNumber: string
}

export function CheckoutForm() {
  const { state, dispatch } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    orderMethod: "email_quote",
    businessName: "",
    gstNumber: "",
  })

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  const gst = state.total * 0.18 // 18% GST
  const shipping = state.total > 25000 ? 0 : 500 // Free shipping above ₹25,000
  const finalTotal = state.total + gst + shipping

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}

    if (!formData.businessName.trim()) errors.businessName = "Business name is required"
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) errors.phone = "Phone number must be 10 digits"
    if (!formData.address.trim()) errors.address = "Address is required"
    if (!formData.city.trim()) errors.city = "City is required"
    if (!formData.state.trim()) errors.state = "State is required"
    if (!formData.pincode.trim()) errors.pincode = "PIN code is required"
    else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "PIN code must be 6 digits"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generateOrderSummary = () => {
    let orderSummary = `🌾 BULK ORDER REQUEST - ROOTWAVE RICE STRAWS\n\n`
    orderSummary += `🏢 BUSINESS INFORMATION:\n`
    orderSummary += `Business Name: ${formData.businessName}\n`
    orderSummary += `Contact Person: ${formData.firstName} ${formData.lastName}\n`
    orderSummary += `Email: ${formData.email}\n`
    orderSummary += `Phone: ${formData.phone}\n`
    if (formData.gstNumber) orderSummary += `GST Number: ${formData.gstNumber}\n`

    orderSummary += `\n🚚 SHIPPING ADDRESS:\n`
    orderSummary += `${formData.address}\n`
    orderSummary += `${formData.city}, ${formData.state} - ${formData.pincode}\n`

    orderSummary += `\n📦 ORDER DETAILS:\n`
    state.items.forEach((item, index) => {
      orderSummary += `${index + 1}. ${item.name} (${item.diameter})\n`
      orderSummary += `   🎨 Color: ${item.color}\n`
      orderSummary += `   📊 Quantity: ${item.quantity.toLocaleString()} straws\n`
      orderSummary += `   💰 Price: ₹${item.price.toFixed(2)} per straw\n`
      orderSummary += `   💵 Subtotal: ₹${(item.price * item.quantity).toLocaleString()}\n\n`
    })

    orderSummary += `💳 ORDER SUMMARY:\n`
    orderSummary += `Subtotal: ₹${state.total.toLocaleString()}\n`
    orderSummary += `GST (18%): ₹${gst.toLocaleString()}\n`
    orderSummary += `Shipping: ${shipping === 0 ? "Free ✅" : `₹${shipping.toLocaleString()}`}\n`
    orderSummary += `TOTAL: ₹${finalTotal.toLocaleString()}\n\n`

    const orderMethodText = {
      email_quote: "📧 Email Quote Request",
      whatsapp_quote: "💬 WhatsApp Quote Request",
      phone_quote: "📞 Phone Quote Request",
    }

    orderSummary += `📋 ORDER METHOD: ${orderMethodText[formData.orderMethod as keyof typeof orderMethodText]}\n\n`
    orderSummary += `Please provide a detailed quote and confirm the order details.\n`
    orderSummary += `We look forward to doing business with you! 🤝\n\n`
    orderSummary += `Best regards,\n${formData.firstName} ${formData.lastName}\n${formData.businessName}\n\n`
    orderSummary += `🌱 Together for a sustainable future! 🌍`

    return orderSummary
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "❌ Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const orderSummary = generateOrderSummary()

      if (formData.orderMethod === "whatsapp_quote") {
        // WhatsApp integration
        const whatsappMessage = encodeURIComponent(orderSummary)
        const whatsappLink = `https://wa.me/917760021026?text=${whatsappMessage}`

        window.open(whatsappLink, "_blank")

        toast({
          title: "💬 WhatsApp Opened Successfully!",
          description:
            "WhatsApp has been opened with your order details. Please send the message to complete your order request.",
        })
      } else if (formData.orderMethod === "phone_quote") {
        // Phone call with order details copied to clipboard
        try {
          await navigator.clipboard.writeText(orderSummary)
          toast({
            title: "📋 Order Details Copied!",
            description: "Order details copied to clipboard. Calling our team now...",
          })
        } catch (error) {
          console.log("Clipboard not available, showing order details")
        }

        // Open phone dialer
        window.location.href = "tel:+917760021026"

        // Show order details in a new window for reference
        const orderWindow = window.open("", "_blank", "width=700,height=900,scrollbars=yes")
        if (orderWindow) {
          orderWindow.document.write(`
            <html>
              <head>
                <title>📞 Order Details - Rootwave</title>
                <style>
                  body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    padding: 30px; 
                    line-height: 1.8; 
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    margin: 0;
                  }
                  .container {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    max-width: 600px;
                    margin: 0 auto;
                  }
                  h2 { 
                    color: #16a34a; 
                    text-align: center; 
                    margin-bottom: 30px;
                    font-size: 24px;
                  }
                  pre { 
                    background: #f8fafc; 
                    padding: 20px; 
                    border-radius: 10px; 
                    white-space: pre-wrap; 
                    border-left: 4px solid #16a34a;
                    font-size: 14px;
                    line-height: 1.6;
                  }
                  .highlight {
                    background: #dcfce7;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                    border: 1px solid #16a34a;
                  }
                  .footer {
                    text-align: center;
                    margin-top: 30px;
                    color: #6b7280;
                    font-size: 12px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>📞 Order Details for Phone Call</h2>
                  <pre>${orderSummary}</pre>
                  <div class="highlight">
                    <strong>📋 Please reference these details during your call with our team.</strong>
                    <br><br>
                    📞 <strong>Calling:</strong> +91 77600 21026<br>
                    ⏰ <strong>Business Hours:</strong> 9:00 AM - 6:00 PM (Mon-Sat)
                  </div>
                  <div class="footer">
                    🌱 Rootwave - Sustainable Solutions for a Better Tomorrow
                  </div>
                </div>
              </body>
            </html>
          `)
        }
      } else {
        // Email integration (default)
        const subject = encodeURIComponent(`🌾 Bulk Order Request - ${formData.businessName}`)
        const body = encodeURIComponent(orderSummary)
        const mailtoLink = `mailto:info@rootwave.org?subject=${subject}&body=${body}`

        window.location.href = mailtoLink

        toast({
          title: "📧 Email Client Opened Successfully!",
          description:
            "Your email client has been opened with your order details. Please send the email to complete your order request.",
        })
      }

      // Clear cart after successful order
      setTimeout(() => {
        dispatch({ type: "CLEAR_CART" })
        toast({
          title: "🛒 Cart Cleared",
          description: "Your cart has been cleared. Thank you for your order request!",
        })
      }, 3000)
    } catch (error) {
      console.error("Order processing error:", error)
      toast({
        title: "❌ Processing Error",
        description: "Failed to process order. Please contact us directly at info@rootwave.org or +91 77600 21026",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Loading checkout..." />
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
          <p className="text-gray-600 mb-8">Add some eco-friendly rice straws to get started with your bulk order.</p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          >
            🛍️ Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Order Summary */}
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            Order Summary
          </CardTitle>
          <CardDescription className="text-green-700">
            Review your bulk order details before requesting a quote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {state.items.map((item, index) => (
            <div key={`${item.id}-${item.color}`} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">{index + 1}</span>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <span>📏 {item.diameter}</span>
                    <span>🎨 {item.color}</span>
                    <span>📊 {item.quantity.toLocaleString()} straws</span>
                    <span>💰 ₹{item.price.toFixed(2)}/straw</span>
                  </div>
                  {item.quantity >= 50000 && (
                    <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-800">
                      🎉 Bulk Discount Applied
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}

          <Separator className="my-6" />

          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{state.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (18%):</span>
              <span className="font-medium">₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-green-600 font-semibold">Free ✅</span>
                ) : (
                  `₹${shipping.toLocaleString()}`
                )}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Note:</strong> GST (18%) included. Free shipping on orders above ₹25,000
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center text-green-800">
            <Users className="w-5 h-5 mr-2" />
            Request Quote
          </CardTitle>
          <CardDescription className="text-green-700">
            Complete your bulk order request by providing your business details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="bg-green-600 p-2 rounded-lg mr-3">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business/Company Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className={`mt-1 ${formErrors.businessName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="Enter your business name"
                    disabled={isProcessing}
                  />
                  {formErrors.businessName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {formErrors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">
                    GST Number (Optional)
                  </Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                    className="mt-1 border-gray-300 focus:border-green-500"
                    placeholder="Enter GST number if available"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Contact Person Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`mt-1 ${formErrors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="First name"
                    disabled={isProcessing}
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`mt-1 ${formErrors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="Last name"
                    disabled={isProcessing}
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-1 ${formErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  placeholder="your@email.com"
                  disabled={isProcessing}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`mt-1 ${formErrors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  placeholder="10-digit mobile number"
                  disabled={isProcessing}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 p-2 rounded-lg mr-3">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Complete Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={`mt-1 ${formErrors.address ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  placeholder="Complete address with landmark"
                  rows={3}
                  disabled={isProcessing}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`mt-1 ${formErrors.city ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="City"
                    disabled={isProcessing}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`mt-1 ${formErrors.state ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="State"
                    disabled={isProcessing}
                  />
                  {formErrors.state && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {formErrors.state}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                  PIN Code *
                </Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className={`mt-1 ${formErrors.pincode ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  placeholder="6-digit PIN code"
                  disabled={isProcessing}
                />
                {formErrors.pincode && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {formErrors.pincode}
                  </p>
                )}
              </div>
            </div>

            {/* Order Method */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="bg-orange-600 p-2 rounded-lg mr-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Choose Order Method</h3>
              </div>

              <Select
                value={formData.orderMethod}
                onValueChange={(value) => handleInputChange("orderMethod", value)}
                disabled={isProcessing}
              >
                <SelectTrigger className="border-gray-300 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email_quote">
                    <div className="flex items-center py-2">
                      <Mail className="w-4 h-4 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">📧 Email Quote Request</div>
                        <div className="text-xs text-gray-500">Recommended - Professional & Detailed</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp_quote">
                    <div className="flex items-center py-2">
                      <MessageCircle className="w-4 h-4 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">💬 WhatsApp Quote Request</div>
                        <div className="text-xs text-gray-500">Instant - Quick Response</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone_quote">
                    <div className="flex items-center py-2">
                      <Phone className="w-4 h-4 mr-3 text-purple-600" />
                      <div>
                        <div className="font-medium">📞 Phone Quote Request</div>
                        <div className="text-xs text-gray-500">Direct - Immediate Assistance</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start mb-4">
                  <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-2">How it works:</p>
                    <div className="text-sm text-blue-700 space-y-2">
                      {formData.orderMethod === "email_quote" && (
                        <>
                          <div className="flex items-center">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">1</span>
                            Submit your order details via email
                          </div>
                          <div className="flex items-center">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">2</span>
                            We'll send you a detailed quote within 24 hours
                          </div>
                          <div className="flex items-center">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">3</span>
                            Confirm your order and payment method
                          </div>
                          <div className="flex items-center">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">4</span>
                            We'll process and ship your bulk order
                          </div>
                        </>
                      )}
                      {formData.orderMethod === "whatsapp_quote" && (
                        <>
                          <div className="flex items-center">
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">1</span>
                            Submit your order details via WhatsApp
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">2</span>
                            Get instant response and detailed quote
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">3</span>
                            Discuss and confirm order details via chat
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">4</span>
                            We'll process and ship your bulk order
                          </div>
                        </>
                      )}
                      {formData.orderMethod === "phone_quote" && (
                        <>
                          <div className="flex items-center">
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">1</span>
                            Call our team with your order details
                          </div>
                          <div className="flex items-center">
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">2</span>
                            Get instant quote and pricing discussion
                          </div>
                          <div className="flex items-center">
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">3</span>
                            Confirm order details over the phone
                          </div>
                          <div className="flex items-center">
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">4</span>
                            We'll process and ship your bulk order
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-200 pt-4">
                  <p className="text-xs text-blue-600 mb-3 font-medium">🚀 Quick Contact Options:</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20bulk%20ordering%20rice%20straws.%20Please%20send%20me%20pricing%20details."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      WhatsApp
                    </a>
                    <a
                      href="tel:+917760021026"
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call Now
                    </a>
                    <a
                      href="mailto:info@rootwave.org"
                      className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors shadow-sm"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <LoadingSpinner size="sm" text="Processing..." />
              ) : (
                <>
                  {formData.orderMethod === "email_quote" && (
                    <>
                      <Mail className="w-5 h-5 mr-2" />📧 Send Email Quote Request - ₹{finalTotal.toLocaleString()}
                    </>
                  )}
                  {formData.orderMethod === "whatsapp_quote" && (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />💬 Send WhatsApp Quote - ₹{finalTotal.toLocaleString()}
                    </>
                  )}
                  {formData.orderMethod === "phone_quote" && (
                    <>
                      <Phone className="w-5 h-5 mr-2" />📞 Call for Quote - ₹{finalTotal.toLocaleString()}
                    </>
                  )}
                </>
              )}
            </Button>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-600 mb-2">
                🔒 By submitting this request, you agree to our Terms of Service and Privacy Policy.
              </p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                {formData.orderMethod === "email_quote" && (
                  <>
                    <Clock className="w-3 h-3 mr-1" />📧 We'll respond to your quote request within 24 hours.
                  </>
                )}
                {formData.orderMethod === "whatsapp_quote" && (
                  <>
                    <MessageCircle className="w-3 h-3 mr-1" />💬 Get instant response via WhatsApp chat.
                  </>
                )}
                {formData.orderMethod === "phone_quote" && (
                  <>
                    <Phone className="w-3 h-3 mr-1" />📞 Call us directly for immediate assistance.
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
