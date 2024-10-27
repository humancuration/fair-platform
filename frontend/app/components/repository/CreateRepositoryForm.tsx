import type { FC } from 'react';
import { Form, useNavigation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaGitAlt, FaLock, FaGithub } from 'react-icons/fa';

export const CreateRepositoryForm: FC = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaGitAlt className="text-gray-500 text-2xl" />
          <h2 className="text-2xl font-bold">Create New Repository</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Repository Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="my-awesome-project"
              pattern="^[a-zA-Z0-9-_]+$"
              title="Use only letters, numbers, hyphens, and underscores"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your repository"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPrivate"
                className="rounded border-gray-300"
              />
              <span className="flex items-center gap-1">
                <FaLock className="text-gray-400" />
                Private Repository
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="lfsEnabled"
                className="rounded border-gray-300"
              />
              <span className="flex items-center gap-1">
                <FaGithub className="text-gray-400" />
                Enable Git LFS
              </span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaGitAlt />
                  </motion.div>
                  Creating Repository...
                </>
              ) : (
                <>
                  <FaGitAlt />
                  Create Repository
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Form>
  );
};
