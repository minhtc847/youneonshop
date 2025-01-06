import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import SwipeableBanner from '@/components/swipeable-banner'

const products = [
  { id: 1, name: 'Blue Wave', price: 129.99, image: '/placeholder.svg?height=300&width=300' },
  { id: 2, name: 'Pink Flamingo', price: 149.99, image: '/placeholder.svg?height=300&width=300' },
  { id: 3, name: 'Yellow Bolt', price: 99.99, image: '/placeholder.svg?height=300&width=300' },
  { id: 4, name: 'Green Leaf', price: 139.99, image: '/placeholder.svg?height=300&width=300' },
]

export default function Home() {
  return (
    <div className="space-y-12">
      <SwipeableBanner />
      <section className="py-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-neon-blue">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-lg">
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-neon-blue transition-colors duration-300">{product.name}</h3>
                  <p className="text-neon-yellow font-bold text-lg">${product.price.toFixed(2)}</p>
                  <Button className="mt-4 w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-glow-pink">
                    View Product
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

