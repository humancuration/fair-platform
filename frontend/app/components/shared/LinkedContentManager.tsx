import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LinkedContentProps {
  surveyId: string;
}

const LinkedContentManager: React.FC<LinkedContentProps> = ({ surveyId }) => {
  const [linkedContent, setLinkedContent] = useState<LinkedContent[]>([]);
  const [contentType, setContentType] = useState<'discussion' | 'learningModule' | 'survey'>('discussion');
  const [contentId, setContentId] = useState('');
  const [contentTitle, setContentTitle] = useState('');

  useEffect(() => {
    fetchLinkedContent();
  }, [surveyId]);

  const fetchLinkedContent = async () => {
    try {
      const response = await axios.get(`/api/surveys/${surveyId}/linked-content`);
      setLinkedContent(response.data);
    } catch (error) {
      console.error('Error fetching linked content:', error);
    }
  };

  const handleLinkContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/surveys/${surveyId}/link-content`, {
        contentType,
        contentId,
        contentTitle
      });
      fetchLinkedContent();
      setContentId('');
      setContentTitle('');
    } catch (error) {
      console.error('Error linking content:', error);
    }
  };

  return (
    <div>
      <h3>Linked Content</h3>
      <ul>
        {linkedContent.map((content, index) => (
          <li key={index}>
            {content.type}: {content.title}
          </li>
        ))}
      </ul>
      <form onSubmit={handleLinkContent}>
        <select value={contentType} onChange={(e) => setContentType(e.target.value as any)}>
          <option value="discussion">Discussion</option>
          <option value="learningModule">Learning Module</option>
          <option value="survey">Survey</option>
        </select>
        <input
          type="text"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          placeholder="Content ID"
          required
        />
        <input
          type="text"
          value={contentTitle}
          onChange={(e) => setContentTitle(e.target.value)}
          placeholder="Content Title"
          required
        />
        <button type="submit">Link Content</button>
      </form>
    </div>
  );
};

export default LinkedContentManager;