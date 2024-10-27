import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Points } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import * as THREE from "three";
import { FaSeedling, FaMicrochip, FaHandshake, FaUsers, FaMusic, FaPalette, FaFlask } from "react-icons/fa";

interface FundingNode {
  id: string;
  type: "source" | "project" | "contributor" | "pool";
  category: "patent" | "compute" | "content" | "research" | "art" | "infrastructure";
  position: [number, number, number];
  value: number;
  connections: {
    to: string;
    amount: number;
    type: "contribution" | "dividend" | "funding" | "revenue";
  }[];
  metadata: {
    name: string;
    description?: string;
    icon?: string;
    impact?: {
      scientific: number;
      social: number;
      economic: number;
    };
  };
}

interface FundingFlow {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: "contribution" | "dividend" | "funding" | "revenue";
  active: boolean;
  path: THREE.CatmullRomCurve3;
  particles: THREE.Vector3[];
}

const categoryColors = {
  patent: "#4CAF50",
  compute: "#2196F3",
  content: "#9C27B0",
  research: "#FF9800",
  art: "#E91E63",
  infrastructure: "#00BCD4"
};

const flowColors = {
  contribution: "#4CAF50",
  dividend: "#2196F3",
  funding: "#9C27B0",
  revenue: "#FF9800"
};

function FundingNodeMesh({ 
  node, 
  onSelect 
}: { 
  node: FundingNode; 
  onSelect: (node: FundingNode) => void 
}) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const glow = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (mesh.current && glow.current) {
      // Gentle floating animation
      mesh.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.001;
      
      // Value-based pulse
      const pulseIntensity = 0.1 * (node.value / 1000);
      glow.current.scale.setScalar(
        1 + Math.sin(clock.getElapsedTime() * 3) * pulseIntensity
      );
    }
  });

  // Node size based on value
  const nodeSize = 0.5 + Math.log(node.value + 1) * 0.2;

  return (
    <group position={new THREE.Vector3(...node.position)}>
      {/* Glow effect */}
      <mesh ref={glow}>
        <sphereGeometry args={[nodeSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={categoryColors[node.category]}
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
          color={categoryColors[node.category]}
          emissive={categoryColors[node.category]}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Info label */}
      {hovered && (
        <Html>
          <div className="bg-white/90 p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="text-2xl">
                {node.metadata.icon}
              </div>
              <div>
                <h3 className="font-bold">{node.metadata.name}</h3>
                <p className="text-sm text-gray-600">
                  Value: ${node.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function FlowParticles({ flows }: { flows: FundingFlow[] }) {
  const points = useRef<THREE.Points | null>(null);

  useFrame(({ clock }) => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();

      flows.forEach((flow, i) => {
        if (flow.active) {
          // Animate multiple particles along each flow
          flow.particles.forEach((particle, j) => {
            const t = ((time * 0.5 + j * 0.1) % 1);
            const point = flow.path.getPoint(t);
            const baseIndex = (i * flow.particles.length + j) * 3;
            positions[baseIndex] = point.x;
            positions[baseIndex + 1] = point.y;
            positions[baseIndex + 2] = point.z;
          });
        }
      });

      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.8}
        vertexColors
      />
    </points>
  );
}

export function FundingFlowVisualization() {
  const [selectedNode, setSelectedNode] = useState<FundingNode | null>(null);
  const [activeFlows, setActiveFlows] = useState<FundingFlow[]>([]);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const fetcher = useFetcher();

  // Simulate some funding flows
  useEffect(() => {
    // Create curved paths between nodes
    // Add particle systems for flow visualization
    // Update flow amounts and active states
  }, []);

  return (
    <div className="funding-flow h-screen relative">
      <Canvas camera={{ position: viewMode === "3d" ? [0, 0, 50] : [0, 0, 100] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          // Lock rotation for 2D mode
          maxPolarAngle={viewMode === "2d" ? 0 : Math.PI}
          minPolarAngle={viewMode === "2d" ? 0 : 0}
        />

        {/* Funding nodes */}
        <FundingNodeMesh
          node={{
            id: "example",
            type: "source",
            category: "patent",
            position: [0, 0, 0],
            value: 1000,
            connections: [],
            metadata: {
              name: "Patent Pool",
              icon: "🔬"
            }
          }}
          onSelect={setSelectedNode}
        />

        {/* Flow particles */}
        <FlowParticles flows={activeFlows} />

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
          <h2 className="text-xl font-bold mb-2">Funding Flows</h2>
          <div className="flex gap-2">
            {["2d", "3d"].map(mode => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode as "2d" | "3d")}
                className={`px-3 py-1 rounded-full ${
                  viewMode === mode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {mode.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Flow Types */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Flow Types</h3>
          <div className="space-y-2">
            {Object.entries(flowColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm capitalize">
                  {type.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 w-96 bg-white/90 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">
              {selectedNode.metadata.name}
            </h3>

            {selectedNode.metadata.description && (
              <p className="text-gray-600 mb-4">
                {selectedNode.metadata.description}
              </p>
            )}

            {/* Flow Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Inflow</span>
                <div className="text-xl font-bold">
                  ${selectedNode.value.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Outflow</span>
                <div className="text-xl font-bold">
                  ${(selectedNode.value * 0.8).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            {selectedNode.metadata.impact && (
              <div className="space-y-2">
                {Object.entries(selectedNode.metadata.impact).map(([type, value]) => (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{type} Impact</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
