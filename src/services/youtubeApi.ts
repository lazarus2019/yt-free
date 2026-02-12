import type {
  YouTubeSearchResponse,
  YouTubeVideoDetails,
  YouTubeVideoItem,
  SearchResult,
  Track,
} from '@/types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Parse ISO 8601 duration (e.g., "PT4M13S") to seconds
 */
export function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Decode HTML entities from YouTube API responses
 */
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Fetch wrapper with error handling for YouTube API
 */
async function ytFetch<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set('key', API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message = error?.error?.message || `YouTube API error: ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

/**
 * Search YouTube videos
 */
export async function searchVideos(
  query: string,
  pageToken?: string,
  maxResults = 20
): Promise<YouTubeSearchResponse> {
  return ytFetch<YouTubeSearchResponse>('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '10', // Music category
    maxResults: String(maxResults),
    ...(pageToken ? { pageToken } : {}),
  });
}

/**
 * Search YouTube (all types: video, playlist, channel)
 */
export async function searchAll(
  query: string,
  pageToken?: string,
  maxResults = 20
): Promise<YouTubeSearchResponse> {
  return ytFetch<YouTubeSearchResponse>('search', {
    part: 'snippet',
    q: query,
    type: 'video,playlist,channel',
    maxResults: String(maxResults),
    ...(pageToken ? { pageToken } : {}),
  });
}

/**
 * Get video details (duration, view count, etc.) for one or more video IDs
 */
export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetails> {
  return ytFetch<YouTubeVideoDetails>('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
  });
}

/**
 * Get trending / popular music videos
 */
export async function getTrendingMusic(
  maxResults = 20,
  pageToken?: string
): Promise<YouTubeVideoDetails> {
  return ytFetch<YouTubeVideoDetails>('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    videoCategoryId: '10', // Music
    regionCode: 'US',
    maxResults: String(maxResults),
    ...(pageToken ? { pageToken } : {}),
  });
}

/**
 * Get related videos for a given video
 */
export async function getRelatedVideos(
  videoId: string,
  maxResults = 10
): Promise<YouTubeSearchResponse> {
  return ytFetch<YouTubeSearchResponse>('search', {
    part: 'snippet',
    relatedToVideoId: videoId,
    type: 'video',
    maxResults: String(maxResults),
  });
}

/**
 * Get YouTube search suggestions via the suggest API
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];
  try {
    // YouTube suggest API (CORS-friendly via JSONP workaround is not needed in dev with proxy)
    // Fallback: we return empty and rely on our own search history
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}&callback=`,
      { mode: 'no-cors' }
    );
    // no-cors doesn't allow reading the response, so this is best-effort
    const text = await res.text();
    // Parse JSONP response: window.google.ac.h([...])
    const match = text.match(/\[.*\]/);
    if (match) {
      const data = JSON.parse(match[0]);
      if (Array.isArray(data[1])) {
        return data[1].map((item: [string]) => item[0]).slice(0, 8);
      }
    }
    return [];
  } catch {
    return [];
  }
}

// ─── Mappers ────────────────────────────────────────────────────────────

/**
 * Map a YouTube search item + optional video details into our SearchResult type
 */
export function mapSearchResult(
  item: YouTubeSearchResponse['items'][number],
  videoDetail?: YouTubeVideoItem
): SearchResult {
  const videoId = item.id.videoId || item.id.playlistId || item.id.channelId || '';
  const type = item.id.videoId ? 'video' : item.id.playlistId ? 'playlist' : 'channel';

  return {
    id: videoId,
    type,
    title: decodeHtml(item.snippet.title),
    description: decodeHtml(item.snippet.description),
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default.url,
    duration: videoDetail ? parseDuration(videoDetail.contentDetails.duration) : undefined,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    viewCount: videoDetail ? parseInt(videoDetail.statistics.viewCount, 10) : undefined,
    publishedAt: new Date(item.snippet.publishedAt),
    videoId,
  };
}

/**
 * Map a YouTube video item (from videos endpoint) into our SearchResult type
 */
export function mapVideoToSearchResult(item: YouTubeVideoItem): SearchResult {
  return {
    id: item.id,
    type: 'video',
    title: decodeHtml(item.snippet.title),
    description: decodeHtml(item.snippet.description),
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default.url,
    duration: parseDuration(item.contentDetails.duration),
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    viewCount: parseInt(item.statistics.viewCount, 10),
    publishedAt: new Date(item.snippet.publishedAt),
    videoId: item.id,
  };
}

/**
 * Convert a SearchResult into a Track (for the player)
 */
export function searchResultToTrack(result: SearchResult): Track {
  return {
    id: result.videoId || result.id,
    title: result.title,
    artist: result.channelName || 'Unknown Artist',
    duration: result.duration || 0,
    thumbnail: result.thumbnail,
    videoId: result.videoId || result.id,
  };
}

/**
 * Map a YouTube video item into a Track
 */
export function videoItemToTrack(item: YouTubeVideoItem): Track {
  return {
    id: item.id,
    title: decodeHtml(item.snippet.title),
    artist: item.snippet.channelTitle,
    duration: parseDuration(item.contentDetails.duration),
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default.url,
    videoId: item.id,
  };
}
