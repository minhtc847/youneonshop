import React from 'react';
import { getTags } from '@/service/productServices';

export default function ProductTags() {
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
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 bg-gray-700 text-white rounded-full text-sm">
          {tag}
        </span>
      ))}
    </div>
  );
}

