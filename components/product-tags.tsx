import React, { useRef, useEffect, useState } from 'react';
import { getTags } from '@/service/productServices';
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductTagsProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export default function ProductTags({ selectedTags, onTagSelect }: ProductTagsProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [tags]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <div className="h-12 bg-gray-800 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="relative mb-6 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3 text-neon-blue">Popular Tags</h2>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-2 py-2 custom-scrollbar"
        style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
      >
        {tags.map((tag) => (
          <motion.div
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedTags.includes(tag) ? "secondary" : "outline"}
              size="sm"
              onClick={() => onTagSelect(tag)}
              className={`text-sm whitespace-nowrap ${selectedTags.includes(tag)
                ? 'bg-neon-blue text-black hover:bg-neon-blue/80'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              {tag}
            </Button>
          </motion.div>
        ))}
      </div>
      {showLeftArrow && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800/50 hover:bg-gray-700 rounded-full p-1"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4 text-neon-blue" />
        </Button>
      )}
      {showRightArrow && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800/50 hover:bg-gray-700 rounded-full p-1"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4 text-neon-blue" />
        </Button>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #00ffff, #ff00ff);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #00ffff, #ff00ff, #ffff00);
        }
      `}</style>
    </div>
  );
}

