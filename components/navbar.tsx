"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"
import Logo from "./logo"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount] = useState(0)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // useEffect(() => {
  //   const fetchCartCount = async () => {
  //     if (session?.user?.authentication_token) {
  //       try {
  //         const response = await getCartItems(session.user.authentication_token)
  //         setCartCount(response.cart.length)
  //       } catch (error) {
  //         console.error("Error fetching cart count:", error)
  //       }
  //     }
  //   }
  //
  //   fetchCartCount()
  // }, [session])

  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)
  }, [status, session])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
      <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="hidden md:flex space-x-4 items-center">
              <NavLink href="/" className="px-2">
                Home
              </NavLink>
              <NavLink href="/products" className="px-2">
                Products
              </NavLink>
              <NavLink href="/imagegen" className="px-2 text-neon-pink">
                Design With AI
              </NavLink>
              <NavLink href="/design" className="px-2">
                Design Your Own
              </NavLink>
              <NavLink href="/about" className="px-2">
                About
              </NavLink>
              <NavLink href="/contact" className="px-2">
                Contact
              </NavLink>
              <NavLink href="/faq" className="px-2">
                FAQ
              </NavLink>
              {status === "authenticated" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                          variant="outline"
                          size="sm"
                          className="text-white border-white hover:bg-neon-blue hover:text-black transition-colors duration-300 bg-black"
                      >
                        <User className="mr-2 h-4 w-4" /> Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/*<DropdownMenuItem onClick={() => router.push("/account")}>Profile</DropdownMenuItem>*/}
                      {/*<DropdownMenuItem onClick={() => router.push("/orders")}>Orders</DropdownMenuItem>*/}
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-white border-white hover:bg-neon-blue hover:text-black transition-colors duration-300 w-24 bg-black"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
              )}
              {status === "authenticated" &&
              <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-neon-yellow transition-colors duration-300 relative"
                  onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-neon-pink text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
                )}
              </Button>}
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
                {status === "authenticated" ? (
                    <>
                      <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-neon-blue transition-colors duration-300 justify-start"
                      >
                        <Link href="/account">
                          <User className="h-5 w-5 mr-2" />
                          Account
                        </Link>
                      </Button>
                      <Button
                          onClick={handleLogout}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-neon-pink transition-colors duration-300 justify-start"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </Button>
                    </>
                ) : (
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-neon-blue transition-colors duration-300 justify-start"
                    >
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
                <NavLink href="/faq">FAQ</NavLink>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-neon-yellow transition-colors duration-300 justify-start"
                    onClick={() => router.push("/cart")}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart ({cartCount})
                </Button>
              </div>
            </div>
        )}
      </nav>
  )
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
      <Link
          href={href}
          className={`text-white hover:text-neon-blue transition-colors duration-300 font-medium ${className || ""}`}
      >
        {children}
      </Link>
  )
}