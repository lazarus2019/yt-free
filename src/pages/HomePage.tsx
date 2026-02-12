import { Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, usePlayerStore } from '@/stores';
import { Button, Skeleton } from '@/components/ui';
import { GoogleLoginButton } from '@/features/auth';
import { searchService, searchResultToTrack } from '@/services';
import type { Track } from '@/types';

export function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { playTrack, playPlaylist } = usePlayerStore();

  // Fetch trending music from YouTube API
  const { data: trendingResults, isLoading } = useQuery({
    queryKey: ['trending-music'],
    queryFn: () => searchService.getTrending(12),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Convert search results to tracks for the player
  const featuredTracks: Track[] = (trendingResults || []).map(searchResultToTrack);

  const handlePlayAll = () => {
    if (featuredTracks.length > 0) {
      playPlaylist(featuredTracks);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-2">
          {isAuthenticated && user
            ? `Good ${getGreeting()}, ${user.name.split(' ')[0]}`
            : 'Welcome to YMusic'}
        </h1>
        <p className="text-zinc-400">
          {isAuthenticated
            ? 'Enjoy ad-free music streaming'
            : 'Sign in to create playlists and save your favorites'}
        </p>
      </section>

      {/* Login prompt for non-authenticated users */}
      {!isAuthenticated && (
        <section className="p-6 bg-gradient-to-r from-red-600/20 to-red-900/20 rounded-xl border border-red-600/30">
          <h2 className="text-xl font-semibold text-white mb-2">
            Get the full experience
          </h2>
          <p className="text-zinc-400 mb-4">
            Sign in with Google to create playlists, save your favorites, and collaborate with friends.
          </p>
          <GoogleLoginButton />
        </section>
      )}

      {/* Trending music */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Trending Music</h2>
          {featuredTracks.length > 0 && (
            <Button variant="ghost" onClick={handlePlayAll}>
              <Play size={18} className="mr-2" />
              Play All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="aspect-square w-full mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="group text-left p-4 rounded-xl hover:bg-zinc-800/50 transition-colors"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 mb-3">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play size={24} fill="white" className="ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-white truncate group-hover:text-red-400 transition-colors">
                  {track.title}
                </h3>
                <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Quick picks - show first 6 trending */}
      {featuredTracks.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredTracks.slice(0, 6).map((track) => (
              <button
                key={`quick-${track.id}`}
                onClick={() => playTrack(track)}
                className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.title}</p>
                  <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
