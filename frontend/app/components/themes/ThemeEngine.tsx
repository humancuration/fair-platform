import { motion, AnimatePresence, MotionValue, useMotionValue, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import { useScroll, useSpring } from "framer-motion";
import * as THREE from "three";

interface ThemeEngineProps {
  children: React.ReactNode;
  theme: {
    type: "2d" | "3d" | "hybrid";
    perspective?: number;
    tiltFactor?: number;
    layerDepth?: number;
    particleSystem?: {
      enabled: boolean;
      density: number;
      color: string;
    };
    transitions: {
      type: "slide" | "flip" | "rotate" | "morph";
      duration: number;
      ease: string;
    };
    effects: {
      bloom?: boolean;
      blur?: boolean;
      glitch?: boolean;
    };
  };
}

function Scene({ children, scrollY }: { children: React.ReactNode; scrollY: MotionValue<number> }) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>();

  useFrame(() => {
    if (group.current) {
      // Smooth camera tilt based on scroll
      const tilt = scrollY.get() * 0.001;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        tilt,
        0.1
      );
    }
  });

  return <group ref={group}>{children}</group>;
}

export function ThemeEngine({ children, theme }: ThemeEngineProps) {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax effect for 2D elements
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 1000], [0, theme.tiltFactor || 0]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="theme-engine relative">
      {theme.type === "3d" || theme.type === "hybrid" ? (
        <Canvas
          camera={{ position: [0, 0, 5], fov: theme.perspective || 75 }}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <Scene scrollY={scrollY}>
            {/* 3D elements would go here */}
            <mesh>
              <boxGeometry />
              <meshStandardMaterial />
            </mesh>
          </Scene>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Canvas>
      ) : null}

      <motion.div
        style={{
          rotateX,
          perspective: theme.perspective || 1000,
        }}
        className="relative z-10"
      >
        {/* Layer system for 2D elements */}
        {Array.isArray(children) ? 
          children.map((child, index) => (
            <motion.div
              key={index}
              style={{
                zIndex: index,
                translateZ: index * (theme.layerDepth || 50),
              }}
              animate={{
                x: mousePosition.x * 20,
                y: mousePosition.y * 20,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
              }}
            >
              {child}
            </motion.div>
          ))
          : children
        }
      </motion.div>

      {/* Particle system overlay */}
      {theme.particleSystem?.enabled && (
        <ParticleSystem
          density={theme.particleSystem.density}
          color={theme.particleSystem.color}
        />
      )}

      {/* Post-processing effects */}
      {theme.effects.bloom && <BloomEffect />}
      {theme.effects.glitch && <GlitchEffect />}
    </div>
  );
}

// Additional components for effects...
