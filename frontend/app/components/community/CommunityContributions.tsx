import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFetcher } from "@remix-run/react";
import { FaHandsHelping, FaComments, FaGlobeAmericas, FaHeart, 
         FaSeedling, FaUserFriends, FaLightbulb } from "react-icons/fa";
import type { CommunityStats, Contribution } from "~/types/community";
import { StatsCard } from "./StatsCard";
import { ImpactBadge } from "./ImpactBadge";
import { ContributionItem } from "./ContributionItem";

interface CommunityContributionsProps {
  stats: CommunityStats;
  contributions: Contribution[];
}

const funTitles = [
  "Community Vibes Check ✨",
  "The Tea on Your Impact ☕",
  "Main Character Stats 💅",
  "Your Slayage Report 👑",
  "Bestie Behavior Analysis 💖",
  "The Girlboss/Boyboss Metrics 💫",
  "Your Iconic Moments 🌟",
];

const impactAreas = [
  { 
    icon: "🤝",
    title: "Community Support",
    description: "Helping the besties",
    count: 100
  },
  {
    icon: "🌍",
    title: "Cultural Bridge",
    description: "Connecting the vibes",
    count: 5
  },
  {
    icon: "🌱",
    title: "Growth Enabler",
    description: "Leveling up together",
    count: 10
  },
  {
    icon: "💡",
    title: "Knowledge Sharer",
    description: "Big brain energy",
    count: 50
  }
];

export function CommunityContributions({ stats, contributions }: CommunityContributionsProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const fetcher = useFetcher();
  const [title] = useState(() => 
    funTitles[Math.floor(Math.random() * funTitles.length)]
  );

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    fetcher.load(`/community?timeframe=${newTimeframe}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-xl"
    >
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          {title}
        </h2>
        <div className="flex gap-2">
          {["week", "month", "year"].map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTimeframeChange(t as typeof timeframe)}
              className={`px-4 py-2 rounded-full transition-colors ${
                timeframe === t 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white/50 text-gray-700 hover:bg-white/80"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <StatsCard
          title="Helpful Actions"
          value={stats.helpfulActions}
          subtitle="Community Contributions"
          details={{
            title: "Knowledge Shared",
            items: [
              { label: "Topics", value: stats.knowledgeShared.topics },
              { label: "Resources", value: stats.knowledgeShared.resources }
            ]
          }}
        />

        <StatsCard
          title="Cultural Impact"
          value={stats.culturalExchanges}
          subtitle="Cultural Exchanges"
          details={{
            title: "Languages Supported",
            tags: stats.languagesSupported
          }}
        />

        <StatsCard
          title="Community Growth"
          value={stats.communityGrowth.newConnections}
          subtitle="New Connections Made"
          details={{
            items: [
              { label: "Collaborations", value: stats.communityGrowth.collaborations },
              { label: "Mentorships", value: stats.communityGrowth.mentorships }
            ]
          }}
        />
      </div>

      <motion.div
        className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Your Impact Areas ✨
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {impactAreas.map((area, index) => (
            <ImpactBadge
              key={index}
              area={area}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
          Recent Slay Moments 💅
        </h3>
        <AnimatePresence>
          {contributions.map((contribution, index) => (
            <ContributionItem
              key={contribution.id}
              contribution={contribution}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
