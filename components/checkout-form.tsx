"use client" // Keep the client directive

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
import { Phone, Truck, Building, Mail, MessageCircle, CheckCircle, Clock, Users, Package, Send } from "lucide-react" // Added Send icon for submission
import { Badge } from "@/components/ui/badge"
// Assuming you have a LoadingSpinner component
import { LoadingSpinner } from "@/components/loading-spinner"

// IMPORTANT: Replace with your actual Make.com webhook URL
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/0i2fr31rleam9gt11yxd8bgelhgrws4e"; // <-- !!! REPLACE THIS !!!

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
  orderMethod: 'email_quote' | 'whatsapp_quote' | 'phone_quote' // Keep to send preferred contact method
  businessName: string
  gstNumber: string | undefined // Optional, can be undefined or string
}

// Type definition for a cart item (adjust based on your cart-context structure)
interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
  color?: string
  diameter?: string
  // Add other relevant item properties
}

export function CheckoutForm() {
  // Access cart state and dispatch, toast functionality
  const { state, dispatch } = useCart() // Assuming state.items is CartItem[] and state.total is number
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
    orderMethod: "email_quote", // Default preferred contact method
    businessName: "",
    gstNumber: undefined, // Initialize as undefined
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
  // Ensure state.total is treated as a number, default to 0 if null/undefined
  const subtotal = state.total ?? 0;
  const gst = subtotal * gstRate;
  // Shipping is free if total is above the threshold, otherwise apply standard cost
  const shipping = subtotal > freeShippingThreshold ? 0 : standardShippingCost;
  // Final total includes subtotal, GST, and shipping
  const finalTotal = subtotal + gst + shipping;


  // Handler for input changes, updates state and clears corresponding error
  const handleInputChange = (field: keyof FormData, value: string | 'email_quote' | 'whatsapp_quote' | 'phone_quote') => {
    let cleanedValue = value;
    // Clean non-digit characters for phone and pincode inputs (only if value is string)
    if (typeof value === 'string' && (field === 'phone' || field === 'pincode')) {
        cleanedValue = value.replace(/\D/g, '');
    }
     // Handle GST number being optionally empty string
     if (field === 'gstNumber' && cleanedValue === '') {
         setFormData((prev) => ({ ...prev, [field]: undefined })); // Store empty GST as undefined
     } else {
         setFormData((prev) => ({ ...prev, [field]: cleanedValue as any })); // Type assertion needed due to cleanedValue type
     }

    // If there was an error for this field, clear it when the user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined })) // Use undefined to clear the specific key
    }
  }

  // Form validation function
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}

    // Check if required fields are empty or just whitespace
    if (!formData.businessName?.trim()) errors.businessName = "Business/Company name is required." // Use optional chaining
    if (!formData.firstName?.trim()) errors.firstName = "First name is required." // Use optional chaining
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required." // Use optional chaining

    // Email validation
    if (!formData.email?.trim()) { // Use optional chaining
        errors.email = "Email address is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address."
    }

    // Phone number validation (after cleaning in handleInputChange)
    if (!formData.phone?.trim()) { // Use optional chaining
        errors.phone = "Phone number is required."
    } else if (!/^\d{10}$/.test(formData.phone)) {
        errors.phone = "Phone number must be 10 digits."
    }

    // Address validation
    if (!formData.address?.trim()) errors.address = "Complete address is required." // Use optional chaining
    if (!formData.city?.trim()) errors.city = "City is required." // Use optional chaining
    if (!formData.state?.trim()) errors.state = "State is required." // Use optional chaining

    // PIN code validation (after cleaning in handleInputChange)
    if (!formData.pincode?.trim()) { // Use optional chaining
        errors.pincode = "PIN code is required."
    } else if (!/^\d{6}$/.test(formData.pincode)) {
        errors.pincode = "PIN code must be 6 digits."
    }

    // Add a check for empty cart (though UI should prevent submission in this state)
    if (!state.items || state.items.length === 0) {
        // This is more of a logic error if the button is clickable, but good safeguard
        console.error("Attempted to submit empty cart");
        // Maybe add a non-field error or use a toast
         toast({
           title: "⚠️ Cart is Empty",
           description: "Please add items to your cart before submitting a quote request.",
           variant: "destructive",
         });
         return false; // Indicate validation failure
    }


    // Update the formErrors state
    setFormErrors(errors)
    // Return true if the errors object is empty (no errors) AND cart is not empty
    return Object.keys(errors).length === 0 && state.items.length > 0;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission

    // Validate the form before proceeding
    if (!validateForm()) {
      // validateForm now handles the toast for validation errors
      // Optional: Scroll to the first error field for better UX (logic kept from original)
      const firstErrorField = Object.keys(formErrors).find(key => formErrors[key as keyof FormData]);
       if (firstErrorField) {
         setTimeout(() => {
            document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }, 100);
       }
      return // Stop submission if validation fails
    }

    // Set processing state to disable inputs and show spinner
    setIsProcessing(true)

    // Construct the payload to send to Make.com
    const payload = {
      businessInfo: {
        businessName: formData.businessName,
        gstNumber: formData.gstNumber, // Will be undefined if empty
      },
      contactPerson: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      orderMethodPreference: formData.orderMethod, // User's preferred contact method
      cartItems: state.items.map(item => ({ // Map cart items to a clean structure for webhook
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          diameter: item.diameter,
          itemSubtotal: (item.quantity ?? 0) * (item.price ?? 0) // Calculate subtotal for each item in payload
          // Include other necessary item details
      })),
      financialSummary: {
        subtotal: subtotal,
        gstAmount: gst,
        shippingCost: shipping,
        totalAmount: finalTotal,
        freeShippingThreshold: freeShippingThreshold,
        gstRate: gstRate,
      },
      timestamp: new Date().toISOString(), // Add timestamp for record-keeping
      // You could add origin information if needed (e.g., "website form submission")
      // origin: "Rootwave Website Checkout Form"
    };

    console.log("Sending payload to Make.com:", payload); // Log payload before sending

    try {
      // Send the data to the Make.com webhook URL
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers if your webhook requires them (uncommon for basic webhooks)
        },
        body: JSON.stringify(payload),
      });

      // Check if the HTTP request was successful (status code 2xx)
      // Make.com webhooks typically return 200 OK with 'Accepted' text
      if (!response.ok) {
        const errorBody = await response.text(); // Read error response body
        console.error("Make.com webhook error response:", response.status, errorBody);
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      // Success: Show toast and clear cart
      console.log("Successfully sent data to Make.com webhook.");
      toast({
        title: "✅ Quote Request Submitted!",
        description: "Your detailed quote request has been sent to our team. We will contact you shortly based on your preferred method.",
      });

      // Clear the cart after successful submission
      // Use a small delay if needed, but generally not necessary for backend submission
      // setTimeout(() => { // Optional delay
          dispatch({ type: "CLEAR_CART" }); // Assuming this action type exists
      // }, 500); // Optional delay time

    } catch (error: any) { // Catch network errors or errors from response.ok check
      console.error("Error submitting quote request to Make.com:", error);
      toast({
        title: "❌ Submission Failed",
        description: `Failed to send your quote request. Please try again or contact us directly. Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      // Always set processing state back to false
      setIsProcessing(false);
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
  if (!state.items || state.items.length === 0) {
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
                 // Fallback to scrolling to the top of the page
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
                    {/* Assuming bulk discount logic exists in cart context */}
                    {item.quantity >= 50000 && (
                       // Example check, adjust based on your cart logic
                      <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-800 inline-flex items-center">
                        🎉 Bulk Discount Applied
                      </Badge>
                    )}
                  </div>
                  {/* Item subtotal */}
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="font-bold text-lg text-green-600">₹{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}</p> {/* Use ?? for safety */}
                  </div>
                </div>
              </div>
            ))}

            <Separator className="my-4 sm:my-6" /> {/* Adjusted margin */}

            {/* Order Totals Summary */}
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span> {/* Use calculated subtotal */}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST ({gstRate * 100}%):</span>
                <span className="font-medium">₹{gst.toLocaleString()}</span> {/* Use calculated gst */}
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
                <span className="text-2xl font-bold text-green-600">₹{finalTotal.toLocaleString()}</span> {/* Use calculated finalTotal */}
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

        {/* Quote Request Form Card */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg p-4 sm:p-6"> {/* Adjusted padding */}
            <CardTitle className="flex items-center text-green-800 text-xl sm:text-2xl"> {/* Adjusted text size */}
              <Users className="w-5 h-5 mr-2 flex-shrink-0" />
              Request Quote
            </CardTitle>
            <CardDescription className="text-green-700 text-sm sm:text-base"> {/* Adjusted text size */}
              Provide your details below to request a bulk order quote
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
                      value={formData.gstNumber || ''} // Use empty string for controlled input if value is undefined
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

              {/* Preferred Contact Method Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-600 p-2 rounded-lg mr-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" /> {/* Icon for communication method */}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 flex-grow">How Should We Contact You?</h3>
                </div>

                {/* Select Component for Order Method */}
                 <Label htmlFor="orderMethod" className="sr-only">Preferred Contact Method</Label> {/* Screen reader only label */}
                <Select
                  value={formData.orderMethod}
                  onValueChange={(value: 'email_quote' | 'whatsapp_quote' | 'phone_quote') => handleInputChange("orderMethod", value)}
                  disabled={isProcessing}
                >
                  {/* Select Trigger - full width on mobile */}
                  <SelectTrigger id="orderMethod" className="w-full border-gray-300 focus:border-green-500 text-base py-2 h-auto">
                    <SelectValue placeholder="Select your preferred method for our response" /> {/* Added placeholder */}
                  </SelectTrigger>
                  {/* Select Content with options */}
                  <SelectContent>
                    <SelectItem value="email_quote">
                      <div className="flex items-center py-2">
                        <Mail className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-base">📧 Email</div>
                          <div className="text-xs text-gray-500">Receive your detailed quote via email.</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="whatsapp_quote">
                      <div className="flex items-center py-2">
                        <MessageCircle className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-base">💬 WhatsApp</div>
                          <div className="text-xs text-gray-500">Get a quick response via WhatsApp chat.</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone_quote">
                      <div className="flex items-center py-2">
                        <Phone className="w-4 h-4 mr-3 text-purple-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-base">📞 Phone Call</div>
                          <div className="text-xs text-gray-500">Receive a call to discuss your request.</div>
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
                      <p className="text-sm font-semibold text-blue-800 mb-2">What Happens Next:</p>
                      <div className="text-sm text-blue-700 space-y-2">
                         {/* Unified steps */}
                         <div className="flex items-start">
                           <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">1</span>
                           Your details and cart items are sent securely.
                         </div>
                         <div className="flex items-start">
                           <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">2</span>
                           Our team reviews your bulk order request.
                         </div>
                          <div className="flex items-start">
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">3</span>
                           We will contact you with a detailed quote using your preferred method ({formData.orderMethod === 'email_quote' ? 'Email' : formData.orderMethod === 'whatsapp_quote' ? 'WhatsApp' : 'Phone Call'}).
                          </div>
                         <div className="flex items-start">
                           <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full mr-2 flex-shrink-0 mt-0.5">4</span>
                           Once confirmed, we process and ship your order.
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact Buttons (Optional - keep as alternative methods) */}
                  <div className="border-t border-blue-200 pt-4">
                    <p className="text-xs text-blue-600 mb-3 font-medium">Need immediate assistance?</p>
                    <div className="flex flex-wrap gap-2">
                      {/* WhatsApp Button (Hardcoded contact number if desired, DIFFERENT from submission) */}
                       {/* NOTE: Replace with actual contact number if different from submission target */}
                      <a
                        href={`https://wa.me/${917760021026}?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20bulk%20ordering%20rice%20straws%20and%20need%20immediate%20help.`}
                        target="_blank"
                        rel="noopener noreferrer" // Good practice for external links
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        WhatsApp Now
                      </a>
                      {/* Call Button (Hardcoded contact number if desired, DIFFERENT from submission) */}
                       {/* NOTE: Replace with actual contact number if different from submission target */}
                      <a
                        href={`tel:+${917760021026}`}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call Direct
                      </a>
                      {/* Email Button (Hardcoded email if desired, DIFFERENT from submission) */}
                      <a
                        href="mailto:info@rootwave.org"
                        className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email Us
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
                disabled={isProcessing || !state.items || state.items.length === 0} // Ensure items exist and is not empty
              >
                {isProcessing ? (
                  // Show spinner and processing text when processing
                  <LoadingSpinner size="sm" text="Submitting..." />
                ) : (
                  // Show a generic send icon for submission
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    <span>
                       Submit Quote Request {finalTotal > 0 && `- ₹${finalTotal.toLocaleString()}`} {/* Show total if greater than 0 */}
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
                     <Clock className="w-3 h-3 mr-1 flex-shrink-0" />Expected response: Typically within 24 hours during business days.
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}