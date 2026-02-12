import type { Playlist, Track, PlaylistRole, PlaylistContributor } from '@/types';

// ─── LocalStorage-backed playlist persistence ────────────────────────────

const STORAGE_KEY = 'yt-free-playlists';

function loadPlaylists(): Playlist[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Playlist[];
    // Rehydrate Date objects
    return parsed.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      tracks: p.tracks.map((t) => ({
        ...t,
        addedAt: t.addedAt ? new Date(t.addedAt) : undefined,
      })),
    }));
  } catch {
    return [];
  }
}

function savePlaylists(playlists: Playlist[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

// Generate unique ID
const generateId = () => `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const playlistService = {
  // Get all playlists for a user
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    const playlists = loadPlaylists();
    return playlists.filter(
      (playlist) =>
        playlist.owner.id === userId ||
        playlist.contributors.some((c) => c.userId === userId)
    );
  },

  // Get playlist by ID
  async getPlaylist(playlistId: string): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    return playlists.find((p) => p.id === playlistId) || null;
  },

  // Get playlist by share link
  async getPlaylistByShareLink(shareLink: string): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    return playlists.find((p) => p.shareLink === shareLink) || null;
  },

  // Create new playlist
  async createPlaylist(
    name: string,
    description: string,
    owner: { id: string; name: string; avatar: string }
  ): Promise<Playlist> {
    const playlists = loadPlaylists();

    const newPlaylist: Playlist = {
      id: generateId(),
      name,
      description,
      thumbnail: undefined,
      owner,
      contributors: [],
      tracks: [],
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    playlists.push(newPlaylist);
    savePlaylists(playlists);
    return newPlaylist;
  },

  // Update playlist
  async updatePlaylist(
    playlistId: string,
    updates: Partial<Pick<Playlist, 'name' | 'description' | 'isPublic'>>
  ): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    playlists[index] = {
      ...playlists[index],
      ...updates,
      updatedAt: new Date(),
    };

    savePlaylists(playlists);
    return playlists[index];
  },

  // Delete playlist
  async deletePlaylist(playlistId: string): Promise<boolean> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return false;

    playlists.splice(index, 1);
    savePlaylists(playlists);
    return true;
  },

  // Add track to playlist
  async addTrack(playlistId: string, track: Omit<Track, 'addedAt'>): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    // Prevent duplicate tracks
    const exists = playlists[index].tracks.some((t) => t.videoId === track.videoId);
    if (exists) return playlists[index];

    const newTrack: Track = {
      ...track,
      addedAt: new Date(),
    };

    playlists[index].tracks.push(newTrack);
    playlists[index].updatedAt = new Date();

    // Update thumbnail to first track if none set
    if (!playlists[index].thumbnail && track.thumbnail) {
      playlists[index].thumbnail = track.thumbnail;
    }

    savePlaylists(playlists);
    return playlists[index];
  },

  // Remove track from playlist
  async removeTrack(playlistId: string, trackId: string): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    playlists[index].tracks = playlists[index].tracks.filter(
      (t) => t.id !== trackId
    );
    playlists[index].updatedAt = new Date();

    savePlaylists(playlists);
    return playlists[index];
  },

  // Reorder tracks in playlist
  async reorderTracks(
    playlistId: string,
    trackIds: string[]
  ): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const trackMap = new Map(
      playlists[index].tracks.map((t) => [t.id, t])
    );

    playlists[index].tracks = trackIds
      .map((id) => trackMap.get(id))
      .filter((t): t is Track => t !== undefined);
    playlists[index].updatedAt = new Date();

    savePlaylists(playlists);
    return playlists[index];
  },

  // Generate share link
  async generateShareLink(playlistId: string): Promise<string | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const shareLink = `${window.location.origin}/playlist/${playlistId}`;
    playlists[index].shareLink = shareLink;
    playlists[index].isPublic = true;

    savePlaylists(playlists);
    return shareLink;
  },

  // Add collaborator to playlist
  async addCollaborator(
    playlistId: string,
    collaborator: Omit<PlaylistContributor, 'role'>,
    role: PlaylistRole = 'collaborator'
  ): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const existingIndex = playlists[index].contributors.findIndex(
      (c) => c.userId === collaborator.userId
    );

    if (existingIndex !== -1) {
      playlists[index].contributors[existingIndex].role = role;
    } else {
      playlists[index].contributors.push({
        ...collaborator,
        role,
      });
    }

    playlists[index].updatedAt = new Date();
    savePlaylists(playlists);
    return playlists[index];
  },

  // Remove collaborator from playlist
  async removeCollaborator(
    playlistId: string,
    userId: string
  ): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    playlists[index].contributors = playlists[index].contributors.filter(
      (c) => c.userId !== userId
    );
    playlists[index].updatedAt = new Date();

    savePlaylists(playlists);
    return playlists[index];
  },

  // Update collaborator role
  async updateCollaboratorRole(
    playlistId: string,
    userId: string,
    role: PlaylistRole
  ): Promise<Playlist | null> {
    const playlists = loadPlaylists();
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index === -1) return null;

    const contributorIndex = playlists[index].contributors.findIndex(
      (c) => c.userId === userId
    );

    if (contributorIndex === -1) return null;

    playlists[index].contributors[contributorIndex].role = role;
    playlists[index].updatedAt = new Date();

    savePlaylists(playlists);
    return playlists[index];
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
