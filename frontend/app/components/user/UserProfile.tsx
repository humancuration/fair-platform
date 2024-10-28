import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { 
  FaUsers, FaBrain, FaLightbulb, FaSeedling,
  FaHandshake, FaGraduationCap, FaChartLine
} from "react-icons/fa";
import type { User } from "~/types/auth";

interface ContributionMetrics {
  research: number;
  code: number;
  review: number;
  mentorship: number;
  community: number;
}

interface CollectiveImpact {
  patentsContributed: number;
  projectsSupported: number;
  peersHelped: number;
  learningHoursShared: number;
  computeShared: number;
}

interface UserProfileProps {
  user: User;
  contributions: ContributionMetrics;
  impact: CollectiveImpact;
  skills: string[];
  interests: string[];
}

export function UserProfile({
  user,
  contributions,
  impact,
  skills,
  interests
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<"contributions" | "impact" | "learning">("contributions");
  const fetcher = useFetcher();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <img 
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full"
          />
          {user.verifiedContributor && (
            <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-full">
              <FaHandshake className="w-4 h-4" />
            </div>
          )}
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.bio}</p>
          <div className="flex gap-2 mt-2">
            {user.roles.map(role => (
              <span 
                key={role}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contribution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg"
        >
          <div className="text-2xl mb-2">🌟</div>
          <h3 className="font-medium">Universal Basic Income</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${user.ubiEarnings.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Monthly from collective patents</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg"
        >
          <div className="text-2xl mb-2">💡</div>
          <h3 className="font-medium">Learning Hours</h3>
          <p className="text-2xl font-bold text-green-600">
            {user.learningHours}
          </p>
          <p className="text-sm text-gray-600">Hours of skills gained</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg"
        >
          <div className="text-2xl mb-2">🤝</div>
          <h3 className="font-medium">Collaboration Score</h3>
          <p className="text-2xl font-bold text-blue-600">
            {user.collaborationScore}
          </p>
          <p className="text-sm text-gray-600">Based on peer feedback</p>
        </motion.div>
      </div>

      {/* Skills & Interests */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Skills & Interests</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Impact Visualization */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="font-bold mb-4">Collective Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🧬</div>
            <div className="text-sm font-medium">Patents</div>
            <div className="text-xl font-bold text-purple-600">
              {impact.patentsContributed}
            </div>
          </div>
          {/* Add other impact metrics */}
        </div>
      </div>
    </div>
  );
}
