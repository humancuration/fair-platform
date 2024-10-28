import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { Comment } from "~/types/social";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={comment.avatar}
                alt={comment.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-semibold">{comment.username}</span>
                <p className="text-sm opacity-90">{comment.content}</p>
                <span className="text-xs opacity-60">
                  {format(new Date(comment.timestamp), 'PPp')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
