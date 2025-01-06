'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import SimplifiedNavbar from '@/components/simplified-navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login submitted', { email, password })
  }

  return (
    <>
      <SimplifiedNavbar />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-neon-blue">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-neon-blue focus:ring-neon-blue transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-neon-blue focus:ring-neon-blue transition-all duration-300"
              />
            </div>
            <Button type="submit" className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-glow-blue">
              Login
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-300">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full bg-transparent hover:bg-neon-blue/10 text-white border-neon-blue hover:border-neon-blue transition-all duration-300">
                <FaGoogle className="mr-2" /> Google
              </Button>
              <Button variant="outline" className="w-full bg-transparent hover:bg-neon-pink/10 text-white border-neon-pink hover:border-neon-pink transition-all duration-300">
                <FaFacebook className="mr-2" /> Facebook
              </Button>
            </div>
          </div>
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link href="/register" className="text-neon-pink hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

