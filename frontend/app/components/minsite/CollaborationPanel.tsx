import { useState } from "react";
import { motion } from "framer-motion";
import { useFetcher } from "@remix-run/react";
import type { User } from "~/types/models";

interface Collaborator extends User {
  role: "owner" | "editor" | "viewer";
  status: "active" | "pending";
}

interface CollaborationPanelProps {
  collaborators: Collaborator[];
  minsiteId: string;
  currentUserId: string;
}

export function CollaborationPanel({ collaborators, minsiteId, currentUserId }: CollaborationPanelProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const fetcher = useFetcher();

  const handleInvite = () => {
    if (email) {
      fetcher.submit(
        { email, role, minsiteId, intent: "invite" },
        { method: "post", action: "/api/collaborators" }
      );
      setEmail("");
      setIsInviting(false);
    }
  };

  const handleRemove = (userId: string) => {
    fetcher.submit(
      { userId, minsiteId, intent: "remove" },
      { method: "delete", action: "/api/collaborators" }
    );
  };

  const handleRoleChange = (userId: string, newRole: "editor" | "viewer") => {
    fetcher.submit(
      { userId, role: newRole, minsiteId, intent: "updateRole" },
      { method: "post", action: "/api/collaborators" }
    );
  };

  return (
    <div className="collaboration-panel p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Collaborators</h3>
        <button
          onClick={() => setIsInviting(true)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Invite
        </button>
      </div>

      {isInviting && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3 p-4 bg-gray-50 rounded mb-4"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
            className="w-full p-2 border rounded"
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsInviting(false)}
              className="px-3 py-1 text-sm text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Send Invite
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {collaborators.map((collaborator) => (
          <motion.div
            key={collaborator.id}
            layout
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <p className="font-medium">{collaborator.email}</p>
              <p className="text-sm text-gray-500">
                {collaborator.status === "pending" ? "Pending" : collaborator.role}
              </p>
            </div>
            {currentUserId !== collaborator.id && (
              <div className="flex items-center gap-2">
                <select
                  value={collaborator.role}
                  onChange={(e) => 
                    handleRoleChange(
                      collaborator.id, 
                      e.target.value as "editor" | "viewer"
                    )
                  }
                  className="text-sm border rounded p-1"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  onClick={() => handleRemove(collaborator.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
