'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import SimplifiedNavbar from '@/components/simplified-navbar'
import { toast } from 'react-toastify'
import { signIn } from '@/service/userServices'
import { useSession } from 'next-auth/react'

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-neon-blue text-2xl mb-4 text-center font-bold">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
            <div>
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
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-300">Or login with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full bg-transparent hover:bg-neon-blue/10 text-white border-neon-blue hover:border-neon-blue transition-all duration-300" onClick={handleGoogleSignIn}>
                <FaGoogle className="mr-2" /> Google
              </Button>
              <Button variant="outline" className="w-full bg-transparent hover:bg-neon-pink/10 text-white border-neon-pink hover:border-neon-pink transition-all duration-300">
                <FaFacebook className="mr-2" /> Facebook
              </Button>
            </div>
          </div>
          <p className="mt-4 text-center text-white">
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

