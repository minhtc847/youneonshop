'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Star, ChevronRight, Truck, RefreshCcw, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { getProductById } from '@/service/productServices';
import { Product } from '@/types/product'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const productData = await getProductById(id as string);
        setProduct(productData.product)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product. Please try again later.')
      }
      setIsLoading(false)
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center text-gray-400">
        Product not found
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link href="/" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">Home</Link>
        <ChevronRight className="mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">Products</Link>
        <ChevronRight className="mx-2 text-gray-400" />
        <span className="text-neon-blue">{product?.name || 'Product Details'}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-900">
            <Image
              src={product.image || '/neon-2.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 hover:scale-105"
            />
          </div>
          {/* Add thumbnail images here if available */}
        </motion.div>

        {/* Product Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-neon-blue">{product.name}</h1>
          <p className="text-3xl font-bold text-neon-yellow">₫{product.price.toLocaleString()}</p>

          <div className="prose prose-invert">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart */}
          <div className="flex space-x-4">
            <Button
              className="flex-1 bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-glow-pink"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button variant="outline" className="bg-transparent border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-colors duration-300">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto text-neon-blue mb-2" />
              <p className="text-sm">Free Shipping</p>
            </div>
            <div className="text-center">
              <RefreshCcw className="h-8 w-8 mx-auto text-neon-pink mb-2" />
              <p className="text-sm">30-Day Returns</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto text-neon-yellow mb-2" />
              <p className="text-sm">2-Year Warranty</p>
            </div>
          </div>

          {/* Tags */}
          {product.tags && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-neon-pink">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700 text-white rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-neon-blue">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* This section needs data from the API to populate related products */}
        </div>
      </motion.div>
    </div>
  )
}

