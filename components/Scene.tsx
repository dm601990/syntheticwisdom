'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export default function Scene() {
  // This reference will give us direct access to the mesh
  const boxRef = useRef<Mesh>(null);
  
  // Rotate mesh every frame
  useFrame((state, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.x += delta * 0.2;
      boxRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={boxRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" roughness={0.5} metalness={0.5} />
    </mesh>
  );
} 