"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    console.error("Authentication error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-red-500">
        <h2 className="text-red-500 text-3xl mb-6 text-center font-bold">Authentication Error</h2>
        <p className="text-white text-center mb-6">
          {error === "AccessDenied"
            ? "Access was denied. This could be due to insufficient permissions or an issue with your account."
            : "An error occurred during authentication. Please try again."}
        </p>
        <Button
          asChild
          className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-3 rounded-md transition-all duration-300"
        >
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    </div>
  )
}

