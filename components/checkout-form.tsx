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
// Assuming these context and hooks are correctly implemented and provided in your app
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Phone, Truck, Building, Mail, MessageCircle, CheckCircle, Clock, Users, Package } from "lucide-react" // Added Package icon for items
import { Badge } from "@/components/ui/badge"
// Assuming you have a LoadingSpinner component
import { LoadingSpinner } from "@/components/loading-spinner"

// Type definition for form data
interface FormData {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  orderMethod: 'email_quote' | 'whatsapp_quote' | 'phone_quote'
  businessName: string
  gstNumber: string // Optional
}

export function CheckoutForm() {
  // Access cart state and dispatch, toast functionality
  const { state, dispatch } = useCart()
  const { toast } = useToast()

  // State to manage loading/processing state during submission
  const [isProcessing, setIsProcessing] = useState(false)
  // State to track if the component is mounted on the client-side (to avoid hydration issues)
  const [isClient, setIsClient] = useState(false)

  // State for form data, initialized with default values
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    orderMethod: "email_quote", // Default order method
    businessName: "",
    gstNumber: "",
  })

  // State to hold form validation errors
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})

  // useEffect to set isClient to true after the component mounts on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Constants for financial calculations
  const gstRate = 0.18 // 18% GST
  const freeShippingThreshold = 25000 // ₹25,000
  const standardShippingCost = 500 // ₹500

  // Calculate financial summaries (these re-calculate whenever state.total changes)
  const gst = state.total * gstRate
  // Shipping is free if total is above the threshold, otherwise apply standard cost
  const shipping = state.total > freeShippingThreshold ? 0 : standardShippingCost
  // Final total includes subtotal, GST, and shipping
  const finalTotal = state.total + gst + shipping

  // Handler for input changes, updates state and clears corresponding error
  const handleInputChange = (field: keyof FormData, value: string) => {
    let cleanedValue = value;
    // Clean non-digit characters for phone and pincode inputs
    if (field === 'phone' || field === 'pincode') {
        cleanedValue = value.replace(/\D/g, '');
    }
    setFormData((prev) => ({ ...prev, [field]: cleanedValue }))
    // If there was an error for this field, clear it when the user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined })) // Use undefined to clear the specific key
    }
  }

  // Form validation function
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}

    // Check if required fields are empty or just whitespace
    if (!formData.businessName.trim()) errors.businessName = "Business/Company name is required."
    if (!formData.firstName.trim()) errors.firstName = "First name is required."
    if (!formData.lastName.trim()) errors.lastName = "Last name is required."

    // Email validation
    if (!formData.email.trim()) {
        errors.email = "Email address is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address."
    }

    // Phone number validation (after cleaning in handleInputChange)
    if (!formData.phone.trim()) {
        errors.phone = "Phone number is required."
    } else if (!/^\d{10}$/.test(formData.phone)) {
        errors.phone = "Phone number must be 10 digits."
    }

    // Address validation
    if (!formData.address.trim()) errors.address = "Complete address is required."
    if (!formData.city.trim()) errors.city = "City is required."
    if (!formData.state.trim()) errors.state = "State is required."

    // PIN code validation (after cleaning in handleInputChange)
    if (!formData.pincode.trim()) {
        errors.pincode = "PIN code is required."
    } else if (!/^\d{6}$/.test(formData.pincode)) {
        errors.pincode = "PIN code must be 6 digits."
    }

    // Update the formErrors state
    setFormErrors(errors)
    // Return true if the errors object is empty (no errors)
    return Object.keys(errors).length === 0
  }

  // Function to generate the structured order summary text
  const generateOrderSummary = (): string => {
    let orderSummary = `🌾 BULK ORDER REQUEST - ROOTWAVE RICE STRAWS\n\n`;

    // Business Information Section
    orderSummary += `🏢 BUSINESS INFORMATION:\n`;
    orderSummary += `Business Name: ${formData.businessName || 'N/A'}\n`; // Add N/A fallback
    orderSummary += `Contact Person: ${formData.firstName || 'N/A'} ${formData.lastName || 'N/A'}\n`; // Add N/A fallback
    orderSummary += `Email: ${formData.email || 'N/A'}\n`; // Add N/A fallback
    orderSummary += `Phone: ${formData.phone || 'N/A'}\n`; // Add N/A fallback
    if (formData.gstNumber) orderSummary += `GST Number: ${formData.gstNumber}\n`;
    orderSummary += `\n`; // Add newline for spacing

    // Shipping Address Section
    orderSummary += `🚚 SHIPPING ADDRESS:\n`;
    orderSummary += `${formData.address || 'N/A'}\n`; // Add N/A fallback
    orderSummary += `${formData.city || 'N/A'}, ${formData.state || 'N/A'} - ${formData.pincode || 'N/A'}\n`; // Add N/A fallback
    orderSummary += `\n`; // Add newline for spacing

    // Order Details Section
    orderSummary += `📦 ORDER DETAILS:\n`;
    // Check if items exist and iterate
    if (state.items && state.items.length > 0) {
        state.items.forEach((item, index) => {
          // Use nullish coalescing (??) or fallback for potential missing properties
          const itemName = item.name ?? 'Unknown Item';
          const itemDiameter = item.diameter ?? 'N/A';
          const itemColor = item.color ?? 'N/A';
          const itemQuantity = item.quantity ?? 0;
          const itemPrice = item.price ?? 0;

          orderSummary += `${index + 1}. ${itemName} (${itemDiameter})\n`;
          orderSummary += `   🎨 Color: ${itemColor}\n`;
          orderSummary += `   📊 Quantity: ${itemQuantity.toLocaleString()} straws\n`;
          orderSummary += `   💰 Price: ₹${itemPrice.toFixed(2)} per straw\n`;
          orderSummary += `   💵 Subtotal: ₹${(itemPrice * itemQuantity).toLocaleString()}\n\n`;
        });
    } else {
         orderSummary += `   No items added to the order request.\n\n`; // Message if cart is empty (though UI should prevent this)
    }


    // Order Summary Section (Financials)
    orderSummary += `💳 ORDER SUMMARY:\n`;
    orderSummary += `Subtotal: ₹${state.total.toLocaleString()}\n`;
    orderSummary += `GST (${gstRate * 100}%): ₹${gst.toLocaleString()}\n`;
    orderSummary += `Shipping: ${shipping === 0 ? "Free ✅" : `₹${shipping.toLocaleString()}`}\n`;
    orderSummary += `TOTAL: ₹${finalTotal.toLocaleString()}\n\n`;

    // Order Method Section
    const orderMethodText = {
      email_quote: "📧 Email Quote Request",
      whatsapp_quote: "💬 WhatsApp Quote Request",
      phone_quote: "📞 Phone Quote Request",
    } as const; // Use 'as const' for type safety

    orderSummary += `📋 ORDER METHOD: ${orderMethodText[formData.orderMethod]}\n\n`; // Use the selected method text

    // Closing message
    orderSummary += `Please provide a detailed quote and confirm the order details.\n`;
    orderSummary += `We look forward to doing business with you! 🤝\n\n`;
    orderSummary += `Best regards,\n${formData.firstName} ${formData.lastName}\n${formData.businessName}\n\n`;
    orderSummary += `🌱 Together for a sustainable future! 🌍`;

    return orderSummary
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission

    // Validate the form before proceeding
    if (!validateForm()) {
      toast({
        title: "❌ Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      // Optional: Scroll to the first error field for better UX
      const firstErrorField = Object.keys(formErrors).find(key => formErrors[key as keyof FormData]);
       if (firstErrorField) {
         // Use a timeout to ensure toast doesn't block scrolling
         setTimeout(() => {
            document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }, 100);
       }
      return // Stop submission if validation fails
    }

    // Set processing state to disable inputs and show spinner
    setIsProcessing(true)

    try {
      // Generate the order summary string
      const orderSummary = generateOrderSummary()
      const contactNumber = '917760021026'; // Ensure this is the correct number with country code

      // Handle submission based on the selected order method
      if (formData.orderMethod === "whatsapp_quote") {
        // Encode the message for the URL
        const whatsappMessage = encodeURIComponent(orderSummary)
        // Construct the WhatsApp Web/App link
        const whatsappLink = `https://wa.me/${contactNumber}?text=${whatsappMessage}`

        // Open the link in a new tab/window
        window.open(whatsappLink, "_blank")

        toast({
          title: "💬 WhatsApp Opened Successfully!",
          description:
            "WhatsApp has been opened with your order details. Please send the pre-filled message to initiate your quote request.",
        })

      } else if (formData.orderMethod === "phone_quote") {
        // Try to copy the summary to clipboard
        try {
          // navigator.clipboard is only available in secure contexts (HTTPS)
          if (navigator.clipboard && window.isSecureContext) {
             await navigator.clipboard.writeText(orderSummary)
             toast({
               title: "📋 Order Details Copied!",
               description: "Order details copied to clipboard. Calling our team now...",
             })
          } else {
             // Fallback toast if clipboard is not available
             toast({
               title: "ℹ️ Order Details Available",
               description: "Calling our team now. Please have your order details ready for reference.",
              
             });
             console.log("Clipboard write not available. Order Summary:", orderSummary); // Log for reference
          }

        } catch (error) {
          // Log any clipboard errors but don't block the phone call
          console.error("Failed to copy to clipboard:", error)
           toast({
               title: "⚠️ Clipboard Issue",
               description: "Couldn't copy details automatically. Please refer to the order summary popup.",
              
           });
        }

        // Attempt to open the phone dialer
        // This might not work universally, especially on desktop, but it's the standard approach
        window.location.href = `tel:+${contactNumber}`

        // Open a new window to display the order summary for reference during the call
        const orderWindow = window.open("", "_blank", "width=700,height=900,scrollbars=yes");
        if (orderWindow) {
          // Write HTML content to the new window
          orderWindow.document.write(`
            <html>
              <head>
                <title>📞 Order Details - Rootwave</title>
                <style>
                   /* Basic reset and font smoothing */
                   body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
                   /* Improved font stack */
                   body {
                     font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                     padding: 20px; /* Consistent padding */
                     line-height: 1.6;
                     background: #f8fafc;
                     color: #333;
                   }
                   .container {
                     background: white;
                     padding: 20px;
                     border-radius: 8px;
                     box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                     max-width: 600px;
                     margin: 0 auto;
                     border-top: 5px solid #16a34a;
                   }
                   h2 {
                     color: #16a34a;
                     text-align: center;
                     margin-bottom: 20px;
                     font-size: 20px;
                     font-weight: 600;
                   }
                   pre {
                     background: #eef2ff;
                     padding: 15px;
                     border-radius: 6px;
                     white-space: pre-wrap;
                     word-wrap: break-word;
                     font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* Monospace font */
                     font-size: 13px;
                     line-height: 1.5;
                     border: 1px solid #c7d2fe;
                     overflow-x: auto; /* Allow horizontal scroll */
                   }
                   .highlight {
                     background: #dcfce7;
                     padding: 15px;
                     border-radius: 8px;
                     margin-top: 20px;
                     border: 1px solid #16a34a;
                     color: #14532d;
                   }
                   .highlight strong {
                       color: #16a34a;
                   }
                   .footer {
                     text-align: center;
                     margin-top: 20px;
                     color: #6b7280;
                     font-size: 11px;
                   }
                   /* Responsive adjustments for smaller popups */
                   @media (max-width: 600px) {
                       body { padding: 10px; }
                       .container { padding: 15px; }
                       h2 { font-size: 18px; margin-bottom: 15px; }
                       pre { padding: 10px; font-size: 12px; }
                       .highlight { padding: 10px; margin-top: 15px; }
                       .footer { margin-top: 15px; font-size: 10px; }
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
                    📞 <strong>Calling:</strong> +${contactNumber}<br>
                    ⏰ <strong>Business Hours:</strong> 9:00 AM - 6:00 PM (Mon-Sat)
                  </div>
                  <div class="footer">
                    🌱 Rootwave - Sustainable Solutions for a Better Tomorrow
                  </div>
                </div>
              </body>
            </html>
          `);
          orderWindow.document.close(); // Important to close the document stream
          orderWindow.focus(); // Bring the new window to the front
        } else {
            // Handle cases where the popup was blocked by the browser
            toast({
               title: "⚠️ Popup Blocked",
               description: "Please allow popups to view order details in a new window for your reference during the call.",
               
            });
        }

      } else {
        // Default to email integration ("email_quote" or any other value)
        const subject = encodeURIComponent(`🌾 Bulk Order Request - ${formData.businessName || 'Rootwave Customer'}`) // Add fallback for business name
        const body = encodeURIComponent(orderSummary)
        const mailtoLink = `mailto:info@rootwave.org?subject=${subject}&body=${body}` // Ensure this is the correct email address

        // Attempt to open the user's default email client
        window.location.href = mailtoLink

        toast({
          title: "📧 Email Client Opened Successfully!",
          description:
            "Your email client has been opened with your order details. Please send the pre-filled email to complete your quote request.",
        })
      }

      // Clear the cart after the request is initiated
      // Use a small delay to allow the external action (opening app/window) to happen
      setTimeout(() => {
        dispatch({ type: "CLEAR_CART" }) // Assuming this action type exists and works
        toast({
          title: "✅ Order Request Initiated",
          description: "Your request has been sent. We will contact you shortly!",
          
        })
      }, 1000) // 1 second delay

    } catch (error) {
      console.error("Order processing error:", error)
      toast({
        title: "❌ Processing Error",
        description: "Failed to initiate order request. Please contact us directly at info@rootwave.org or +91 77600 21026",
        variant: "destructive",
      })
    } finally {
      // Always set processing state back to false after try/catch block finishes
      setIsProcessing(false)
    }
  }

  // --- Render Logic ---

  // Show a loading spinner while component is hydrating on the client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Loading checkout..." />
      </div>
    )
  }

  // Show an empty cart message if there are no items
  if (state.items.length === 0) {
    return (
      // Added padding for mobile screens
      <div className="py-10 md:py-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" /> {/* Using Package icon */}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
          <p className="text-gray-600 mb-8">Add some eco-friendly rice straws to get started with your bulk order.</p>
          {/* Button to browse products */}
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              // Attempt to scroll to an element with id="products", fallback to top
              const productsSection = document.getElementById("products");
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            🛍️ Browse Products
          </Button>
        </div>
      </div>
    )
  }

  // Main checkout form UI when cart has items
  return (
    // Main container with responsive padding and centering
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Grid layout: single column on small screens, 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"> {/* Increased gap on large screens */}

        {/* Order Summary Card */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg p-4 sm:p-6"> {/* Adjusted padding */}
            <CardTitle className="flex items-center text-green-800 text-xl sm:text-2xl"> {/* Adjusted text size */}
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              Order Summary
            </CardTitle>
            <CardDescription className="text-green-700 text-sm sm:text-base"> {/* Adjusted text size */}
              Review your bulk order details before requesting a quote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6"> {/* Adjusted padding and space-y */}
            {/* Map over cart items */}
            {state.items.map((item, index) => (
              // Key using item ID and color, with index fallback
              <div key={`${item.id}-${item.color || 'default'}-${index}`} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"> {/* Adjusted padding */}
                {/* Item details layout, stacks on mobile, rows on medium+ */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  {/* Item name and details */}
                  <div className="flex-1 mb-3 sm:mb-0 sm:mr-4 min-w-0">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0">
                        {index + 1}
                      </span>
                      {/* Break words for long names */}
                      <h4 className="font-semibold text-gray-900 text-base break-words">{item.name}</h4>
                    </div>
                    {/* Flex wrap for details on small screens */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span>📏 {item.diameter ?? 'N/A'}</span> {/* Use ?? for default if null/undefined */}
                      <span>🎨 {item.color ?? 'N/A'}</span>
                      <span>📊 {item.quantity?.toLocaleString() ?? 'N/A'} straws</span> {/* Use ?? for quantity too */}
                      <span>💰 ₹{item.price?.toFixed(2) ?? 'N/A'}/straw</span> {/* Use ?? for price too */}
                    </div>
                    {/* Bulk discount badge */}
                    {item.quantity >= 50000 && (
                      <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-800 inline-flex items-center">
                        🎉 Bulk Discount Applied
                      </Badge>
                    )}
                  </div>
                  {/* Item subtotal */}
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="font-bold text-lg text-green-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            <Separator className="my-4 sm:my-6" /> {/* Adjusted margin */}

            {/* Order Totals Summary */}
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{state.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST ({gstRate * 100}%):</span>
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

            {/* Note about GST and Shipping */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Note:</strong> GST ({gstRate * 100}%) included. Free shipping on orders above ₹{freeShippingThreshold.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form Card */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg p-4 sm:p-6"> {/* Adjusted padding */}
            <CardTitle className="flex items-center text-green-800 text-xl sm:text-2xl"> {/* Adjusted text size */}
              <Users className="w-5 h-5 mr-2 flex-shrink-0" />
              Request Quote
            </CardTitle>
            <CardDescription className="text-green-700 text-sm sm:text-base"> {/* Adjusted text size */}
              Complete your bulk order request by providing your business details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6"> {/* Adjusted padding */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8"> {/* Adjusted space-y */}

              {/* Business Information Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="bg-green-600 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 flex-grow">Business Information</h3>
                </div>

                <div className="grid gap-4"> {/* gap-4 for grid items */}
                  {/* Business Name Input */}
                  <div>
                    <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                      Business/Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className={`mt-1 w-full ${formErrors.businessName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="Enter your business name"
                      disabled={isProcessing}
                      aria-invalid={formErrors.businessName ? "true" : "false"} 
                      aria-describedby={formErrors.businessName ? "businessName-error" : undefined}
                    />
                    {formErrors.businessName && (
                      <p id="businessName-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert"> {/* Added role="alert" */}
                        <span className="mr-1">⚠️</span>
                        {formErrors.businessName}
                      </p>
                    )}
                  </div>

                  {/* GST Number Input */}
                  <div>
                    <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">
                      GST Number (Optional)
                    </Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                      className="mt-1 w-full border-gray-300 focus:border-green-500"
                      placeholder="Enter GST number if available"
                      disabled={isProcessing}
                    />
                     {/* No error handling needed for optional field unless format is validated */}
                  </div>
                </div>
              </div>

              <Separator /> {/* Add a separator */}

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 flex-grow">Contact Person Details</h3>
                </div>

                {/* First Name & Last Name (stacks on mobile, 2 cols on medium+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`mt-1 w-full ${formErrors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="First name"
                      disabled={isProcessing}
                      aria-invalid={formErrors.firstName ? "true" : "false"}
                      aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                    />
                    {formErrors.firstName && (
                      <p id="firstName-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <span className="mr-1">⚠️</span>
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`mt-1 w-full ${formErrors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="Last name"
                      disabled={isProcessing}
                      aria-invalid={formErrors.lastName ? "true" : "false"}
                      aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                    />
                    {formErrors.lastName && (
                      <p id="lastName-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <span className="mr-1">⚠️</span>
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Address Input */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email" // Use email type for mobile keyboards
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`mt-1 w-full ${formErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="your@email.com"
                    disabled={isProcessing}
                    aria-invalid={formErrors.email ? "true" : "false"}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                      <span className="mr-1">⚠️</span>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel" // Use tel type for mobile keyboards
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)} // Value is already cleaned here
                    className={`mt-1 w-full ${formErrors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="10-digit mobile number (e.g., 9876543210)"
                    disabled={isProcessing}
                    aria-invalid={formErrors.phone ? "true" : "false"}
                    aria-describedby={formErrors.phone ? "phone-error" : undefined}
                    maxLength={10} // Restrict input length
                    inputMode="numeric" // Suggest numeric keyboard on mobile
                  />
                  {formErrors.phone && (
                    <p id="phone-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                      <span className="mr-1">⚠️</span>
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <Separator /> {/* Add a separator */}

              {/* Shipping Address Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 flex-grow">Shipping Address</h3>
                </div>

                {/* Address Textarea */}
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Complete Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={`mt-1 w-full ${formErrors.address ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="Street address, building name, landmark"
                    rows={3} // Standard number of rows for address
                    disabled={isProcessing}
                    aria-invalid={formErrors.address ? "true" : "false"}
                    aria-describedby={formErrors.address ? "address-error" : undefined}
                  />
                  {formErrors.address && (
                    <p id="address-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                      <span className="mr-1">⚠️</span>
                      {formErrors.address}
                    </p>
                  )}
                </div>

                {/* City & State (stacks on mobile, 2 cols on medium+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`mt-1 w-full ${formErrors.city ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="City"
                      disabled={isProcessing}
                      aria-invalid={formErrors.city ? "true" : "false"}
                      aria-describedby={formErrors.city ? "city-error" : undefined}
                    />
                    {formErrors.city && (
                      <p id="city-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <span className="mr-1">⚠️</span>
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={`mt-1 w-full ${formErrors.state ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="State"
                      disabled={isProcessing}
                      aria-invalid={formErrors.state ? "true" : "false"}
                      aria-describedby={formErrors.state ? "state-error" : undefined}
                    />
                    {formErrors.state && (
                      <p id="state-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <span className="mr-1">⚠️</span>
                        {formErrors.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* PIN Code Input */}
                <div>
                  <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                    PIN Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)} // Value is already cleaned here
                    className={`mt-1 w-full ${formErrors.pincode ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                    placeholder="6-digit PIN code"
                    disabled={isProcessing}
                    aria-invalid={formErrors.pincode ? "true" : "false"}
                    aria-describedby={formErrors.pincode ? "pincode-error" : undefined}
                    maxLength={6} // Restrict input length
                    type="text" // Keep type="text" to prevent default browser number spinners
                    inputMode="numeric" // Suggest numeric keyboard on mobile
                  />
                  {formErrors.pincode && (
                    <p id="pincode-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                      <span className="mr-1">⚠️</span>
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <Separator /> {/* Add a separator */}

              {/* Order Method Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-600 p-2 rounded-lg mr-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" /> {/* Icon for communication method */}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 flex-grow">Choose Order Method</h3>
                </div>

                {/* Select Component for Order Method */}
                 <Label htmlFor="orderMethod" className="sr-only">Choose Order Method</Label> {/* Screen reader only label */}
                <Select
                  value={formData.orderMethod}
                  onValueChange={(value: 'email_quote' | 'whatsapp_quote' | 'phone_quote') => handleInputChange("orderMethod", value)}
                  disabled={isProcessing}
                >
                  {/* Select Trigger - full width on mobile */}
                  <SelectTrigger id="orderMethod" className="w-full border-gray-300 focus:border-green-500 text-base py-2 h-auto">
                    <SelectValue placeholder="Select how you'd like to receive your quote" /> {/* Added placeholder */}
                  </SelectTrigger>
                  {/* Select Content with options */}
                  <SelectContent>
                    <SelectItem value="email_quote">
                      <div className="flex items-center py-2">
                        <Mail className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-base">📧 Email Quote Request</div>
                          <div className="text-xs text-gray-500">Recommended - Professional & Detailed</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="whatsapp_quote">
                      <div className="flex items-center py-2">
                        <MessageCircle className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-base">💬 WhatsApp Quote Request</div>
                          <div className="text-xs text-gray-500">Instant - Quick Response</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone_quote">
                      <div className="flex items-center py-2">
                        <Phone className="w-4 h-4 mr-3 text-purple-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-base">📞 Phone Quote Request</div>
                          <div className="text-xs text-gray-500">Direct - Immediate Assistance</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Explainer text based on selected method */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 sm:p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start mb-4">
                    <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800 mb-2">How it works:</p>
                      <div className="text-sm text-blue-700 space-y-2">
                        {/* Steps for Email Method */}
                        {formData.orderMethod === "email_quote" && (
                          <>
                            <div className="flex items-start">
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">1</span>
                              Submit your order details via email client
                            </div>
                            <div className="flex items-start">
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">2</span>
                              We'll send you a detailed quote within 24 hours
                            </div>
                            <div className="flex items-start">
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">3</span>
                              Confirm your order and payment method
                            </div>
                            <div className="flex items-start">
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">4</span>
                              We'll process and ship your bulk order
                            </div>
                          </>
                        )}
                        {/* Steps for WhatsApp Method */}
                        {formData.orderMethod === "whatsapp_quote" && (
                          <>
                             <div className="flex items-start">
                               <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">1</span>
                               Submit your order details via WhatsApp
                             </div>
                             <div className="flex items-start">
                               <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">2</span>
                               Get instant response and detailed quote
                             </div>
                             <div className="flex items-start">
                               <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">3</span>
                               Discuss and confirm order details via chat
                             </div>
                             <div className="flex items-start">
                               <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">4</span>
                               We'll process and ship your bulk order
                             </div>
                          </>
                        )}
                        {/* Steps for Phone Method */}
                        {formData.orderMethod === "phone_quote" && (
                          <>
                             <div className="flex items-start">
                               <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">1</span>
                               Call our team with your order details
                             </div>
                             <div className="flex items-start">
                               <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">2</span>
                               Get instant quote and pricing discussion
                             </div>
                             <div className="flex items-start">
                               <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">3</span>
                               Confirm order details over the phone
                             </div>
                             <div className="flex items-start">
                               <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">4</span>
                               We'll process and ship your bulk order
                             </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact Buttons (Flex wrap on small screens) */}
                  <div className="border-t border-blue-200 pt-4">
                    <p className="text-xs text-blue-600 mb-3 font-medium">🚀 Quick Contact Options:</p>
                    <div className="flex flex-wrap gap-2">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${9244823663}?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20bulk%20ordering%20rice%20straws.%20Please%20send%20me%20pricing%20details.`}
                        target="_blank"
                        rel="noopener noreferrer" // Good practice for external links
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        WhatsApp
                      </a>
                      {/* Call Button */}
                      <a
                        href={`tel:+${9244823663}`}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call Now
                      </a>
                      {/* Email Button */}
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

              {/* Submit Button - Full width on mobile */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                // Button is disabled if processing or if the cart is empty
                disabled={isProcessing || state.items.length === 0}
              >
                {isProcessing ? (
                  // Show spinner and processing text when processing
                  <LoadingSpinner size="sm" text="Processing..." />
                ) : (
                  // Show relevant icon and text based on selected method
                  <>
                    {formData.orderMethod === "email_quote" && <Mail className="w-5 h-5 mr-2" />}
                    {formData.orderMethod === "whatsapp_quote" && <MessageCircle className="w-5 h-5 mr-2" />}
                    {formData.orderMethod === "phone_quote" && <Phone className="w-5 h-5 mr-2" />}
                    <span>
                       Request Quote {finalTotal > 0 && `- ₹${finalTotal.toLocaleString()}`} {/* Show total if greater than 0 */}
                    </span>
                  </>
                )}
              </Button>

              {/* Footer note about terms and expected response */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-2">
                  🔒 By submitting this request, you agree to our Terms of Service and Privacy Policy.
                </p>
                <div className="flex items-center justify-center text-xs text-gray-500">
                     {/* Dynamic expected response time based on method */}
                     {formData.orderMethod === "email_quote" && (
                       <>
                         <Clock className="w-3 h-3 mr-1 flex-shrink-0" />Expected response: within 24 hours via email.
                       </>
                     )}
                     {formData.orderMethod === "whatsapp_quote" && (
                       <>
                         <MessageCircle className="w-3 h-3 mr-1 flex-shrink-0" />Expected response: instant via WhatsApp chat.
                       </>
                     )}
                     {formData.orderMethod === "phone_quote" && (
                       <>
                         <Phone className="w-3 h-3 mr-1 flex-shrink-0" />Expected response: immediate via phone call.
                       </>
                     )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}