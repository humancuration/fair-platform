import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion } from "framer-motion";
import { Container, Paper, Typography, Button, LinearProgress } from "@mui/material";
import { 
  FaCoins, FaChartLine, FaHandshake, FaMusic, 
  FaHeart, FaStar, FaUserShield, FaInfoCircle 
} from "react-icons/fa";
import { useState } from "react";
import type { EarningMetrics, SupportedArtist } from "~/types/monetization";

interface LoaderData {
  metrics: EarningMetrics;
  supportedArtists: SupportedArtist[];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [metrics, supportedArtists] = await Promise.all([
    fetch(`/api/curators/${params.curatorId}/metrics`).then(res => res.json()),
    fetch(`/api/curators/${params.curatorId}/supported-artists`).then(res => res.json())
  ]);

  return json({ metrics, supportedArtists });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const { action, artistId } = Object.fromEntries(formData);

  if (action === "directSupport") {
    await fetch('/api/support/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artistId })
    });
  }

  return json({ success: true });
};

export default function CuratorMonetizationRoute() {
  const { metrics, supportedArtists } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showEthicsInfo, setShowEthicsInfo] = useState(false);

  return (
    <Container maxWidth="xl" className="py-8">
      <Paper className="bg-black/50 backdrop-blur-md p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="flex items-center gap-2">
            <FaCoins className="text-yellow-400" /> Curator Earnings
          </Typography>
          <Button
            startIcon={<FaInfoCircle />}
            onClick={() => setShowEthicsInfo(!showEthicsInfo)}
            className="text-white"
          >
            Ethics Score: {metrics.ethicalScore}%
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EarningsCard metrics={metrics} />
          <ArtistSupportCard artists={supportedArtists} onSupport={id => {
            fetcher.submit(
              { action: "directSupport", artistId: id },
              { method: "post" }
            );
          }} />
          <TransparencyCard metrics={metrics} />
        </div>

        {showEthicsInfo && <EthicsInfoPanel metrics={metrics} />}
      </Paper>
    </Container>
  );
}

function EarningsCard({ metrics }: { metrics: EarningMetrics }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <Typography variant="h6" className="flex items-center gap-2 mb-4">
        <FaChartLine /> Total Earnings
      </Typography>
      <Typography variant="h3" className="mb-2">
        ${metrics.totalEarned.toLocaleString()}
      </Typography>
      <div className="space-y-4">
        <MetricItem
          label="Direct Support"
          value={metrics.artistSupport.directSupport}
          total={metrics.totalEarned}
        />
        <MetricItem
          label="Streaming Royalties"
          value={metrics.artistSupport.streamingRoyalties}
          total={metrics.totalEarned}
        />
        <MetricItem
          label="Merchandise"
          value={metrics.artistSupport.merchandiseSales}
          total={metrics.totalEarned}
        />
      </div>
    </motion.div>
  );
}

function MetricItem({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = (value / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>${value.toLocaleString()}</span>
      </div>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        className="h-1"
      />
    </div>
  );
}

// Additional component implementations...
