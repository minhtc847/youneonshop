'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Star, ChevronRight } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Blue Wave',
    price: 129.99,
    images: [
      '/placeholder.svg?height=600&width=600',
      '/placeholder.svg?height=600&width=600&text=Image+2',
      '/placeholder.svg?height=600&width=600&text=Image+3',
      '/placeholder.svg?height=600&width=600&text=Image+4',
    ],
    description: 'A calming blue wave neon light that brings the ocean vibes to your space. Perfect for creating a relaxing atmosphere in any room.',
    specifications: [
      { name: 'Dimensions', value: '24" x 18"' },
      { name: 'Power', value: '12W' },
      { name: 'Color', value: 'Blue' },
      { name: 'Material', value: 'Acrylic and LED' },
    ],
    reviews: [
      { author: 'John D.', rating: 5, comment: 'Absolutely love this neon light! It\'s the perfect addition to my room.' },
      { author: 'Sarah M.', rating: 4, comment: 'Great quality and looks amazing. Shipping was quick too.' },
    ]
  },
  // Add more products here...
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === parseInt(params.id))
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link href="/" className="text-gray-400 hover:text-neon-blue">Home</Link>
        <ChevronRight className="mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-400 hover:text-neon-blue">Products</Link>
        <ChevronRight className="mx-2 text-gray-400" />
        <span className="text-neon-blue">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-neon-blue' : ''}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-neon-blue">{product.name}</h1>
          <p className="text-3xl font-bold text-neon-yellow">${product.price.toFixed(2)}</p>

          {/* Size Selection */}
          <div>
            <Label htmlFor="size" className="text-lg mb-2 block">Size</Label>
            <RadioGroup id="size" defaultValue="medium" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">Large</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-lg mb-2 block">Quantity</Label>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-700 hover:bg-neon-blue text-white hover:text-black"
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
                className="bg-gray-700 hover:bg-neon-blue text-white hover:text-black"
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
            <Button variant="outline" className="bg-transparent border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black">
              <Heart className="h-5 w-5" />
            </Button>
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
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-400">{spec.name}</span>
                    <span className="text-white">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-white mr-2">{review.author}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-neon-blue">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105">
                <div className="relative aspect-square">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-neon-blue transition-colors duration-300">{relatedProduct.name}</h3>
                  <p className="text-neon-yellow font-bold">${relatedProduct.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

