import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useFetcher } from "@remix-run/react";

interface CitationNode {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  references: string[];
  position: [number, number, number];
  field: string;
  impact: number;
  isOpenAccess: boolean;
}

interface CitationLink {
  source: string;
  target: string;
  strength: number;
  type: "citation" | "reference" | "collaboration";
}

const fieldColors = {
  "computer-science": "#4CAF50",
  "biology": "#2196F3",
  "physics": "#9C27B0",
  "chemistry": "#F44336",
  "mathematics": "#FF9800",
  "interdisciplinary": "#3F51B5"
};

function Node({ node, onSelect }: { node: CitationNode; onSelect: (node: CitationNode) => void }) {
  const meshRef = useRef<THREE.Mesh>();
  const glowRef = useRef<THREE.Mesh>();
  
  useFrame(({ clock }) => {
    if (meshRef.current && glowRef.current) {
      // Gentle floating animation
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.0005;
      
      // Pulse effect based on citations/impact
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05 * (node.impact / 100);
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={new THREE.Vector3(...node.position)}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[node.citations * 0.01 + 0.5, 32, 32]} />
        <meshBasicMaterial 
          color={fieldColors[node.field as keyof typeof fieldColors]} 
          transparent 
          opacity={0.2} 
        />
      </mesh>

      {/* Main node */}
      <mesh 
        ref={meshRef}
        onClick={() => onSelect(node)}
      >
        <sphereGeometry args={[node.citations * 0.01 + 0.3, 32, 32]} />
        <meshPhongMaterial 
          color={fieldColors[node.field as keyof typeof fieldColors]}
          emissive={fieldColors[node.field as keyof typeof fieldColors]}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Label */}
      <Html>
        <div className="px-2 py-1 bg-white/90 rounded text-sm whitespace-nowrap">
          {node.title.length > 30 ? node.title.slice(0, 30) + "..." : node.title}
        </div>
      </Html>
    </group>
  );
}

function CitationFlows({ links }: { links: CitationLink[] }) {
  const linesRef = useRef<THREE.LineSegments>();

  useFrame(({ clock }) => {
    if (linesRef.current) {
      // Animate citation flows
      const time = clock.getElapsedTime();
      const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.0005;
      }
      
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        {/* Citation flow geometry would be computed here */}
      </bufferGeometry>
      <lineBasicMaterial
        color="#4CAF50"
        transparent
        opacity={0.3}
        linewidth={2}
      />
    </lineSegments>
  );
}

export function CitationGraph() {
  const [selectedNode, setSelectedNode] = useState<CitationNode | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const fetcher = useFetcher();

  return (
    <div className="citation-graph h-screen relative">
      {/* 3D Visualization */}
      <Canvas camera={{ position: [0, 0, 50] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
        
        {/* Citation nodes */}
        {mockNodes.map(node => (
          <Node key={node.id} node={node} onSelect={setSelectedNode} />
        ))}

        {/* Citation flows */}
        <CitationFlows links={mockLinks} />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-4 left-4 space-y-4">
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Citation Network</h2>
          <div className="flex gap-2">
            {["3d", "2d"].map(mode => (
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
                {mode.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Fields</h3>
          <div className="space-y-2">
            {Object.entries(fieldColors).map(([field, color]) => (
              <div key={field} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm capitalize">
                  {field.replace("-", " ")}
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
            <h3 className="text-xl font-bold mb-2">{selectedNode.title}</h3>
            <p className="text-gray-600 mb-4">
              {selectedNode.authors.join(", ")} ({selectedNode.year})
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Citations</span>
                <div className="text-xl font-bold">{selectedNode.citations}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Impact</span>
                <div className="text-xl font-bold">{selectedNode.impact}</div>
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
