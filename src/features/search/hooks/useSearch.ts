import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services';

export function useSearch(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn: () => searchService.search(query, page),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: () => searchService.getSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
