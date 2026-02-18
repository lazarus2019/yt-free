import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Player, YouTubePlayer } from '@/features/player';
import { usePlayerStore } from '@/stores';
import { Menu, X } from 'lucide-react';

export function MainLayout() {
  const { currentTrack } = usePlayerStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Mobile hamburger menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-800 text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - responsive */}
      <div
        className={`fixed left-0 top-0 bottom-20 z-40 transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header - responsive */}
      <Header sidebarOpen={sidebarOpen} />
      
      {/* Main content - responsive */}
      <main
        className="md:ml-64 pt-20 md:pt-16 min-h-screen transition-all"
        style={{ paddingBottom: currentTrack ? '6rem' : '0' }}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* YouTube IFrame Player (hidden, handles actual playback) */}
      <YouTubePlayer />

      {/* Player controls UI */}
      <Player />
    </div>
  );
}
