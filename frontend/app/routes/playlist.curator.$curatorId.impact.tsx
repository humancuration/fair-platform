import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Paper, Typography, Avatar, LinearProgress } from "@mui/material";
import { FaStar, FaCompactDisc, FaGlobe, FaUserFriends, FaChartLine, FaLightbulb } from "react-icons/fa";
import type { CuratorMetrics } from "~/types/curator";
import type { ArtistGrowth } from "~/types/artist";

interface LoaderData {
  metrics: CuratorMetrics;
  growthData: ArtistGrowth[];
  timeframe: 'month' | 'year' | 'all';
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const timeframe = (url.searchParams.get("timeframe") || "month") as LoaderData["timeframe"];

  const [metrics, growthData] = await Promise.all([
    fetch(`/api/curators/${params.curatorId}/impact?timeframe=${timeframe}`).then(res => res.json()),
    fetch(`/api/curators/${params.curatorId}/artist-growth?timeframe=${timeframe}`).then(res => res.json())
  ]);

  return json({ metrics, growthData, timeframe });
};

export default function CuratorImpactRoute() {
  const { metrics, growthData, timeframe } = useLoaderData<typeof loader>();

  const achievements = [
    { icon: <FaGlobe />, title: 'Global Reach', description: 'Playlists played in 50+ countries' },
    { icon: <FaCompactDisc />, title: 'Genre Explorer', description: 'Connected 10+ music genres' },
    { icon: <FaUserFriends />, title: 'Artist Supporter', description: 'Helped 100+ emerging artists' },
    { icon: <FaLightbulb />, title: 'Trend Setter', description: '5 playlists in trending' }
  ];

  return (
    <Container maxWidth="xl" className="py-8">
      <Paper className="bg-black/50 backdrop-blur-md p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="flex items-center gap-2">
            <FaStar className="text-yellow-400" /> Curator Impact
          </Typography>
          <TimeframeSelector currentTimeframe={timeframe} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImpactCard
            title="Listener Impact"
            value={metrics.totalListeners}
            subtitle="Total Listeners Reached"
            secondaryMetric={{
              label: "Retention Rate",
              value: metrics.listenerRetention
            }}
          />

          <ArtistGrowthCard growthData={growthData} />
          
          <GlobalReachCard metrics={metrics} />
        </div>

        <AchievementsSection achievements={achievements} />
        
        {metrics.communityEngagement && (
          <CommunityImpactSection metrics={metrics} />
        )}
      </Paper>
    </Container>
  );
}

function TimeframeSelector({ currentTimeframe }: { currentTimeframe: LoaderData["timeframe"] }) {
  return (
    <div className="flex gap-2">
      {(['month', 'year', 'all'] as const).map((timeframe) => (
        <motion.a
          key={timeframe}
          href={`?timeframe=${timeframe}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-4 py-2 rounded-full transition-colors
            ${currentTimeframe === timeframe ? 'bg-blue-500' : 'bg-gray-700'}
          `}
        >
          {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
        </motion.a>
      ))}
    </div>
  );
}

function ImpactCard({ 
  title, 
  value, 
  subtitle, 
  secondaryMetric 
}: { 
  title: string;
  value: number;
  subtitle: string;
  secondaryMetric?: { label: string; value: number };
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <Typography variant="h6" className="mb-2">{title}</Typography>
      <Typography variant="h3" className="font-bold">
        {value.toLocaleString()}
      </Typography>
      <Typography variant="body2" className="opacity-70">{subtitle}</Typography>

      {secondaryMetric && (
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>{secondaryMetric.label}</span>
            <span>{secondaryMetric.value}%</span>
          </div>
          <LinearProgress 
            variant="determinate" 
            value={secondaryMetric.value} 
            className="mt-1"
          />
        </div>
      )}
    </motion.div>
  );
}

function ArtistGrowthCard({ growthData }: { growthData: ArtistGrowth[] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <Typography variant="h6" className="mb-4">Artist Growth</Typography>
      <div className="space-y-4">
        {growthData.slice(0, 3).map((artist) => (
          <motion.div
            key={artist.artistId}
            whileHover={{ x: 5 }}
            className="flex items-center gap-4"
          >
            <Avatar src={artist.avatar} alt={artist.name} />
            <div>
              <Typography variant="subtitle2">{artist.name}</Typography>
              <Typography 
                variant="body2" 
                className="text-green-400"
              >
                +{artist.growthPercentage}% growth
              </Typography>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ... Additional component implementations
