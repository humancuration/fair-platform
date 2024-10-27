import type { FC } from 'react';
import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaHistory, FaUndo } from 'react-icons/fa';
import type { CommitInfo } from '~/types/version-control/operations';

interface VersionHistoryProps {
  commits: CommitInfo[];
  currentBranch: string;
}

export const VersionHistory: FC<VersionHistoryProps> = ({ commits, currentBranch }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FaHistory className="text-gray-500" />
        <h3 className="text-lg font-semibold">Version History</h3>
        <span className="text-sm text-gray-500">({currentBranch})</span>
      </div>

      {commits.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No commits yet</p>
      ) : (
        <div className="space-y-4">
          {commits.map((commit, index) => (
            <motion.div
              key={commit.oid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{commit.message}</p>
                  <p className="text-sm text-gray-500">
                    {commit.author.name} • {format(new Date(commit.author.timestamp), 'PPp')}
                  </p>
                </div>
                <Form method="post">
                  <input type="hidden" name="intent" value="revert" />
                  <input type="hidden" name="commitId" value={commit.oid} />
                  <button
                    type="submit"
                    className="text-blue-500 hover:text-blue-600 p-2"
                    title="Revert to this version"
                  >
                    <FaUndo />
                  </button>
                </Form>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
