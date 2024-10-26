import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { prisma } from '~/utils/db.server';

interface Highlight {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export async function loader() {
  const highlights = await prisma.communityHighlight.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return json({ highlights });
}

export default function CommunityHighlights() {
  const { highlights } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-4">
      {highlights.map((highlight, index) => (
        <motion.div
          key={highlight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 border rounded bg-green-50 dark:bg-green-900"
        >
          <h3 className="text-lg font-semibold dark:text-green-100">
            {highlight.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {highlight.description}
          </p>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(highlight.createdAt).toLocaleDateString()}
          </time>
        </motion.div>
      ))}

      {highlights.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400 p-4"
        >
          No community highlights available yet.
        </motion.p>
      )}
    </div>
  );
}
