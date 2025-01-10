'use client'

import { use } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Star, ChevronRight, Truck, RefreshCcw, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { products, Product } from '@/data/products'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Sử dụng use() để “unwrap” params (API experimental)
  const { id } = use(params)

  // Tìm sản phẩm dựa trên id
  const product: Product | undefined = products.find((p) => p.id === id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    // Mô phỏng độ trễ load
    const timer = setTimeout(() => {
      document.body.style.backgroundColor = '#000'
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link href="/" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">Home</Link>
        <ChevronRight className="mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">Products</Link>
        <ChevronRight className="mx-2 text-gray-400" />
        <span className="text-neon-blue">{product.name}</span>
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
              src={product.image_list ? product.image_list[selectedImage] : product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 hover:scale-105"
            />
          </div>
          {product.image_list && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.image_list.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-neon-blue' : ''}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
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
          <p className="text-gray-300">{product.description}</p>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-lg mb-2 block text-neon-pink">Quantity</Label>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-700 hover:bg-neon-blue text-white hover:text-black transition-colors duration-300"
              >
                -
              </Button>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-20 text-center bg-gray-700 text-white border-gray-600"
              />
              <Button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-700 hover:bg-neon-blue text-white hover:text-black transition-colors duration-300"
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart and Wishlist */}
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

          {/* Product Tabs */}
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-gray-300">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-neon-blue">Category</span>
                  <span className="text-white">{product.category}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neon-blue">Material</span>
                  <span className="text-white">LED Neon Flex</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neon-blue">Power Source</span>
                  <span className="text-white">AC Adapter (included)</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {product.rating && (
                  <div className="border-b border-gray-700 pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-neon-pink mr-2">Average Rating</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-neon-yellow fill-neon-yellow' : 'text-gray-400'}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-300">({product.rating})</span>
                    </div>
                    <p className="text-gray-300">Based on customer reviews</p>
                  </div>
                )}
                {/* Add more review content here if available */}
              </div>
            </TabsContent>
          </Tabs>
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
          {products.filter(p => p.id !== product.id).slice(0, 4).map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-glow-blue">
                <div className="relative aspect-square">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-neon-blue transition-colors duration-300">{relatedProduct.name}</h3>
                  <p className="text-neon-yellow font-bold">₫{relatedProduct.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

