import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Points } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import * as THREE from "three";

interface VoteNode {
  id: string;
  type: "voter" | "delegate" | "proposal";
  position: [number, number, number];
  power: number;
  connections: {
    to: string;
    type: "vote" | "delegation" | "influence";
    amount: number;
    active: boolean;
  }[];
  metadata: {
    name?: string;
    avatar?: string;
    votingHistory?: {
      total: number;
      participation: number;
      alignment: number;
    };
    delegatedPower?: number;
    quadraticPower?: number;
  };
}

interface VoteFlow {
  from: string;
  to: string;
  amount: number;
  type: "direct" | "delegated" | "quadratic";
  timestamp: string;
  active: boolean;
  path: THREE.CatmullRomCurve3; // For curved flow lines
}

interface VoteVisualizationProps {
  mode?: "2d" | "3d";
  style?: "organic" | "structured" | "force-directed";
  showLabels?: boolean;
  interactive?: boolean;
  highlightActive?: boolean;
}

const flowColors = {
  direct: "#4CAF50",
  delegated: "#2196F3",
  quadratic: "#9C27B0"
};

function VoteNodeMesh({ node, onSelect }: { node: VoteNode; onSelect: (node: VoteNode) => void }) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const glow = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (mesh.current && glow.current) {
      // Gentle floating animation
      mesh.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.001;
      
      // Power pulse effect
      const pulseIntensity = 0.1 * (node.power / 100);
      glow.current.scale.setScalar(
        1 + Math.sin(clock.getElapsedTime() * 3) * pulseIntensity
      );
    }
  });

  // Node size based on voting power
  const nodeSize = 0.5 + (node.power * 0.02);

  return (
    <group position={new THREE.Vector3(...node.position)}>
      {/* Glow effect */}
      <mesh ref={glow}>
        <sphereGeometry args={[nodeSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={
            node.type === "voter" ? "#4CAF50" :
            node.type === "delegate" ? "#2196F3" :
            "#9C27B0"
          }
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
          color={
            node.type === "voter" ? "#4CAF50" :
            node.type === "delegate" ? "#2196F3" :
            "#9C27B0"
          }
          emissive={
            node.type === "voter" ? "#4CAF50" :
            node.type === "delegate" ? "#2196F3" :
            "#9C27B0"
          }
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Info label */}
      {hovered && (
        <Html>
          <div className="bg-white/90 p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              {node.metadata.avatar && (
                <img 
                  src={node.metadata.avatar} 
                  className="w-8 h-8 rounded-full"
                  alt="Avatar"
                />
              )}
              <div>
                <h3 className="font-bold">{node.metadata.name || node.id}</h3>
                <p className="text-sm text-gray-600">
                  Power: {node.power}
                  {node.metadata.delegatedPower && 
                    ` (${node.metadata.delegatedPower} delegated)`}
                </p>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function VoteFlowLines({ flows }: { flows: VoteFlow[] }) {
  const lines = useRef<THREE.LineSegments | null>(null);
  const particles = useRef<THREE.Points | null>(null);

  useFrame(({ clock }) => {
    if (particles.current) {
      // Animate flow particles along paths
      const positions = particles.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();

      flows.forEach((flow, i) => {
        if (flow.active) {
          const t = (time * 0.5 + i * 0.1) % 1;
          const point = flow.path.getPoint(t);
          const baseIndex = i * 3;
          positions[baseIndex] = point.x;
          positions[baseIndex + 1] = point.y;
          positions[baseIndex + 2] = point.z;
        }
      });

      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Flow lines */}
      <lineSegments ref={lines}>
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>

      {/* Flow particles */}
      <points ref={particles}>
        <pointsMaterial
          size={0.1}
          transparent
          opacity={0.8}
          vertexColors
        />
      </points>
    </group>
  );
}

export function VoteVisualization({ 
  mode = "3d",
  style = "organic",
  showLabels = true,
  interactive = true,
  highlightActive = true
}: VoteVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<VoteNode | null>(null);
  const [activeFlows, setActiveFlows] = useState<VoteFlow[]>([]);
  const [visualizationStyle, setVisualizationStyle] = useState(style);
  const fetcher = useFetcher();

  // Force-directed layout simulation
  useEffect(() => {
    if (style === "force-directed") {
      // Implement force-directed graph layout
    }
  }, [style]);

  return (
    <div className="vote-visualization h-screen relative">
      <Canvas camera={{ position: mode === "3d" ? [0, 0, 50] : [0, 0, 100] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <OrbitControls
          enabled={interactive}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          // Lock rotation for 2D mode
          maxPolarAngle={mode === "2d" ? 0 : Math.PI}
          minPolarAngle={mode === "2d" ? 0 : 0}
        />

        {/* Vote nodes */}
        <VoteNodeMesh
          node={{
            id: "example",
            type: "voter",
            position: [0, 0, 0],
            power: 50,
            connections: [],
            metadata: {
              name: "Example Voter"
            }
          }}
          onSelect={setSelectedNode}
        />

        {/* Vote flows */}
        <VoteFlowLines flows={activeFlows} />

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
          <h2 className="text-xl font-bold mb-2">Vote Visualization</h2>
          <div className="flex gap-2">
            {["2d", "3d"].map(m => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => mode = m as "2d" | "3d"}
                className={`px-3 py-1 rounded-full ${
                  mode === m
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {m.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Visualization Styles */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Style</h3>
          <div className="space-y-2">
            {["organic", "structured", "force-directed"].map(s => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                onClick={() => setVisualizationStyle(s as typeof style)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${
                  visualizationStyle === s
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="capitalize">{s.replace("-", " ")}</span>
              </motion.button>
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
              {selectedNode.metadata.name || selectedNode.id}
            </h3>

            {/* Voting Power Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Base Power</span>
                <div className="text-xl font-bold">{selectedNode.power}</div>
              </div>
              {selectedNode.metadata.delegatedPower && (
                <div>
                  <span className="text-sm text-gray-500">Delegated</span>
                  <div className="text-xl font-bold">
                    {selectedNode.metadata.delegatedPower}
                  </div>
                </div>
              )}
            </div>

            {/* Voting History */}
            {selectedNode.metadata.votingHistory && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Participation</span>
                    <span>
                      {selectedNode.metadata.votingHistory.participation}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alignment</span>
                    <span>
                      {selectedNode.metadata.votingHistory.alignment}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
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
