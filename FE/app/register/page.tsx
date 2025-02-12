'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'
import SimplifiedNavbar from '@/components/simplified-navbar'
import { registerNewUser } from '@/service/userServices'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await registerNewUser({ email, first_name, last_name, password })
      toast.success('Registration successful! Please log in.')
      router.push('/login')
    } catch (error) {
      console.log('Registration failed', error)
      toast.error('Registration failed. Please try again.')
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/account' })
  }

  return (
    <>
      <SimplifiedNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-lg shadow-2xl border border-neon-pink"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-neon-pink">Join the Neon Revolution</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white text-sm font-semibold">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white focus:border-neon-pink focus:ring-neon-pink transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white text-sm font-semibold">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white focus:border-neon-pink focus:ring-neon-pink transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white focus:border-neon-pink focus:ring-neon-pink transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white focus:border-neon-pink focus:ring-neon-pink transition-all duration-300"
              />
            </div>
            <Button type="submit" className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 rounded-md transition-all duration-300 transform hover:scale-105">
              Register
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or register with</span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-neon-blue/10 text-white border-neon-blue hover:border-neon-blue transition-all duration-300 transform hover:scale-105"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle className="mr-2" /> Google
              </Button>
            </div>
          </div>
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-neon-blue hover:underline transition-all duration-300">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}

