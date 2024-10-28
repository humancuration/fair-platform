import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaLock, FaUnlock, FaHistory, FaCrown } from "react-icons/fa";
import { toast } from "react-toastify";
import { 
  getCollaborators, 
  getActivityHistory,
  removeCollaborator,
  togglePlaylistAccess 
} from "~/models/playlist.server";

interface CollaboratorAction {
  userId: string;
  username: string;
  action: 'add' | 'remove' | 'reorder' | 'update';
  timestamp: string;
  trackInfo?: {
    id: string;
    title: string;
  };
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const [collaborators, activityHistory] = await Promise.all([
    getCollaborators(params.playlistId),
    getActivityHistory(params.playlistId)
  ]);
  
  return json({ collaborators, activityHistory });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, userId, playlistId } = Object.fromEntries(formData);

  switch (action) {
    case "removeCollaborator":
      await removeCollaborator(playlistId as string, userId as string);
      break;
    case "toggleAccess":
      await togglePlaylistAccess(playlistId as string);
      break;
  }

  return json({ success: true });
};

export function CollaborativePlaylist() {
  const { collaborators, activityHistory } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // Component JSX remains largely the same, but uses fetcher.submit() 
  // instead of direct fetch calls
}
