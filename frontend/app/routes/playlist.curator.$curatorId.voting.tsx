import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Paper, Typography, Avatar, LinearProgress, Button } from "@mui/material";
import { 
  FaVoteYea, FaBrain, FaUserShield, FaExclamationTriangle, 
  FaHistory, FaChartLine 
} from "react-icons/fa";
import { useState } from "react";
import type { VotingPower, VoteHistory, AIVoterRegistration } from "~/types/voting";
import { toast } from "react-toastify";

interface LoaderData {
  votingPower: VotingPower;
  voteHistory: VoteHistory[];
  aiVoters: AIVoterRegistration[];
  suspiciousActivity: boolean;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [votingPower, voteHistory, aiVoters] = await Promise.all([
    fetch(`/api/voting/${params.curatorId}/power`).then(res => res.json()),
    fetch(`/api/voting/${params.curatorId}/history`).then(res => res.json()),
    fetch(`/api/voting/${params.curatorId}/ai-voters`).then(res => res.json())
  ]);

  // Analyze voting patterns for suspicious activity
  const suspiciousActivity = await analyzeVotingPatterns(voteHistory);

  return json({ votingPower, voteHistory, aiVoters, suspiciousActivity });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const { action, aiVoterId } = Object.fromEntries(formData);

  switch (action) {
    case "register_ai":
      await fetch('/api/voting/register-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiVoterId })
      });
      break;
    case "revoke_ai":
      await fetch(`/api/voting/revoke-ai/${aiVoterId}`, { method: 'POST' });
      break;
  }

  return json({ success: true });
};

export default function VotingSystemRoute() {
  const { votingPower, voteHistory, aiVoters, suspiciousActivity } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showAIRegistration, setShowAIRegistration] = useState(false);

  return (
    <Container maxWidth="xl" className="py-8">
      <Paper className="bg-black/50 backdrop-blur-md p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="flex items-center gap-2">
            <FaVoteYea /> Voting System
          </Typography>
          <Button
            startIcon={<FaBrain />}
            onClick={() => setShowAIRegistration(!showAIRegistration)}
            variant="contained"
            className="bg-purple-500/20"
          >
            Register AI Voter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VotingPowerCard votingPower={votingPower} />
          <VoteHistoryCard voteHistory={voteHistory} />
          <AIVotersCard 
            aiVoters={aiVoters} 
            onManageAI={(id, action) => {
              fetcher.submit(
                { action: action === 'register' ? 'register_ai' : 'revoke_ai', aiVoterId: id },
                { method: 'post' }
              );
            }}
          />
        </div>

        {suspiciousActivity && <SuspiciousActivityWarning />}
        
        {showAIRegistration && (
          <AIRegistrationForm 
            onClose={() => setShowAIRegistration(false)}
            onSubmit={(data) => {
              fetcher.submit(
                { action: 'register_ai', ...data },
                { method: 'post' }
              );
            }}
          />
        )}
      </Paper>
    </Container>
  );
}

function VotingPowerCard({ votingPower }: { votingPower: VotingPower }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <Typography variant="h6" className="flex items-center gap-2 mb-4">
        <FaUserShield /> Voting Power
      </Typography>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Total Power</span>
            <span>{votingPower.total}</span>
          </div>
          <LinearProgress 
            variant="determinate" 
            value={(votingPower.total / 100) * 100} 
            className="h-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="caption" className="opacity-70">Base</Typography>
            <Typography variant="h6">{votingPower.base}</Typography>
          </div>
          <div>
            <Typography variant="caption" className="opacity-70">Reputation</Typography>
            <Typography variant="h6">{votingPower.reputation}</Typography>
          </div>
          <div>
            <Typography variant="caption" className="opacity-70">Specialization</Typography>
            <Typography variant="h6">{votingPower.specialization}</Typography>
          </div>
          <div>
            <Typography variant="caption" className="opacity-70">Time Weight</Typography>
            <Typography variant="h6">{votingPower.timeWeight}</Typography>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VoteHistoryCard({ voteHistory }: { voteHistory: VoteHistory[] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <Typography variant="h6" className="flex items-center gap-2 mb-4">
        <FaHistory /> Recent Votes
      </Typography>

      <div className="space-y-3">
        <AnimatePresence>
          {voteHistory.map(vote => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <div className="flex justify-between">
                <div>
                  <Typography variant="subtitle2">
                    {vote.type} Vote
                  </Typography>
                  <Typography variant="caption" className="opacity-70">
                    {vote.target}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="subtitle2">
                    {vote.power} VP
                  </Typography>
                  <Typography variant="caption" className="opacity-70">
                    {new Date(vote.timestamp).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Additional component implementations...
