import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { SearchResultItem } from './SearchResultItem';
import { SearchResultSkeleton } from '@/components/ui';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { data, isLoading, isError, error } = useSearch(query);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Search size={64} className="mb-4 opacity-50" />
        <p className="text-lg">Search for songs, videos, or artists</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400">
        <p className="text-lg">Error loading results</p>
        <p className="text-sm text-zinc-500 mt-2">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Search size={64} className="mb-4 opacity-50" />
        <p className="text-lg">No results found for "{query}"</p>
        <p className="text-sm mt-2">Try different keywords</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-4">
        {data.totalCount} results for "{query}"
      </p>
      <div className="space-y-1">
        {data.items.map((result) => (
          <SearchResultItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
