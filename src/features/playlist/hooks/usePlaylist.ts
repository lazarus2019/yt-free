import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '@/services';
import { useAuthStore } from '@/stores';
import type { Track, PlaylistRole } from '@/types';

// Query keys
export const playlistKeys = {
  all: ['playlists'] as const,
  user: (userId: string) => [...playlistKeys.all, 'user', userId] as const,
  detail: (id: string) => [...playlistKeys.all, 'detail', id] as const,
  shared: (shareLink: string) => [...playlistKeys.all, 'shared', shareLink] as const,
};

// Hook to get user's playlists
export function useUserPlaylists() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: playlistKeys.user(user?.id || ''),
    queryFn: () => playlistService.getUserPlaylists(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single playlist
export function usePlaylist(playlistId: string) {
  return useQuery({
    queryKey: playlistKeys.detail(playlistId),
    queryFn: () => playlistService.getPlaylist(playlistId),
    enabled: !!playlistId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to get playlist by share link
export function useSharedPlaylist(shareLink: string) {
  return useQuery({
    queryKey: playlistKeys.shared(shareLink),
    queryFn: () => playlistService.getPlaylistByShareLink(shareLink),
    enabled: !!shareLink,
  });
}

// Hook to create a playlist
export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) => {
      if (!user) throw new Error('User not authenticated');
      return playlistService.createPlaylist(name, description, {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.all });
    },
  });
}

// Hook to update a playlist
export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      updates,
    }: {
      playlistId: string;
      updates: { name?: string; description?: string; isPublic?: boolean };
    }) => playlistService.updatePlaylist(playlistId, updates),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
      queryClient.invalidateQueries({ queryKey: playlistKeys.all });
    },
  });
}

// Hook to delete a playlist
export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playlistId: string) => playlistService.deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.all });
    },
  });
}

// Hook to add a track to a playlist
export function useAddTrack() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ playlistId, track }: { playlistId: string; track: Omit<Track, 'addedAt'> }) => {
      const trackWithUser = {
        ...track,
        addedBy: user?.id,
      };
      return playlistService.addTrack(playlistId, trackWithUser);
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}

// Hook to remove a track from a playlist
export function useRemoveTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
      playlistService.removeTrack(playlistId, trackId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}

// Hook to generate share link
export function useGenerateShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playlistId: string) => playlistService.generateShareLink(playlistId),
    onSuccess: (_, playlistId) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}

// Hook to manage collaborators
export function useAddCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      collaborator,
      role,
    }: {
      playlistId: string;
      collaborator: { userId: string; name: string; avatar: string };
      role?: PlaylistRole;
    }) => playlistService.addCollaborator(playlistId, collaborator, role),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}

export function useRemoveCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, userId }: { playlistId: string; userId: string }) =>
      playlistService.removeCollaborator(playlistId, userId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}
