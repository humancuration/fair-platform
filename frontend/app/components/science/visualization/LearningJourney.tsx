import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  type: "paper_read" | "review_completed" | "replication_study" | "contribution" | "achievement";
  date: string;
  field: string;
  impact: number;
  position: [number, number, number];
  connections: string[];
  resources: {
    papers: string[];
    notes: string[];
    implementations?: string[];
  };
  achievements: {
    icon: string;
    name: string;
    description: string;
  }[];
}

interface JourneyPath {
  id: string;
  milestones: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  prerequisites: string[];
  mentors: {
    id: string;
    name: string;
    avatar: string;
    expertise: string[];
  }[];
}

const milestoneColors = {
  paper_read: "#4CAF50",
  review_completed: "#2196F3",
  replication_study: "#9C27B0",
  contribution: "#F44336",
  achievement: "#FFD700"
};

function MilestoneMesh({ 
  milestone, 
  onSelect 
}: { 
  milestone: LearningMilestone; 
  onSelect: (milestone: LearningMilestone) => void 
}) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const glow = useRef<THREE.Mesh | null>(null);
  
  useFrame(({ clock }) => {
    if (mesh.current && glow.current) {
      // Floating animation
      mesh.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.001;
      
      // Glow pulse effect
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
      glow.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={new THREE.Vector3(...milestone.position)}>
      {/* Glow effect */}
      <mesh ref={glow}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color={milestoneColors[milestone.type]}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Main milestone sphere */}
      <mesh
        ref={mesh}
        onClick={() => onSelect(milestone)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          color={milestoneColors[milestone.type]}
          emissive={milestoneColors[milestone.type]}
          emissiveIntensity={0.2}
        />
      </mesh>

      <Html>
        <div className="bg-white/90 p-2 rounded shadow-lg">
          <h3 className="font-bold">{milestone.title}</h3>
          <p className="text-sm text-gray-600">
            {new Date(milestone.date).toLocaleDateString()}
          </p>
        </div>
      </Html>
    </group>
  );
}

function JourneyConnections({ milestones }: { milestones: LearningMilestone[] }) {
  const lines = useRef<THREE.LineSegments | null>(null);

  useFrame(({ clock }) => {
    if (lines.current) {
      // Animate connections with flowing effect
      const time = clock.getElapsedTime();
      const positions = lines.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.001;
      }
      
      lines.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lines}>
      <lineBasicMaterial color="#4CAF50" transparent opacity={0.3} />
    </lineSegments>
  );
}

export function LearningJourney() {
  const [selectedMilestone, setSelectedMilestone] = useState<LearningMilestone | null>(null);
  const [currentPath, setCurrentPath] = useState<JourneyPath | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const fetcher = useFetcher();

  return (
    <div className="learning-journey h-screen relative">
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

        {/* Example milestone */}
        <MilestoneMesh
          milestone={{
            id: "example",
            title: "First Paper Review",
            position: [0, 0, 0],
            type: "review_completed",
            date: new Date().toISOString(),
            // ... other required properties
          } as LearningMilestone}
          onSelect={setSelectedMilestone}
        />

        <JourneyConnections milestones={[]} />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-4 left-4 space-y-4">
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Learning Journey ✨</h2>
          <div className="flex gap-2">
            {["3d", "2d"].map(mode => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode as "3d" | "2d")}
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

        {/* Milestone Types Legend */}
        <div className="bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Journey Milestones</h3>
          <div className="space-y-2">
            {Object.entries(milestoneColors).map(([type, color]) => (
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

      {/* Selected Milestone Details */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 w-96 bg-white/90 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">{selectedMilestone.title}</h3>
            <p className="text-gray-600 mb-4">{selectedMilestone.description}</p>

            {/* Achievement badges */}
            <div className="flex gap-2 mb-4">
              {selectedMilestone.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-yellow-100 rounded-full"
                  title={achievement.description}
                >
                  {achievement.icon}
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Continue Journey ✨
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
