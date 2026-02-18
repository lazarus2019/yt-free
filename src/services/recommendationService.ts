import type { Track } from '@/types';
import {
  getRelatedVideos,
  getVideoDetails,
  mapSearchResult,
} from './youtubeApi';

/**
 * Get music recommendations based on the last played track
 * Fetches related videos from YouTube and returns them as Track objects
 */
export const recommendationService = {
  /**
   * Get related music tracks based on a video ID
   * @param videoId - The YouTube video ID of the track to get recommendations for
   * @param maxResults - Maximum number of recommendations (default: 10)
   * @returns Array of related Track objects
   */
  async getRelatedMusic(videoId: string, maxResults = 10): Promise<Track[]> {
    try {
      // Fetch related videos from YouTube API
      const relatedResponse = await getRelatedVideos(videoId, maxResults);

      // Extract video IDs for fetching detailed information
      const videoIds = relatedResponse.items
        .filter((item) => item.id.videoId)
        .map((item) => item.id.videoId!);

      // Get detailed information (duration, view count, etc.)
      let videoDetailsMap = new Map<string, unknown>();
      if (videoIds.length > 0) {
        try {
          const detailsResponse = await getVideoDetails(videoIds);
          videoDetailsMap = new Map(
            detailsResponse.items.map((item) => [item.id, item])
          );
        } catch (err) {
          console.warn('Failed to fetch video details for recommendations:', err);
        }
      }

      // Map search results to Track objects
      const tracks: Track[] = relatedResponse.items
        .filter((item) => item.id.videoId)
        .map((item) => {
          const videoDetail = videoDetailsMap.get(item.id.videoId!) as unknown;
          const searchResult = mapSearchResult(item, videoDetail as undefined);
          return {
            id: searchResult.videoId || searchResult.id,
            title: searchResult.title,
            artist: searchResult.channelName || 'Unknown Artist',
            duration: searchResult.duration || 0,
            thumbnail: searchResult.thumbnail,
            videoId: searchResult.videoId || searchResult.id,
          };
        });

      return tracks;
    } catch (error) {
      console.error('Error fetching related music:', error);
      return [];
    }
  },

  /**
   * Get recommendations and add them to the queue
   * Useful for auto-play functionality when queue is running out
   */
  async getAndQueueRelated(
    track: Track,
    maxResults = 5
  ): Promise<Track[]> {
    return this.getRelatedMusic(track.videoId, maxResults);
  },
};
