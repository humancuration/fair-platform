import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaBookmark, FaUserFriends } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface SocialStats {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
}

const SocialContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const SocialActions = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled(motion.button)<{ isActive?: boolean }>`
  background: none;
  border: none;
  color: ${({ isActive }) => isActive ? '#ff6b6b' : 'white'};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  svg {
    font-size: 1.5rem;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.8;
  }
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentInput = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    color: white;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  button {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const CommentList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CommentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  gap: 15px;
`;

const ShareModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  z-index: 1000;
`;

const PlaylistSocialFeatures: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [socialStats, setSocialStats] = useState<SocialStats>({
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    isLiked: false,
    isSaved: false
  });
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchSocialData();
  }, [playlistId]);

  const fetchSocialData = async () => {
    try {
      const [statsResponse, commentsResponse] = await Promise.all([
        fetch(`/api/playlists/${playlistId}/social-stats`),
        fetch(`/api/playlists/${playlistId}/comments`)
      ]);
      
      const stats = await statsResponse.json();
      const commentsData = await commentsResponse.json();
      
      setSocialStats(stats);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching social data:', error);
      toast.error('Failed to load social features');
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      setSocialStats(prev => ({
        ...prev,
        likes: data.likes,
        isLiked: data.isLiked
      }));
    } catch (error) {
      toast.error('Failed to like playlist');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/playlists/${playlistId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      const comment = await response.json();
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setSocialStats(prev => ({
        ...prev,
        comments: prev.comments + 1
      }));
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const handleShare = async (platform: string) => {
    try {
      await fetch(`/api/playlists/${playlistId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
      
      setSocialStats(prev => ({
        ...prev,
        shares: prev.shares + 1
      }));
      
      setShowShareModal(false);
      toast.success(`Shared to ${platform}!`);
    } catch (error) {
      toast.error('Failed to share playlist');
    }
  };

  return (
    <SocialContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SocialActions>
        <ActionButton
          onClick={handleLike}
          isActive={socialStats.isLiked}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaHeart />
          <span>{socialStats.likes} Likes</span>
        </ActionButton>
        <ActionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaComment />
          <span>{socialStats.comments} Comments</span>
        </ActionButton>
        <ActionButton
          onClick={() => setShowShareModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaShare />
          <span>{socialStats.shares} Shares</span>
        </ActionButton>
        <ActionButton
          isActive={socialStats.isSaved}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBookmark />
          <span>{socialStats.saves} Saves</span>
        </ActionButton>
      </SocialActions>

      <CommentSection>
        <CommentInput>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleComment}>Post</button>
        </CommentInput>

        <CommentList>
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.username}</span>
                    <span className="text-sm opacity-60">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-sm opacity-60 hover:opacity-100">
                      {comment.likes} likes
                    </button>
                    <button className="text-sm opacity-60 hover:opacity-100">
                      Reply
                    </button>
                  </div>
                </div>
              </CommentCard>
            ))}
          </AnimatePresence>
        </CommentList>
      </CommentSection>

      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowShareModal(false)}
            />
            <ShareModal
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-4">Share Playlist</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Twitter', 'Facebook', 'Instagram', 'Discord'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </ShareModal>
          </>
        )}
      </AnimatePresence>
    </SocialContainer>
  );
};

export default PlaylistSocialFeatures;
