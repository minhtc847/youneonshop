'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import Logo from './logo'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/design">Design Your Own</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Button asChild variant="outline" size="sm" className="text-white border-white hover:bg-neon-blue hover:text-black transition-colors duration-300 bg-black">
              <Link href="/login">Login</Link>
            </Button>
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
            <Button asChild variant="ghost" size="sm" className="text-black hover:text-neon-blue transition-colors duration-300 justify-start bg-black">
              <Link href="/login">
                <User className="h-5 w-5 mr-2" />
                Login
              </Link>
            </Button>
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-white hover:text-neon-blue transition-colors duration-300 font-medium">
      {children}
    </Link>
  )
}

