import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services';

export function useSearch(query: string, page: number = 1) {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn: async () => {
      const result = await searchService.search(query, page);
      // Save successful searches to history
      if (result.items.length > 0) {
        searchService.saveToHistory(query);
      }
      return result;
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
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

export function useTrendingMusic() {
  return useQuery({
    queryKey: ['trending-music'],
    queryFn: () => searchService.getTrending(20),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
