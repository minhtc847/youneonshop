import React from 'react';
import { getTags } from '@/service/productServices';
import { Button } from "@/components/ui/button"

interface ProductTagsProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export default function ProductTags({ selectedTags, onTagSelect }: ProductTagsProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
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

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTags.includes(tag) ? "secondary" : "outline"}
          size="sm"
          onClick={() => onTagSelect(tag)}
          className="text-sm"
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
