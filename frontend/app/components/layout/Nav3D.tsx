import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useGLTF, Float } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Link, useLocation } from '@remix-run/react';

interface NavItem {
  to: string;
  label: string;
  icon?: string; // Path to 3D model
}

interface NavItemProps extends NavItem {
  isActive: boolean;
  index: number;
}

const NavItem3D: React.FC<NavItemProps> = ({ to, label, icon, isActive, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = icon ? useGLTF(icon) : { scene: null };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + index) * 0.1;
    }
  });

  return (
    <Link to={to}>
      <Float
        speed={1.5} 
        rotationIntensity={isActive ? 0.5 : 0.2}
        floatIntensity={isActive ? 0.5 : 0.2}
      >
        <motion.group
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          {scene ? (
            <primitive 
              object={scene} 
              scale={0.5}
              position={[0, 0, 0]}
            />
          ) : (
            <mesh ref={meshRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color={isActive ? "#4f46e5" : "#9ca3af"}
                emissive={isActive ? "#4f46e5" : "#000000"}
                emissiveIntensity={isActive ? 0.5 : 0}
              />
            </mesh>
          )}
          <Text
            position={[0, -1, 0]}
            fontSize={0.3}
            color={isActive ? "#4f46e5" : "#374151"}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </motion.group>
      </Float>
    </Link>
  );
};

const Nav3D: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: '/models/dashboard.glb' },
    { to: '/groups', label: 'Groups', icon: '/models/groups.glb' },
    { to: '/eco', label: 'Eco Impact', icon: '/models/eco.glb' },
    { to: '/marketplace', label: 'Marketplace', icon: '/models/marketplace.glb' },
  ];

  return (
    <div className="h-24 w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <group position={[-3, 0, 0]}>
          {navItems.map((item, index) => (
            <group key={item.to} position={[index * 2, 0, 0]}>
              <NavItem3D
                {...item}
                isActive={location.pathname === item.to}
                index={index}
              />
            </group>
          ))}
        </group>
      </Canvas>
    </div>
  );
};

export default Nav3D; 