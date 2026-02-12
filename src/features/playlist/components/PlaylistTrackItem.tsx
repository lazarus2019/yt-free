import { Play, Pause, Trash2, GripVertical } from 'lucide-react';
import type { Track } from '@/types';
import { formatDuration, cn } from '@/utils';
import { usePlayerStore } from '@/stores';

interface PlaylistTrackItemProps {
  track: Track;
  index: number;
  canEdit: boolean;
  onRemove?: (trackId: string) => void;
}

export function PlaylistTrackItem({
  track,
  index,
  canEdit,
  onRemove,
}: PlaylistTrackItemProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlayingThis = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
        isCurrentTrack ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
      )}
    >
      {/* Drag handle (for future drag-and-drop) */}
      {canEdit && (
        <div className="opacity-0 group-hover:opacity-100 cursor-grab text-zinc-500 hover:text-zinc-300 transition-opacity">
          <GripVertical size={16} />
        </div>
      )}

      {/* Track number / Play button */}
      <div className="w-8 flex items-center justify-center">
        <button
          onClick={handlePlay}
          className="relative w-8 h-8 flex items-center justify-center"
        >
          {/* Track number (shown by default) */}
          <span
            className={cn(
              'text-sm tabular-nums',
              isCurrentTrack ? 'text-red-500' : 'text-zinc-500 group-hover:opacity-0',
              'transition-opacity'
            )}
          >
            {isPlayingThis ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-red-500 animate-pulse" style={{ height: '60%' }} />
                <span className="w-1 bg-red-500 animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                <span className="w-1 bg-red-500 animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
              </div>
            ) : (
              index + 1
            )}
          </span>
          
          {/* Play/Pause button (shown on hover) */}
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              isCurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              'transition-opacity'
            )}
          >
            {isPlayingThis ? (
              <Pause size={18} className="text-white" fill="white" />
            ) : (
              <Play size={18} className="text-white ml-0.5" fill="white" />
            )}
          </span>
        </button>
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-medium truncate transition-colors',
            isCurrentTrack ? 'text-red-500' : 'text-white'
          )}
        >
          {track.title}
        </p>
        <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-sm text-zinc-500 tabular-nums">
        {formatDuration(track.duration)}
      </span>

      {/* Remove button */}
      {canEdit && (
        <button
          onClick={() => onRemove?.(track.id)}
          className="p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Remove from playlist"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
