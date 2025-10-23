'use client';

import { forwardRef, useRef, FC, ReactNode } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

interface BeamsProps {
  children?: ReactNode;
}

interface BeamProps {
  position?: [number, number, number];
}

const Beam = forwardRef<THREE.Mesh, BeamProps>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#00a8ff"
        transparent
        opacity={0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
});

Beam.displayName = 'Beam';

const Beams: FC<BeamsProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        <group rotation={[0, 0, 0]}>
          <Beam position={[-2, 0, 0]} />
          <Beam position={[0, 0, 0]} />
          <Beam position={[2, 0, 0]} />
        </group>
        {children}
      </Canvas>
    </div>
  );
};

export default Beams;