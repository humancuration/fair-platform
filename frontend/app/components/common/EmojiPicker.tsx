import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaHistory, FaSmile, FaHeart, FaStar } from "react-icons/fa";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  customEmojis?: Array<{
    shortcode: string;
    url: string;
    category?: string;
  }>;
}

export default function EmojiPicker({ onSelect, customEmojis = [] }: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("smileys");

  const categories = [
    { id: "recent", icon: FaHistory, label: "Recent" },
    { id: "smileys", icon: FaSmile, label: "Smileys" },
    { id: "custom", icon: FaStar, label: "Custom" },
    { id: "reactions", icon: FaHeart, label: "Reactions" },
  ];

  const commonEmojis = {
    smileys: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉"],
    reactions: ["❤️", "👍", "👎", "😍", "🎉", "🤔", "👀", "💯", "🔥", "✨", "💪", "🙌"],
  };

  useEffect(() => {
    const stored = localStorage.getItem("recentEmojis");
    if (stored) {
      setRecentEmojis(JSON.parse(stored));
    }
  }, []);

  const handleSelect = (emoji: string) => {
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(newRecent);
    localStorage.setItem("recentEmojis", JSON.stringify(newRecent));
    onSelect(emoji);
  };

  const filteredEmojis = searchTerm
    ? [...Object.values(commonEmojis).flat(), ...customEmojis.map(e => `:${e.shortcode}:`)].filter(
        emoji => emoji.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activeCategory === "recent"
    ? recentEmojis
    : activeCategory === "custom"
    ? customEmojis.map(e => `:${e.shortcode}:`)
    : commonEmojis[activeCategory as keyof typeof commonEmojis] || [];

  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-xl w-72 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="p-2 border-b border-gray-700">
        <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emojis..."
            className="bg-transparent w-full focus:outline-none text-white"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        {categories.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`flex-1 p-2 hover:bg-gray-700 transition-colors ${
              activeCategory === id ? "bg-gray-700" : ""
            }`}
            title={label}
          >
            <Icon className="mx-auto text-gray-400" />
          </button>
        ))}
      </div>

      <div className="h-64 overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <motion.button
              key={`${emoji}-${index}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(emoji)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              {emoji.startsWith(":") ? (
                <img
                  src={customEmojis.find(e => `:${e.shortcode}:` === emoji)?.url}
                  alt={emoji}
                  className="w-6 h-6"
                />
              ) : (
                <span className="text-xl">{emoji}</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
