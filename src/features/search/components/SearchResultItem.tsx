import { Play, Plus, MoreVertical } from 'lucide-react';
import type { SearchResult } from '@/types';
import { formatDuration, formatViewCount, formatRelativeTime, cn } from '@/utils';
import { usePlayerStore } from '@/stores';
import { searchResultToTrack } from '@/services';
import { Dropdown, DropdownItem } from '@/components/ui';

interface SearchResultItemProps {
  result: SearchResult;
  onAddToPlaylist?: (result: SearchResult) => void;
}

export function SearchResultItem({ result, onAddToPlaylist }: SearchResultItemProps) {
  const { playTrack, addToQueue } = usePlayerStore();

  const handlePlay = () => {
    playTrack(searchResultToTrack(result));
  };

  const handleAddToQueue = () => {
    addToQueue(searchResultToTrack(result));
  };

  return (
    <div className="group flex gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-zinc-800">
        <img
          src={result.thumbnail}
          alt={result.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {result.duration && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-xs font-medium bg-black/80 rounded">
            {formatDuration(result.duration)}
          </span>
        )}
        {/* Play overlay */}
        <button
          onClick={handlePlay}
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity'
          )}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full hover:scale-105 transition-transform">
            <Play size={24} fill="white" className="ml-1" />
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-medium text-white truncate group-hover:text-red-400 transition-colors">
          {result.title}
        </h3>
        {result.channelName && (
          <p className="text-sm text-zinc-400 truncate mt-1">
            {result.channelName}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
          {result.viewCount && (
            <span>{formatViewCount(result.viewCount)} views</span>
          )}
          {result.publishedAt && (
            <>
              <span>•</span>
              <span>{formatRelativeTime(result.publishedAt)}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleAddToQueue}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors"
          title="Add to queue"
        >
          <Plus size={20} />
        </button>
        
        <Dropdown
          trigger={
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={handlePlay}>
            Play now
          </DropdownItem>
          <DropdownItem onClick={handleAddToQueue}>
            Add to queue
          </DropdownItem>
          <DropdownItem onClick={() => onAddToPlaylist?.(result)}>
            Add to playlist
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}
