import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import { FaImage, FaPaperclip, FaPoll, FaSmile, FaMarkdown } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import UserAvatar from '../../components/common/UserAvatar';
import MarkdownPreview from '../../components/common/MarkdownPreview';
import PollCreator from './PollCreator';
import { formatDistanceToNow } from 'date-fns';

interface ForumReplyProps {
  threadId: string;
  parentId?: string;
  onReplyCreated?: () => void;
  initialContent?: string;
  isEditing?: boolean;
  replyId?: string;
  onCancelEdit?: () => void;
}

interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  previewUrl?: string;
}

interface Poll {
  question: string;
  options: string[];
  expiresIn?: number;
  multipleChoice?: boolean;
}

const ForumReply: React.FC<ForumReplyProps> = ({
  threadId,
  parentId,
  onReplyCreated,
  initialContent = '',
  isEditing = false,
  replyId,
  onCancelEdit,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(initialContent);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false);
  const [contentWarning, setContentWarning] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Mention.configure({
        suggestion: {
          items: query => {
            return fetchMentionSuggestions(query);
          },
        },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const createReplyMutation = useMutation(
    (data: any) => api.post(`/forum/threads/${threadId}/replies`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['thread', threadId]);
        toast.success('Reply posted successfully!');
        onReplyCreated?.();
        resetForm();
      },
      onError: () => {
        toast.error('Failed to post reply');
      },
    }
  );

  const updateReplyMutation = useMutation(
    (data: any) => api.put(`/forum/replies/${replyId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['thread', threadId]);
        toast.success('Reply updated successfully!');
        onCancelEdit?.();
      },
      onError: () => {
        toast.error('Failed to update reply');
      },
    }
  );

  const handleFileUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await api.post('/forum/attachments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachments([...attachments, ...response.data]);
    } catch (error) {
      toast.error('Failed to upload files');
    }
  };

  const handleSubmit = async () => {
    const replyData = {
      content,
      parentId,
      attachments: attachments.map(a => a.id),
      poll,
      isSensitive,
      contentWarning: isSensitive ? contentWarning : undefined,
      visibility,
    };

    if (isEditing) {
      updateReplyMutation.mutate(replyData);
    } else {
      createReplyMutation.mutate(replyData);
    }
  };

  const resetForm = () => {
    setContent('');
    setAttachments([]);
    setPoll(null);
    setIsSensitive(false);
    setContentWarning('');
    setVisibility('public');
    editor?.commands.setContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
    >
      <div className="flex items-start space-x-4">
        <UserAvatar src={user.avatar} alt={user.username} size="md" />
        <div className="flex-1">
          {isSensitive && (
            <div className="mb-4">
              <input
                type="text"
                value={contentWarning}
                onChange={(e) => setContentWarning(e.target.value)}
                placeholder="Content Warning"
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="mb-4">
            {isPreview ? (
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownPreview content={content} />
              </div>
            ) : (
              <EditorContent editor={editor} className="min-h-[200px]" />
            )}
          </div>

          {attachments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {attachments.map(attachment => (
                <div key={attachment.id} className="relative group">
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.previewUrl || attachment.url}
                      alt={attachment.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                      <FaPaperclip className="text-2xl" />
                      <span className="ml-2">{attachment.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setAttachments(attachments.filter(a => a.id !== attachment.id))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {poll && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <h4 className="font-medium mb-2">{poll.question}</h4>
              <ul className="space-y-2">
                {poll.options.map((option, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setPoll(null)}
                className="text-red-500 text-sm mt-2"
              >
                Remove Poll
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FaImage />
              </button>
              <button
                type="button"
                onClick={() => setShowPollCreator(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FaPoll />
              </button>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FaSmile />
              </button>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <FaMarkdown />
              </button>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="p-2 border rounded"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSensitive}
                  onChange={(e) => setIsSensitive(e.target.checked)}
                  className="mr-2"
                />
                CW
              </label>
            </div>

            <div className="flex items-center space-x-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() || createReplyMutation.isLoading || updateReplyMutation.isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {createReplyMutation.isLoading || updateReplyMutation.isLoading
                  ? 'Posting...'
                  : isEditing
                  ? 'Update'
                  : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-10"
          >
            <EmojiPicker
              onEmojiClick={(emoji) => {
                editor?.commands.insertContent(emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </motion.div>
        )}

        {showPollCreator && (
          <PollCreator
            onSubmit={(pollData) => {
              setPoll(pollData);
              setShowPollCreator(false);
            }}
            onClose={() => setShowPollCreator(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ForumReply;
