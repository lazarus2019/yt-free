import { Link } from 'react-router-dom';
import { Play, MoreVertical, Users, Lock, Globe } from 'lucide-react';
import type { Playlist } from '@/types';
import { usePlayerStore, useAuthStore } from '@/stores';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui';
import { cn } from '@/utils';

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete?: (playlistId: string) => void;
  onShare?: (playlistId: string) => void;
}

export function PlaylistCard({ playlist, onDelete, onShare }: PlaylistCardProps) {
  const { playPlaylist } = usePlayerStore();
  const { user } = useAuthStore();
  
  const isOwner = user?.id === playlist.owner.id;
  const isCollaborative = playlist.contributors.length > 0;
  const trackCount = playlist.tracks.length;

  const handlePlay = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (playlist.tracks.length > 0) {
      playPlaylist(playlist.tracks);
    }
  };

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group block p-4 rounded-xl hover:bg-zinc-800/50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 mb-3">
        {playlist.thumbnail ? (
          <img
            src={playlist.thumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800">
            <span className="text-4xl text-zinc-500">🎵</span>
          </div>
        )}
        
        {/* Play button overlay */}
        <button
          onClick={handlePlay}
          className={cn(
            'absolute bottom-2 right-2',
            'w-12 h-12 flex items-center justify-center',
            'bg-red-600 rounded-full shadow-lg',
            'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
            'hover:scale-105 hover:bg-red-500',
            'transition-all duration-200'
          )}
        >
          <Play size={24} fill="white" className="ml-1" />
        </button>

        {/* Status badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isCollaborative && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-600/90 rounded-full flex items-center gap-1">
              <Users size={12} />
              Shared
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-white truncate group-hover:text-red-400 transition-colors">
            {playlist.name}
          </h3>
          <p className="text-sm text-zinc-400 truncate mt-0.5">
            {trackCount} {trackCount === 1 ? 'song' : 'songs'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500">
              {isOwner ? 'By you' : `By ${playlist.owner.name}`}
            </span>
            {playlist.isPublic ? (
              <Globe size={12} className="text-zinc-500" />
            ) : (
              <Lock size={12} className="text-zinc-500" />
            )}
          </div>
        </div>

        {/* Menu */}
        <Dropdown
          trigger={
            <button
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={18} />
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={handlePlay}>Play</DropdownItem>
          {isOwner && (
            <>
              <DropdownItem onClick={() => onShare?.(playlist.id)}>
                Share playlist
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={() => onDelete?.(playlist.id)} danger>
                Delete playlist
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </Link>
  );
}
