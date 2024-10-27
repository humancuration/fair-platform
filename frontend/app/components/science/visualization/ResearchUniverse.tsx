import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Html, OrbitControls } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import * as THREE from "three";

interface ResearchNode {
  id: string;
  type: "paper" | "dataset" | "code" | "experiment" | "discussion";
  title: string;
  authors: Author[];
  abstract: string;
  field: string;
  position: [number, number, number];
  connections: string[];
  metrics: {
    citations: number;
    replications: number;
    openAccess: boolean;
    reproducibilityScore: number;
  };
  visualProperties: {
    size: number;
    color: string;
    aura: string;
    pulseRate: number;
  };
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  institution: string;
  h_index: number;
  recentActivity: "active" | "semi-active" | "inactive";
}

// Fun visual elements for different research states
const nodeStates = {
  breakthrough: {
    particleColor: "#FFD700",
    pulseRate: 2,
    auraSize: 2,
    soundEffect: "breakthrough.mp3"
  },
  trending: {
    particleColor: "#FF69B4",
    pulseRate: 1.5,
    auraSize: 1.5,
    soundEffect: "trending.mp3"
  },
  emerging: {
    particleColor: "#7CFF00",
    pulseRate: 1.2,
    auraSize: 1.2,
    soundEffect: "emerging.mp3"
  }
};

function ResearchNodeMesh({ node, onSelect }: { node: ResearchNode; onSelect: (node: ResearchNode) => void }) {
  const meshRef = useRef<THREE.Mesh>();
  const auraRef = useRef<THREE.Mesh>();
  
  useFrame(({ clock }) => {
    if (meshRef.current && auraRef.current) {
      // Make nodes gently float and pulse
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * node.visualProperties.pulseRate) * 0.001;
      
      // Aura effect
      auraRef.current.scale.setScalar(
        1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1
      );
    }
  });

  return (
    <group position={new THREE.Vector3(...node.position)}>
      {/* Aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[node.visualProperties.size * 1.2, 32, 32]} />
        <meshBasicMaterial
          color={node.visualProperties.aura}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Main node */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect(node)}
      >
        <sphereGeometry args={[node.visualProperties.size, 32, 32]} />
        <meshPhongMaterial
          color={node.visualProperties.color}
          emissive={node.visualProperties.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Node label */}
      <Html>
        <div className="px-2 py-1 bg-white/90 rounded text-sm whitespace-nowrap">
          {node.title}
        </div>
      </Html>
    </group>
  );
}

function CitationFlows({ nodes }: { nodes: ResearchNode[] }) {
  const linesRef = useRef<THREE.LineSegments>();

  useFrame(({ clock }) => {
    if (linesRef.current) {
      // Animate citation flows
      const time = clock.getElapsedTime();
      const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.001;
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

export function ResearchUniverse() {
  const [selectedNode, setSelectedNode] = useState<ResearchNode | null>(null);
  const [viewMode, setViewMode] = useState<"explore" | "focus" | "overview">("explore");
  const fetcher = useFetcher();

  return (
    <div className="research-universe h-screen relative">
      {/* 3D Visualization */}
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
        
        {/* Research nodes */}
        {/* This would map over actual research data */}
        <ResearchNodeMesh
          node={{
            id: "example",
            type: "paper",
            title: "Example Research",
            position: [0, 0, 0],
            // ... other properties
          } as ResearchNode}
          onSelect={setSelectedNode}
        />

        {/* Citation flows */}
        <CitationFlows nodes={[]} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 space-y-4">
        {/* Navigation controls */}
        {/* Search interface */}
        {/* Filters and view modes */}
      </div>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 w-96 bg-white/90 p-6 rounded-lg backdrop-blur-sm"
          >
            {/* Node details would go here */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
