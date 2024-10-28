import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCodeBranch, FaRobot, FaHistory, FaMagic, 
  FaCodeFork, FaMerge, FaGitAlt 
} from "react-icons/fa";
import { 
  getVersionHistory, 
  getForks, 
  createFork, 
  mergeFork 
} from "~/models/version.server";
import type { PlaylistVersion, PlaylistFork } from "~/types/version";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.playlistId) throw new Error("Playlist ID is required");

  const [versions, forks] = await Promise.all([
    getVersionHistory(params.playlistId),
    getForks(params.playlistId)
  ]);

  return json({ versions, forks });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, playlistId, versionId, forkId, name, description } = 
    Object.fromEntries(formData);

  switch (action) {
    case "createFork":
      await createFork(playlistId as string, {
        name,
        description,
        versionId
      });
      break;
    case "mergeFork":
      await mergeFork(playlistId as string, forkId as string);
      break;
  }

  return json({ success: true });
};

export function PlaylistVersionControl() {
  const { versions, forks } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedVersion, setSelectedVersion] = useState<PlaylistVersion | null>(null);
  const [showForkModal, setShowForkModal] = useState(false);

  const handleCreateFork = () => {
    if (!selectedVersion) return;

    fetcher.submit(
      {
        action: "createFork",
        playlistId: selectedVersion.playlistId,
        versionId: selectedVersion.id,
        name: `Fork of ${selectedVersion.playlistId}`,
        description: "Forked playlist"
      },
      { method: "post" }
    );
    setShowForkModal(false);
  };

  const handleMergeFork = (forkId: string) => {
    fetcher.submit(
      { action: "mergeFork", forkId },
      { method: "post" }
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaGitAlt /> Version Control
        </h2>
        <div className="flex gap-4">
          <motion.button
            onClick={() => setShowForkModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg"
          >
            <FaCodeFork /> Fork Playlist
          </motion.button>
        </div>
      </div>

      <VersionList 
        versions={versions} 
        selectedVersion={selectedVersion}
        onVersionSelect={setSelectedVersion}
        onRevert={(version) => {
          fetcher.submit(
            { action: "revert", versionId: version.id },
            { method: "post" }
          );
        }}
      />

      <ForkList 
        forks={forks}
        onMerge={handleMergeFork}
      />

      {showForkModal && (
        <ForkModal
          onClose={() => setShowForkModal(false)}
          onConfirm={handleCreateFork}
        />
      )}
    </div>
  );
}

// Add VersionList, ForkList, and ForkModal components...
