import { useAuthStore } from '@/stores';
import { Avatar, Dropdown, DropdownItem, DropdownDivider } from '@/components/ui';
import { GoogleLoginButton } from './GoogleLoginButton';
import { LogOut, User, Settings } from 'lucide-react';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center">
        <GoogleLoginButton />
      </div>
    );
  }

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-800 transition-colors">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="md"
            fallback={user.name}
          />
        </button>
      }
      align="right"
    >
      <div className="px-4 py-3 border-b border-zinc-700">
        <p className="font-medium text-white">{user.name}</p>
        <p className="text-sm text-zinc-400">{user.email}</p>
      </div>
      
      <DropdownItem icon={<User size={18} />}>
        Your Profile
      </DropdownItem>
      
      <DropdownItem icon={<Settings size={18} />}>
        Settings
      </DropdownItem>
      
      <DropdownDivider />
      
      <DropdownItem
        icon={<LogOut size={18} />}
        onClick={logout}
        danger
      >
        Sign Out
      </DropdownItem>
    </Dropdown>
  );
}
