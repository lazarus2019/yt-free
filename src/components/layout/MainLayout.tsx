import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Player } from '@/features/player';
import { usePlayerStore } from '@/stores';

export function MainLayout() {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="min-h-screen bg-zinc-900">
      <Sidebar />
      <Header />
      
      {/* Main content */}
      <main
        className="ml-64 pt-16 min-h-screen"
        style={{ paddingBottom: currentTrack ? '6rem' : '0' }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Player */}
      <Player />
    </div>
  );
}
