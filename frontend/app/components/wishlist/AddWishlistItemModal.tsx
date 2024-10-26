import { Form } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import TextInput from '../forms/TextInput';
import Button from '../common/Button';

interface AddWishlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWishlistItemModal({ isOpen, onClose }: AddWishlistItemModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Wishlist Item</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="addItem" />
            
            <TextInput
              label="Item Name"
              name="name"
              required
              autoFocus
              placeholder="Enter item name"
            />

            <TextInput
              label="Description"
              name="description"
              required
              placeholder="Describe your wishlist item"
              as="textarea"
              rows={3}
            />

            <TextInput
              label="Image URL (optional)"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Item
              </Button>
            </div>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
