import type { FC } from 'react';
import { Form, useNavigation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FaGitAlt, 
  FaLock, 
  FaCodeBranch, 
  FaCalendar,
  FaEdit,
  FaTrash,
  FaUser,
  FaExternalLinkAlt
} from 'react-icons/fa';
import type { Repository } from '~/types/version-control/repository';

interface RepositoryDetailProps {
  repository: Repository;
}

export const RepositoryDetail: FC<RepositoryDetailProps> = ({ repository }) => {
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting" && 
    navigation.formData?.get("intent") === "delete";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <FaGitAlt className="text-gray-500 text-2xl" />
            <div>
              <h1 className="text-2xl font-bold">{repository.name}</h1>
              {repository.description && (
                <p className="text-gray-600 mt-1">{repository.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {repository.isPrivate && (
              <span className="flex items-center gap-1 text-gray-500">
                <FaLock />
                Private
              </span>
            )}
            <Form method="post" className="flex gap-2">
              <button
                type="submit"
                name="intent"
                value="delete"
                className="text-red-500 hover:text-red-600 p-2"
                onClick={(e) => {
                  if (!confirm('Are you sure you want to delete this repository?')) {
                    e.preventDefault();
                  }
                }}
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
              <button
                type="submit"
                name="intent"
                value="edit"
                className="text-blue-500 hover:text-blue-600 p-2"
              >
                <FaEdit />
              </button>
            </Form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUser className="text-gray-400" />
              <span>Owner: {repository.owner.username}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaCodeBranch className="text-gray-400" />
              <span>Default branch: {repository.defaultBranch}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendar className="text-gray-400" />
              <span>Created: {format(new Date(repository.createdAt), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendar className="text-gray-400" />
              <span>Last updated: {format(new Date(repository.updatedAt), 'PPP')}</span>
            </div>
          </div>
        </div>

        {repository.url && (
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <FaExternalLinkAlt />
            View repository
          </a>
        )}
      </div>
    </motion.div>
  );
};
