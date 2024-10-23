import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUsers, FaComments, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import UserAvatar from '../../components/common/UserAvatar';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  threadCount: number;
  postCount: number;
  memberCount: number;
  lastPost?: {
    id: string;
    title: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      avatar: string;
    };
  };
  moderators: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
  tags: string[];
  isPrivate: boolean;
  requiredRole?: string;
}

interface ForumCategoryProps {
  category: ForumCategory;
  onSubscribe?: (categoryId: string) => void;
  isSubscribed?: boolean;
  currentUserRole?: string;
}

const ForumCategory: React.FC<ForumCategoryProps> = ({
  category,
  onSubscribe,
  isSubscribed,
  currentUserRole
}) => {
  const canAccess = !category.isPrivate || 
    (category.requiredRole && currentUserRole === category.requiredRole);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {category.icon ? (
              <img 
                src={category.icon} 
                alt={category.name}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: category.color || '#4B5563' }}
              >
                {category.name.charAt(0)}
              </div>
            )}
            
            <div>
              <Link 
                to={canAccess ? `/forum/category/${category.id}` : '#'}
                className={`text-xl font-bold hover:text-blue-500 ${
                  !canAccess && 'cursor-not-allowed opacity-50'
                }`}
              >
                {category.name}
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {category.description}
              </p>
              
              {category.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {category.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {onSubscribe && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSubscribe(category.id)}
              className={`px-4 py-2 rounded-lg ${
                isSubscribed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </motion.button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <FaComments />
            <span>{category.threadCount} threads</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <FaUsers />
            <span>{category.memberCount} members</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <FaClock />
            <span>{category.postCount} posts</span>
          </div>
        </div>

        {category.lastPost && (
          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserAvatar
                  src={category.lastPost.author.avatar}
                  alt={category.lastPost.author.username}
                  size="sm"
                />
                <div>
                  <Link 
                    to={`/forum/thread/${category.lastPost.id}`}
                    className="text-sm font-medium hover:text-blue-500"
                  >
                    {category.lastPost.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    by {category.lastPost.author.username}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(category.lastPost.createdAt), 'PPp')}
              </span>
            </div>
          </div>
        )}

        {category.moderators.length > 0 && (
          <div className="mt-4 border-t dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 mb-2">Moderators:</p>
            <div className="flex -space-x-2">
              {category.moderators.map(mod => (
                <UserAvatar
                  key={mod.id}
                  src={mod.avatar}
                  alt={mod.username}
                  size="sm"
                  className="border-2 border-white dark:border-gray-800 rounded-full"
                />
              ))}
            </div>
          </div>
        )}

        {category.isPrivate && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This is a private category. {category.requiredRole && 
                `Required role: ${category.requiredRole}`
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ForumCategory;
