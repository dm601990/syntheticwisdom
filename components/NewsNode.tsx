'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { Mesh } from 'three';

interface NewsNodeProps {
  position: [number, number, number];
  title: string;
  energy: number;
}

export function NewsNode({ position, title, energy }: NewsNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Define base color and calculate emissive intensity based on energy
  const baseColor = '#2a9d8f'; // A teal/cyan base color
  const emissiveIntensity = hovered 
    ? 0.3 + energy * 0.7 // Brighter when hovered
    : 0.1 + energy * 0.6; // Normal intensity
  
  // Node size with slight increase when hovered
  const nodeSize = hovered ? 0.9 : 0.8;

  // Handle hover effects
  useFrame(() => {
    if (meshRef.current) {
      // Subtle animation when hovered
      if (hovered) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Simple Sphere Geometry */}
        <sphereGeometry args={[nodeSize, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor} // Glow with the base color
          emissiveIntensity={emissiveIntensity}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      {/* Use Billboard to keep text facing camera */}
      <Billboard position={[0, nodeSize + 0.5, 0]}>
        <Text
          fontSize={hovered ? 0.32 : 0.28} // Slightly larger when hovered
          color={hovered ? "#ffffff" : "#dddddd"}
          anchorX="center"
          anchorY="middle"
          maxWidth={4}
        >
          {title}
        </Text>
      </Billboard>
    </group>
  );
}

export default NewsNode; 