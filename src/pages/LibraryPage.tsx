import { useState } from 'react';
import { Plus, Users, User } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Button, PlaylistCardSkeleton } from '@/components/ui';
import { PlaylistCard, CreatePlaylistModal, SharePlaylistModal, useUserPlaylists, useDeletePlaylist } from '@/features/playlist';
import { useDisclosure } from '@/hooks';
import { GoogleLoginButton } from '@/features/auth';
import type { Playlist } from '@/types';

export function LibraryPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { data: playlists = [], isLoading } = useUserPlaylists();
  const deletePlaylist = useDeletePlaylist();
  
  const createModal = useDisclosure();
  const shareModal = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Separate owned and shared playlists
  const ownedPlaylists = playlists.filter((p) => p.owner.id === user?.id);
  const sharedPlaylists = playlists.filter((p) => p.owner.id !== user?.id);

  const handleDelete = async (playlistId: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist.mutateAsync(playlistId);
    }
  };

  const handleShare = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist) {
      setSelectedPlaylist(playlist);
      shareModal.onOpen();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Library</h1>
          <p className="text-zinc-400 mb-6">
            Sign in to view your playlists and saved music
          </p>
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <Button onClick={createModal.onOpen}>
          <Plus size={18} className="mr-2" />
          Create Playlist
        </Button>
      </div>

      {/* Owned playlists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Your Playlists</h2>
          <span className="text-sm text-zinc-500">({ownedPlaylists.length})</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <PlaylistCardSkeleton key={i} />
            ))}
          </div>
        ) : ownedPlaylists.length === 0 ? (
          <div className="text-center py-12 bg-zinc-800/30 rounded-xl">
            <p className="text-zinc-400 mb-4">You haven't created any playlists yet</p>
            <Button variant="secondary" onClick={createModal.onOpen}>
              <Plus size={18} className="mr-2" />
              Create your first playlist
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {ownedPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </section>

      {/* Shared playlists */}
      {sharedPlaylists.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Shared with You</h2>
            <span className="text-sm text-zinc-500">({sharedPlaylists.length})</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sharedPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <CreatePlaylistModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
      <SharePlaylistModal
        isOpen={shareModal.isOpen}
        onClose={shareModal.onClose}
        playlist={selectedPlaylist}
      />
    </div>
  );
}
