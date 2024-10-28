import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { FaExpand, FaCompress, FaSearch, FaFilter } from "react-icons/fa";

interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  level?: number;
  title?: string;
  physics?: boolean;
}

interface NetworkEdge {
  from: string;
  to: string;
  label?: string;
  value?: number;
  arrows?: 'to' | 'from' | 'middle' | { to: boolean };
  dashes?: boolean;
  smooth?: {
    type: 'curvedCW' | 'curvedCCW' | 'continuous';
    roundness?: number;
  };
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  height?: string;
  physics?: boolean;
  clusters?: boolean;
}

export function NetworkGraph({
  nodes,
  edges,
  onNodeClick,
  onEdgeClick,
  height = '400px',
  physics = true,
  clusters = true,
}: NetworkGraphProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!networkRef.current) return;

    const nodesDataSet = new DataSet(nodes);
    const edgesDataSet = new DataSet(edges);

    const groups = [...new Set(nodes.filter(n => n.group).map(n => n.group!))];
    const colors = generateColors(groups.length);
    
    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          size: 12,
          color: '#ffffff',
        },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        width: 2,
        color: { inherit: 'both' },
        smooth: {
          type: 'continuous',
        },
      },
      physics: {
        enabled: physics,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
        },
        stabilization: {
          iterations: 2500,
        },
      },
      groups: Object.fromEntries(
        groups.map((group, i) => [
          group,
          {
            color: {
              background: colors[i],
              border: colors[i],
              highlight: { background: colors[i], border: colors[i] },
            },
          },
        ])
      ),
      interaction: {
        hover: true,
        tooltipDelay: 300,
      },
      layout: {
        improvedLayout: true,
        hierarchical: clusters ? {
          enabled: true,
          direction: 'UD',
          sortMethod: 'hubsize',
        } : false,
      },
    };

    networkInstanceRef.current = new Network(
      networkRef.current,
      { nodes: nodesDataSet, edges: edgesDataSet },
      options
    );

    networkInstanceRef.current.on('click', (params) => {
      if (params.nodes.length > 0 && onNodeClick) {
        onNodeClick(params.nodes[0]);
      }
      if (params.edges.length > 0 && onEdgeClick) {
        onEdgeClick(params.edges[0]);
      }
    });

    return () => {
      networkInstanceRef.current?.destroy();
    };
  }, [nodes, edges, physics, clusters]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!networkInstanceRef.current) return;

    if (term) {
      const matchingNodes = nodes.filter(node => 
        node.label.toLowerCase().includes(term.toLowerCase())
      );
      networkInstanceRef.current.selectNodes(matchingNodes.map(n => n.id));
      if (matchingNodes.length > 0) {
        networkInstanceRef.current.focus(matchingNodes[0].id, {
          scale: 1.2,
          animation: true,
        });
      }
    } else {
      networkInstanceRef.current.unselectAll();
    }
  };

  const toggleGroup = (group: string) => {
    const newGroups = new Set(selectedGroups);
    if (newGroups.has(group)) {
      newGroups.delete(group);
    } else {
      newGroups.add(group);
    }
    setSelectedGroups(newGroups);

    if (!networkInstanceRef.current) return;

    const visibleNodes = nodes.filter(node => 
      !node.group || newGroups.size === 0 || newGroups.has(node.group)
    );
    networkInstanceRef.current.selectNodes(visibleNodes.map(n => n.id));
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg backdrop-blur-sm p-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search nodes..."
            className="bg-transparent border-none focus:ring-0 text-sm w-32"
          />
          <FaSearch className="text-gray-400" />
        </div>
        
        {clusters && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => networkInstanceRef.current?.fit()}
            className="p-2 bg-gray-900/80 rounded-lg backdrop-blur-sm"
            title="Fit to view"
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </motion.button>
        )}
      </div>

      {nodes.some(n => n.group) && (
        <div className="absolute top-2 left-2 z-10">
          <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg backdrop-blur-sm p-2">
            <FaFilter className="text-gray-400" />
            <div className="flex gap-1">
              {[...new Set(nodes.filter(n => n.group).map(n => n.group!))]
                .map(group => (
                  <motion.button
                    key={group}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleGroup(group)}
                    className={`px-2 py-1 rounded text-xs ${
                      selectedGroups.has(group) ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  >
                    {group}
                  </motion.button>
                ))}
            </div>
          </div>
        </div>
      )}

      <div 
        ref={networkRef} 
        style={{ height }} 
        className="rounded-lg border border-white/10"
      />
    </div>
  );
}

function generateColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => 
    `hsl(${(i * 360) / count}, 70%, 60%)`
  );
}
