import { motion } from "framer-motion";
import { useFetcher } from "@remix-run/react";
import type { CommunityMember } from "~/types/community";

interface CommunityGroupProps {
  name: string;
  description: string;
  members: CommunityMember[];
  isPrivate: boolean;
  currentUserId: string;
  onJoin?: () => void;
}

export function CommunityGroup({ 
  name, 
  description, 
  members, 
  isPrivate,
  currentUserId,
  onJoin 
}: CommunityGroupProps) {
  const fetcher = useFetcher();
  const isAdmin = members.some(m => m.userId === currentUserId && m.role === "ADMIN");
  const isMember = members.some(m => m.userId === currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            {name}
            {isPrivate && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                Private
              </span>
            )}
          </h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>

        {!isMember && (
          <button
            onClick={onJoin}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Join Squad ✨
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {members.map((member) => (
          <motion.div
            key={member.userId}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"
          >
            <img
              src={member.avatar || "/default-avatar.png"}
              alt={member.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm">{member.username}</span>
            {member.role === "ADMIN" && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 rounded-full">
                Admin
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Squad Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => {
                  fetcher.submit(
                    { 
                      intent: "updateSettings",
                      isPrivate: e.target.checked.toString() 
                    },
                    { method: "post" }
                  );
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Private Squad</span>
            </label>
            {/* Add more settings as needed */}
          </div>
        </div>
      )}
    </motion.div>
  );
}
