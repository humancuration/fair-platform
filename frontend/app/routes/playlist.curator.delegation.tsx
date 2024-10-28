import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Paper, Typography, Avatar, Button, LinearProgress } from "@mui/material";
import { FaUserShield, FaVoteYea, FaChartLine, FaNetworkWired, FaBrain } from "react-icons/fa";
import type { Delegate, DelegationMetrics } from "~/types/curator";
import { toast } from "react-toastify";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [delegates, metrics] = await Promise.all([
    fetch('/api/delegation/delegates').then(res => res.json()),
    fetch('/api/delegation/metrics').then(res => res.json())
  ]);

  return json({ delegates, metrics });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const { action, delegateId } = Object.fromEntries(formData);

  switch (action) {
    case "delegate":
      await fetch('/api/delegation/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delegateId })
      });
      break;
    case "revoke":
      await fetch(`/api/delegation/revoke/${delegateId}`, { method: 'POST' });
      break;
  }

  return json({ success: true });
};

export default function CuratorDelegationRoute() {
  const { delegates, metrics } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleDelegate = (delegateId: string, isDelegating: boolean) => {
    fetcher.submit(
      { 
        action: isDelegating ? "delegate" : "revoke", 
        delegateId 
      },
      { method: "post" }
    );
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Paper className="bg-black/50 backdrop-blur-md p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="flex items-center gap-2">
            <FaUserShield /> Curator Delegation System
          </Typography>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <FaVoteYea />
              {metrics?.activeDelegations} Active Delegations
            </span>
            <span className="flex items-center gap-2">
              <FaChartLine />
              {metrics?.averageTrustScore.toFixed(1)} Avg Trust Score
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {delegates.map((delegate) => (
              <DelegateCard
                key={delegate.id}
                delegate={delegate}
                onDelegate={(isDelegating) => handleDelegate(delegate.id, isDelegating)}
              />
            ))}
          </AnimatePresence>
        </div>

        {metrics && <DelegationMetricsDisplay metrics={metrics} />}
      </Paper>
    </Container>
  );
}

function DelegateCard({ delegate, onDelegate }: { 
  delegate: Delegate; 
  onDelegate: (isDelegating: boolean) => void;
}) {
  const isDelegated = false; // TODO: Get from user context

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        bg-gradient-to-br rounded-xl p-6
        ${delegate.type === 'ai' ? 'from-purple-900/30 to-blue-900/30' : 
          delegate.type === 'hybrid' ? 'from-green-900/30 to-blue-900/30' :
          'from-orange-900/30 to-red-900/30'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={delegate.avatar}
            alt={delegate.name}
            className="w-16 h-16"
          />
          <div>
            <Typography variant="h6">{delegate.name}</Typography>
            <div className="flex items-center gap-2 text-sm opacity-80">
              {delegate.type === 'ai' && <FaBrain />}
              <span>{delegate.type.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Typography variant="h6">
            {delegate.votingPower + delegate.delegatedPower} VP
          </Typography>
          <Typography variant="caption" className="opacity-70">
            {delegate.delegators} delegators
          </Typography>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Trust Score</span>
          <span>{delegate.trustScore}%</span>
        </div>
        <LinearProgress 
          variant="determinate" 
          value={delegate.trustScore} 
          className="h-1"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {delegate.expertise.map(exp => (
          <span
            key={exp}
            className="px-2 py-1 bg-white/10 rounded-full text-xs"
          >
            {exp}
          </span>
        ))}
      </div>

      <Button
        fullWidth
        variant="contained"
        onClick={() => onDelegate(!isDelegated)}
        className={isDelegated ? 'bg-red-500' : 'bg-blue-500'}
      >
        {isDelegated ? 'Revoke Delegation' : 'Delegate'}
      </Button>
    </motion.div>
  );
}

function DelegationMetricsDisplay({ metrics }: { metrics: DelegationMetrics }) {
  return (
    <Paper className="mt-6 p-4 bg-black/30">
      <Typography variant="h6" className="flex items-center gap-2 mb-4">
        <FaNetworkWired /> Delegation Network
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Typography variant="subtitle1" className="mb-2">
            Top Genres by Delegates
          </Typography>
          {metrics.topGenres.map(genre => (
            <div
              key={genre.genre}
              className="flex justify-between items-center mb-2"
            >
              <span>{genre.genre}</span>
              <span>{genre.delegates} delegates</span>
            </div>
          ))}
        </div>
        
        <div>
          <Typography variant="subtitle1" className="mb-2">
            Delegation Chain Lengths
          </Typography>
          {metrics.delegationChains.map(chain => (
            <div
              key={chain.length}
              className="flex justify-between items-center mb-2"
            >
              <span>{chain.length} hops</span>
              <span>{chain.count} chains</span>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
}
