import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useGameStore } from '@/stores/gameStore';

interface FlyingSwordProps {
  velocity: Vector3;
}

export function FlyingSword({ velocity }: FlyingSwordProps) {
  const groupRef = useRef<Group>(null);
  const trailRef = useRef<Group>(null);
  const isFlying = useGameStore((state) => state.player.isFlying);

  // Trail particles
  const trailParticles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      offset: i * 0.15,
      scale: 1 - i * 0.025,
      opacity: 1 - i * 0.03,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !isFlying) return;

    const t = state.clock.elapsedTime;

    // Tilt sword based on velocity
    const speed = velocity.length();
    const tiltX = velocity.z * 0.02; // Pitch based on forward/back
    const tiltZ = -velocity.x * 0.02; // Roll based on left/right

    groupRef.current.rotation.x = tiltX;
    groupRef.current.rotation.z = tiltZ;

    // Subtle hover animation
    groupRef.current.position.y = Math.sin(t * 3) * 0.05;

    // Blade glow pulse
    if (groupRef.current.children[0]) {
      const blade = groupRef.current.children[0] as THREE.Mesh;
      if (blade.material && 'emissiveIntensity' in blade.material) {
        (blade.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.5 + Math.sin(t * 4) * 0.2 + speed * 0.01;
      }
    }

    // Trail animation
    if (trailRef.current && speed > 5) {
      trailRef.current.visible = true;
      trailRef.current.children.forEach((child, i) => {
        child.position.z = i * 0.3 + Math.sin(t * 10 + i * 0.5) * 0.05;
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'opacity' in mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity =
            (1 - i * 0.03) * Math.min(1, speed * 0.05);
        }
      });
    } else if (trailRef.current) {
      trailRef.current.visible = false;
    }
  });

  if (!isFlying) return null;

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} rotation={[0, 0, 0]}>
      {/* Main Blade */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.15, 3, 0.03]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Blade Edge Glow - Left */}
      <mesh position={[-0.08, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.02, 3, 0.04]} />
        <meshBasicMaterial color="#FFFACD" transparent opacity={0.8} />
      </mesh>

      {/* Blade Edge Glow - Right */}
      <mesh position={[0.08, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.02, 3, 0.04]} />
        <meshBasicMaterial color="#FFFACD" transparent opacity={0.8} />
      </mesh>

      {/* Central Ridge */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.03, 2.8, 0.01]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFD700"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Tip */}
      <mesh position={[0, 0, -1.6]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.12, 0.3, 4]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Guard (Tsuba) */}
      <mesh position={[0, 0, 1.5]}>
        <boxGeometry args={[0.5, 0.08, 0.15]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Guard Decorations */}
      <mesh position={[-0.2, 0, 1.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#40E0D0" emissive="#40E0D0" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.2, 0, 1.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#40E0D0" emissive="#40E0D0" emissiveIntensity={0.5} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, 0, 1.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Handle Wrapping */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0, 1.65 + i * 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.015, 4, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Pommel */}
      <mesh position={[0, 0, 2.3]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Energy Aura */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3.5, 16, 1, true]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.15} side={2} />
      </mesh>

      {/* Trail Effect */}
      <group ref={trailRef} position={[0, 0, 0.5]}>
        {trailParticles.map((particle) => (
          <mesh
            key={particle.id}
            position={[0, 0, particle.offset]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.1 * particle.scale, 0.3 * particle.scale]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={particle.opacity * 0.5}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Sword Light */}
      <pointLight
        color="#FFD700"
        intensity={2}
        distance={5}
        position={[0, 0, 0]}
      />
      <pointLight
        color="#FF8C00"
        intensity={1}
        distance={3}
        position={[0, 0, -1]}
      />
    </group>
  );
}

export default FlyingSword;
