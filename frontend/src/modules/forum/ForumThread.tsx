import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaReply, FaBookmark, FaShare, FaEllipsisV } from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../api/api';
import { toast } from 'react-toastify';
import UserAvatar from '../../components/common/UserAvatar';
import TagList from '../../components/common/TagList';
import RichTextViewer from '../../components/common/RichTextViewer';

interface ThreadProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    reputation: number;
  };
  tags: string[];
  category: string;
  createdAt: string;
  lastActivity: string;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  attachments?: {
    id: string;
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  polls?: {
    id: string;
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
    totalVotes: number;
    endsAt?: string;
  }[];
}

const ForumThread: React.FC<ThreadProps> = ({
  id,
  title,
  content,
  author,
  tags,
  category,
  createdAt,
  lastActivity,
  viewCount,
  replyCount,
  likeCount,
  isLiked,
  isBookmarked,
  isPinned,
  isLocked,
  attachments,
  polls,
}) => {
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation(
    () => api.post(`/forum/threads/${id}/like`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['thread', id]);
        toast.success(isLiked ? 'Removed like' : 'Added like');
      },
      onError: () => {
        toast.error('Failed to update like');
      },
    }
  );

  const bookmarkMutation = useMutation(
    () => api.post(`/forum/threads/${id}/bookmark`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['thread', id]);
        toast.success(isBookmarked ? 'Removed bookmark' : 'Added bookmark');
      },
      onError: () => {
        toast.error('Failed to update bookmark');
      },
    }
  );

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: `Check out this discussion: ${title}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await api.post(`/forum/polls/${pollId}/vote`, { optionId });
      queryClient.invalidateQueries(['thread', id]);
      toast.success('Vote recorded');
    } catch (error) {
      toast.error('Failed to record vote');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      {/* Thread Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <UserAvatar
              src={author.avatar}
              alt={author.username}
              size="lg"
              onClick={() => navigate(`/profile/${author.id}`)}
              className="cursor-pointer"
            />
            <div>
              <h2 className="text-xl font-bold hover:text-blue-500 cursor-pointer"
                  onClick={() => navigate(`/forum/thread/${id}`)}>
                {isPinned && <span className="text-yellow-500 mr-2">📌</span>}
                {isLocked && <span className="text-red-500 mr-2">🔒</span>}
                {title}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Posted by {author.username}</span>
                <span>•</span>
                <span>{format(new Date(createdAt), 'PPp')}</span>
                <span>•</span>
                <span className="text-blue-500">{category}</span>
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
                  {/* Action menu items */}
                  <button
                    onClick={() => navigate(`/forum/thread/${id}/edit`)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Edit Thread
                  </button>
                  <button
                    onClick={() => {/* Handle report */}}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  >
                    Report Thread
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <TagList tags={tags} className="mt-2" />
      </div>

      {/* Thread Content */}
      <div className="p-4">
        <RichTextViewer content={content} />
        
        {attachments && attachments.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map(attachment => (
              <div key={attachment.id} className="relative group">
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => {/* Open image viewer */}}
                  />
                ) : (
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {attachment.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {polls && polls.length > 0 && (
          <div className="mt-4 space-y-4">
            {polls.map(poll => (
              <div key={poll.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{poll.question}</h3>
                <div className="space-y-2">
                  {poll.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <div className="flex justify-between">
                        <span>{option.text}</span>
                        <span>{((option.votes / poll.totalVotes) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(option.votes / poll.totalVotes) * 100}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {poll.totalVotes} votes
                  {poll.endsAt && ` • Ends ${format(new Date(poll.endsAt), 'PPp')}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thread Footer */}
      <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => likeMutation.mutate()}
            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : ''}`}
          >
            <FaHeart />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => navigate(`/forum/thread/${id}#reply`)}
            className="flex items-center space-x-1"
          >
            <FaReply />
            <span>{replyCount}</span>
          </button>
          <button
            onClick={() => bookmarkMutation.mutate()}
            className={`flex items-center space-x-1 ${isBookmarked ? 'text-yellow-500' : ''}`}
          >
            <FaBookmark />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1"
          >
            <FaShare />
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          <span>{viewCount} views</span>
          <span className="mx-2">•</span>
          <span>Last activity {format(new Date(lastActivity), 'PPp')}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ForumThread;
