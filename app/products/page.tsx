'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

// This would typically come from a database or API
const products = [
  { id: 1, name: 'Blue Wave', price: 129.99, image: '/placeholder.svg?height=300&width=300', category: 'Abstract' },
  { id: 2, name: 'Pink Flamingo', price: 149.99, image: '/placeholder.svg?height=300&width=300', category: 'Animals' },
  { id: 3, name: 'Yellow Bolt', price: 99.99, image: '/placeholder.svg?height=300&width=300', category: 'Abstract' },
  { id: 4, name: 'Green Leaf', price: 139.99, image: '/placeholder.svg?height=300&width=300', category: 'Nature' },
  { id: 5, name: 'Purple Haze', price: 159.99, image: '/placeholder.svg?height=300&width=300', category: 'Abstract' },
  { id: 6, name: 'Red Heart', price: 119.99, image: '/placeholder.svg?height=300&width=300', category: 'Symbols' },
  { id: 7, name: 'Orange Sunset', price: 134.99, image: '/placeholder.svg?height=300&width=300', category: 'Nature' },
  { id: 8, name: 'Teal Ocean', price: 144.99, image: '/placeholder.svg?height=300&width=300', category: 'Nature' },
]

const categories = [...new Set(products.map(product => product.category))]

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200])

  useEffect(() => {
    const filtered = products.filter(product => 
      (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1])
    )
    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategories, priceRange])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-blue">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1 space-y-6">
          <div>
            <Label htmlFor="search" className="text-neon-blue mb-2 block">Search</Label>
            <Input 
              id="search"
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white border-neon-blue focus:ring-neon-blue"
            />
          </div>
          <div>
            <Label className="text-neon-blue mb-2 block">Categories</Label>
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id={category} 
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={category} className="text-white">{category}</Label>
              </div>
            ))}
          </div>
          <div>
            <Label className="text-neon-blue mb-2 block">Price Range</Label>
            <Slider
              min={0}
              max={200}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
            <div className="flex justify-between text-white">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
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
                    <p className="text-gray-400 mb-4">{product.category}</p>
                    <Button className="w-full bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-2 px-4 rounded-full transition-all duration-300 hover:shadow-glow-pink">
                      View Product
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

