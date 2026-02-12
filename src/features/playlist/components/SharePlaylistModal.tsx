import { useState } from 'react';
import { Copy, Check, Link2, Users, Globe, Lock } from 'lucide-react';
import { Modal, Button, Avatar } from '@/components/ui';
import { useGenerateShareLink } from '../hooks/usePlaylist';
import { copyToClipboard, cn } from '@/utils';
import type { Playlist, PlaylistRole } from '@/types';

interface SharePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
}

export function SharePlaylistModal({ isOpen, onClose, playlist }: SharePlaylistModalProps) {
  const [copied, setCopied] = useState(false);
  const generateShareLink = useGenerateShareLink();

  const handleGenerateLink = async () => {
    if (!playlist) return;
    await generateShareLink.mutateAsync(playlist.id);
  };

  const handleCopyLink = async () => {
    if (!playlist?.shareLink) return;
    
    const success = await copyToClipboard(playlist.shareLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoleBadge = (role: PlaylistRole) => {
    const badges = {
      owner: { label: 'Owner', className: 'bg-red-600' },
      collaborator: { label: 'Can edit', className: 'bg-blue-600' },
      viewer: { label: 'View only', className: 'bg-zinc-600' },
    };
    return badges[role];
  };

  if (!playlist) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Playlist" size="md">
      <div className="space-y-6">
        {/* Playlist info */}
        <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
          <div className="w-16 h-16 rounded overflow-hidden bg-zinc-700">
            {playlist.thumbnail ? (
              <img
                src={playlist.thumbnail}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🎵
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{playlist.name}</h3>
            <p className="text-sm text-zinc-400">
              {playlist.tracks.length} songs
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-400">
            {playlist.isPublic ? (
              <>
                <Globe size={14} />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Private</span>
              </>
            )}
          </div>
        </div>

        {/* Share link */}
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
            <Link2 size={16} />
            Share Link
          </h4>
          
          {playlist.shareLink ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={playlist.shareLink}
                readOnly
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-300 truncate"
              />
              <Button
                variant="secondary"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-400 mb-3">
                Generate a link to share this playlist with others
              </p>
              <Button
                onClick={handleGenerateLink}
                isLoading={generateShareLink.isPending}
              >
                <Link2 size={16} className="mr-2" />
                Generate Share Link
              </Button>
            </div>
          )}
        </div>

        {/* Collaborators */}
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
            <Users size={16} />
            People with access
          </h4>
          
          <div className="space-y-2">
            {/* Owner */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors">
              <Avatar
                src={playlist.owner.avatar}
                alt={playlist.owner.name}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {playlist.owner.name}
                </p>
              </div>
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                getRoleBadge('owner').className
              )}>
                {getRoleBadge('owner').label}
              </span>
            </div>

            {/* Contributors */}
            {playlist.contributors.map((contributor) => (
              <div
                key={contributor.userId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <Avatar
                  src={contributor.avatar}
                  alt={contributor.name}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {contributor.name}
                  </p>
                </div>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  getRoleBadge(contributor.role).className
                )}>
                  {getRoleBadge(contributor.role).label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info about sharing */}
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-400">
            Anyone with the link can view this playlist. Collaborators can add and remove songs.
          </p>
        </div>
      </div>
    </Modal>
  );
}
