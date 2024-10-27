import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import confetti from "canvas-confetti";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributions: string[];
  skills: string[];
  vibeScore: number;
}

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  contributors: TeamMember[];
  celebrationEmoji: string;
}

interface ProjectShowcaseProps {
  title: string;
  description: string;
  status: "active" | "completed" | "archived";
  team: TeamMember[];
  milestones: ProjectMilestone[];
  tags: string[];
  impact: {
    users: number;
    revenue: number;
    happiness: number;
  };
}

const roleEmojis: Record<string, string> = {
  "engineer": "👩‍💻",
  "designer": "🎨",
  "product": "💡",
  "community": "🌟",
  "support": "💪",
  "marketing": "📢",
  "operations": "⚙️",
  "intern": "🌱",
  "contributor": "✨"
};

const funMessages = [
  "Squad Goals! ����",
  "Dream Team Alert! ⭐",
  "Collaboration Queens/Kings! 👑",
  "The Vibes are Immaculate! ✨",
  "Main Characters Only! 💫",
  "Power Level Over 9000! 💪",
  "Absolutely Iconic! 🌟"
];

export function ProjectShowcase({ 
  title, 
  description, 
  status, 
  team, 
  milestones,
  tags,
  impact 
}: ProjectShowcaseProps) {
  const [activeSection, setActiveSection] = useState<"team" | "milestones" | "impact">("team");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const fetcher = useFetcher();
  const [message] = useState(() => funMessages[Math.floor(Math.random() * funMessages.length)]);

  const handleCelebrate = (memberId: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    fetcher.submit(
      { memberId, intent: "celebrate" },
      { method: "post", action: "/api/celebrations" }
    );
  };

  return (
    <div className="project-showcase bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <motion.h2 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h2>
          <p className="text-gray-600 mt-1">{description}</p>
          <motion.p
            className="text-sm text-purple-500 font-medium mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        </div>
        <motion.div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "active" ? "bg-green-100 text-green-700" :
            status === "completed" ? "bg-blue-100 text-blue-700" :
            "bg-gray-100 text-gray-700"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.div>
      </div>

      <div className="flex gap-2 mb-6">
        {["team", "milestones", "impact"].map((section) => (
          <motion.button
            key={section}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(section as typeof activeSection)}
            className={`px-4 py-2 rounded-full ${
              activeSection === section
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "team" && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {team.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-gray-600">
                      {roleEmojis[member.role.toLowerCase()] || "✨"} {member.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-white/50 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm">
                    <strong>Recent Wins:</strong>
                    <ul className="mt-1 space-y-1">
                      {member.contributions.map((contribution, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span>🌟</span> {contribution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCelebrate(member.id)}
                    className="w-full py-2 mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium"
                  >
                    Celebrate Their Work! ✨
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeSection === "milestones" && (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {milestone.title}
                      <span className="text-2xl">{milestone.celebrationEmoji}</span>
                    </h3>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(milestone.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {milestone.contributors.map((contributor) => (
                    <motion.div
                      key={contributor.id}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>{contributor.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeSection === "impact" && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg text-center"
            >
              <h3 className="text-lg font-bold text-gray-800">Happy Users</h3>
              <div className="text-3xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
                {impact.users.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-1">Lives Touched ✨</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg text-center"
            >
              <h3 className="text-lg font-bold text-gray-800">Revenue</h3>
              <div className="text-3xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                ${impact.revenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-1">Value Created 💫</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-yellow-50 to-red-50 rounded-lg text-center"
            >
              <h3 className="text-lg font-bold text-gray-800">Team Happiness</h3>
              <div className="text-3xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500">
                {impact.happiness}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Good Vibes Only 🌟</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-4 border-t">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
