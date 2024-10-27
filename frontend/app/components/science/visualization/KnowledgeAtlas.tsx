import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Points, PointMaterial } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import * as THREE from "three";

interface KnowledgeNode {
  id: string;
  title: string;
  type: "concept" | "theory" | "discovery" | "method" | "question";
  field: string;
  description: string;
  position: [number, number, number];
  connections: string[];
  level: "galaxy" | "solar" | "planet";
  status: "known" | "frontier" | "unexplored";
  contributors: {
    id: string;
    name: string;
    avatar: string;
    contribution: string;
  }[];
  resources: {
    papers: number;
    datasets: number;
    implementations: number;
    discussions: number;
  };
}

const zoomLevels = {
  galaxy: {
    camera: [0, 0, 500],
    nodeSize: 5,
    particleDensity: 5000
  },
  solar: {
    camera: [0, 0, 200],
    nodeSize: 3,
    particleDensity: 2000
  },
  planet: {
    camera: [0, 0, 50],
    nodeSize: 1,
    particleDensity: 1000
  }
};

const statusColors = {
  known: "#4CAF50",
  frontier: "#FF9800",
  unexplored: "#9C27B0"
};

function KnowledgeNodeMesh({ node, onSelect }: { node: KnowledgeNode; onSelect: (node: KnowledgeNode) => void }) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      // Gentle floating animation
      mesh.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.001;
      
      // Pulse effect for frontier nodes
      if (node.status === "frontier") {
        mesh.current.scale.setScalar(
          1 + Math.sin(clock.getElapsedTime() * 3) * 0.1
        );
      }
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[...node.position]} // Spread array directly
      onClick={() => onSelect(node)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[hovered ? 1.2 : 1, 32, 32]} />
      <meshPhongMaterial
        color={statusColors[node.status]}
        transparent
        opacity={node.status === "unexplored" ? 0.5 : 0.8}
      />
      {hovered && (
        <Html>
          <div className="bg-white/90 p-2 rounded shadow-lg">
            <h3 className="font-bold">{node.title}</h3>
            <p className="text-sm text-gray-600">{node.field}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function ConnectionLines({ nodes }: { nodes: KnowledgeNode[] }) {
  const lines = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    if (!lines.current) return;

    const positions: number[] = [];
    const colors: number[] = [];

    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (target) {
          positions.push(...node.position, ...target.position);
          const color = new THREE.Color(statusColors.known);
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

export function KnowledgeAtlas() {
  const [currentLevel, setCurrentLevel] = useState<"galaxy" | "solar" | "planet">("galaxy");
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const fetcher = useFetcher();

  return (
    <div className="knowledge-atlas h-screen relative">
      <Canvas camera={{ position: new THREE.Vector3(...zoomLevels[currentLevel].camera) }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars
          radius={100}
          depth={50}
          count={zoomLevels[currentLevel].particleDensity}
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

        {/* Knowledge nodes */}
        <KnowledgeNodeMesh
          node={{
            id: "example",
            title: "Example Node",
            position: [0, 0, 0],
            // ... other properties
          } as KnowledgeNode}
          onSelect={setSelectedNode}
        />

        {/* Connection lines */}
        <ConnectionLines nodes={[]} />

        {/* Particle systems for various effects */}
        <Points>
          <PointMaterial
            transparent
            vertexColors
            size={15}
            sizeAttenuation={false}
            depthWrite={false}
          />
        </Points>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 space-y-4">
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Knowledge Atlas</h2>
          <div className="flex gap-2">
            {["galaxy", "solar", "planet"].map(level => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleZoomLevel(level as typeof currentLevel)}
                className={`px-3 py-1 rounded-full ${
                  currentLevel === level
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Knowledge Status</h3>
          <div className="space-y-2">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm capitalize">
                  {status.replace("-", " ")}
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
            <p className="text-gray-600 mb-4">{selectedNode.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Papers</span>
                <div className="text-xl font-bold">{selectedNode.resources.papers}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Datasets</span>
                <div className="text-xl font-bold">{selectedNode.resources.datasets}</div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Explore
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
