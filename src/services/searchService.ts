import type { SearchResult, PaginatedResponse, YouTubeVideoItem } from '@/types';
import {
  searchVideos,
  getVideoDetails,
  getTrendingMusic,
  mapSearchResult,
  mapVideoToSearchResult,
} from './youtubeApi';

export const searchService = {
  /**
   * Search YouTube for music videos
   * Returns paginated results with video details (duration, view count)
   */
  async search(
    query: string,
    page: number = 1,
    pageSize: number = 20,
    pageToken?: string
  ): Promise<PaginatedResponse<SearchResult> & { nextPageToken?: string }> {
    const searchResponse = await searchVideos(query, pageToken, pageSize);

    // Extract video IDs to fetch details (duration, views)
    const videoIds = searchResponse.items
      .filter((item) => item.id.videoId)
      .map((item) => item.id.videoId!);

    // Fetch video details in parallel for all video results
    let videoDetailsMap = new Map<string, YouTubeVideoItem>();
    if (videoIds.length > 0) {
      const detailsResponse = await getVideoDetails(videoIds);
      videoDetailsMap = new Map(
        detailsResponse.items.map((item) => [item.id, item])
      );
    }

    // Map search results with enriched video details
    const items: SearchResult[] = searchResponse.items.map((item) => {
      const videoDetail = item.id.videoId
        ? videoDetailsMap.get(item.id.videoId)
        : undefined;
      return mapSearchResult(item, videoDetail);
    });

    return {
      items,
      totalCount: searchResponse.pageInfo.totalResults,
      nextPageToken: searchResponse.nextPageToken,
      prevPageToken: searchResponse.prevPageToken,
      page,
      pageSize,
      hasMore: !!searchResponse.nextPageToken,
    };
  },

  /**
   * Get trending music videos for the home page
   */
  async getTrending(maxResults = 20): Promise<SearchResult[]> {
    const response = await getTrendingMusic(maxResults);
    return response.items.map(mapVideoToSearchResult);
  },

  /**
   * Get suggestions based on local search history
   */
  async getSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const stored = localStorage.getItem('yt-free-search-history');
    const history: string[] = stored ? JSON.parse(stored) : [];

    return history
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  },

  /**
   * Save a search query to local history
   */
  saveToHistory(query: string): void {
    const stored = localStorage.getItem('yt-free-search-history');
    const history: string[] = stored ? JSON.parse(stored) : [];

    const filtered = history.filter((item) => item.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 50);
    localStorage.setItem('yt-free-search-history', JSON.stringify(updated));
  },

  /**
   * Clear search history
   */
  clearHistory(): void {
    localStorage.removeItem('yt-free-search-history');
  },
};
