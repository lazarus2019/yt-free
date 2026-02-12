import type { Playlist, Track, PlaylistRole, PlaylistContributor } from '@/types';

// Mock data storage (simulating a database)
let mockPlaylists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'My Favorites',
    description: 'Collection of my all-time favorite songs',
    thumbnail: 'https://picsum.photos/seed/playlist1/300/300',
    owner: {
      id: 'user-1',
      name: 'Demo User',
      avatar: 'https://picsum.photos/seed/user1/100/100',
    },
    contributors: [],
    tracks: [
      {
        id: 'track-1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: 354,
        thumbnail: 'https://picsum.photos/seed/queen1/120/120',
        videoId: 'fJ9rUzIMcZQ',
        addedBy: 'user-1',
        addedAt: new Date('2024-01-15'),
      },
      {
        id: 'track-2',
        title: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        duration: 391,
        thumbnail: 'https://picsum.photos/seed/eagles1/120/120',
        videoId: 'EqPtz5qN7HM',
        addedBy: 'user-1',
        addedAt: new Date('2024-01-16'),
      },
    ],
    isPublic: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'playlist-2',
    name: 'Rock Classics',
    description: 'Best rock songs from the 70s and 80s',
    thumbnail: 'https://picsum.photos/seed/playlist2/300/300',
    owner: {
      id: 'user-1',
      name: 'Demo User',
      avatar: 'https://picsum.photos/seed/user1/100/100',
    },
    contributors: [
      {
        userId: 'user-2',
        name: 'Friend User',
        avatar: 'https://picsum.photos/seed/user2/100/100',
        role: 'collaborator',
      },
    ],
    tracks: [
      {
        id: 'track-3',
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        album: 'Led Zeppelin IV',
        duration: 482,
        thumbnail: 'https://picsum.photos/seed/ledzep1/120/120',
        videoId: 'QkF3oxziUI4',
        addedBy: 'user-1',
        addedAt: new Date('2024-02-01'),
      },
      {
        id: 'track-4',
        title: 'Sweet Child O Mine',
        artist: "Guns N' Roses",
        album: 'Appetite for Destruction',
        duration: 303,
        thumbnail: 'https://picsum.photos/seed/gnr1/120/120',
        videoId: '1w7OgIMMRc4',
        addedBy: 'user-2',
        addedAt: new Date('2024-02-05'),
      },
    ],
    isPublic: true,
    shareLink: 'https://ytfree.app/share/playlist-2',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const playlistService = {
  // Get all playlists for a user
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    await delay(300);
    
    return mockPlaylists.filter(
      (playlist) =>
        playlist.owner.id === userId ||
        playlist.contributors.some((c) => c.userId === userId)
    );
  },

  // Get playlist by ID
  async getPlaylist(playlistId: string): Promise<Playlist | null> {
    await delay(200);
    return mockPlaylists.find((p) => p.id === playlistId) || null;
  },

  // Get playlist by share link
  async getPlaylistByShareLink(shareLink: string): Promise<Playlist | null> {
    await delay(200);
    return mockPlaylists.find((p) => p.shareLink === shareLink) || null;
  },

  // Create new playlist
  async createPlaylist(
    name: string,
    description: string,
    owner: { id: string; name: string; avatar: string }
  ): Promise<Playlist> {
    await delay(300);

    const newPlaylist: Playlist = {
      id: generateId(),
      name,
      description,
      thumbnail: `https://picsum.photos/seed/${Date.now()}/300/300`,
      owner,
      contributors: [],
      tracks: [],
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlaylists.push(newPlaylist);
    return newPlaylist;
  },

  // Update playlist
  async updatePlaylist(
    playlistId: string,
    updates: Partial<Pick<Playlist, 'name' | 'description' | 'isPublic'>>
  ): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    mockPlaylists[index] = {
      ...mockPlaylists[index],
      ...updates,
      updatedAt: new Date(),
    };

    return mockPlaylists[index];
  },

  // Delete playlist
  async deletePlaylist(playlistId: string): Promise<boolean> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return false;

    mockPlaylists.splice(index, 1);
    return true;
  },

  // Add track to playlist
  async addTrack(playlistId: string, track: Omit<Track, 'addedAt'>): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const newTrack: Track = {
      ...track,
      addedAt: new Date(),
    };

    mockPlaylists[index].tracks.push(newTrack);
    mockPlaylists[index].updatedAt = new Date();

    // Update thumbnail if it's the first track
    if (mockPlaylists[index].tracks.length === 1) {
      mockPlaylists[index].thumbnail = track.thumbnail;
    }

    return mockPlaylists[index];
  },

  // Remove track from playlist
  async removeTrack(playlistId: string, trackId: string): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    mockPlaylists[index].tracks = mockPlaylists[index].tracks.filter(
      (t) => t.id !== trackId
    );
    mockPlaylists[index].updatedAt = new Date();

    return mockPlaylists[index];
  },

  // Reorder tracks in playlist
  async reorderTracks(
    playlistId: string,
    trackIds: string[]
  ): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const trackMap = new Map(
      mockPlaylists[index].tracks.map((t) => [t.id, t])
    );

    mockPlaylists[index].tracks = trackIds
      .map((id) => trackMap.get(id))
      .filter((t): t is Track => t !== undefined);
    mockPlaylists[index].updatedAt = new Date();

    return mockPlaylists[index];
  },

  // Generate share link
  async generateShareLink(playlistId: string): Promise<string | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const shareLink = `https://ytfree.app/share/${playlistId}`;
    mockPlaylists[index].shareLink = shareLink;
    mockPlaylists[index].isPublic = true;

    return shareLink;
  },

  // Add collaborator to playlist
  async addCollaborator(
    playlistId: string,
    collaborator: Omit<PlaylistContributor, 'role'>,
    role: PlaylistRole = 'collaborator'
  ): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    // Check if already a contributor
    const existingIndex = mockPlaylists[index].contributors.findIndex(
      (c) => c.userId === collaborator.userId
    );

    if (existingIndex !== -1) {
      // Update role
      mockPlaylists[index].contributors[existingIndex].role = role;
    } else {
      // Add new contributor
      mockPlaylists[index].contributors.push({
        ...collaborator,
        role,
      });
    }

    mockPlaylists[index].updatedAt = new Date();
    return mockPlaylists[index];
  },

  // Remove collaborator from playlist
  async removeCollaborator(
    playlistId: string,
    userId: string
  ): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    mockPlaylists[index].contributors = mockPlaylists[index].contributors.filter(
      (c) => c.userId !== userId
    );
    mockPlaylists[index].updatedAt = new Date();

    return mockPlaylists[index];
  },

  // Update collaborator role
  async updateCollaboratorRole(
    playlistId: string,
    userId: string,
    role: PlaylistRole
  ): Promise<Playlist | null> {
    await delay(200);

    const index = mockPlaylists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const contributorIndex = mockPlaylists[index].contributors.findIndex(
      (c) => c.userId === userId
    );

    if (contributorIndex === -1) return null;

    mockPlaylists[index].contributors[contributorIndex].role = role;
    mockPlaylists[index].updatedAt = new Date();

    return mockPlaylists[index];
  },

  // Check user's role in playlist
  getUserRole(playlist: Playlist, userId: string): PlaylistRole | null {
    if (playlist.owner.id === userId) return 'owner';
    
    const contributor = playlist.contributors.find((c) => c.userId === userId);
    return contributor?.role || null;
  },

  // Check if user can edit playlist
  canEditPlaylist(playlist: Playlist, userId: string): boolean {
    const role = this.getUserRole(playlist, userId);
    return role === 'owner' || role === 'collaborator';
  },
};
