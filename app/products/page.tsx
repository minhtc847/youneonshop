'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Filter, SortAsc, SortDesc, X, Search } from 'lucide-react'
import { Product, ProductsResponse } from '@/types/product'
import { listProduct, getCategories, getTags } from '@/service/productServices'
import ProductTags from '@/components/product-tags'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'react-toastify'

const themes = {
  blue: { primary: '#00ffff', secondary: '#0080ff' },
  pink: { primary: '#ff00ff', secondary: '#ff0080' },
  yellow: { primary: '#ffff00', secondary: '#ffaa00' },
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [metadata, setMetadata] = useState<ProductsResponse['metadata'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [theme, setTheme] = useState('blue')
  const [error, setError] = useState<string | null>(null)

  const updateQueryParams = useCallback((params: Record<string, string | string[] | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else if (Array.isArray(value)) {
        newSearchParams.set(key, value.join(','));
      } else {
        newSearchParams.set(key, value);
      }
    });

    router.push(`/products?${newSearchParams.toString()}`);
  }, [router, searchParams]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        category: selectedCategory || undefined,
        tags: selectedTags,
        name: searchTerm || undefined,
        price_from: priceRange[0],
        price_to: priceRange[1],
        page: currentPage,
        page_size: 20,
        sort: sortOrder === 'asc' ? 'price' : '-price',
      };

      const data = await listProduct(params);
      setProducts(data.products);
      setMetadata(data.metadata);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      toast.error('Failed to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedTags, searchTerm, priceRange, currentPage, sortOrder]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([getCategories(), getTags()])
        setCategories(categoriesData)
        setTags(tagsData)

        const categoryParam = searchParams.get('category')
        if (categoryParam) {
          setSelectedCategory(categoryParam)
        }

        const tagParam = searchParams.get('tags')
        if (tagParam) {
          setSelectedTags(tagParam.split(','))
        }

        const searchParam = searchParams.get('search')
        if (searchParam) {
          setSearchTerm(searchParam)
        }

        const sortParam = searchParams.get('sort')
        if (sortParam === 'asc' || sortParam === 'desc') {
          setSortOrder(sortParam)
        }

        const pageParam = searchParams.get('page')
        if (pageParam) {
          setCurrentPage(parseInt(pageParam, 10))
        }

        const minPriceParam = searchParams.get('price_from');
        const maxPriceParam = searchParams.get('price_to');
        if (minPriceParam && maxPriceParam) {
          setPriceRange([parseInt(minPriceParam, 10), parseInt(maxPriceParam, 10)]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error)
        toast.error('Error loading initial data. Please refresh the page.');
      }
    }

    fetchInitialData()
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    updateQueryParams({ category: category === selectedCategory ? null : category })
  }

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  useEffect(() => {
    updateQueryParams({ tags: selectedTags.length > 0 ? selectedTags : null })
    fetchProducts()
  }, [selectedTags, updateQueryParams, fetchProducts])

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    updateQueryParams({ sort: newSortOrder })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchTerm || null })
    fetchProducts();
  }

  const handlePriceRangeChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
    updateQueryParams({
      price_from: newPriceRange[0].toString(),
      price_to: newPriceRange[1].toString(),
    });
  };

  const handleAddToCart = (productId: string) => {
    // This is a placeholder for the actual cart functionality
    console.log(`Adding product ${productId} to cart`);
    toast.success('Product added to cart!');
  };

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
            {(Object.keys(themes) as Array<keyof typeof themes>).map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-110 ${theme === color ? 'ring-2 ring-offset-2 scale-110' : ''}`}
                style={{ backgroundColor: themes[color].primary }}
                onClick={() => setTheme(color as keyof typeof themes)}
                aria-label={`Switch to ${color} theme`}
              />
            ))}
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
              <form onSubmit={handleSearch} className="flex">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white border-gray-600 focus:border-current"
                  style={{ '--tw-ring-color': themes[theme].primary } as React.CSSProperties}
                />
                <Button type="submit" className="ml-2 bg-gray-700 hover:bg-gray-600 text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            <div>
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Categories</Label>
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={category} className="text-white">{category}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Tags</Label>
              <div className="max-h-40 overflow-y-auto pr-2">
                {tags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagChange(tag)}
                    />
                    <Label htmlFor={tag} className="text-white">{tag}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Price Range</Label>
              <Slider
                min={0}
                max={10000000}
                step={100000}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
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
                {isFilterOpen ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Select
                value={sortOrder}
                onValueChange={(value: 'asc' | 'desc') => {
                  setSortOrder(value);
                  updateQueryParams({ sort: value });
                }}
              >
                <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Price: Low to High</SelectItem>
                  <SelectItem value="desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {/* <ProductTags selectedTags={selectedTags} onTagSelect={handleTagChange} /> */}
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg backdrop-blur-md">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  ))
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">
                    No products found. Try adjusting your filters or search terms.
                  </div>
                ) : (
                  products.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl backdrop-blur-md flex flex-col h-full">
                        <Link href={`/products/${product.id}`} className="group">
                          <div className="relative aspect-square">
                            <Image
                              src={product.image || '/neon-1.jpg'}
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
                        </Link>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-current transition-colors duration-300" style={{ color: themes[theme].primary }}>{product.name}</h3>
                          <p className="font-bold text-lg mb-3" style={{ color: themes[theme].secondary }}>₫{product.price.toLocaleString()}</p>
                          <div className="mb-4 flex-grow">
                            <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                              {product.tags && product.tags.map((tag, index) => (
                                <span key={index} className="inline-block px-2 py-1 bg-gray-700 text-white text-xs rounded-full mr-2 mb-2 transition-all duration-300 hover:bg-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            className="w-full mt-2 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 bg-gray-700 hover:text-black hover:bg-opacity-90"
                            style={{
                              '--hover-bg': themes[theme].primary,
                              '--hover-shadow': themes[theme].primary,
                            } as React.CSSProperties}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
            {metadata && (
              <div className="mt-8 flex justify-center space-x-2">
                <Button
                  onClick={() => {
                    if (metadata) {
                      const newPage = Math.max(currentPage - 1, metadata.first_page);
                      setCurrentPage(newPage);
                      updateQueryParams({ page: newPage.toString() });
                    }
                  }}
                  disabled={!metadata || currentPage === metadata.first_page}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Previous
                </Button>
                <span className="py-2 px-4 bg-gray-700 rounded-md text-white">
                  Page {currentPage} of {metadata?.last_page || 1}
                </span>
                <Button
                  onClick={() => {
                    if (metadata) {
                      const newPage = Math.min(currentPage + 1, metadata.last_page);
                      setCurrentPage(newPage);
                      updateQueryParams({ page: newPage.toString() });
                    }
                  }}
                  disabled={!metadata || currentPage === metadata.last_page}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

