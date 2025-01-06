'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

//1920x1080
const featuredProducts = [
  { id: 1, name: 'Cosmic Dreams', description: 'Illuminate your space', image: '/neon-1.jpg', cta: 'Shop Now' },
  { id: 2, name: 'Urban Pulse', description: "Energize your home", image: '/neon-2.jpg', cta: 'Explore' },
  { id: 3, name: 'Neon Jungle', description: 'Transform your room', image: '/neon-3.jpg', cta: 'Discover' },
]

export default function SwipeableBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredProducts.length) % featuredProducts.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black">
      {featuredProducts.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === currentIndex}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <h2 className="text-6xl md:text-8xl font-bold mb-4 text-white tracking-tight">{product.name}</h2>
              <p className="text-2xl md:text-3xl mb-8 text-white font-light">{product.description}</p>
              <Button asChild className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 text-lg transition-colors duration-300">
                <Link href={`/products/${product.id}`}>{product.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 text-black p-2 rounded-full hover:bg-white/70 transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 text-black p-2 rounded-full hover:bg-white/70 transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

