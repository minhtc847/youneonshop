'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/navbar'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Package, Settings, CreditCard, LogOut } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neon-blue text-2xl animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-12 text-center text-neon-blue"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Your Account
        </motion.h1>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink flex items-center">
              <User className="mr-2" /> Profile Information
            </h2>
            <div className="space-y-2">
              <p><span className="text-neon-yellow">Name:</span> {session.user?.name}</p>
              <p><span className="text-neon-yellow">Email:</span> {session.user?.email}</p>
              <p><span className="text-neon-yellow">Member Since:</span> January 1, 2023</p>
            </div>
            <Button className="mt-4 w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold">
              Edit Profile
            </Button>
          </motion.div>

          <motion.div 
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink flex items-center">
              <Package className="mr-2" /> Recent Orders
            </h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Order #12345</span>
                <span className="text-neon-yellow">$129.99</span>
              </li>
              <li className="flex justify-between">
                <span>Order #12346</span>
                <span className="text-neon-yellow">$89.99</span>
              </li>
            </ul>
            <Button className="mt-4 w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold">
              View All Orders
            </Button>
          </motion.div>

          <motion.div 
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-neon-pink flex items-center">
              <Settings className="mr-2" /> Preferences
            </h2>
            <div className="space-y-2">
              <p><span className="text-neon-yellow">Language:</span> English</p>
              <p><span className="text-neon-yellow">Currency:</span> USD</p>
              <p><span className="text-neon-yellow">Notifications:</span> Enabled</p>
            </div>
            <Button className="mt-4 w-full bg-neon-yellow hover:bg-neon-yellow/80 text-black font-bold">
              Update Preferences
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-neon-pink flex items-center">
            <CreditCard className="mr-2" /> Payment Methods
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-neon-blue">Visa ending in 1234</p>
              <p className="text-sm text-gray-400">Expires 12/2025</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-neon-blue">Mastercard ending in 5678</p>
              <p className="text-sm text-gray-400">Expires 06/2024</p>
            </div>
          </div>
          <Button className="mt-4 w-full bg-neon-green hover:bg-neon-green/80 text-black font-bold">
            Add Payment Method
          </Button>
        </motion.div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-glow-red">
            <LogOut className="mr-2" /> Logout
          </Button>
        </motion.div>
      </div>
    </>
  )
}

