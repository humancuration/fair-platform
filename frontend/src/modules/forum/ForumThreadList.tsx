import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaSort, FaFilter, FaSearch, FaTag, FaEye, FaComment, FaHeart, FaRobot, FaBrain, FaNetworkWired } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/api';
import UserAvatar from '../../components/common/UserAvatar';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    type: 'ai' | 'human' | 'hybrid';
    capabilities?: string[];
    trustScore?: number;
  };
  category: string;
  tags: string[];
  createdAt: string;
  lastActivity: string;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  federatedInstances?: string[];
  computationalContext?: {
    resources: {
      cpu: number;
      memory: number;
      gpu?: string;
    };
    duration: number;
    complexity: number;
  };
  aiMetadata?: {
    modelVersion: string;
    confidenceScore: number;
    verificationStatus: 'verified' | 'pending' | 'disputed';
    reasoningChain?: string[];
    dataSourceLinks?: string[];
  };
  collaborators?: {
    id: string;
    username: string;
    type: 'ai' | 'human' | 'hybrid';
    contribution: string;
  }[];
}

interface ThreadListProps {
  categoryId?: string;
  showFilters?: boolean;
  showSort?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
  aiOnly?: boolean;
}

const ForumThreadList: React.FC<ThreadListProps> = ({
  categoryId,
  showFilters = true,
  showSort = true,
  showSearch = true,
  itemsPerPage = 10,
  aiOnly = false,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'activity' | 'computational'>('recent');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'federated' | 'ai'>('all');
  const [computationalFilter, setComputationalFilter] = useState({
    minComplexity: 0,
    maxDuration: Infinity,
    requiredCapabilities: [] as string[],
  });

  // Fetch threads with filters and pagination
  const { data, isLoading, error } = useQuery(
    ['threads', categoryId, currentPage, searchTerm, selectedTags, sortBy, filterVisibility, computationalFilter],
    () => api.get('/forum/threads', {
      params: {
        categoryId,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        tags: selectedTags.join(','),
        sort: sortBy,
        visibility: filterVisibility,
        aiOnly,
        ...computationalFilter,
      },
    }).then(res => res.data),
    {
      keepPreviousData: true,
    }
  );

  // Fetch available tags for filtering
  const { data: availableTags } = useQuery(
    'threadTags',
    () => api.get('/forum/tags').then(res => res.data)
  );

  // Like thread mutation
  const likeMutation = useMutation(
    (threadId: string) => api.post(`/forum/threads/${threadId}/like`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['threads']);
        toast.success('Thread liked!');
      },
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const renderAIMetadata = (thread: Thread) => {
    if (!thread.aiMetadata) return null;

    return (
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <FaBrain className="text-purple-500" />
          <span>Model: {thread.aiMetadata.modelVersion}</span>
          <span>•</span>
          <span>Confidence: {(thread.aiMetadata.confidenceScore * 100).toFixed(1)}%</span>
        </div>
        {thread.computationalContext && (
          <div className="flex items-center gap-2 text-gray-600">
            <FaNetworkWired className="text-blue-500" />
            <span>Complexity: {thread.computationalContext.complexity}</span>
            <span>•</span>
            <span>Duration: {thread.computationalContext.duration}ms</span>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Failed to load threads. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {(showSearch || showFilters || showSort) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          {showSearch && (
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search threads..."
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FaSearch />
              </button>
            </form>
          )}

          {showFilters && (
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={filterVisibility}
                  onChange={(e) => setFilterVisibility(e.target.value as any)}
                  className="p-2 border rounded"
                >
                  <option value="all">All Threads</option>
                  <option value="public">Public Only</option>
                  <option value="federated">Federated</option>
                  <option value="ai">AI Generated</option>
                </select>
              </div>

              {filterVisibility === 'ai' && (
                <div className="flex items-center gap-2">
                  <FaBrain className="text-purple-500" />
                  <select
                    multiple
                    value={computationalFilter.requiredCapabilities}
                    onChange={(e) => setComputationalFilter({
                      ...computationalFilter,
                      requiredCapabilities: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="p-2 border rounded"
                  >
                    <option value="nlp">Natural Language Processing</option>
                    <option value="vision">Computer Vision</option>
                    <option value="reasoning">Logical Reasoning</option>
                    <option value="math">Mathematical Computation</option>
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {availableTags?.map((tag: string) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1
                      ${selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <FaTag />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSort && (
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 border rounded"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="activity">Recent Activity</option>
                <option value="computational">Computational Complexity</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Thread List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {data?.threads.map((thread: Thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <UserAvatar
                      src={thread.author.avatar}
                      alt={thread.author.username}
                      size="lg"
                      type={thread.author.type}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            to={`/forum/thread/${thread.id}`}
                            className="text-xl font-semibold hover:text-blue-500"
                          >
                            {thread.isPinned && <span className="text-yellow-500 mr-2">📌</span>}
                            {thread.isLocked && <span className="text-red-500 mr-2">🔒</span>}
                            {thread.title}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Link
                              to={`/user/${thread.author.id}`}
                              className="hover:text-blue-500 flex items-center gap-1"
                            >
                              {thread.author.type === 'ai' && <FaRobot className="text-blue-500" />}
                              {thread.author.username}
                            </Link>
                            <span>•</span>
                            <span>{format(new Date(thread.createdAt), 'PPp')}</span>
                            <span>•</span>
                            <span className="text-blue-500">{thread.category}</span>
                            {thread.federatedInstances?.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-purple-500">
                                  Federated with {thread.federatedInstances.length} instances
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{thread.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaComment />
                            <span>{thread.replyCount}</span>
                          </div>
                          <button
                            onClick={() => likeMutation.mutate(thread.id)}
                            className={`flex items-center gap-1 ${
                              thread.isLiked ? 'text-red-500' : 'hover:text-red-500'
                            }`}
                          >
                            <FaHeart />
                            <span>{thread.likeCount}</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {thread.category}
                        </span>
                        {thread.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {renderAIMetadata(thread)}

                      {thread.collaborators && thread.collaborators.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-gray-500">Collaborators:</span>
                          <div className="flex -space-x-2">
                            {thread.collaborators.map(collaborator => (
                              <UserAvatar
                                key={collaborator.id}
                                src={collaborator.avatar}
                                alt={collaborator.username}
                                size="sm"
                                type={collaborator.type}
                                className="border-2 border-white dark:border-gray-800"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ForumThreadList;
