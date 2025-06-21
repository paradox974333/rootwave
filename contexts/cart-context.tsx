"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  diameter: string
  price: number
  quantity: number
  color: string
  image: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

// Add a function to calculate bulk discount:
const calculateBulkDiscount = (quantity: number, basePrice: number) => {
  let discount = 0
  if (quantity >= 250000) discount = 0.2
  else if (quantity >= 100000) discount = 0.15
  else if (quantity >= 50000) discount = 0.1

  return basePrice * (1 - discount)
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.color === action.payload.color,
      )

      if (existingItem) {
        const newQuantity = existingItem.quantity + (action.payload.quantity || 10000)
        const discountedPrice = calculateBulkDiscount(newQuantity, action.payload.price)
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id && item.color === action.payload.color
            ? { ...item, quantity: newQuantity, price: discountedPrice }
            : item,
        )
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        return { items: updatedItems, total, itemCount }
      } else {
        const quantity = action.payload.quantity || 10000
        const discountedPrice = calculateBulkDiscount(quantity, action.payload.price)
        const newItem = { ...action.payload, quantity, price: discountedPrice }
        const updatedItems = [...state.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        return { items: updatedItems, total, itemCount }
      }
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => `${item.id}-${item.color}` !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      return { items: updatedItems, total, itemCount }
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          `${item.id}-${item.color}` === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0)
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      return { items: updatedItems, total, itemCount }
    }
    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }
    case "LOAD_CART":
      return action.payload
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("rootwave-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // Clear corrupted data
      localStorage.removeItem("rootwave-cart")
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("rootwave-cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
