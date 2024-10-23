import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FaReply, FaHeart, FaRepost, FaBookmark, FaEllipsisV, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import api from '../../api/api';
import Markdown from '../../components/common/Markdown';
import UserAvatar from '../../components/common/UserAvatar';
import { Link } from 'react-router-dom';

interface PostAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  preview_url?: string;
  description?: string;
}

interface PostEmoji {
  shortcode: string;
  url: string;
  static_url: string;
}

interface PostMention {
  id: string;
  username: string;
  acct: string;
  url: string;
}

interface Post {
  id: string;
  content: string;
  content_warning?: string;
  created_at: string;
  edited_at?: string;
  sensitive: boolean;
  spoiler_text: string;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  uri: string;
  url: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  favourited: boolean;
  reblogged: boolean;
  bookmarked: boolean;
  attachments: PostAttachment[];
  mentions: PostMention[];
  tags: string[];
  emojis: PostEmoji[];
  card?: {
    url: string;
    title: string;
    description: string;
    image: string;
  };
  poll?: {
    id: string;
    expires_at: string;
    expired: boolean;
    multiple: boolean;
    votes_count: number;
    options: {
      title: string;
      votes_count: number;
    }[];
    voted: boolean;
  };
  account: {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    avatar: string;
    header: string;
    note: string;
    url: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
  };
}

interface ForumPostProps {
  post: Post;
  isReply?: boolean;
  onReply?: (post: Post) => void;
}

const ForumPost: React.FC<ForumPostProps> = ({ post, isReply, onReply }) => {
  const [showActions, setShowActions] = useState(false);
  const [showContent, setShowContent] = useState(!post.sensitive);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Mutations for post interactions
  const likeMutation = useMutation(
    () => api.post(`/api/v1/statuses/${post.id}/favourite`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', post.id]);
        toast.success(post.favourited ? 'Post unliked' : 'Post liked');
      }
    }
  );

  const repostMutation = useMutation(
    () => api.post(`/api/v1/statuses/${post.id}/reblog`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', post.id]);
        toast.success(post.reblogged ? 'Post unreblogged' : 'Post reblogged');
      }
    }
  );

  const bookmarkMutation = useMutation(
    () => api.post(`/api/v1/statuses/${post.id}/bookmark`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', post.id]);
        toast.success(post.bookmarked ? 'Bookmark removed' : 'Post bookmarked');
      }
    }
  );

  const reportMutation = useMutation(
    (reason: string) => api.post(`/api/v1/reports`, {
      account_id: post.account.id,
      status_ids: [post.id],
      comment: reason,
    }),
    {
      onSuccess: () => {
        toast.success('Post reported successfully');
      }
    }
  );

  const handleReport = () => {
    const reason = prompt('Please provide a reason for reporting this post:');
    if (reason) {
      reportMutation.mutate(reason);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
        ${isReply ? 'ml-8 mt-2' : 'mb-4'}`}
    >
      {/* Post Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/users/${post.account.acct}`}>
              <UserAvatar
                src={post.account.avatar}
                alt={post.account.display_name}
                size="md"
                className="rounded-full"
              />
            </Link>
            <div>
              <Link 
                to={`/users/${post.account.acct}`}
                className="font-semibold hover:underline"
              >
                {post.account.display_name}
              </Link>
              <div className="flex items-center text-sm text-gray-500">
                <span>@{post.account.acct}</span>
                <span className="mx-1">·</span>
                <span>{format(new Date(post.created_at), 'PPp')}</span>
                {post.visibility !== 'public' && (
                  <span className="ml-1">
                    <FaGlobe className="text-gray-400" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FaEllipsisV />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={handleReport}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  >
                    Report Post
                  </button>
                  {user?.id === post.account.id && (
                    <>
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Edit Post
                      </button>
                      <button
                        onClick={() => {/* Handle delete */}}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                      >
                        Delete Post
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {post.content_warning && (
          <div className="mb-4">
            <button
              onClick={() => setShowContent(!showContent)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              CW: {post.content_warning}
              {showContent ? ' (Hide)' : ' (Show)'}
            </button>
          </div>
        )}

        <AnimatePresence>
          {(!post.sensitive || showContent) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Markdown content={post.content} />

              {/* Attachments */}
              {post.attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {post.attachments.map(attachment => (
                    <div key={attachment.id} className="relative group">
                      {attachment.type === 'image' ? (
                        <img
                          src={attachment.preview_url || attachment.url}
                          alt={attachment.description || ''}
                          className="rounded-lg cursor-pointer hover:opacity-75"
                          onClick={() => {/* Open media viewer */}}
                        />
                      ) : (
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-4">
                          {/* Handle other media types */}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Poll */}
              {post.poll && !post.poll.expired && (
                <div className="mt-4 space-y-2">
                  {post.poll.options.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      disabled={post.poll.voted}
                    >
                      <div className="flex justify-between">
                        <span>{option.title}</span>
                        <span>{((option.votes_count / post.poll.votes_count) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(option.votes_count / post.poll.votes_count) * 100}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t dark:border-gray-700 flex items-center justify-between">
        <button
          onClick={() => onReply?.(post)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
        >
          <FaReply />
          <span>{post.replies_count}</span>
        </button>

        <button
          onClick={() => repostMutation.mutate()}
          className={`flex items-center space-x-2 ${
            post.reblogged ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
          }`}
        >
          <FaRepost />
          <span>{post.reblogs_count}</span>
        </button>

        <button
          onClick={() => likeMutation.mutate()}
          className={`flex items-center space-x-2 ${
            post.favourited ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <FaHeart />
          <span>{post.favourites_count}</span>
        </button>

        <button
          onClick={() => bookmarkMutation.mutate()}
          className={`flex items-center space-x-2 ${
            post.bookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
          }`}
        >
          <FaBookmark />
        </button>
      </div>
    </motion.div>
  );
};

export default ForumPost;
