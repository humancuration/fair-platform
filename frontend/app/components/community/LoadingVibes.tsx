import { motion } from "framer-motion";

const funLoadingMessages = [
  "Manifesting the vibes... ✨",
  "Loading your main character energy... 💫",
  "Charging up the slay meter... 💅",
  "Assembling the bestie stats... 👯‍♀️",
  "Calculating your impact... 🌟",
  "Gathering the tea... ☕",
  "Summoning good vibes... 🌈",
  "Hyping you up... 🎉"
];

export function LoadingVibes() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-xl opacity-50" />
        <div className="relative text-6xl">✨</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        {funLoadingMessages.map((message, index) => (
          <motion.p
            key={message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-lg text-gray-600 font-medium"
          >
            {message}
          </motion.p>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 flex gap-2"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-3 h-3 rounded-full bg-blue-400" />
        <div className="w-3 h-3 rounded-full bg-purple-400" />
        <div className="w-3 h-3 rounded-full bg-pink-400" />
      </motion.div>
    </div>
  );
}
