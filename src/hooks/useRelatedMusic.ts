import { useQuery } from '@tanstack/react-query';
import type { Track } from '@/types';
import { recommendationService } from '@/services';

/**
 * Hook to fetch related music recommendations for a given track
 * Uses React Query for caching and automatic refetching
 */
export function useRelatedMusic(track: Track | null, enabled = true) {
  return useQuery({
    queryKey: ['relatedMusic', track?.videoId],
    queryFn: () => {
      if (!track) return Promise.resolve([]);
      return recommendationService.getRelatedMusic(track.videoId, 10);
    },
    enabled: enabled && !!track,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}
