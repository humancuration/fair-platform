import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { RootState } from '@react-three/fiber';

const FloatingCube: React.FC = () => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state: RootState) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      mesh.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  const texture = useTexture('/path/to/your/logo.png');

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

interface FloatingTextProps {
  text: string;
  position: [number, number, number];
}

const FloatingText: React.FC<FloatingTextProps> = ({ text, position }) => {
  const textRef = useRef<THREE.Mesh>(null);
  useFrame((state: RootState) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      color="#ff6f61"
      fontSize={0.5}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const ThreeDScene: React.FC = () => {
  return (
    <Canvas style={{ height: '100vh' }} camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <FloatingCube />
      <FloatingText text="Fair Platform" position={[0, 3, 0]} />
      <FloatingText text="Equitable Referrals" position={[-3, 0, 0]} />
      <FloatingText text="Revenue Sharing" position={[3, 0, 0]} />
      <OrbitControls enableZoom={false} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </Canvas>
  );
};

export default ThreeDScene;
