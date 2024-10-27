import type { FC } from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaGitAlt, FaLock, FaCodeBranch, FaCalendar } from 'react-icons/fa';
import { formatDate } from '~/utils/formatters';
import type { Repository } from '~/types/version-control/repository';

interface RepositoryListProps {
  repositories: Repository[];
}

export const RepositoryList: FC<RepositoryListProps> = ({ repositories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <Link 
            to={`/repositories/${repo.id}`} 
            prefetch="intent"
            className="block p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaGitAlt className="text-gray-500" />
                <h3 className="text-lg font-semibold">{repo.name}</h3>
              </div>
              {repo.isPrivate && (
                <FaLock className="text-gray-400" title="Private repository" />
              )}
            </div>

            {repo.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {repo.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaCodeBranch className="text-gray-400" />
                <span>{repo.defaultBranch}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-gray-400" />
                <span>Updated {formatDate(repo.updatedAt)}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
      {repositories.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No repositories found
        </div>
      )}
    </div>
  );
};
