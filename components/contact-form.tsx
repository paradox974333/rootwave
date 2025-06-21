"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send, Mail, Phone, MessageCircle, Clock, Users } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({})

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"
    if (!formData.subject.trim()) errors.subject = "Subject is required"
    if (!formData.message.trim()) errors.message = "Message is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
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

    setIsSubmitting(true)

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`🌾 ${formData.subject} - Contact from ${formData.name}`)
      const body = encodeURIComponent(
        `📧 Contact Form Submission - Rootwave\n\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n\n📝 Message:\n${formData.message}\n\n🌱 Sent via Rootwave Contact Form`,
      )
      const mailtoLink = `mailto:info@rootwave.org?subject=${subject}&body=${body}`

      // Open email client
      window.location.href = mailtoLink

      toast({
        title: "📧 Email Client Opened Successfully!",
        description:
          "Your email client has been opened with the message pre-filled. Please send the email to complete your inquiry.",
      })

      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
        toast({
          title: "✅ Form Reset",
          description: "Form has been cleared. Thank you for contacting us!",
        })
      }, 2000)
    } catch (error) {
      console.error("Contact form error:", error)
      toast({
        title: "❌ Error",
        description:
          "Failed to open email client. Please contact us directly at info@rootwave.org or call +91 77600 21026",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
        <CardTitle className="flex items-center text-green-800">
          <Mail className="w-5 h-5 mr-2" />
          Send us a Message
        </CardTitle>
        <CardDescription className="text-green-700">
          We'd love to hear from you. Fill out the form below and we'll open your email client with the message
          pre-filled.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
                👤 Name *
              </Label>
              <Input
                id="contact-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1 ${formErrors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                placeholder="Your full name"
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                📧 Email *
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 ${formErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {formErrors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="contact-subject" className="text-sm font-medium text-gray-700">
              📋 Subject *
            </Label>
            <Input
              id="contact-subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`mt-1 ${formErrors.subject ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
              placeholder="What's this about?"
              disabled={isSubmitting}
            />
            {formErrors.subject && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {formErrors.subject}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="contact-message" className="text-sm font-medium text-gray-700">
              💬 Message *
            </Label>
            <Textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className={`mt-1 ${formErrors.message ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
              placeholder="Tell us about your requirements, questions, or how we can help you..."
              rows={5}
              disabled={isSubmitting}
            />
            {formErrors.message && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {formErrors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" text="Opening..." />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />📧 Send via Email Client
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50 py-3 font-semibold"
              onClick={() => (window.location.href = "mailto:info@rootwave.org")}
            >
              <Mail className="w-4 h-4 mr-2" />📮 Direct Email
            </Button>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm font-semibold text-green-800">Alternative Contact Methods:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-green-700 bg-white p-3 rounded-lg shadow-sm">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-blue-600" />
                <a href="mailto:info@rootwave.org" className="hover:underline truncate font-medium">
                  info@rootwave.org
                </a>
              </div>
              <div className="flex items-center text-sm text-green-700 bg-white p-3 rounded-lg shadow-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-purple-600" />
                <a href="tel:+917760021026" className="hover:underline font-medium">
                  +91 77600 21026
                </a>
              </div>
              <div className="flex items-center text-sm text-green-700 bg-white p-3 rounded-lg shadow-sm">
                <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-600" />
                <a
                  href="https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20your%20eco-friendly%20rice%20straws.%20Can%20you%20please%20provide%20more%20information%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="border-t border-green-200 pt-4">
              <div className="flex items-center mb-3">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <p className="text-xs text-blue-600 font-medium">🚀 Quick WhatsApp Contact:</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I%27m%20interested%20in%20bulk%20ordering%20rice%20straws.%20Please%20send%20me%20pricing%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />💼 Bulk Order Inquiry
                </a>
                <a
                  href="https://wa.me/918319545466?text=Hi%20Arpan%2C%20I%27m%20interested%20in%20Rootwave%27s%20rice%20straws.%20Can%20we%20discuss%20bulk%20pricing%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />💬 Chat with Arpan
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-gray-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">⏰ Response Time</p>
            </div>
            <p className="text-xs text-gray-600">
              📧 Email: Within 24 hours | 💬 WhatsApp: Instant | 📞 Phone: Business hours (9 AM - 6 PM)
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
