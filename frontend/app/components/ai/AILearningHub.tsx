import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaGraduationCap, FaBook, FaVideo, FaCode } from 'react-icons/fa';
import api from '@/utils/api';

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'code' | 'course';
  difficulty: string;
  duration: string;
  author: string;
  rating: number;
  tags: string[];
  collaborativeFeatures: {
    studyGroups: boolean;
    peerReviews: boolean;
    mentorshipAvailable: boolean;
  };
  accessibilityOptions: {
    translations: string[];
    offlineAccess: boolean;
    lowBandwidthVersion: boolean;
    screenReaderOptimized: boolean;
  };
  communityContributions: {
    contributors: string[];
    improvements: string[];
    relatedProjects: string[];
  };
}

const AILearningHub: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resources } = useQuery('aiResources', () =>
    api.get('/ai/learning-resources').then(res => res.data)
  );

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: FaGraduationCap },
    { id: 'article', name: 'Articles', icon: FaBook },
    { id: 'video', name: 'Videos', icon: FaVideo },
    { id: 'code', name: 'Code Examples', icon: FaCode },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">AI Learning Hub</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto">
        {resourceTypes.map(type => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              selectedType === type.id
                ? 'bg-purple-600 text-white'
                : 'bg-white border'
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <type.icon />
            <span>{type.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.filter(r => 
          (selectedType === 'all' || r.type === selectedType) &&
          (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        ).map((resource: Resource) => (
          <motion.div
            key={resource.id}
            whileHover={{ y: -5 }}
            className="border rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              {resource.type === 'article' && <FaBook className="text-blue-500" />}
              {resource.type === 'video' && <FaVideo className="text-red-500" />}
              {resource.type === 'code' && <FaCode className="text-green-500" />}
              <h3 className="text-xl font-bold">{resource.title}</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>{resource.duration}</span>
              <span>{resource.difficulty}</span>
              <span>⭐ {resource.rating}/5</span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              By {resource.author}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AILearningHub;
