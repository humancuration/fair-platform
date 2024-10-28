import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaTrash, FaEdit, FaShoppingCart } from 'react-icons/fa';
import Button from '../components/common/Button';
import { useQuery, useMutation } from '@apollo/client';
import { GET_GROUP_EMOJIS, UPLOAD_EMOJI, DELETE_EMOJI, UPDATE_EMOJI } from '../graphql/emojiQueries';

interface CustomEmojisProps {
  groupId: string;
  isAdmin?: boolean;
}

interface Emoji {
  id: string;
  name: string;
  url: string;
  createdBy: string;
  price: number;
  isPublic: boolean;
}

const CustomEmojis: React.FC<CustomEmojisProps> = ({ groupId, isAdmin }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emojiName, setEmojiName] = useState('');
  const [emojiPrice, setEmojiPrice] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const { data, loading, error } = useQuery(GET_GROUP_EMOJIS, {
    variables: { groupId }
  });

  const [uploadEmoji] = useMutation(UPLOAD_EMOJI);
  const [deleteEmoji] = useMutation(DELETE_EMOJI);
  const [updateEmoji] = useMutation(UPDATE_EMOJI);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxSize: 512000, // 500KB max
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        await uploadEmoji({
          variables: {
            groupId,
            file,
            name: file.name.replace(/\.[^/.]+$/, ""),
            price: 0,
            isPublic: true
          }
        });
      } catch (err) {
        console.error('Error uploading emoji:', err);
      }
    }
  });

  const handleDeleteEmoji = async (emojiId: string) => {
    try {
      await deleteEmoji({
        variables: { emojiId }
      });
    } catch (err) {
      console.error('Error deleting emoji:', err);
    }
  };

  const handleUpdateEmoji = async () => {
    if (!selectedEmoji) return;

    try {
      await updateEmoji({
        variables: {
          emojiId: selectedEmoji.id,
          name: emojiName,
          price: emojiPrice,
          isPublic
        }
      });
      setIsEditing(false);
      setSelectedEmoji(null);
    } catch (err) {
      console.error('Error updating emoji:', err);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Custom Emojis</h2>
      
      {isAdmin && (
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 cursor-pointer hover:border-primary-500">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <FaUpload className="text-3xl mb-2 text-gray-400" />
            <p className="text-gray-600">Drop PNG or GIF emoji here, or click to select</p>
            <p className="text-sm text-gray-400">Max size: 500KB</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <AnimatePresence>
          {data?.groupEmojis.map((emoji: Emoji) => (
            <motion.div
              key={emoji.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <img
                src={emoji.url}
                alt={emoji.name}
                className="w-full h-auto rounded-lg cursor-pointer hover:transform hover:scale-110 transition-transform"
                onClick={() => {
                  if (isAdmin) {
                    setSelectedEmoji(emoji);
                    setEmojiName(emoji.name);
                    setEmojiPrice(emoji.price);
                    setIsPublic(emoji.isPublic);
                    setIsEditing(true);
                  }
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                <div className="hidden group-hover:flex gap-2">
                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsEditing(true)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteEmoji(emoji.id)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                  {emoji.price > 0 && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {/* Handle purchase */}}
                    >
                      <FaShoppingCart /> ${emoji.price}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isEditing && selectedEmoji && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Emoji</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={emojiName}
                  onChange={(e) => setEmojiName(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={emojiPrice}
                  onChange={(e) => setEmojiPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                <label>Make public</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEmoji(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateEmoji}>Save</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomEmojis;
