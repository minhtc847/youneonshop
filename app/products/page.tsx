'use client'

import {useState, useEffect, useCallback, Suspense} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X, DollarSign } from 'lucide-react'
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
import ModernProductCard from '@/components/modern-product-card'
import { useDebounce } from 'use-debounce'

const themes = {
  blue: { primary: '#00ffff', secondary: '#0080ff' },
  pink: { primary: '#ff00ff', secondary: '#ff0080' },
  yellow: { primary: '#ffff00', secondary: '#ffaa00' },
}

interface FilterState {
  category: string;
  tags: string[];
  priceRange: number[];
  searchTerm: string;
  sortOrder: 'asc' | 'desc';
}

const initialFilterState: FilterState = {
  category: '',
  tags: [],
  priceRange: [0, 10000000],
  searchTerm: '',
  sortOrder: 'asc'
}
export default function ProductsPage() {
  return (
      <Suspense fallback={<p>Loading...</p>}>
        <ProductssPage />
      </Suspense>
  );
}
function ProductssPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [metadata, setMetadata] = useState<ProductsResponse['metadata'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilterState)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState)

  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [theme] = useState<keyof typeof themes>('blue')
  const [error, setError] = useState<string | null>(null)
  const [allProductsLoaded, setAllProductsLoaded] = useState(false)

  const [debouncedSearchTerm] = useDebounce(currentFilters.searchTerm, 300)
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
  useEffect(() => {
    if (debouncedSearchTerm !== appliedFilters.searchTerm) {
      setAppliedFilters(prev => ({ ...prev, searchTerm: debouncedSearchTerm }))
      setCurrentPage(1)
      updateQueryParams({ page: '1' })
    }
  }, [appliedFilters.searchTerm, debouncedSearchTerm, updateQueryParams])



  const changePage = async (newPage: number) => {
    setIsLoading(true);
    setAllProductsLoaded(false);
    setError(null);

    try {
      const params = {
        ...appliedFilters,
        page: newPage,
        page_size: 20,
        sort: appliedFilters.sortOrder === 'asc' ? 'price' : '-price',
      };

      const data = await listProduct(params);
      setProducts(data.products);
      setMetadata(data.metadata);
      setAllProductsLoaded(true);
      setCurrentPage(newPage);

      updateQueryParams({ page: newPage.toString() });
    } catch (error) {
      console.log('Error changing page:', error);
      setError('Failed to change page. Please try again.');
      toast.error('Failed to change page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const applyFilters = async () => {
    setIsLoading(true);
    setAllProductsLoaded(false);
    setError(null);

    try {
      const params = {
        category: currentFilters.category || undefined,
        tags: currentFilters.tags,
        name: currentFilters.searchTerm || undefined,
        price_from: currentFilters.priceRange[0],
        price_to: currentFilters.priceRange[1],
        page: 1,
        page_size: 20,
        sort: currentFilters.sortOrder === 'asc' ? 'price' : '-price',
      };

      const data = await listProduct(params);
      setProducts(data.products);
      setMetadata(data.metadata);
      setAllProductsLoaded(true);
      setAppliedFilters(currentFilters);
      setCurrentPage(1);

      updateQueryParams({
        category: currentFilters.category || null,
        tags: currentFilters.tags.length > 0 ? currentFilters.tags : null,
        search: currentFilters.searchTerm || null,
        sort: currentFilters.sortOrder,
        price_from: currentFilters.priceRange[0].toString(),
        price_to: currentFilters.priceRange[1].toString(),
        page: '1'
      });
    } catch (error) {
      console.log('Error applying filters:', error);
      setError('Failed to apply filters. Please try again.');
      toast.error('Failed to apply filters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setCurrentFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setCurrentPage(1);
    updateQueryParams({
      category: null,
      tags: null,
      search: null,
      sort: 'asc',
      price_from: '0',
      price_to: '10000000',
      page: '1'
    });
  };

  const handleCategoryChange = (category: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      category: category === prev.category ? '' : category
    }));
  };

  const handleTagChange = (tag: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }

  const handlePriceRangeChange = (newPriceRange: number[]) => {
    setCurrentFilters(prev => ({
      ...prev,
      priceRange: newPriceRange.map(value => Math.max(0, Math.min(value, 10000000)))
    }));
  };

  const handleSortChange = (value: 'asc' | 'desc') => {
    setCurrentFilters(prev => ({
      ...prev,
      sortOrder: value
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setAllProductsLoaded(false);
      setError(null);

      try {
        const [categoriesData, tagsData] = await Promise.all([getCategories(), getTags()]);
        setCategories(categoriesData);
        setTags(tagsData);

        const categoryParam = searchParams.get('category');
        const tagParam = searchParams.get('tags');
        const searchParam = searchParams.get('search');
        const sortParam = searchParams.get('sort');
        const pageParam = searchParams.get('page');
        const minPriceParam = searchParams.get('price_from');
        const maxPriceParam = searchParams.get('price_to');

        const initialFilters: FilterState = {
          category: categoryParam || '',
          tags: tagParam ? tagParam.split(',') : [],
          searchTerm: searchParam || '',
          sortOrder: (sortParam === 'asc' || sortParam === 'desc') ? sortParam : 'asc',
          priceRange: [
            minPriceParam ? parseInt(minPriceParam, 10) : 0,
            maxPriceParam ? parseInt(maxPriceParam, 10) : 10000000
          ]
        };

        setCurrentFilters(initialFilters);
        setAppliedFilters(initialFilters);

        if (pageParam) {
          setCurrentPage(parseInt(pageParam, 10));
        }

        const params = {
          category: initialFilters.category || undefined,
          tags: initialFilters.tags,
          name: initialFilters.searchTerm || undefined,
          price_from: initialFilters.priceRange[0],
          price_to: initialFilters.priceRange[1],
          page: pageParam ? parseInt(pageParam, 10) : 1,
          page_size: 20,
          sort: initialFilters.sortOrder === 'asc' ? 'price' : '-price',
        };

        const data = await listProduct(params);
        setProducts(data.products);
        setMetadata(data.metadata);
        setAllProductsLoaded(true);
      } catch (error) {
        console.log('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        toast.error('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);


  return (
      <Suspense fallback={<div>Loading...</div>}>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search products..."
                  value={currentFilters.searchTerm}
                  onChange={(e) => setCurrentFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10 bg-gray-700 text-white border-gray-600 focus:border-current"
                  style={{ '--tw-ring-color': themes[theme].primary } as React.CSSProperties}
                />
              </div>
            </div>
            <div>
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Categories</Label>
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={category}
                    checked={currentFilters.category === category}
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
                      checked={currentFilters.tags.includes(tag)}
                      onCheckedChange={() => handleTagChange(tag)}
                    />
                    <Label htmlFor={tag} className="text-white">{tag}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-lg mb-2 block" style={{ color: themes[theme].primary }}>Price Range</Label>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="number"
                    value={currentFilters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), currentFilters.priceRange[1]])}
                    className="pl-10 bg-gray-700 text-white border-gray-600"
                    placeholder="Min"
                  />
                </div>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="number"
                    value={currentFilters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([currentFilters.priceRange[0], parseInt(e.target.value)])}
                    className="pl-10 bg-gray-700 text-white border-gray-600"
                    placeholder="Max"
                  />
                </div>
              </div>
              <Slider
                min={0}
                max={10000000}
                step={100000}
                value={currentFilters.priceRange}
                onValueChange={handlePriceRangeChange}
                className="my-4"
              />
              <div className="flex justify-between text-white">
                <span>₫{currentFilters.priceRange[0].toLocaleString()}</span>
                <span>₫{currentFilters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={applyFilters}
                className="flex-1 bg-neon-blue hover:bg-neon-blue/80 text-black font-bold"
              >
                Apply Filters
              </Button>
              <Button
                onClick={clearFilters}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold"
              >
                Clear Filters
              </Button>
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
                value={currentFilters.sortOrder}
                onValueChange={(value: 'asc' | 'desc') => handleSortChange(value)}
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
            <ProductTags selectedTags={appliedFilters.tags} onTagSelect={handleTagChange} />
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-[500px] w-full rounded-lg" />
                  ))}
                </motion.div>
              ) : allProductsLoaded && products.length === 0 ? (
                <motion.div
                  className="col-span-full text-center text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  No products found. Try adjusting your filters or search terms.
                </motion.div>
              ) : allProductsLoaded ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {products.map((product) => (
                    <ModernProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image || '/neon-1.jpg'}
                      description={product.description}
                      tags={product.tags || []}
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
            {metadata && (
              <div className="mt-8 flex justify-center space-x-2">
                <Button
                  onClick={() => {
                    if (metadata) {
                      const newPage = Math.max(currentPage - 1, metadata.first_page);
                      changePage(newPage);
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
                      changePage(newPage);
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
      </Suspense>
  )
}

