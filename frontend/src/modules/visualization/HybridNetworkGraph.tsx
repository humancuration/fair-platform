import React, { useRef, useState, useEffect } from 'react';
import { Network, DataSet } from 'vis-network';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalNode {
  id: string;
  label: string;
  region: string;
  type: 'region' | 'hub' | 'major_supplier';
  scale: 'global' | 'regional' | 'local';
  connections: number;
}

interface DetailedNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'supplier' | 'manufacturer' | 'distributor';
  certifications: string[];
  metrics: {
    sustainability: number;
    reliability: number;
    quality: number;
  };
}

export const HybridNetworkGraph: React.FC = () => {
  const globalContainerRef = useRef<HTMLDivElement>(null);
  const detailContainerRef = useRef<SVGSVGElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<'global' | 'regional' | 'local'>('global');
  const [networkInstance, setNetworkInstance] = useState<Network | null>(null);

  // Initialize global view with vis-network
  useEffect(() => {
    if (!globalContainerRef.current || selectedRegion) return;

    const nodes = new DataSet<GlobalNode>([/* Global nodes */]);
    const edges = new DataSet([/* Global connections */]);

    const options = {
      nodes: {
        shape: 'dot',
        size: 30,
        font: { size: 12 },
        scaling: {
          label: { enabled: true }
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
        zoomView: true,
        dragView: true
      }
    };

    const network = new Network(
      globalContainerRef.current,
      { nodes, edges },
      options
    );

    network.on('click', (params) => {
      if (params.nodes.length) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId);
        handleNodeClick(node);
      }
    });

    setNetworkInstance(network);
  }, [selectedRegion]);

  // Initialize detailed view with D3
  useEffect(() => {
    if (!detailContainerRef.current || !selectedRegion) return;

    const svg = d3.select(detailContainerRef.current);
    const width = svg.node()?.getBoundingClientRect().width || 800;
    const height = svg.node()?.getBoundingClientRect().height || 600;

    // D3 force simulation for detailed view
    const simulation = d3.forceSimulation<DetailedNode>()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Add detailed visualization elements
    // ...

    return () => {
      simulation.stop();
    };
  }, [selectedRegion]);

  const handleNodeClick = async (node: GlobalNode) => {
    if (node.scale === 'global') {
      // Zoom into region
      setZoomLevel('regional');
      setSelectedRegion(node.id);
      await fetchRegionalData(node.id);
    } else if (node.scale === 'regional') {
      // Zoom into local network
      setZoomLevel('local');
      await fetchLocalData(node.id);
    }
  };

  const handleBackClick = () => {
    if (zoomLevel === 'local') {
      setZoomLevel('regional');
    } else if (zoomLevel === 'regional') {
      setZoomLevel('global');
      setSelectedRegion(null);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <AnimatePresence>
        {!selectedRegion && (
          <motion.div
            ref={globalContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          />
        )}

        {selectedRegion && (
          <motion.svg
            ref={detailContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          />
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleBackClick}
          disabled={zoomLevel === 'global'}
          className="px-4 py-2 bg-white shadow rounded"
        >
          Back to {zoomLevel === 'local' ? 'Regional' : 'Global'} View
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <NetworkMetrics zoomLevel={zoomLevel} region={selectedRegion} />
      </div>
    </div>
  );
};

const NetworkMetrics: React.FC<{ zoomLevel: string; region: string | null }> = ({
  zoomLevel,
  region
}) => {
  // Render relevant metrics based on zoom level
  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Metrics content */}
    </div>
  );
};
