'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

// Mock data for cart items
const initialCartItems = [
  { id: 1, name: 'Blue Wave', price: 129.99, quantity: 1, image: '/neon-1.jpg' },
  { id: 2, name: 'Pink Flamingo', price: 129.99, quantity: 1, image: '/neon-1.jpg' },
  { id: 3, name: 'Yellow Bolt', price: 89.99, quantity: 1, image: '/neon-1.jpg' },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15 // Flat rate shipping
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-neon-blue"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Cart
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className="mx-auto text-neon-pink w-24 h-24 mb-4" />
          <p className="text-2xl text-gray-400 mb-8">Your cart is empty</p>
          <Button asChild className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="md:col-span-2 space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
                <div className="flex-shrink-0">
                  <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-neon-blue">{item.name}</h2>
                  <p className="text-neon-yellow">₫{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-neon-pink hover:text-neon-pink/80"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 text-center bg-gray-700 text-white border-gray-600"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-neon-green hover:text-neon-green/80"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-neon-pink hover:text-neon-pink/80"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </motion.div>

          <motion.div 
            className="md:col-span-1"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-neon-pink">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₫{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">₫{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-neon-blue">Total</span>
                    <span className="text-lg font-semibold text-neon-yellow">₫{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold">
                Proceed to Checkout
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

