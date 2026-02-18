import { useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  ChevronUp,
  Music,
  Video,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { usePlayerStore } from '@/stores';
import { formatDuration, cn } from '@/utils';
import { useState } from 'react';

export function Player() {
  const [showQueue, setShowQueue] = useState(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    repeatMode,
    isShuffled,
    queue,
    playerMode,
    play,
    pause,
    next,
    previous,
    setCurrentTime,
    setVolume,
    toggleMute,
    setRepeatMode,
    toggleShuffle,
    setPlayerMode,
    playTrack,
    removeFromQueueByIndex,
    moveTrackUp,
    moveTrackDown,
  } = usePlayerStore();

  // Seek via the global YouTube player reference
  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      setCurrentTime(time);
      // The YouTubePlayer component sets this global ref
      const ytPlayer = (window as unknown as { __ytPlayer?: { seekTo: (t: number, a: boolean) => void } }).__ytPlayer;
      if (ytPlayer?.seekTo) {
        ytPlayer.seekTo(time, true);
      }
    },
    [setCurrentTime]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(Number(e.target.value));
    },
    [setVolume]
  );

  const cycleRepeatMode = useCallback(() => {
    const modes: Array<'none' | 'all' | 'one'> = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode, setRepeatMode]);

  // Don't render if no track
  if (!currentTrack) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800">
        {/* Progress bar */}
        <div className="relative h-1 bg-zinc-800 group cursor-pointer">
          <div
            className="absolute h-full bg-red-600 transition-all"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* Hover indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{currentTrack.title}</p>
              <p className="text-sm text-zinc-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isShuffled
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-zinc-400 hover:text-white'
                )}
                title={isShuffled ? 'Shuffle on' : 'Shuffle off'}
              >
                <Shuffle size={18} />
              </button>

              {/* Previous */}
              <button
                onClick={previous}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack size={22} fill="currentColor" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={isPlaying ? pause : play}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={next}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward size={22} fill="currentColor" />
              </button>

              {/* Repeat */}
              <button
                onClick={cycleRepeatMode}
                className={cn(
                  'p-2 rounded-full transition-colors relative',
                  repeatMode !== 'none'
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-zinc-400 hover:text-white'
                )}
                title={
                  repeatMode === 'none'
                    ? 'Repeat off'
                    : repeatMode === 'all'
                    ? 'Repeat all'
                    : 'Repeat one'
                }
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 tabular-nums">
              <span>{formatDuration(currentTime)}</span>
              <span>/</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Queue button */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={cn(
                'p-2 rounded-full transition-colors',
                showQueue
                  ? 'text-red-500 hover:text-red-400'
                  : 'text-zinc-400 hover:text-white'
              )}
              title="Queue"
            >
              <ListMusic size={20} />
            </button>

            {/* Player mode toggle */}
            <button
              onClick={() => setPlayerMode(playerMode === 'audio' ? 'video' : 'audio')}
              className={cn(
                'p-2 rounded-full transition-colors',
                playerMode === 'video'
                  ? 'text-red-500 hover:text-red-400'
                  : 'text-zinc-400 hover:text-white'
              )}
              title={playerMode === 'audio' ? 'Switch to video' : 'Switch to audio'}
            >
              {playerMode === 'video' ? <Video size={20} /> : <Music size={20} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Queue panel */}
      {showQueue && (
        <div className="fixed bottom-24 right-4 w-80 max-h-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <h3 className="font-medium text-white">Queue ({queue.length})</h3>
            <button
              onClick={() => setShowQueue(false)}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronUp size={20} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-72">
            {queue.length === 0 ? (
              <p className="text-center py-8 text-zinc-500">Queue is empty</p>
            ) : (
              queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className={cn(
                    'group flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-b-0',
                    currentTrack.id === track.id && 'bg-zinc-800'
                  )}
                >
                  {/* Index */}
                  <span className="w-5 text-xs text-zinc-500 tabular-nums shrink-0">
                    {index + 1}
                  </span>

                  {/* Track info (clickable) */}
                  <button
                    onClick={() => playTrack(track)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden bg-zinc-700 shrink-0">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm truncate',
                          currentTrack.id === track.id ? 'text-red-500 font-medium' : 'text-white'
                        )}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
                    </div>
                  </button>

                  {/* Action buttons - visible on hover */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Move up */}
                    <button
                      onClick={() => moveTrackUp(index)}
                      disabled={index === 0}
                      className={cn(
                        'p-1 rounded transition-colors',
                        index === 0
                          ? 'text-zinc-600 cursor-not-allowed'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                      )}
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>

                    {/* Move down */}
                    <button
                      onClick={() => moveTrackDown(index)}
                      disabled={index === queue.length - 1}
                      className={cn(
                        'p-1 rounded transition-colors',
                        index === queue.length - 1
                          ? 'text-zinc-600 cursor-not-allowed'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                      )}
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromQueueByIndex(index)}
                      className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-700 rounded transition-colors"
                      title="Remove from queue"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
