import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Plus, Music } from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore } from '@/stores';
import { useUserPlaylists } from '@/features/playlist';
import { useDisclosure } from '@/hooks';
import { CreatePlaylistModal } from '@/features/playlist';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/library', icon: Library, label: 'Library' },
];

export function Sidebar() {
  const { isAuthenticated } = useAuthStore();
  const { data: playlists = [] } = useUserPlaylists();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <aside className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 shrink-0">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Music size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">YMusic</span>
        </div>

        {/* Main navigation */}
        <nav className="px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm md:text-base',
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                )
              }
            >
              <item.icon size={22} />
              <span className="font-medium hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Playlists section */}
        {isAuthenticated && (
          <div className="flex-1 mt-6 px-3 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 mb-2 shrink-0">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:inline">
                Playlists
              </h2>
              <button
                onClick={onOpen}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
                title="Create playlist"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {playlists.length === 0 ? (
                <p className="px-4 py-2 text-xs text-zinc-500 hidden sm:block">No playlists yet</p>
              ) : (
                playlists.map((playlist) => (
                  <NavLink
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      )
                    }
                  >
                    <div className="w-10 h-10 rounded bg-zinc-800 flex-shrink-0 overflow-hidden">
                      {playlist.thumbnail ? (
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          🎵
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 hidden sm:block">
                      <p className="text-sm font-medium truncate">{playlist.name}</p>
                      <p className="text-xs text-zinc-500">
                        {playlist.tracks.length} songs
                      </p>
                    </div>
                  </NavLink>
                ))
              )}
            </div>
          </div>
        )}
      </aside>

      <CreatePlaylistModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
