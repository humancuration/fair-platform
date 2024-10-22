import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMagic, FaSparkles } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface PlaylistFormProps {
  onSubmit: (data: { name: string; description: string; groupId?: string }) => void;
  loading: boolean;
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

const PlaylistForm: React.FC<PlaylistFormProps> = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('🧙‍♂️ Oops! Your magical incantation is incomplete. Please fill in all required fields.');
      return;
    }
    onSubmit({ name, description, groupId: groupId || undefined });
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
        <label>
          <FaSparkles /> Playlist Name
        </label>
        <MagicalInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter a magical name"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label>
          <FaSparkles /> Description
        </label>
        <EnchantedTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe your enchanted playlist"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label>
          <FaSparkles /> Group (Optional)
        </label>
        <MagicalInput
          type="text"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Enter group ID if casting a group spell"
        />
      </motion.div>
      <SpellcastButton
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaMagic />
        {loading ? 'Casting Spell...' : 'Create Magical Playlist'}
      </SpellcastButton>
    </EnchantedForm>
  );
};

export default PlaylistForm;
