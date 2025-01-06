'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import Logo from './logo'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/service/userServices'
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)

    const checkLoginStatus = () => {
      const user = localStorage.getItem('user')
      setIsLoggedIn(!!user)
    }

    // Check login status immediately and set up interval
    checkLoginStatus()
    const intervalId = setInterval(checkLoginStatus, 1000) // Check every second

    // Listen for storage events (in case of logout in another tab)
    window.addEventListener('storage', checkLoginStatus)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', checkLoginStatus)
      clearInterval(intervalId)
    }
  }, [])

  const handleLogout = () => {
    //await logoutUser();
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/login')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex space-x-4 items-center">
            <NavLink href="/" className="px-2">Home</NavLink>
            <NavLink href="/products" className="px-2">Products</NavLink>
            <NavLink href="/design" className="px-2">Design Your Own</NavLink>
            <NavLink href="/about" className="px-2">About</NavLink>
            <NavLink href="/contact" className="px-2">Contact</NavLink>
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-neon-blue hover:text-black transition-colors duration-300 w-24 bg-black">
                  <Link href="/account">Account</Link>
                </Button>
                <Button onClick={handleLogout} variant="outline" size="sm" className="text-white border-white hover:bg-neon-pink hover:text-black transition-colors duration-300 w-24 bg-black">
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-neon-blue hover:text-black transition-colors duration-300 w-24 bg-black">
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-white hover:text-neon-yellow transition-colors duration-300 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-neon-pink text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-neon-blue transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                <Button asChild variant="ghost" size="sm" className="text-white hover:text-neon-blue transition-colors duration-300 justify-start">
                  <Link href="/account">
                    <User className="h-5 w-5 mr-2" />
                    Account
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white hover:text-neon-pink transition-colors duration-300 justify-start">
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm" className="text-white hover:text-neon-blue transition-colors duration-300 justify-start">
                <Link href="/login">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </Link>
              </Button>
            )}
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/design">Design Your Own</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Button variant="ghost" size="sm" className="text-white hover:text-neon-yellow transition-colors duration-300 justify-start">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart (0)
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`text-white hover:text-neon-blue transition-colors duration-300 font-medium ${className || ''}`}>
      {children}
    </Link>
  )
}

