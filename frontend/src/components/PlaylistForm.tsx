import React, { useState } from 'react';
import Button from './common/Button';
import { toast } from 'react-toastify';

interface PlaylistFormProps {
  onSubmit: (data: { name: string; description: string; groupId?: string }) => void;
  loading: boolean;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('Please fill in all required fields.');
      return;
    }
    onSubmit({ name, description, groupId: groupId || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Playlist Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Enter playlist name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Enter playlist description"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Group (Optional)</label>
        <input
          type="text"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter group ID if applicable"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Playlist'}
      </Button>
    </form>
  );
};

export default PlaylistForm;