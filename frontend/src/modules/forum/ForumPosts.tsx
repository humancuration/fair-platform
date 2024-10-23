import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import ForumPost from './ForumPost';
import { toast } from 'react-toastify';

const ForumPosts: React.FC = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  // Use react-query for data fetching
  const { data: posts, isLoading } = useQuery(['posts', forumId], 
    () => api.get(`/api/v1/forums/${forumId}/posts`).then(res => res.data)
  );

  // Create post mutation
  const createPostMutation = useMutation(
    (newPost: { content: string }) => 
      api.post(`/api/v1/forums/${forumId}/posts`, newPost),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts', forumId]);
        setContent('');
        toast.success('Post created successfully');
      },
      onError: () => {
        toast.error('Failed to create post');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate({ content });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 mb-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          rows={4}
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          disabled={createPostMutation.isLoading}
        >
          {createPostMutation.isLoading ? 'Posting...' : 'Post'}
        </button>
      </form>

      <div className="space-y-4">
        {posts?.map((post) => (
          <ForumPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ForumPosts;
