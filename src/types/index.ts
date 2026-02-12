// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

// Track types
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  thumbnail: string;
  videoId: string;
  addedBy?: string;
  addedAt?: Date;
}

// Playlist types
export type PlaylistRole = 'owner' | 'collaborator' | 'viewer';

export interface PlaylistContributor {
  userId: string;
  name: string;
  avatar: string;
  role: PlaylistRole;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  contributors: PlaylistContributor[];
  tracks: Track[];
  isPublic: boolean;
  shareLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Search types
export interface SearchResult {
  id: string;
  type: 'video' | 'playlist' | 'channel';
  title: string;
  description?: string;
  thumbnail: string;
  duration?: number;
  channelName?: string;
  channelId?: string;
  viewCount?: number;
  publishedAt?: Date;
  videoId?: string;
}

// Player types
export type RepeatMode = 'none' | 'one' | 'all';

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  nextPageToken?: string;
  prevPageToken?: string;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// YouTube API types
export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
}

export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: YouTubeSnippet;
}

export interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideoDetails {
  kind: string;
  etag: string;
  items: YouTubeVideoItem[];
}

export interface YouTubeVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeSnippet;
  contentDetails: {
    duration: string; // ISO 8601 duration, e.g., "PT4M13S"
    dimension: string;
    definition: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}
