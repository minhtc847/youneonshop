'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', { name, email, message })
    // Reset form fields
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-neon-blue"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Contact Us
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-neon-pink">Get in Touch</h2>
          <p className="text-gray-300 mb-8">
            We&apos;d love to hear from you! Whether you have a question about our products, need help with an order, or want to discuss a custom design, our team is here to assist you.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="text-neon-yellow mr-4" />
              <span className="text-gray-300">info@neonlights.vn</span>
            </div>
            <div className="flex items-center">
              <Phone className="text-neon-yellow mr-4" />
              <span className="text-gray-300">+84 123 456 789</span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-neon-yellow mr-4" />
              <span className="text-gray-300">123 Neon Street, District 1, Ho Chi Minh City, Vietnam</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-neon-blue">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-neon-blue"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-neon-blue">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-neon-blue"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-neon-blue">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-neon-blue"
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-glow-pink">
              Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

