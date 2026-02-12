import { SearchBar } from '@/features/search';
import { UserMenu } from '@/features/auth';

export function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 z-20 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        <UserMenu />
      </div>
    </header>
  );
}
