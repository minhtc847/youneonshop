"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-red-500">
        <h2 className="text-red-500 text-3xl mb-6 text-center font-bold">Something went wrong!</h2>
        <p className="text-white text-center mb-6">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => reset()} className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-neon-pink hover:bg-neon-pink/80 text-black font-bold"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}

