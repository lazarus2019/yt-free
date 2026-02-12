import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import { useCreatePlaylist } from '../hooks/usePlaylist';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlaylistModal({ isOpen, onClose }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const createPlaylist = useCreatePlaylist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Playlist name is required');
      return;
    }

    try {
      await createPlaylist.mutateAsync({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Playlist" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My awesome playlist"
          error={error && !name.trim() ? error : undefined}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this playlist about?"
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {error && name.trim() && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createPlaylist.isPending}>
            <Plus size={18} className="mr-1" />
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
