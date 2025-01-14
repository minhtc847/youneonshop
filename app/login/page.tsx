'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'
import SimplifiedNavbar from '@/components/simplified-navbar'
import { toast } from 'react-toastify'
import { signIn } from '@/service/userServices'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', { email, password })
      console.log('Sign in result:', result)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Login successful!')
        console.log('Session:', session)
        router.push('/')
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please check your credentials and try again.')
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google')
  }

  return (
    <>
      <SimplifiedNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-neon-blue"
        >
          <h2 className="text-neon-blue text-3xl mb-6 text-center font-bold">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 bg-gray-700 text-white border-neon-blue focus:ring-neon-blue transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 bg-gray-700 text-white border-neon-blue focus:ring-neon-blue transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-3 rounded-md transition-all duration-300 transform hover:scale-105">
              Login
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or login with</span>
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
            Don't have an account?{' '}
            <Link href="/register" className="text-neon-pink hover:underline transition-all duration-300">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}

