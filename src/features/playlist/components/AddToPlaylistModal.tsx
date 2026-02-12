import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useUserPlaylists, useAddTrack } from '../hooks/usePlaylist';
import type { Track } from '@/types';
import { cn } from '@/utils';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Omit<Track, 'addedAt' | 'addedBy'> | null;
}

export function AddToPlaylistModal({ isOpen, onClose, track }: AddToPlaylistModalProps) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const { data: playlists = [], isLoading } = useUserPlaylists();
  const addTrack = useAddTrack();

  const handleAdd = async () => {
    if (!selectedPlaylistId || !track) return;

    try {
      await addTrack.mutateAsync({
        playlistId: selectedPlaylistId,
        track: track as Omit<Track, 'addedAt'>,
      });
      setSelectedPlaylistId(null);
      onClose();
    } catch (error) {
      console.error('Failed to add track:', error);
    }
  };

  const handleClose = () => {
    setSelectedPlaylistId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add to Playlist" size="md">
      {/* Track being added */}
      {track && (
        <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg mb-4">
          <div className="w-12 h-12 rounded overflow-hidden bg-zinc-700">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{track.title}</p>
            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
          </div>
        </div>
      )}

      {/* Playlist list */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8 text-zinc-500">Loading playlists...</div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>No playlists yet</p>
            <p className="text-sm">Create a playlist first</p>
          </div>
        ) : (
          playlists.map((playlist) => {
            const isSelected = selectedPlaylistId === playlist.id;
            const hasTrack = track
              ? playlist.tracks.some((t) => t.id === track.id)
              : false;

            return (
              <button
                key={playlist.id}
                onClick={() => !hasTrack && setSelectedPlaylistId(playlist.id)}
                disabled={hasTrack}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                  isSelected
                    ? 'bg-red-600/20 border border-red-600'
                    : 'hover:bg-zinc-800',
                  hasTrack && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="w-12 h-12 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      🎵
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{playlist.name}</p>
                  <p className="text-sm text-zinc-400">
                    {playlist.tracks.length} songs
                  </p>
                </div>
                {(isSelected || hasTrack) && (
                  <Check
                    size={20}
                    className={hasTrack ? 'text-green-500' : 'text-red-500'}
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-zinc-800">
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          disabled={!selectedPlaylistId}
          isLoading={addTrack.isPending}
        >
          Add to Playlist
        </Button>
      </div>
    </Modal>
  );
}
