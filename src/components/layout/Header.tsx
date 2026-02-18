import { SearchBar } from '@/features/search';
import { UserMenu } from '@/features/auth';

interface HeaderProps {
  sidebarOpen?: boolean;
}

export function Header({ sidebarOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-16 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 z-20 flex items-center justify-between px-4 md:px-6 md:left-64">
      {/* Search - hidden on mobile when sidebar is open */}
      <div className={`flex-1 max-w-2xl ${sidebarOpen ? 'hidden' : ''}`}>
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        <UserMenu />
      </div>
    </header>
  );
}
