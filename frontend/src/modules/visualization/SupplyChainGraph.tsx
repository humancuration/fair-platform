import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { FETCH_SUPPLY_CHAIN_DATA } from '@/graphql/queries';

interface SupplyChainNode {
  id: string;
  type: 'supplier' | 'manufacturer' | 'distributor' | 'retailer' | 'material';
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  certifications: string[];
  sustainabilityScore: number;
  carbonFootprint: number;
  timestamp: string;
  blockchainProof: string;
}

interface SupplyChainLink {
  source: string;
  target: string;
  type: 'material' | 'processing' | 'transport';
  transportMethod?: string;
  carbonEmission: number;
  verificationStatus: 'verified' | 'pending' | 'disputed';
  transactionHash: string;
  timestamp: string;
}

interface SupplyChainGraphProps {
  productId: string;
  onNodeClick?: (node: SupplyChainNode) => void;
  onPathHighlight?: (path: SupplyChainNode[]) => void;
}

export const SupplyChainGraph: React.FC<SupplyChainGraphProps> = ({
  productId,
  onNodeClick,
  onPathHighlight
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[Date, Date]>([new Date(), new Date()]);

  const { data, loading } = useQuery(FETCH_SUPPLY_CHAIN_DATA, {
    variables: { productId, timeRange }
  });

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 1200;
    const height = 800;
    const svg = d3.select(svgRef.current);

    // Clear previous rendering
    svg.selectAll('*').remove();

    // Create force simulation
    const simulation = d3.forceSimulation<SupplyChainNode>(data.nodes)
      .force('link', d3.forceLink<SupplyChainNode, SupplyChainLink>(data.links)
        .id(d => d.id)
        .distance(link => calculateLinkDistance(link)))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create container for map visualization
    const container = svg.append('g');
    
    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Create links with multiple visual channels
    const links = container.append('g')
      .selectAll('path')
      .data(data.links)
      .join('path')
      .attr('class', 'supply-chain-link')
      .attr('stroke-width', link => Math.sqrt(link.carbonEmission))
      .attr('stroke', link => getColorByVerificationStatus(link.verificationStatus))
      .on('mouseover', (event, link) => {
        showLinkDetails(link);
      });

    // Create nodes with type-specific styling
    const nodes = container.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('class', 'supply-chain-node')
      .call(d3.drag<SVGGElement, SupplyChainNode>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Add node visuals
    nodes.append('circle')
      .attr('r', node => getNodeRadius(node))
      .attr('fill', node => getNodeColor(node))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add node labels
    nodes.append('text')
      .text(d => d.name)
      .attr('dy', 30)
      .attr('text-anchor', 'middle');

    // Add certification badges
    nodes.each(function(node) {
      const nodeGroup = d3.select(this);
      node.certifications.forEach((cert, i) => {
        nodeGroup.append('image')
          .attr('href', getCertificationIcon(cert))
          .attr('x', -20 + (i * 15))
          .attr('y', -40)
          .attr('width', 12)
          .attr('height', 12);
      });
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('d', link => generateLinkPath(link));

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Handle node selection
    nodes.on('click', (event, node) => {
      highlightSupplyPath(node);
      if (onNodeClick) onNodeClick(node);
    });

  }, [data, timeRange]);

  const highlightSupplyPath = (node: SupplyChainNode) => {
    const path = findCompletePath(node, data.links);
    setSelectedPath(path.map(n => n.id));
    if (onPathHighlight) onPathHighlight(path);
  };

  return (
    <div className="supply-chain-visualization">
      <motion.div 
        className="controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <TimeRangeSelector onChange={setTimeRange} />
        <FilterControls />
        <LegendPanel />
      </motion.div>

      <svg
        ref={svgRef}
        className="supply-chain-graph"
        style={{ width: '100%', height: '800px' }}
      />

      <BlockchainVerificationPanel 
        selectedPath={selectedPath}
        data={data}
      />
    </div>
  );
};

// Helper components and functions...
const TimeRangeSelector = ({ onChange }) => {
  // Implementation
};

const FilterControls = () => {
  // Implementation
};

const LegendPanel = () => {
  // Implementation
};

const BlockchainVerificationPanel = ({ selectedPath, data }) => {
  // Implementation
};

// Helper functions
const calculateLinkDistance = (link: SupplyChainLink) => {
  // Implementation
};

const getColorByVerificationStatus = (status: string) => {
  // Implementation
};

const getNodeRadius = (node: SupplyChainNode) => {
  // Implementation
};

const getNodeColor = (node: SupplyChainNode) => {
  // Implementation
};

const getCertificationIcon = (certification: string) => {
  // Implementation
};

const generateLinkPath = (link: SupplyChainLink) => {
  // Implementation
};

const findCompletePath = (node: SupplyChainNode, links: SupplyChainLink[]) => {
  // Implementation
};
