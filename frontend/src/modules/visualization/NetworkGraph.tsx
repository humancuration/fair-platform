import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

interface Node {
  id: string;
  label: string;
  size?: number;
  color?: string;
  trustScore?: number;
}

interface Edge {
  from: string;
  to: string;
  label?: string;
  width?: number;
  bidirectional?: boolean;
}

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, edges, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !nodes || !edges) return;

    const nodesDataSet = new DataSet(
      nodes.map(node => ({
        ...node,
        value: node.size,
        title: `Trust Score: ${(node.trustScore || 0).toFixed(2)}`,
      }))
    );

    const edgesDataSet = new DataSet(
      edges.map(edge => ({
        ...edge,
        arrows: edge.bidirectional ? 'to, from' : 'to',
        value: edge.width,
      }))
    );

    const options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30,
        },
        font: {
          size: 12,
          face: 'Arial',
        },
      },
      edges: {
        width: 1,
        smooth: {
          type: 'continuous',
        },
        font: {
          size: 8,
          align: 'middle',
        },
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    };

    networkRef.current = new Network(
      containerRef.current,
      { nodes: nodesDataSet, edges: edgesDataSet },
      options
    );

    if (onNodeClick) {
      networkRef.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          onNodeClick(params.nodes[0]);
        }
      });
    }

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [nodes, edges, onNodeClick]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[500px] bg-white rounded-lg border border-gray-200"
    />
  );
};

export default NetworkGraph;
