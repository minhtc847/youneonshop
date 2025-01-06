import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'

const products = [
  { id: 1, name: 'Blue Wave', price: 129.99, image: '/placeholder.svg?height=600&width=600', description: 'A calming blue wave neon light that brings the ocean vibes to your space.' },
  { id: 2, name: 'Pink Flamingo', price: 149.99, image: '/placeholder.svg?height=600&width=600', description: 'Add a touch of tropical flair with this vibrant pink flamingo neon light.' },
  { id: 3, name: 'Yellow Bolt', price: 99.99, image: '/placeholder.svg?height=600&width=600', description: 'Energize your room with this striking yellow lightning bolt neon light.' },
  { id: 4, name: 'Green Leaf', price: 139.99, image: '/placeholder.svg?height=600&width=600', description: 'Bring nature indoors with this serene green leaf neon light.' },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id))

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="w-full h-auto rounded-lg"
        />
      </div>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-neon-blue">{product.name}</h1>
        <p className="text-2xl font-bold text-neon-yellow">${product.price.toFixed(2)}</p>
        <p className="text-gray-300">{product.description}</p>
        <Button className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-glow-pink">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </div>
    </div>
  )
}

