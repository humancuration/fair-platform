import React, { useEffect, useState } from 'react';
import api from '@api/api';

const DiscourseForums: React.FC = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await api.get('/discourse/latest-topics');
      setTopics(response.data);
    };
    fetchTopics();
  }, []);

  return (
    <div>
      <h2>Latest Discussions</h2>
      {topics.map(topic => (
        <div key={topic.id}>
          <h3>{topic.title}</h3>
          <p>{topic.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default DiscourseForums;