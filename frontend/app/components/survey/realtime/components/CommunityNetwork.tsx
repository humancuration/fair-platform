import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaNetworkWired, FaProjectDiagram } from 'react-icons/fa';
import ForceGraph2D from 'react-force-graph-2d';

interface CommunityNetworkProps {
  connections: {
    nodes: {
      id: string;
      name: string;
      group: string;
      influence: number;
      connections: number;
      activity: number;
    }[];
    links: {
      source: string;
      target: string;
      strength: number;
      type: "collaboration" | "discussion" | "support";
    }[];
    clusters: {
      id: string;
      name: string;
      size: number;
      density: number;
    }[];
  };
  interactive: boolean;
}

export const CommunityNetwork: React.FC<CommunityNetworkProps> = ({
  connections,
  interactive
}) => {
  const graphRef = useRef();

  useEffect(() => {
    // Initialize force graph with quantum-inspired physics
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-120);
      graphRef.current.d3Force('link').distance(link => 100 / (link.strength || 1));
      
      // Add quantum-like fluctuations to node positions
      const quantumJitter = setInterval(() => {
        connections.nodes.forEach(node => {
          if (Math.random() > 0.7) {
            node.x += (Math.random() - 0.5) * node.influence;
            node.y += (Math.random() - 0.5) * node.influence;
          }
        });
        graphRef.current.refresh();
      }, 1000);

      return () => clearInterval(quantumJitter);
    }
  }, [connections]);

  return (
    <motion.div 
      className="community-network bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaNetworkWired className="mr-2" /> Community Network
        </h3>
      </div>

      {/* Network Visualization */}
      <div className="h-[400px] bg-gray-50 rounded">
        <ForceGraph2D
          ref={graphRef}
          graphData={connections}
          nodeAutoColorBy="group"
          nodeRelSize={node => 6 + node.influence * 2}
          linkWidth={link => link.strength}
          linkColor={link => {
            switch(link.type) {
              case "collaboration": return "#4f46e5";
              case "discussion": return "#059669";
              case "support": return "#dc2626";
              default: return "#6b7280";
            }
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            // Draw quantum-inspired node glow
            const size = 6 + node.influence * 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Add activity ripple effect
            if (node.activity > 0.5) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size * (1 + node.activity), 0, 2 * Math.PI);
              ctx.strokeStyle = `${node.color}44`;
              ctx.stroke();
            }
          }}
          enableNodeDrag={interactive}
          onNodeClick={node => {
            if (interactive) {
              // Trigger quantum-like ripple effect
              node.activity = 1;
              setTimeout(() => node.activity = 0, 1000);
              graphRef.current.refresh();
            }
          }}
        />
      </div>

      {/* Network Metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {connections.clusters.map(cluster => (
          <div key={cluster.id} className="p-2 bg-gray-50 rounded text-sm">
            <div className="font-medium">{cluster.name}</div>
            <div className="text-gray-500">
              Size: {cluster.size} • Density: {(cluster.density * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
