import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Points } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import * as THREE from "three";
import { FaLightbulb, FaUsers, FaIndustry, FaSeedling, FaGlobe } from "react-icons/fa";

interface PatentNode {
  id: string;
  title: string;
  description: string;
  stage: "research" | "development" | "prototype" | "implementation" | "deployed";
  type: "invention" | "process" | "software" | "design";
  category: "sustainable" | "social" | "digital" | "scientific" | "industrial";
  position: [number, number, number];
  connections: {
    id: string;
    type: "builds_on" | "inspired_by" | "used_by" | "collaborates_with";
    strength: number;
  }[];
  contributors: {
    id: string;
    name: string;
    role: string;
    shares: number;
  }[];
  impact: {
    environmental: number;
    social: number;
    economic: number;
    scientific: number;
  };
  metrics: {
    implementations: number;
    derivatives: number;
    communities: number;
    revenue: number;
  };
  resources: {
    documentation: string;
    code?: string;
    designs?: string;
    prototypes?: string[];
  };
}

const stageColors = {
  research: "#4CAF50",
  development: "#2196F3",
  prototype: "#9C27B0",
  implementation: "#FF9800",
  deployed: "#00BCD4"
};

const categoryIcons = {
  sustainable: <FaSeedling className="text-green-500" />,
  social: <FaUsers className="text-blue-500" />,
  digital: <FaLightbulb className="text-purple-500" />,
  scientific: <FaGlobe className="text-orange-500" />,
  industrial: <FaIndustry className="text-gray-500" />
};

function PatentNodeMesh({ 
  node, 
  onSelect 
}: { 
  node: PatentNode; 
  onSelect: (node: PatentNode) => void 
}) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const glow = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (mesh.current && glow.current) {
      // Floating animation
      mesh.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.001;
      
      // Glow pulse based on impact
      const totalImpact = Object.values(node.impact).reduce((a, b) => a + b, 0);
      const pulseIntensity = 0.1 * (totalImpact / 400); // Normalize to max impact
      glow.current.scale.setScalar(
        1 + Math.sin(clock.getElapsedTime() * 3) * pulseIntensity
      );
    }
  });

  // Calculate node size based on metrics
  const nodeSize = 0.5 + 
    (node.metrics.implementations * 0.1) +
    (node.metrics.derivatives * 0.05) +
    (node.metrics.communities * 0.02);

  return (
    <group position={new THREE.Vector3(...node.position)}>
      {/* Glow effect */}
      <mesh ref={glow}>
        <sphereGeometry args={[nodeSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={stageColors[node.stage]}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Main node */}
      <mesh
        ref={mesh}
        onClick={() => onSelect(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[nodeSize, 32, 32]} />
        <meshPhongMaterial
          color={stageColors[node.stage]}
          emissive={stageColors[node.stage]}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Info label */}
      {hovered && (
        <Html>
          <div className="bg-white/90 p-3 rounded-lg shadow-lg">
            <h3 className="font-bold">{node.title}</h3>
            <div className="flex items-center gap-2 text-sm">
              {categoryIcons[node.category]}
              <span className="capitalize">{node.stage}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionLines({ nodes }: { nodes: PatentNode[] }) {
  const lines = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    if (!lines.current) return;

    const positions: number[] = [];
    const colors: number[] = [];

    nodes.forEach(node => {
      node.connections.forEach(connection => {
        const target = nodes.find(n => n.id === connection.id);
        if (target) {
          positions.push(...node.position, ...target.position);
          
          // Color based on connection type
          const color = new THREE.Color(
            connection.type === "builds_on" ? "#4CAF50" :
            connection.type === "inspired_by" ? "#2196F3" :
            connection.type === "used_by" ? "#9C27B0" :
            "#FF9800"
          );
          
          colors.push(color.r, color.g, color.b);
          colors.push(color.r, color.g, color.b);
        }
      });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    lines.current.geometry = geometry;
  }, [nodes]);

  return (
    <lineSegments ref={lines}>
      <lineBasicMaterial vertexColors transparent opacity={0.3} />
    </lineSegments>
  );
}

export function PatentVisualization() {
  const [selectedNode, setSelectedNode] = useState<PatentNode | null>(null);
  const [viewMode, setViewMode] = useState<"network" | "impact" | "timeline">("network");
  const [filter, setFilter] = useState<PatentNode["category"] | null>(null);
  const fetcher = useFetcher();

  return (
    <div className="patent-visualization h-screen relative">
      <Canvas camera={{ position: [0, 0, 50] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />

        {/* Patent nodes */}
        <PatentNodeMesh
          node={{
            id: "example",
            title: "Example Patent",
            position: [0, 0, 0],
            stage: "development",
            category: "sustainable",
            // ... other required properties
          } as PatentNode}
          onSelect={setSelectedNode}
        />

        {/* Connection network */}
        <ConnectionLines nodes={[]} />

        {/* Ambient particles */}
        <Points>
          <pointsMaterial
            size={0.1}
            transparent
            opacity={0.5}
            color="#4CAF50"
          />
        </Points>
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-4 left-4 space-y-4">
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Patent Ecosystem</h2>
          <div className="flex gap-2">
            {["network", "impact", "timeline"].map(mode => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode as typeof viewMode)}
                className={`px-3 py-1 rounded-full ${
                  viewMode === mode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Categories</h3>
          <div className="space-y-2">
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilter(category as PatentNode["category"])}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${
                  filter === category
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {icon}
                <span className="capitalize">{category}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Patent Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 w-96 bg-white/90 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">{selectedNode.title}</h3>
            <p className="text-gray-600 mb-4">{selectedNode.description}</p>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(selectedNode.impact).map(([type, value]) => (
                <div key={type}>
                  <span className="text-sm text-gray-500 capitalize">
                    {type} Impact
                  </span>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Contributors */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Contributors</h4>
              <div className="space-y-2">
                {selectedNode.contributors.map(contributor => (
                  <div
                    key={contributor.id}
                    className="flex justify-between items-center"
                  >
                    <span>{contributor.name}</span>
                    <span className="text-sm text-gray-600">
                      {contributor.shares}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
