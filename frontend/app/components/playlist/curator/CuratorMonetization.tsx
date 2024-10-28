import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCoins, FaChartLine, FaHandshake, FaMusic, 
  FaHeart, FaStar, FaUserShield, FaInfoCircle 
} from "react-icons/fa";
import { getCuratorStats, updateCuratorMonetization } from "~/models/curator.server";

interface EarningMetrics {
  totalEarned: number;
  listenerMinutes: number;
  uniqueListeners: number;
  artistSupport: {
    directSupport: number;
    streamingRoyalties: number;
    merchandiseSales: number;
  };
  curatorMetrics: {
    playlistFollowers: number;
    averageListenTime: number;
    retentionRate: number;
    genreAccuracy: number;
  };
  transparencyScore: number;
  ethicalScore: number;
}

interface SupportedArtist {
  id: string;
  name: string;
  supportAmount: number;
  listenerGrowth: number;
  isVerified: boolean;
  platformShare: number;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.curatorId) throw new Error("Curator ID is required");
  
  const [metrics, supportedArtists] = await Promise.all([
    getCuratorStats(params.curatorId),
    getSupportedArtists(params.curatorId)
  ]);

  return json({ metrics, supportedArtists });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, curatorId, artistId } = Object.fromEntries(formData);

  switch (action) {
    case "directSupport":
      await handleDirectSupport(curatorId as string, artistId as string);
      break;
  }

  return json({ success: true });
};

export function CuratorMonetization() {
  const { metrics, supportedArtists } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showEthicsInfo, setShowEthicsInfo] = useState(false);

  const handleDirectSupport = (artistId: string) => {
    fetcher.submit(
      { action: "directSupport", artistId },
      { method: "post" }
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      {/* Rest of the component JSX remains largely the same */}
    </div>
  );
}
