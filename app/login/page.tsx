'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import SimplifiedNavbar from '@/components/simplified-navbar'
import { loginUser } from '@/service/userServices'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      router.push('/')
    }
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await loginUser({ email, password })
      console.log('Login successful:', response.authentication_token)
      localStorage.setItem('user', JSON.stringify(response.authentication_token))
      toast.success('Login successful!')
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login failed:', (error as any).response?.data || error.message)
        toast.error((error as any).response?.data?.message || 'Login failed. Please try again.')
      } else {
        console.error('Login failed:', error)
        toast.error('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <>
      <SimplifiedNavbar />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-neon-blue text-2xl mb-4 text-center font-bold">Login</h2>
          <div className="mb-4">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 bg-gray-700 text-white border-neon-blue focus:ring-neon-blue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 bg-gray-700 text-white border-neon-blue focus:ring-neon-blue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold">
            Login
          </Button>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full bg-transparent hover:bg-neon-blue/10 text-white border-neon-blue hover:border-neon-blue transition-all duration-300">
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent hover:bg-neon-pink/10 text-white border-neon-pink hover:border-neon-pink transition-all duration-300">
              <FaFacebook className="mr-2" /> Facebook
            </Button>
          </div>
          <p className="mt-4 text-center text-white">
            Don't have an account?{' '}
            <Link href="/register" className="text-neon-pink hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}

