'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, CreditCard, Settings } from 'lucide-react'
import Navbar from '@/components/navbar'

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-neon-blue">Your Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 bg-gray-800 border-neon-blue">
            <CardHeader>
              <CardTitle className="text-neon-pink">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar || '/placeholder.svg?height=128&width=128'} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="bg-neon-blue text-black text-2xl">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold text-white mb-2">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-400 mb-4">{user.email}</p>
              <Button onClick={handleLogout} className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold">
                Logout
              </Button>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 bg-gray-800 border-neon-blue">
            <CardHeader>
              <CardTitle className="text-neon-yellow">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                  <TabsTrigger value="orders" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orders" className="text-white">
                  <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                  <p>You haven't placed any orders yet.</p>
                </TabsContent>
                <TabsContent value="payments" className="text-white">
                  <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
                  <p>No payment methods added yet.</p>
                </TabsContent>
                <TabsContent value="settings" className="text-white">
                  <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                  <p>Manage your account settings and preferences here.</p>
                </TabsContent>
                <TabsContent value="profile" className="text-white">
                  <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                  <p>Update your profile information here.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

