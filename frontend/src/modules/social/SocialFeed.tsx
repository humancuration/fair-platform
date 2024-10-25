import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNotification } from '../../hooks/useNotification';
import { FaMusic, FaHeart, FaReply, FaRetweet, FaShare, FaEllipsisV } from 'react-icons/fa';
import { usePlaylist } from '../../contexts/PlaylistContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    type: 'user' | 'ai' | 'system';
  };
  attachedPlaylist?: {
    id: string;
    name: string;
    description: string;
    trackCount: number;
    duration: number;
  };
  likes: number;
  replies: number;
  reposts: number;
  isLiked: boolean;
  isReposted: boolean;
  timestamp: string;
  tags: string[];
}

const FeedContainer = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const PostCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const PlaylistPreview = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled(motion.button)<{ isActive?: boolean }>`
  background: none;
  border: none;
  color: ${({ isActive }) => isActive ? '#ff6b6b' : 'white'};
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px;
  border-radius: 20px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const { socket } = useWebSocket();
  const { notifyInfo } = useNotification();
  const { dispatch: playlistDispatch } = usePlaylist();

  useEffect(() => {
    fetchPosts();
    setupWebSocket();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/social/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Could not load social feed');
    }
  };

  const setupWebSocket = () => {
    if (!socket) return;

    socket.on('new_post', (post: Post) => {
      setPosts(prev => [post, ...prev]);
      notifyInfo(`New post from ${post.author.username}`);
    });

    socket.on('post_liked', ({ postId, likes }: { postId: string; likes: number }) => {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes } : post
      ));
    });

    return () => {
      socket.off('new_post');
      socket.off('post_liked');
    };
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent,
          playlistId: selectedPlaylist
        })
      });

      const post = await response.json();
      setPosts(prev => [post, ...prev]);
      setNewPostContent('');
      setSelectedPlaylist(null);
      toast.success('Post shared successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Could not create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, likes: data.likes, isLiked: data.isLiked } : post
      ));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/repost`, {
        method: 'POST'
      });
      const data = await response.json();
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, reposts: data.reposts, isReposted: data.isReposted } : post
      ));
    } catch (error) {
      toast.error('Failed to repost');
    }
  };

  const handlePlaylistClick = (playlist: Post['attachedPlaylist']) => {
    if (!playlist) return;

    playlistDispatch({ type: 'SET_PLAYLIST', payload: playlist });
    playlistDispatch({ type: 'SET_TRACK_INDEX', payload: 0 });
    playlistDispatch({ type: 'TOGGLE_PLAY' });
  };

  return (
    <FeedContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Post Creation */}
      <PostCard>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share your musical thoughts..."
          className="w-full p-4 bg-transparent border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {/* Open playlist selector */}}
            className="flex items-center gap-2 text-blue-400"
          >
            <FaMusic /> Attach Playlist
          </button>
          <button
            onClick={handlePost}
            disabled={isPosting || !newPostContent.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white disabled:opacity-50"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </PostCard>

      {/* Posts Feed */}
      <AnimatePresence>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PostHeader>
              <UserInfo>
                <img src={post.author.avatar} alt={post.author.username} />
                <div>
                  <h3 className="font-bold">{post.author.username}</h3>
                  <span className="text-sm opacity-70">
                    {new Date(post.timestamp).toLocaleString()}
                  </span>
                </div>
              </UserInfo>
              <button className="opacity-70 hover:opacity-100">
                <FaEllipsisV />
              </button>
            </PostHeader>

            <p className="whitespace-pre-wrap">{post.content}</p>

            {post.attachedPlaylist && (
              <PlaylistPreview
                onClick={() => handlePlaylistClick(post.attachedPlaylist)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <FaMusic className="text-2xl" />
                  <div>
                    <h4 className="font-bold">{post.attachedPlaylist.name}</h4>
                    <p className="text-sm opacity-70">
                      {post.attachedPlaylist.trackCount} tracks • 
                      {Math.floor(post.attachedPlaylist.duration / 60)} mins
                    </p>
                  </div>
                </div>
              </PlaylistPreview>
            )}

            <ActionBar>
              <ActionButton
                onClick={() => handleLike(post.id)}
                isActive={post.isLiked}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaHeart />
                <span>{post.likes}</span>
              </ActionButton>
              <ActionButton
                onClick={() => {/* Handle reply */}}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaReply />
                <span>{post.replies}</span>
              </ActionButton>
              <ActionButton
                onClick={() => handleRepost(post.id)}
                isActive={post.isReposted}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaRetweet />
                <span>{post.reposts}</span>
              </ActionButton>
              <ActionButton
                onClick={() => {/* Handle share */}}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaShare />
              </ActionButton>
            </ActionBar>
          </PostCard>
        ))}
      </AnimatePresence>
    </FeedContainer>
  );
};

export default SocialFeed;
