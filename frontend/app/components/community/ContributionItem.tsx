import { motion } from "framer-motion";
import type { Contribution } from "~/types/community";

interface ContributionItemProps {
  contribution: Contribution;
  index: number;
}

const typeEmojis = {
  comment: "💭",
  review: "👀",
  help: "🤝",
  event: "🎉",
  translation: "🌍",
  mentorship: "🧠"
};

const funMessages = {
  comment: ["Spitting facts!", "Hot take alert!", "The tea is hot! ☕"],
  review: ["Eagle eyes!", "Detective mode on!", "Sherlock vibes~"],
  help: ["Not all heroes wear capes!", "MVP behavior!", "Main character energy!"],
  event: ["Party time!", "The vibes are immaculate!", "It's giving community!"],
  translation: ["Breaking barriers!", "World connector!", "Babel who?"],
  mentorship: ["Big brain energy!", "Knowledge drop!", "Sensei mode activated!"]
};

export function ContributionItem({ contribution, index }: ContributionItemProps) {
  const getMessage = () => {
    const messages = funMessages[contribution.type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="bg-white rounded-lg shadow-md p-4 mb-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeEmojis[contribution.type]}</span>
          <div>
            <h4 className="font-medium text-gray-800">
              {contribution.content}
            </h4>
            <p className="text-sm text-gray-500">
              {new Date(contribution.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-medium"
        >
          +{contribution.impact} impact
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="mt-2 text-sm text-purple-500 font-medium italic"
      >
        {getMessage()}
      </motion.div>

      {contribution.languages && (
        <div className="mt-2 flex gap-2">
          {contribution.languages.map(lang => (
            <motion.span
              key={lang}
              whileHover={{ y: -2 }}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
            >
              {lang}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
