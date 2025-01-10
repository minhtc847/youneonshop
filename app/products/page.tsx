'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Filter, SortAsc, SortDesc } from 'lucide-react'
import { products, Product } from '@/data/products'

const categories = [...new Set(products.map(product => product.category).filter(Boolean))]

const themes = {
  blue: { primary: '#00ffff', secondary: '#0080ff' },
  pink: { primary: '#ff00ff', secondary: '#ff0080' },
  yellow: { primary: '#ffff00', secondary: '#ffaa00' },
}

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [theme, setTheme] = useState<keyof typeof themes>('blue')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const filtered = products.filter(product =>
      (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategories.length === 0 || (product.category && selectedCategories.includes(product.category))) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1])
    );
    const sorted = filtered.sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted);
  }, [searchTerm, selectedCategories, priceRange, sortOrder, products]);

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <header className="bg-black py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.h1
            className="text-6xl font-bold mb-6 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ color: themes[theme].primary }}
          >
            Illuminate Your Space
          </motion.h1>
          <motion.p
            className="text-xl text-center text-gray-300 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover our collection of stunning neon lights to transform your environment
          </motion.p>
          <motion.div
            className="flex justify-center mb-8 space-x-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* {(Object.keys(themes) as Array<keyof typeof themes>).map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-110 ${theme === color ? 'ring-2 ring-offset-2 scale-110' : ''}`}
                style={{ backgroundColor: themes[color].primary }}
                onClick={() => setTheme(color)}
                aria-label={`Switch to ${color} theme`}
              />
            ))} */}
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-x"></div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <motion.div
            className={`md:w-1/4 space-y-6 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md ${isFilterOpen ? 'block' : 'hidden md:block'}`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <Label htmlFor="search" className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Search</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-current"
                style={{ '--tw-ring-color': themes[theme].primary } as React.CSSProperties}
              />
            </div>
            <div>
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Categories</Label>
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
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Price Range</Label>
              <Slider
                min={0}
                max={2000000}
                step={100000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-white">
                <span>₫{priceRange[0].toLocaleString()}</span>
                <span>₫{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button
                onClick={toggleSortOrder}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
                Sort by Price
              </Button>
            </div>
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link href={`/products/${product.id}`} className="group">
                      <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl backdrop-blur-md">
                        <div className="relative h-64">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-all duration-300 group-hover:opacity-75"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
                              View Details
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-current transition-colors duration-300" style={{ color: themes[theme].primary }}>{product.name}</h3>
                          <p className="text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center mb-2">
                            {product.rating && [...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                            ))}
                            {product.rating && <span className="ml-2 text-gray-400">({product.rating})</span>}
                          </div>
                          <p className="font-bold text-lg" style={{ color: themes[theme].secondary }}>₫{product.price.toLocaleString()}</p>
                          <Button
                            className="w-full mt-4 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 bg-gray-700 hover:text-black hover:bg-opacity-90"
                            style={{
                              ':hover': {
                                backgroundColor: themes[theme].primary,
                                boxShadow: `0 0 20px ${themes[theme].primary}, 0 0 40px ${themes[theme].primary}`,
                              }
                            }}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

