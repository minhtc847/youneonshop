import { Suspense } from 'react'
import SwipeableBanner from '@/components/swipeable-banner'
import { listProduct } from '@/service/productServices'
import { Product } from '@/types/product'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

async function FeaturedProducts() {
  try {
    const productsData = await listProduct();
    const products: Product[] = Array.isArray(productsData) ? productsData : [];
    const featuredProducts = products.slice(0, 4); // Get the first 4 products as featured

    if (featuredProducts.length === 0) {
      return <p className="text-center text-gray-400">No featured products available at the moment.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-glow-blue">
              <div className="relative aspect-square">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-neon-blue transition-colors duration-300">{product.name}</h3>
                <p className="text-neon-yellow font-bold">₫{product.price.toLocaleString()}</p>
                <Button className="w-full mt-4 bg-neon-blue hover:bg-neon-blue/80 text-black font-bold">
                  View Product
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return <p className="text-center text-red-500">Error loading featured products. Please try again later.</p>;
  }
}

export default function Home() {
  return (
    <div className="space-y-12">
      <SwipeableBanner />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-neon-blue">Featured Products</h2>
        <Suspense fallback={<p className="text-center">Loading featured products...</p>}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </div>
  )
}

