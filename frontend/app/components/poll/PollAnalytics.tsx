import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaBrain, FaUsers, FaLightbulb } from 'react-icons/fa';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import ForceGraph2D from 'react-force-graph-2d';

interface PollAnalyticsProps {
  pollId: string;
  data: {
    responses: {
      optionId: string;
      timestamp: number;
      userId: string;
      metadata?: {
        device: string;
        location: string;
        duration: number;
      };
    }[];
    demographics?: {
      age: Record<string, number>;
      location: Record<string, number>;
      platform: Record<string, number>;
    };
    trends: {
      hourly: Record<string, number>;
      daily: Record<string, number>;
      weekly: Record<string, number>;
    };
    insights: {
      id: string;
      type: 'pattern' | 'anomaly' | 'correlation';
      description: string;
      confidence: number;
      relatedData: string[];
    }[];
  };
  config: {
    realTime: boolean;
    aiAssisted: boolean;
    visualizations: string[];
  };
}

export const PollAnalytics: React.FC<PollAnalyticsProps> = ({
  pollId,
  data,
  config
}) => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const particlesConfig = {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: "#4f46e5" },
      opacity: { value: 0.3, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        out_mode: "out"
      }
    }
  };

  return (
    <motion.div 
      className="poll-analytics bg-white rounded-lg shadow-lg p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Particles
        id="pollAnalyticsParticles"
        init={particlesInit}
        options={particlesConfig}
        className="absolute inset-0"
      />

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaChartLine className="mr-2" /> Poll Analytics
        </h2>

        {/* Response Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Response Timeline</h3>
          <div className="h-48 bg-gray-50 rounded">
            {/* Add your preferred charting library component here */}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FaBrain className="mr-2" /> AI Insights
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.insights.map(insight => (
              <motion.div
                key={insight.id}
                className={`p-4 rounded-lg border-2 ${
                  selectedInsight === insight.id ? 'border-blue-500' : 'border-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedInsight(insight.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{insight.type}</span>
                  <span className="text-sm text-gray-500">
                    {insight.confidence * 100}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demographic Distribution */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {data.demographics && Object.entries(data.demographics).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 rounded">
              <h4 className="text-sm font-medium mb-2 capitalize">{key}</h4>
              {/* Add visualization for each demographic metric */}
            </div>
          ))}
        </div>

        {/* Response Network */}
        <div className="h-[400px] bg-gray-50 rounded">
          <ForceGraph2D
            graphData={graphData}
            nodeAutoColorBy="group"
            nodeRelSize={6}
            linkWidth={2}
            linkColor={() => "#4f46e5"}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const size = 6;
              ctx.beginPath();
              ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
              ctx.fillStyle = node.color;
              ctx.fill();
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
