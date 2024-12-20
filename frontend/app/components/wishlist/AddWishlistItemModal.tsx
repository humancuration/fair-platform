import { Form } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { FormInput, FormTextArea } from '~/components/forms/FormElements';
import { cn } from '~/utils';
import { Button } from '~/components/common/Button';

interface AddWishlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWishlistItemModal({ isOpen, onClose }: AddWishlistItemModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "relative w-full max-w-lg rounded-lg",
                "bg-white dark:bg-gray-800",
                "p-6 shadow-xl"
              )}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
              >
                <FaTimes className="h-5 w-5" />
              </button>

              <h2 className="text-2xl font-bold mb-6">Add Wishlist Item</h2>

              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="addItem" />
                
                <FormInput
                  label="Item Name"
                  name="name"
                  required
                  autoFocus
                  placeholder="Enter item name"
                />

                <FormTextArea
                  label="Description"
                  name="description"
                  required
                  placeholder="Describe your wishlist item"
                  rows={3}
                />

                <FormInput
                  label="Image URL"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />

                <FormInput
                  label="Target Amount (optional)"
                  name="targetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Make this item public
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Add Item
                  </Button>
                </div>
              </Form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
