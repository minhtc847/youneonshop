'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import SimplifiedNavbar from '@/components/simplified-navbar'
import { registerNewUser } from '@/service/userServices'

export default function RegisterPage() {
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await registerNewUser({ email, first_name, last_name, password })
      toast.success('Registration successful')
      router.push('/login')
    } catch (error) {
      toast.error('Registration failed')
      console.error('Error:', error)
    }
  }

  return (
    <>
      <SimplifiedNavbar />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-white text-2xl mb-4 text-center">Register</h2>
          <div className="mb-4">
            <Label htmlFor="first_name" className="text-white">First Name</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Enter your first name"
              className="mt-1"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="last_name" className="text-white">Last Name</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Enter your last name"
              className="mt-1"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1"
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
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Register
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
            Already have an account?{' '}
            <Link href="/login" className="text-neon-pink hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}