import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaReply, FaBranch, FaCodeBranch, FaArrowRight, 
  FaNetworkWired, FaGlobe, FaRobot 
} from "react-icons/fa";
import { RichMediaPost } from "./RichMediaPost";
import type { ThreadNode, ThreadBranch } from "~/types/forum";

interface ThreadVisualizationProps {
  rootPost: ThreadNode;
  branches: ThreadBranch[];
  federatedReplies?: {
    instanceUrl: string;
    replyCount: number;
    lastReplyTimestamp: string;
  }[];
  aiGeneratedBranches?: {
    branchId: string;
    confidence: number;
    reasoningPath: string[];
  }[];
  onReply?: (parentId: string) => void;
  onBranchSelect?: (branchId: string) => void;
  onFederatedExpand?: (instanceUrl: string) => void;
}

export function ThreadVisualization({
  rootPost,
  branches,
  federatedReplies,
  aiGeneratedBranches,
  onReply,
  onBranchSelect,
  onFederatedExpand,
}: ThreadVisualizationProps) {
  const [expandedBranches, setExpandedBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(false);

  const toggleBranch = (branchId: string) => {
    setExpandedBranches(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const renderBranchLines = (depth: number, isLast: boolean) => (
    <div className="absolute left-0 top-0 bottom-0 flex">
      {Array.from({ length: depth }).map((_, i) => (
        <div
          key={i}
          className={`
            w-px bg-gradient-to-b from-purple-500/50 to-blue-500/50
            ${isLast && i === depth - 1 ? 'h-1/2' : 'h-full'}
            mx-6
          `}
        />
      ))}
    </div>
  );

  const renderThread = (node: ThreadNode, depth = 0, branchId?: string) => {
    const branch = branches.find(b => b.id === branchId);
    const isExpanded = expandedBranches.includes(branchId || '');
    const hasAIInsights = aiGeneratedBranches?.some(b => b.branchId === branchId);
    const federatedInfo = federatedReplies?.find(f => 
      node.federatedReplies?.includes(f.instanceUrl)
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <div className="relative pl-16">
          {depth > 0 && renderBranchLines(depth, !node.replies?.length)}
          
          <div className={`
            rounded-lg border
            ${selectedBranch === branchId ? 'border-purple-500' : 'border-white/10'}
            ${hasAIInsights ? 'bg-purple-900/10' : 'bg-white/5'}
          `}>
            <RichMediaPost {...node.post} />

            {/* Branch Info */}
            {branch && (
              <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaBranch className="text-purple-400" />
                  <span className="text-sm font-medium">{branch.name}</span>
                  {hasAIInsights && (
                    <FaRobot className="text-blue-400" />
                  )}
                </div>
                <button
                  onClick={() => onBranchSelect?.(branch.id)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  View Branch
                </button>
              </div>
            )}

            {/* Federation Info */}
            {federatedInfo && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="px-4 py-2 border-t border-white/10"
              >
                <button
                  onClick={() => onFederatedExpand?.(federatedInfo.instanceUrl)}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  <FaGlobe />
                  <span>
                    {federatedInfo.replyCount} replies from {federatedInfo.instanceUrl}
                  </span>
                  <FaArrowRight className="ml-auto" />
                </button>
              </motion.div>
            )}

            {/* Reply Actions */}
            <div className="px-4 py-2 border-t border-white/10 flex justify-between">
              <button
                onClick={() => onReply?.(node.id)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                <FaReply />
                Reply
              </button>
              {node.replies?.length > 0 && (
                <button
                  onClick={() => toggleBranch(branchId || node.id)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  <FaCodeBranch />
                  {node.replies.length} Replies
                </button>
              )}
            </div>
          </div>

          {/* Nested Replies */}
          <AnimatePresence>
            {isExpanded && node.replies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-4"
              >
                {node.replies.map((reply, i) => (
                  <div key={reply.id}>
                    {renderThread(reply, depth + 1, reply.branchId)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Thread Visualization */}
      {renderThread(rootPost)}

      {/* AI Insights Panel */}
      {aiGeneratedBranches && aiGeneratedBranches.length > 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: showAIInsights ? 'auto' : '40px' }}
          className="bg-purple-900/20 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className="w-full px-4 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FaNetworkWired className="text-purple-400" />
              <span>AI Thread Analysis</span>
            </div>
            <FaArrowRight
              className={`transform transition-transform ${
                showAIInsights ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {showAIInsights && (
            <div className="p-4 space-y-4">
              {aiGeneratedBranches.map(branch => (
                <div
                  key={branch.branchId}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Branch Analysis</span>
                    <span className="text-sm">
                      {(branch.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1">
                    {branch.reasoningPath.map((step, i) => (
                      <li key={i} className="text-sm opacity-80">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
