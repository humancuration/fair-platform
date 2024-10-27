import React, { useState } from 'react';
import { Form } from '@remix-run/react';
import { X } from 'react-feather';
import { motion } from 'framer-motion';
import type { AffiliateProgram } from '~/types/dashboard';

interface CreateAffiliateLinkModalProps {
  programs: AffiliateProgram[];
  onClose: () => void;
}

export default function CreateAffiliateLinkModal({ programs, onClose }: CreateAffiliateLinkModalProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [originalLink, setOriginalLink] = useState('');
  const [customAlias, setCustomAlias] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Affiliate Link
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Affiliate Program
            </label>
            <select
              name="programId"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              required
            >
              <option value="">Select a program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.commissionRate}% commission)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Original Link
            </label>
            <input
              type="url"
              name="originalLink"
              value={originalLink}
              onChange={(e) => setOriginalLink(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              placeholder="https://example.com/product"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              name="customAlias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              placeholder="my-custom-link"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Link
            </button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
