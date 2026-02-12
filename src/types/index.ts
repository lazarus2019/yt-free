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
  viewCount?: number;
  publishedAt?: Date;
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
  page: number;
  pageSize: number;
  hasMore: boolean;
}
