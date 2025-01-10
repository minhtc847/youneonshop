'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'

// Mock data for orders
const orders = [
  {
    id: '12345',
    date: '2023-05-15',
    total: 259.98,
    status: 'Delivered',
    items: [
      { id: 1, name: 'Blue Wave', price: 129.99, quantity: 1 },
      { id: 2, name: 'Pink Flamingo', price: 129.99, quantity: 1 },
    ],
  },
  {
    id: '12346',
    date: '2023-05-10',
    total: 89.99,
    status: 'Processing',
    items: [
      { id: 3, name: 'Yellow Bolt', price: 89.99, quantity: 1 },
    ],
  },
  // Add more mock orders as needed
]

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-neon-blue"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Orders
      </motion.h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div 
            key={order.id}
            className="bg-gray-800 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="p-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div className="flex items-center space-x-4">
                <Package className="text-neon-pink" />
                <div>
                  <h2 className="text-xl font-semibold text-neon-blue">Order #{order.id}</h2>
                  <p className="text-gray-400">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-neon-yellow">₫{order.total.toLocaleString()}</p>
                <p className={`text-sm ${order.status === 'Delivered' ? 'text-neon-green' : 'text-neon-yellow'}`}>{order.status}</p>
              </div>
              {expandedOrder === order.id ? <ChevronUp className="text-neon-blue" /> : <ChevronDown className="text-neon-blue" />}
            </div>
            {expandedOrder === order.id && (
              <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold mb-2 text-neon-pink">Order Items:</h3>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span className="text-white">{item.name} (x{item.quantity})</span>
                      <span className="text-neon-yellow">₫{item.price.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold">
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

