import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '@/stores';
import { cn } from '@/utils';

interface MiniPlayerProps {
  className?: string;
}

export function MiniPlayer({ className }: MiniPlayerProps) {
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 bg-zinc-800/80 backdrop-blur rounded-lg',
        className
      )}
    >
      <div className="w-10 h-10 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
        <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
      </div>
      <button
        onClick={togglePlay}
        className="p-2 text-white hover:bg-zinc-700 rounded-full transition-colors"
      >
        {isPlaying ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" className="ml-0.5" />
        )}
      </button>
    </div>
  );
}
