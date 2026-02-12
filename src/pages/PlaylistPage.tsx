import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, MoreVertical, Share2, Trash2, Edit2, Users, ArrowLeft } from 'lucide-react';
import { useAuthStore, usePlayerStore } from '@/stores';
import { Button, Avatar, Skeleton, Dropdown, DropdownItem, DropdownDivider } from '@/components/ui';
import { PlaylistTrackItem, SharePlaylistModal, usePlaylist, useRemoveTrack, useDeletePlaylist } from '@/features/playlist';
import { playlistService } from '@/services';
import { useDisclosure } from '@/hooks';
import { formatDuration } from '@/utils';

export function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { playPlaylist, toggleShuffle } = usePlayerStore();
  
  const { data: playlist, isLoading, error } = usePlaylist(playlistId || '');
  const removeTrack = useRemoveTrack();
  const deletePlaylist = useDeletePlaylist();
  const shareModal = useDisclosure();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-6">
          <Skeleton className="w-56 h-56 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl text-zinc-400 mb-4">Playlist not found</p>
        <Button variant="secondary" onClick={() => navigate('/library')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Library
        </Button>
      </div>
    );
  }

  const canEdit = user ? playlistService.canEditPlaylist(playlist, user.id) : false;
  const isOwner = user?.id === playlist.owner.id;
  const totalDuration = playlist.tracks.reduce((sum, t) => sum + t.duration, 0);

  const handlePlay = () => {
    if (playlist.tracks.length > 0) {
      playPlaylist(playlist.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.tracks.length > 0) {
      toggleShuffle();
      playPlaylist(playlist.tracks);
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    await removeTrack.mutateAsync({ playlistId: playlist.id, trackId });
  };

  const handleDeletePlaylist = async () => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      await deletePlaylist.mutateAsync(playlist.id);
      navigate('/library');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover */}
        <div className="w-56 h-56 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 shadow-2xl">
          {playlist.thumbnail ? (
            <img
              src={playlist.thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-zinc-700 to-zinc-800">
              🎵
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-end">
          <span className="text-sm text-zinc-400 uppercase tracking-wider mb-2">
            {playlist.isPublic ? 'Public Playlist' : 'Playlist'}
          </span>
          <h1 className="text-4xl font-bold text-white mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-zinc-400 mb-3">{playlist.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Avatar src={playlist.owner.avatar} alt={playlist.owner.name} size="sm" />
            <span className="font-medium text-white">{playlist.owner.name}</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
            <span>•</span>
            <span>{formatDuration(totalDuration)}</span>
            {playlist.contributors.length > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {playlist.contributors.length + 1} collaborators
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={handlePlay}
          disabled={playlist.tracks.length === 0}
          className="px-8"
        >
          <Play size={22} fill="white" className="mr-2" />
          Play
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleShufflePlay}
          disabled={playlist.tracks.length === 0}
        >
          <Shuffle size={20} className="mr-2" />
          Shuffle
        </Button>

        {isOwner && (
          <Dropdown
            trigger={
              <Button variant="ghost" size="lg">
                <MoreVertical size={20} />
              </Button>
            }
            align="left"
          >
            <DropdownItem icon={<Share2 size={18} />} onClick={shareModal.onOpen}>
              Share playlist
            </DropdownItem>
            <DropdownItem icon={<Edit2 size={18} />}>
              Edit details
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
              icon={<Trash2 size={18} />}
              onClick={handleDeletePlaylist}
              danger
            >
              Delete playlist
            </DropdownItem>
          </Dropdown>
        )}
      </div>

      {/* Tracks */}
      <div className="mt-6">
        {playlist.tracks.length === 0 ? (
          <div className="text-center py-16 bg-zinc-800/30 rounded-xl">
            <p className="text-zinc-400 mb-2">This playlist is empty</p>
            <p className="text-sm text-zinc-500">
              Search for songs and add them to this playlist
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800 mb-2">
              <span className="w-8 text-center">#</span>
              <span className="w-10" /> {/* thumbnail space */}
              <span className="flex-1">Title</span>
              <span className="w-20 text-right">Duration</span>
              {canEdit && <span className="w-10" />}
            </div>

            {playlist.tracks.map((track, index) => (
              <PlaylistTrackItem
                key={track.id}
                track={track}
                index={index}
                canEdit={canEdit}
                onRemove={handleRemoveTrack}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <SharePlaylistModal
        isOpen={shareModal.isOpen}
        onClose={shareModal.onClose}
        playlist={playlist}
      />
    </div>
  );
}
