'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/navbar'
import { useSession, signOut } from 'next-auth/react'

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
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-neon-blue">Your Account</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-neon-pink">Account Information</h2>
          <p className="mb-2"><span className="text-neon-yellow">Name:</span> {session.user?.name}</p>
          <p className="mb-2"><span className="text-neon-yellow">Email:</span> {session.user?.email}</p>
          <Button onClick={handleLogout} className="mt-6 w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold">
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}

