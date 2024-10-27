import { Form } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { FormInput, FormTextArea, FormSelect } from '~/components/forms/FormElements';
import { cn } from '~/utils';
import { Button } from '~/components/common/Button';

interface AddCommunityWishlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string }>;
}

export function AddCommunityWishlistItemModal({ 
  isOpen, 
  onClose,
  categories 
}: AddCommunityWishlistItemModalProps) {
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
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
              >
                <FaTimes className="h-5 w-5" />
              </button>

              <h2 className="text-2xl font-bold mb-6">Add Community Project</h2>

              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="addCommunityItem" />
                
                <FormSelect
                  label="Category"
                  name="category"
                  required
                  options={categories}
                />

                <FormInput
                  label="Project Name"
                  name="name"
                  required
                  autoFocus
                  placeholder="Enter project name"
                />

                <FormTextArea
                  label="Description"
                  name="description"
                  required
                  placeholder="Describe your community project"
                  rows={3}
                />

                <FormInput
                  label="Image URL"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />

                <FormInput
                  label="Target Amount"
                  name="targetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />

                <FormInput
                  label="Timeline (days)"
                  name="timeline"
                  type="number"
                  min="1"
                  placeholder="30"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowContributions"
                    name="allowContributions"
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="allowContributions" className="text-sm">
                    Allow community contributions and collaboration
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
                    Create Project
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
