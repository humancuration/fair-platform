import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, FaComment, FaShare, FaBookmark, 
  FaUserFriends 
} from "react-icons/fa";
import { 
  getSocialStats, 
  getComments, 
  addComment,
  toggleLike,
  toggleSave,
  sharePlaylist 
} from "~/models/social.server";
import type { SocialStats, Comment } from "~/types/social";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.playlistId) throw new Error("Playlist ID is required");
  
  const [stats, comments] = await Promise.all([
    getSocialStats(params.playlistId),
    getComments(params.playlistId)
  ]);

  return json({ stats, comments });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, playlistId, content, platform } = Object.fromEntries(formData);

  switch (action) {
    case "like":
      await toggleLike(playlistId as string);
      break;
    case "save":
      await toggleSave(playlistId as string);
      break;
    case "comment":
      await addComment(playlistId as string, content as string);
      break;
    case "share":
      await sharePlaylist(playlistId as string, platform as string);
      break;
  }

  return json({ success: true });
};

export function PlaylistSocialFeatures() {
  const { stats, comments } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [newComment, setNewComment] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  const handleAction = (actionType: string, data = {}) => {
    fetcher.submit(
      { action: actionType, ...data },
      { method: "post" }
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-around items-center p-4 border-b border-white/10">
        <SocialButton
          icon={<FaHeart />}
          count={stats.likes}
          isActive={stats.isLiked}
          onClick={() => handleAction("like")}
        />
        <SocialButton
          icon={<FaComment />}
          count={stats.comments}
          onClick={() => document.getElementById('comment-input')?.focus()}
        />
        <SocialButton
          icon={<FaShare />}
          count={stats.shares}
          onClick={() => setShowShareModal(true)}
        />
        <SocialButton
          icon={<FaBookmark />}
          count={stats.saves}
          isActive={stats.isSaved}
          onClick={() => handleAction("save")}
        />
      </div>

      <div className="mt-6">
        <div className="flex gap-4 mb-4">
          <input
            id="comment-input"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-white/5 rounded-lg px-4 py-2"
          />
          <button
            onClick={() => {
              handleAction("comment", { content: newComment });
              setNewComment("");
            }}
            className="bg-purple-500 px-4 py-2 rounded-lg"
          >
            Post
          </button>
        </div>

        <CommentList comments={comments} />
      </div>

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          onShare={(platform) => handleAction("share", { platform })}
        />
      )}
    </motion.div>
  );
}

// Continue with subcomponents...
