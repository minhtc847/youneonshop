'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, ChevronLeft, Truck, RefreshCcw, Shield } from 'lucide-react'
import { getProductById } from '@/service/productServices'
import { Product } from '@/types/product'
import { toast } from 'react-toastify'
import {addToCart} from "@/service/cartServices";
import {useSession} from "next-auth/react";

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const productData = await getProductById(id as string)
        setProduct(productData.product)
      } catch (error) {
        console.log('Error fetching product:', error)
        setError('Failed to load product. Please try again later.')
      }
      setIsLoading(false)
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    const token = session?.user?.authentication_token;

    addToCart(token, id as string,quantity).then(() =>  toast("Đã thêm vào giỏ hàng"));

  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">
          Product not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4 text-neon-blue hover:text-neon-pink transition-colors duration-300"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-900">
            <Image
              src={product.image_list?.[activeImage] || product.image || '/neon-1.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 hover:scale-105"
            />
          </div>
          {product.image_list && product.image_list.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto py-2">
              {product.image_list.map((img, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${index === activeImage ? 'ring-2 ring-neon-blue' : ''
                    }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-neon-blue">{product.name}</h1>
          <p className="text-3xl font-bold text-neon-pink">{product.price.toLocaleString('vi-VN')}₫</p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-gray-300">Quantity:</label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-20 bg-gray-800 text-white border-gray-700"
              />
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-neon-glow flex items-center justify-center"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-gray-300">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="text-gray-300">
              <ul className="list-disc list-inside">
                <li>Material: High-quality LED neon flex</li>
                <li>Power: 12V DC adapter included</li>
                <li>Lifespan: Up to 50,000 hours</li>
                <li>Waterproof rating: IP65 (suitable for indoor and outdoor use)</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="text-gray-300">
              <p>Free shipping on orders over 1,000,000₫. Standard delivery takes 3-5 business days.</p>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto text-neon-blue mb-2" />
              <p className="text-sm text-gray-300">Free Shipping</p>
            </div>
            <div className="text-center">
              <RefreshCcw className="h-8 w-8 mx-auto text-neon-pink mb-2" />
              <p className="text-sm text-gray-300">30-Day Returns</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto text-neon-yellow mb-2" />
              <p className="text-sm text-gray-300">2-Year Warranty</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

