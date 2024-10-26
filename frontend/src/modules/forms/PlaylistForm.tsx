import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMagic, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { CreatePlaylistData } from '../../types/playlist';

interface PlaylistFormProps {
  onSubmit: (data: CreatePlaylistData) => void;
  loading: boolean;
  error?: string;
  initialData?: Partial<CreatePlaylistData>;
}

const EnchantedForm = styled(motion.form)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const MagicalInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const EnchantedTextarea = styled(MagicalInput).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
`;

const SpellcastButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  padding: 10px 20px;
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const PlaylistForm: React.FC<PlaylistFormProps> = ({ 
  onSubmit, 
  loading, 
  error,
  initialData 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('🎵 Please enter a title for your playlist!');
      return;
    }
    
    onSubmit({ 
      title: title.trim(), 
      description: description.trim(),
      isPublic,
      mediaItems: [] // Initialize with empty array
    });
  };

  return (
    <EnchantedForm
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label>
          <FaMusic /> Playlist Title
        </Label>
        <MagicalInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter a magical playlist title"
          disabled={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label>
          <FaMusic /> Description
        </Label>
        <EnchantedTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your enchanted playlist"
          disabled={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center mb-4"
      >
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mr-2"
          disabled={loading}
        />
        <Label htmlFor="isPublic">
          Make this playlist public
        </Label>
      </motion.div>

      <SpellcastButton
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaMagic />
        {loading ? 'Creating Playlist...' : 'Create Magical Playlist'}
      </SpellcastButton>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-300 mt-4"
        >
          {error}
        </motion.p>
      )}
    </EnchantedForm>
  );
};

export default PlaylistForm;
