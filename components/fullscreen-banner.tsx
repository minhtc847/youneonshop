import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const featuredProducts = [
  { id: 1, name: 'Cosmic Dreams', description: 'Illuminate your space with celestial wonder', image: '/placeholder.svg?height=1080&width=1920' },
  { id: 2, name: 'Urban Pulse', description: "Bring the city's energy into your home", image: '/placeholder.svg?height=1080&width=1920' },
  { id: 3, name: 'Neon Jungle', description: 'Transform your room into a vibrant oasis', image: '/placeholder.svg?height=1080&width=1920' },
]

export default function FullscreenBanner() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {featuredProducts.map((product, index) => (
        <div key={product.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: index === 0 ? 1 : 0 }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-neon-blue">{product.name}</h2>
              <p className="text-xl md:text-2xl mb-8 text-white">{product.description}</p>
              <Button asChild className="bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-2 px-6 rounded-full transition-all duration-300 hover:shadow-glow-pink">
                <Link href={`/products/${product.id}`}>Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

