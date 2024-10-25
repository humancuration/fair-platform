import React, { useEffect, useRef } from 'react';
import { Network, DataSet, Node, Edge, Options } from 'vis-network/standalone';
import { motion } from 'framer-motion';

interface NetworkNode extends Node {
  label: string;
  group?: string;
  title?: string;
}

interface NetworkEdge extends Edge {
  label?: string;
  width?: number;
  color?: string;
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  options?: Options;
  height?: string;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  edges,
  options = {},
  height = '500px',
  onNodeClick,
  onEdgeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodesDataSet = new DataSet(nodes);
    const edgesDataSet = new DataSet(edges);

    const defaultOptions: Options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          size: 12,
          color: '#ffffff'
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        color: { inherit: 'both' },
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200
      }
    };

    networkRef.current = new Network(
      containerRef.current,
      { nodes: nodesDataSet, edges: edgesDataSet },
      { ...defaultOptions, ...options }
    );

    if (onNodeClick) {
      networkRef.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          onNodeClick(params.nodes[0]);
        }
      });
    }

    if (onEdgeClick) {
      networkRef.current.on('click', (params) => {
        if (params.edges.length > 0) {
          onEdgeClick(params.edges[0]);
        }
      });
    }

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [nodes, edges, options, onNodeClick, onEdgeClick]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div ref={containerRef} style={{ height, width: '100%' }} />
    </motion.div>
  );
};

export default NetworkGraph;
