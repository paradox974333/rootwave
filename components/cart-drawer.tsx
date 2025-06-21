"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, dispatch } = useCart()

  const updateQuantity = (itemKey: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: itemKey, quantity } })
  }

  const removeItem = (itemKey: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemKey })
  }

  const proceedToCheckout = () => {
    onClose()
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
              Shopping Cart
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {state.itemCount.toLocaleString()} items
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some eco-friendly rice straws to get started</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={onClose}>
                🛍️ Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md border border-gray-200"
                      />
                      <span className="absolute -top-2 -left-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-600">
                        <span>📏 {item.diameter}</span>
                        <span>🎨 {item.color}</span>
                        <span>📊 {item.quantity.toLocaleString()}</span>
                        <span>💰 ₹{item.price.toFixed(2)}</span>
                      </div>

                      {item.quantity >= 50000 && (
                        <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-800">
                          🎉 Bulk Discount Applied
                        </Badge>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(`${item.id}-${item.color}`, Math.max(10000, item.quantity - 10000))
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[60px] text-center">
                            {item.quantity.toLocaleString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(`${item.id}-${item.color}`, item.quantity + 10000)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(`${item.id}-${item.color}`)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t pt-4 mt-4 bg-gray-50 -mx-6 px-6 pb-6">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{state.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium">₹{(state.total * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {state.total > 25000 ? <span className="text-green-600 font-semibold">Free ✅</span> : "₹500"}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ₹{(state.total + state.total * 0.18 + (state.total > 25000 ? 0 : 500)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-blue-800">
                <strong>💡 Note:</strong> Bulk pricing applied automatically. GST included. Free shipping on orders
                above ₹25,000
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={proceedToCheckout}
            >
              <span className="flex items-center justify-center">
                🛒 Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
