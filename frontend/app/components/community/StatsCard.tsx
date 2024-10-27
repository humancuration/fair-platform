import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  details: {
    title?: string;
    items?: Array<{ label: string; value: number }>;
    tags?: string[];
  };
}

const funMessages = [
  "You're crushing it! 🚀",
  "Weird flex but ok 💪",
  "Main character energy ✨",
  "No thoughts, just vibes 🌈",
  "Living your best life rn 💅",
  "Slay bestie! 👑",
  "We love to see it 😌",
  "You ate and left no crumbs 🍽️",
];

export function StatsCard({ title, value, subtitle, details }: StatsCardProps) {
  const [message, setMessage] = useState(() => 
    funMessages[Math.floor(Math.random() * funMessages.length)]
  );

  const handleHover = () => {
    confetti({
      particleCount: 50,
      spread: 30,
      origin: { y: 0.6 }
    });
    setMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={handleHover}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      {/* Fun gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-50" />

      {/* Content */}
      <div className="relative">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">{subtitle}</span>
        </div>

        {/* Fun message that changes on hover */}
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400 mt-2 italic"
        >
          {message}
        </motion.p>

        {/* Details section */}
        {details.items && (
          <div className="mt-4 space-y-2">
            {details.title && (
              <h4 className="text-sm font-medium text-gray-700">{details.title}</h4>
            )}
            <div className="grid grid-cols-2 gap-2">
              {details.items.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-2"
                >
                  <div className="text-sm text-gray-500">{item.label}</div>
                  <div className="text-lg font-bold text-gray-800">
                    {item.value.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {details.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {details.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
