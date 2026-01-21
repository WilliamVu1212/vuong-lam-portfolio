import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface CloudPlatformProps {
  position: [number, number, number];
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const SIZES = {
  small: { radius: 3, height: 0.5 },
  medium: { radius: 5, height: 0.8 },
  large: { radius: 8, height: 1 },
};

export function CloudPlatform({
  position,
  size = 'medium',
  color = '#FF8C00',
}: CloudPlatformProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { radius, height } = SIZES[size];

  // Pulsing glow animation
  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0}
      floatIntensity={0.3}
      floatingRange={[-0.2, 0.2]}
    >
      <group position={position}>
        {/* Physics collider */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[radius, height / 2, radius]} />
        </RigidBody>

        {/* Main cloud mesh */}
        <mesh ref={meshRef} receiveShadow>
          <cylinderGeometry args={[radius, radius * 1.2, height, 32]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.8}
            metalness={0.2}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Top glow ring */}
        <mesh
          ref={glowRef}
          position={[0, height / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[radius * 0.3, radius * 0.95, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Edge glow */}
        <mesh position={[0, height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.9, radius, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Sparkles */}
        <Sparkles
          count={20}
          scale={[radius * 2, 2, radius * 2]}
          position={[0, 1, 0]}
          size={1}
          speed={0.3}
          color={color}
        />
      </group>
    </Float>
  );
}

// Predefined cloud platforms for the intro area
export function IntroCloudPlatforms() {
  const platforms = useMemo(
    () => [
      // Starting area - easy jumps
      { position: [0, 2, -8] as [number, number, number], size: 'large' as const, color: '#FF4444' },
      { position: [6, 4, -15] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
      { position: [-5, 6, -22] as [number, number, number], size: 'medium' as const, color: '#FFD700' },
      { position: [3, 8, -30] as [number, number, number], size: 'medium' as const, color: '#FF6B35' },
      { position: [-3, 10, -38] as [number, number, number], size: 'medium' as const, color: '#FF4444' },

      // Path to About section
      { position: [0, 13, -48] as [number, number, number], size: 'large' as const, color: '#FF8C00' },
      { position: [5, 16, -58] as [number, number, number], size: 'medium' as const, color: '#FFD700' },
      { position: [-4, 19, -68] as [number, number, number], size: 'medium' as const, color: '#FF6B35' },
      { position: [0, 22, -78] as [number, number, number], size: 'large' as const, color: '#FF4444' },
    ],
    []
  );

  return (
    <>
      {platforms.map((platform, index) => (
        <CloudPlatform
          key={index}
          position={platform.position}
          size={platform.size}
          color={platform.color}
        />
      ))}
    </>
  );
}

// Cloud platforms leading to Skills section
export function SkillsCloudPlatforms() {
  const platforms = useMemo(
    () => [
      { position: [0, 28, -90] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
      { position: [8, 32, -105] as [number, number, number], size: 'medium' as const, color: '#FFD700' },
      { position: [-6, 36, -120] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [4, 40, -135] as [number, number, number], size: 'medium' as const, color: '#FF6B35' },
      { position: [-2, 44, -150] as [number, number, number], size: 'large' as const, color: '#FF8C00' },
      { position: [0, 48, -165] as [number, number, number], size: 'medium' as const, color: '#FFD700' },
    ],
    []
  );

  return (
    <>
      {platforms.map((platform, index) => (
        <CloudPlatform
          key={`skills-${index}`}
          position={platform.position}
          size={platform.size}
          color={platform.color}
        />
      ))}
    </>
  );
}

// Cloud platforms from Skills to Projects section
export function ProjectsCloudPlatforms() {
  const platforms = useMemo(
    () => [
      // From Skills (0, 60, -200) to Projects (0, 100, -300)
      { position: [0, 55, -180] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [10, 60, -195] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
      { position: [-8, 65, -210] as [number, number, number], size: 'medium' as const, color: '#FFD700' },
      { position: [5, 70, -225] as [number, number, number], size: 'large' as const, color: '#FF6B35' },
      { position: [-5, 75, -240] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [0, 80, -255] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
      { position: [8, 85, -270] as [number, number, number], size: 'medium' as const, color: '#FFD700' },
      { position: [-6, 90, -285] as [number, number, number], size: 'large' as const, color: '#FF6B35' },

      // Bridge between left and right project clusters
      { position: [-30, 95, -295] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [30, 95, -295] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
    ],
    []
  );

  return (
    <>
      {platforms.map((platform, index) => (
        <CloudPlatform
          key={`projects-${index}`}
          position={platform.position}
          size={platform.size}
          color={platform.color}
        />
      ))}
    </>
  );
}

// Cloud platforms from Projects to Experience section
export function ExperienceCloudPlatforms() {
  const platforms = useMemo(
    () => [
      // From Projects (0, 100, -300) to Experience (0, 150, -450)
      { position: [0, 105, -320] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [-10, 110, -340] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
      { position: [8, 115, -360] as [number, number, number], size: 'large' as const, color: '#FFD700' },
      { position: [-5, 120, -380] as [number, number, number], size: 'medium' as const, color: '#FF6B35' },
      { position: [5, 128, -400] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [0, 135, -420] as [number, number, number], size: 'large' as const, color: '#FF8C00' },
      { position: [-8, 142, -435] as [number, number, number], size: 'medium' as const, color: '#FFD700' },

      // From Experience (0, 150, -450) to Contact (0, 200, -550)
      { position: [0, 158, -470] as [number, number, number], size: 'medium' as const, color: '#FF4444' },
      { position: [10, 165, -490] as [number, number, number], size: 'medium' as const, color: '#FF8C00' },
      { position: [-8, 172, -510] as [number, number, number], size: 'large' as const, color: '#FFD700' },
      { position: [5, 180, -525] as [number, number, number], size: 'medium' as const, color: '#FF6B35' },
      { position: [0, 188, -540] as [number, number, number], size: 'large' as const, color: '#FF4444' },
    ],
    []
  );

  return (
    <>
      {platforms.map((platform, index) => (
        <CloudPlatform
          key={`experience-${index}`}
          position={platform.position}
          size={platform.size}
          color={platform.color}
        />
      ))}
    </>
  );
}

export default CloudPlatform;
