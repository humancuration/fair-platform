import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an AuthContext

interface Post {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
  likesCount: number;
  repostsCount: number;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  sensitive: boolean;
  spoilerText?: string;
}

export default function Social() {
  const [feed, setFeed] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Post['visibility']>('public');
  const [sensitive, setSensitive] = useState(false);
  const [spoilerText, setSpoilerText] = useState('');
  const { token } = useAuth(); // Get the auth token

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('/api/hybrid/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeed(response.data.posts);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/hybrid/post', {
        content,
        visibility,
        sensitive,
        spoilerText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      setSensitive(false);
      setSpoilerText('');
      fetchFeed(); // Refresh the feed after posting
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await axios.post(`/api/hybrid/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeed(); // Refresh the feed after liking
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleRepost = async (postId: number) => {
    try {
      await axios.post(`/api/hybrid/post/${postId}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeed(); // Refresh the feed after reposting
    } catch (error) {
      console.error('Error reposting:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          maxLength={5000}
          className="w-full p-2 mb-2 border rounded"
          placeholder="What's on your mind?"
        />
        <div className="mb-2">
          <select 
            value={visibility} 
            onChange={(e) => setVisibility(e.target.value as Post['visibility'])}
            className="p-2 border rounded"
          >
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
            <option value="direct">Direct</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="mr-2">
            <input 
              type="checkbox" 
              checked={sensitive} 
              onChange={(e) => setSensitive(e.target.checked)}
            /> 
            Sensitive content
          </label>
          {sensitive && (
            <input 
              type="text" 
              value={spoilerText} 
              onChange={(e) => setSpoilerText(e.target.value)}
              placeholder="Content warning"
              className="p-2 border rounded"
            />
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Post</button>
      </form>

      <div>
        {feed.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow mb-4">
            <p className="font-bold">{post.user.username}</p>
            {post.sensitive && <p className="text-red-500">{post.spoilerText || 'Sensitive content'}</p>}
            <p>{post.content}</p>
            <div className="mt-2">
              <button onClick={() => handleLike(post.id)} className="mr-2 text-blue-500">
                Like ({post.likesCount})
              </button>
              <button onClick={() => handleRepost(post.id)} className="text-green-500">
                Repost ({post.repostsCount})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
