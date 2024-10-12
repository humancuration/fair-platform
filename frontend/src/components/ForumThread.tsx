import React from 'react';

interface ForumThreadProps {
  threadId: string;
  threadTitle: string;
  threadPreview: string;
  handleFollowThread: (id: string) => void;
}

const ForumThread: React.FC<ForumThreadProps> = ({ threadId, threadTitle, threadPreview, handleFollowThread }) => {
  return (
    <div className="forum-thread">
      <h3>{threadTitle}</h3>
      <p>{threadPreview}</p>
      <svg className="icon follow-thread" viewBox="0 0 64 64" onClick={() => handleFollowThread(threadId)}>
        <circle cx="32" cy="32" r="30" stroke="#FF6F61" strokeWidth="4" fill="none" />
      </svg>
    </div>
  );
};

export default ForumThread;
