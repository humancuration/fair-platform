import { motion } from "framer-motion";
import { FaCodeBranch as FaCodeFork, FaTimes } from "react-icons/fa6";

interface ForkModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function ForkModal({ onClose, onConfirm }: ForkModalProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   bg-gradient-to-br from-purple-900/90 to-blue-900/90 
                   backdrop-blur-lg rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaCodeFork /> Create Fork
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-sm opacity-70 mb-6">
          Creating a fork will allow you to make changes without affecting the original playlist.
          You can later merge your changes back if desired.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-white/10 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg"
          >
            Create Fork
          </button>
        </div>
      </motion.div>
    </>
  );
}
