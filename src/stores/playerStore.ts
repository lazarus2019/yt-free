import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track, RepeatMode } from '@/types';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  originalQueue: Track[]; // For shuffle restore
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
}

interface PlayerActions {
  // Track controls
  setCurrentTrack: (track: Track | null) => void;
  playTrack: (track: Track) => void;
  
  // Queue management
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  
  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  
  // Time and volume
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Mode controls
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  
  // Play from playlist
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
}

type PlayerStore = PlayerState & PlayerActions;

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTrack: null,
      queue: [],
      originalQueue: [],
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      repeatMode: 'none',
      isShuffled: false,

      // Actions
      setCurrentTrack: (track) => set({ currentTrack: track }),

      playTrack: (track) =>
        set({
          currentTrack: track,
          isPlaying: true,
          currentTime: 0,
        }),

      setQueue: (tracks) =>
        set({
          queue: tracks,
          originalQueue: tracks,
        }),

      addToQueue: (track) =>
        set((state) => ({
          queue: [...state.queue, track],
          originalQueue: [...state.originalQueue, track],
        })),

      removeFromQueue: (trackId) =>
        set((state) => ({
          queue: state.queue.filter((t) => t.id !== trackId),
          originalQueue: state.originalQueue.filter((t) => t.id !== trackId),
        })),

      clearQueue: () =>
        set({
          queue: [],
          originalQueue: [],
          currentTrack: null,
          isPlaying: false,
        }),

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      next: () => {
        const { queue, currentTrack, repeatMode } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') {
            nextIndex = 0;
          } else {
            set({ isPlaying: false });
            return;
          }
        }

        set({
          currentTrack: queue[nextIndex],
          currentTime: 0,
          isPlaying: true,
        });
      },

      previous: () => {
        const { queue, currentTrack, currentTime } = get();
        if (!currentTrack || queue.length === 0) return;

        // If more than 3 seconds played, restart current track
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;

        set({
          currentTrack: queue[prevIndex],
          currentTime: 0,
          isPlaying: true,
        });
      },

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),

      setVolume: (volume) =>
        set({
          volume: Math.max(0, Math.min(1, volume)),
          isMuted: volume === 0,
        }),

      toggleMute: () =>
        set((state) => ({
          isMuted: !state.isMuted,
        })),

      setRepeatMode: (mode) => set({ repeatMode: mode }),

      toggleShuffle: () => {
        const { isShuffled, queue, originalQueue, currentTrack } = get();
        
        if (isShuffled) {
          // Restore original order
          set({
            isShuffled: false,
            queue: originalQueue,
          });
        } else {
          // Shuffle queue but keep current track at the beginning
          const otherTracks = queue.filter((t) => t.id !== currentTrack?.id);
          const shuffledOthers = shuffleArray(otherTracks);
          const newQueue = currentTrack
            ? [currentTrack, ...shuffledOthers]
            : shuffledOthers;
          
          set({
            isShuffled: true,
            queue: newQueue,
          });
        }
      },

      playPlaylist: (tracks, startIndex = 0) => {
        const { isShuffled } = get();
        
        if (isShuffled) {
          const startTrack = tracks[startIndex];
          const otherTracks = tracks.filter((_, i) => i !== startIndex);
          const shuffledOthers = shuffleArray(otherTracks);
          const queue = [startTrack, ...shuffledOthers];
          
          set({
            queue,
            originalQueue: tracks,
            currentTrack: startTrack,
            currentTime: 0,
            isPlaying: true,
          });
        } else {
          set({
            queue: tracks,
            originalQueue: tracks,
            currentTrack: tracks[startIndex],
            currentTime: 0,
            isPlaying: true,
          });
        }
      },
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      }),
    }
  )
);
