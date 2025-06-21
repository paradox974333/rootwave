"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Sparkles, Zap, ShoppingCart } from "lucide-react"
import { Chatbot } from "@/components/chatbot"

export function ChatbotTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showOrderPrompt, setShowOrderPrompt] = useState(true)

  useEffect(() => {
    setIsClient(true)

    // Hide order prompt after 8 seconds
    const orderPromptTimer = setTimeout(() => {
      setShowOrderPrompt(false)
    }, 8000)

    return () => {
      clearTimeout(orderPromptTimer)
    }
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="relative">
          {/* Order Prompt Popup */}
          {showOrderPrompt && !isOpen && (
            <div className="absolute bottom-20 left-0 mb-2 w-56 bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-2xl shadow-2xl animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Order from AI!</p>
                  <p className="text-xs text-green-100">Get instant quotes & place bulk orders</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderPrompt(false)}
                  className="text-white hover:bg-green-800 p-1 h-5 w-5"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-0 left-8 transform translate-y-full">
                <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-green-600"></div>
              </div>
            </div>
          )}

          {/* Main Chat Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
              isOpen
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800"
            }`}
            aria-label={isOpen ? "Close chat" : "Open chat"}
          >
            {/* Icon */}
            <div className="relative z-10">
              {isOpen ? (
                <X className="w-7 h-7 text-white" />
              ) : (
                <div className="relative">
                  <MessageCircle className="w-7 h-7 text-white" />
                  
                </div>
              )}
            </div>
          </Button>

          {/* Simple Online Status */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          )}

          {/* AI Badge */}
          {!isOpen && (
            <div className="absolute -bottom-1 -right-1">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-1.5 py-0.5 shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                AI
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Component */}
      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
