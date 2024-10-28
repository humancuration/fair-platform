import { motion } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { FaCog, FaShieldAlt, FaHandshake, FaGraduationCap, FaChartLine } from "react-icons/fa";
import { useUser } from "~/contexts/UserContext";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const sections: SettingsSection[] = [
  {
    id: "collaboration",
    title: "Collaboration Preferences",
    icon: <FaHandshake className="text-2xl" />,
    description: "Set your preferred collaboration style and availability"
  },
  {
    id: "learning",
    title: "Learning Journey",
    icon: <FaGraduationCap className="text-2xl" />,
    description: "Customize your learning path and mentorship preferences"
  },
  {
    id: "economic",
    title: "Economic Settings",
    icon: <FaChartLine className="text-2xl" />,
    description: "Manage your UBI allocation and contribution tracking"
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: <FaShieldAlt className="text-2xl" />,
    description: "Control your data sharing and visibility settings"
  }
];

export function UserSettings() {
  const { preferences, economicBenefits } = useUser();
  const [activeSection, setActiveSection] = useState("collaboration");
  const fetcher = useFetcher();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings & Preferences</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {sections.map(section => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-4 rounded-lg ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm opacity-80">{section.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {/* Collaboration Settings */}
            {activeSection === "collaboration" && (
              <motion.div
                key="collab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-bold mb-4">Collaboration Style</h2>
                {/* Add collaboration settings UI */}
              </motion.div>
            )}

            {/* Learning Settings */}
            {activeSection === "learning" && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-bold mb-4">Learning Preferences</h2>
                {/* Add learning settings UI */}
              </motion.div>
            )}

            {/* Economic Settings */}
            {activeSection === "economic" && (
              <motion.div
                key="economic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-bold mb-4">Economic Preferences</h2>
                {/* Add economic settings UI */}
              </motion.div>
            )}

            {/* Privacy Settings */}
            {activeSection === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-bold mb-4">Privacy Controls</h2>
                {/* Add privacy settings UI */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
