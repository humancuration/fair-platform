import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, FaHandsHelping, FaLightbulb,
  FaUsers, FaGlobe, FaSeedling 
} from 'react-icons/fa';
import { SocialFeed } from './SocialFeed';
import { SocialAnalytics } from './SocialAnalytics';
import { SocialInsights } from './SocialInsights';

interface Collective {
  id: string;
  name: string;
  description: string;
  members: number;
  topics: string[];
}

interface Contributor {
  id: string;
  name: string;
  avatar: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  contributors: Contributor[];
  resourcesNeeded: string[];
}

interface SocialHubData {
  collectives: Collective[];
  projects: Project[];
  insights: {
    trends: string[];
    opportunities: string[];
    risks: string[];
    recommendations: string[];
  };
}

interface SocialHubProps {
  features: {
    learningCollectives: boolean;
    mutualAid: boolean;
    researchIncubation: boolean;
    communityProjects: boolean;
  };
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const data: SocialHubData = await getSocialHubData(params.communityId);
  return json({ data });
};

export const SocialHub: React.FC<SocialHubProps> = ({ features }) => {
  const { data } = useLoaderData<typeof loader>();

  return (
    <motion.div 
      className="social-hub grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Learning Collectives */}
      {features.learningCollectives && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold flex items-center mb-4">
            <FaGraduationCap className="mr-2 text-blue-500" />
            Learning Collectives
          </h3>
          
          <div className="space-y-4">
            {data.collectives.map((collective: Collective) => (
              <motion.div
                key={collective.id}
                className="p-4 border rounded-lg hover:border-blue-500"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{collective.name}</h4>
                  <span className="text-sm text-gray-500">
                    {collective.members} members
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {collective.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {collective.topics.map((topic: string) => (
                    <span key={topic} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mutual Aid Projects */}
      {features.mutualAid && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold flex items-center mb-4">
            <FaHandsHelping className="mr-2 text-green-500" />
            Mutual Aid Projects
          </h3>

          <div className="space-y-4">
            {data.projects.map((project: Project) => (
              <motion.div
                key={project.id}
                className="p-4 border rounded-lg hover:border-green-500"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{project.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    project.status === 'active' ? 'bg-green-100 text-green-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {project.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {project.contributors.slice(0, 3).map((contributor: Contributor) => (
                      <img
                        key={contributor.id}
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                    {project.contributors.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        +{project.contributors.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Resources needed: {project.resourcesNeeded.join(', ')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Community Insights */}
      <SocialInsights 
        insights={data.insights}
        features={{
          aiAssistance: {
            sentimentTracking: true,
            topicModeling: true,
            participantSupport: true
          },
          visualization: {
            interactiveElements: true,
            realTimeNetworks: true
          }
        }}
      />
    </motion.div>
  );
};
