import React, { useState } from 'react';
import Button from './common/Button';
import { toast } from 'react-toastify';

interface MediaItemFormProps {
  onSubmit: (mediaItem: { type: string; title: string; url: string }) => void;
  isLoading: boolean;
}

const MediaItemForm: React.FC<MediaItemFormProps> = ({ onSubmit, isLoading }) => {
  const [type, setType] = useState<'music' | 'video' | 'social' | 'podcast'>('music');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      toast.error('Please fill in all required fields.');
      return;
    }
    onSubmit({ type, title, url });
    setTitle('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Media Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'music' | 'video' | 'social' | 'podcast')}
          className="w-full border rounded px-3 py-2"
          disabled={isLoading}
        >
          <option value="music">Music</option>
          <option value="video">Video</option>
          <option value="social">Social Media Clip</option>
          <option value="podcast">Podcast</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Enter media title"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Enter media URL"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Media Item'}
      </Button>
    </form>
  );
};

export default MediaItemForm;