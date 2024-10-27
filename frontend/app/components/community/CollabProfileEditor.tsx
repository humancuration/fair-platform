import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { Skill, ProjectIdea } from "~/types/community";

interface CollabProfileEditorProps {
  initialProfile: {
    bio: string;
    skills: Skill[];
    interests: string[];
    availability: "immediately" | "within-month" | "exploring";
    projectIdeas: ProjectIdea[];
    seeking: {
      roles: string[];
      skills: string[];
      commitment: "full-time" | "part-time" | "casual";
    };
  };
}

const skillCategories = {
  tech: ["React", "Node.js", "Python", "AI/ML", "Web3", "DevOps"],
  creative: ["UI/UX", "Branding", "Content", "Video", "Animation"],
  business: ["Strategy", "Marketing", "Sales", "Finance", "Operations"],
  science: ["Research", "Data Science", "Biology", "Physics", "Chemistry"]
};

const funPlaceholders = {
  bio: [
    "I'm here to vibe and build cool stuff ✨",
    "Ready to revolutionize something! 🚀",
    "Looking for my startup bestie 👯‍♂️",
    "Let's create something iconic! 💅",
    "Main character seeking sidekick (or vice versa) 🦸‍♀️"
  ];
};

export function CollabProfileEditor({ initialProfile }: CollabProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [activeSection, setActiveSection] = useState<"bio" | "skills" | "seeking" | "projects">("bio");
  const fetcher = useFetcher();
  const [bioPlaceholder] = useState(() => 
    funPlaceholders.bio[Math.floor(Math.random() * funPlaceholders.bio.length)]
  );

  const handleSave = () => {
    fetcher.submit(
      { profile: JSON.stringify(profile), intent: "updateProfile" },
      { method: "post", action: "/api/collab-profile" }
    );
  };

  return (
    <div className="collab-profile-editor bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Your Collab Profile ✨
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg"
        >
          Save Changes
        </motion.button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["bio", "skills", "seeking", "projects"].map((section) => (
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
        {activeSection === "bio" && (
          <motion.div
            key="bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Story
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder={bioPlaceholder}
                className="w-full p-3 border rounded-lg h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={profile.availability}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  availability: e.target.value as typeof profile.availability 
                })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="immediately">Ready to start! 🚀</option>
                <option value="within-month">Available next month 📅</option>
                <option value="exploring">Just exploring for now 🔍</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commitment Level
              </label>
              <select
                value={profile.seeking.commitment}
                onChange={(e) => setProfile({
                  ...profile,
                  seeking: {
                    ...profile.seeking,
                    commitment: e.target.value as typeof profile.seeking.commitment
                  }
                })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="full-time">Full-time grind 💪</option>
                <option value="part-time">Part-time flex 🌅</option>
                <option value="casual">Keeping it casual ✌️</option>
              </select>
            </div>
          </motion.div>
        )}

        {activeSection === "skills" && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {Object.entries(skillCategories).map(([category, skills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {category} Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const isSelected = profile.skills.some(s => s.name === skill);
                        setProfile({
                          ...profile,
                          skills: isSelected
                            ? profile.skills.filter(s => s.name !== skill)
                            : [...profile.skills, { id: skill, name: skill, category }]
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        profile.skills.some(s => s.name === skill)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Add more sections for seeking and projects */}
      </AnimatePresence>
    </div>
  );
}
