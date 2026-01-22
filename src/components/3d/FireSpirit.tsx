import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Mesh, Group, Vector3 } from 'three';

interface FireSpiritProps {
  /** Intensity multiplier for glow effects */
  intensity?: number;
  /** Whether the spirit is currently flying */
  isFlying?: boolean;
}

// Fire particle data
interface FireParticle {
  offset: Vector3;
  speed: number;
  size: number;
  phase: number;
}

export function FireSpirit({ intensity = 1, isFlying = false }: FireSpiritProps) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const middleRef = useRef<Mesh>(null);
  const outerRef = useRef<Mesh>(null);
  const wispRefs = useRef<Mesh[]>([]);
  const particleRefs = useRef<Mesh[]>([]);

  // Generate fire particles
  const particles = useMemo<FireParticle[]>(() => {
    const result: FireParticle[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.3;
      result.push({
        offset: new Vector3(
          Math.cos(angle) * radius,
          -0.3 + Math.random() * 0.2,
          Math.sin(angle) * radius
        ),
        speed: 0.8 + Math.random() * 0.6,
        size: 0.08 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return result;
  }, []);

  // Generate energy wisps (flowing trails around core)
  const wisps = useMemo(() => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push({
        radius: 0.5 + i * 0.1,
        speed: 1.5 - i * 0.2,
        phase: (i / 5) * Math.PI * 2,
        tilt: 0.2 + i * 0.1,
      });
    }
    return result;
  }, []);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Core pulse animation
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 3) * 0.1;
      coreRef.current.scale.setScalar(pulse);

      // Rotate core slowly
      coreRef.current.rotation.y = time * 0.5;
      coreRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    // Middle layer rotation
    if (middleRef.current) {
      middleRef.current.rotation.y = -time * 0.3;
      middleRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;

      // Pulse opposite to core
      const pulse = 1 + Math.sin(time * 3 + Math.PI) * 0.05;
      middleRef.current.scale.setScalar(pulse);
    }

    // Outer layer slow rotation
    if (outerRef.current) {
      outerRef.current.rotation.y = time * 0.2;

      // Gentle breathing
      const breath = 1 + Math.sin(time * 1.5) * 0.08;
      outerRef.current.scale.setScalar(breath);
    }

    // Animate wisps (energy trails orbiting)
    wispRefs.current.forEach((wisp, i) => {
      if (wisp && wisps[i]) {
        const w = wisps[i];
        const angle = time * w.speed + w.phase;
        wisp.position.x = Math.cos(angle) * w.radius;
        wisp.position.z = Math.sin(angle) * w.radius;
        wisp.position.y = Math.sin(angle * 2) * w.tilt;

        // Scale based on position (larger when in front)
        const scale = 0.8 + Math.sin(angle) * 0.3;
        wisp.scale.setScalar(scale);

        // Rotate to face movement direction
        wisp.rotation.y = -angle + Math.PI / 2;
      }
    });

    // Animate fire particles (rising flames)
    particleRefs.current.forEach((particle, i) => {
      if (particle && particles[i]) {
        const p = particles[i];
        const cycleTime = (time * p.speed + p.phase) % 2;

        // Rise up and fade
        const progress = cycleTime / 2; // 0 to 1
        const height = progress * 1.5;
        const fade = 1 - progress;

        particle.position.x = p.offset.x + Math.sin(time * 2 + p.phase) * 0.1;
        particle.position.y = p.offset.y + height;
        particle.position.z = p.offset.z + Math.cos(time * 2 + p.phase) * 0.1;

        // Scale down as it rises
        const scale = p.size * fade * (isFlying ? 1.3 : 1);
        particle.scale.setScalar(Math.max(0.01, scale));

        // Update opacity through material
        const material = particle.material as THREE.MeshBasicMaterial;
        if (material) {
          material.opacity = fade * 0.8;
        }
      }
    });

    // Whole group gentle hover
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.05;

      // Slight tilt when flying
      if (isFlying) {
        groupRef.current.rotation.x = Math.sin(time) * 0.1;
      } else {
        groupRef.current.rotation.x = 0;
      }
    }
  });

  const flyingMultiplier = isFlying ? 1.3 : 1;

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Inner Core - Bright glowing center */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.25, 2]} />
        <meshStandardMaterial
          color="#FFDD44"
          emissive="#FF6600"
          emissiveIntensity={2 * intensity * flyingMultiplier}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Core glow (additive) */}
      <mesh scale={1.1}>
        <icosahedronGeometry args={[0.25, 1]} />
        <meshBasicMaterial
          color="#FF8800"
          transparent
          opacity={0.6 * intensity}
        />
      </mesh>

      {/* Middle Layer - Semi-transparent energy shell */}
      <mesh ref={middleRef} scale={1.4}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial
          color="#FF6B35"
          emissive="#FF4400"
          emissiveIntensity={0.8 * intensity}
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Outer Layer - Ethereal glow */}
      <mesh ref={outerRef} scale={1.8}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color="#FF4444"
          transparent
          opacity={0.15 * intensity}
        />
      </mesh>

      {/* Outermost aura */}
      <mesh scale={2.2}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial
          color="#FF2200"
          transparent
          opacity={0.08 * intensity}
        />
      </mesh>

      {/* Energy Wisps - Orbiting flame trails */}
      {wisps.map((wisp, i) => (
        <mesh
          key={`wisp-${i}`}
          ref={(el) => {
            if (el) wispRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#FFAA00' : '#FF6600'}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Wisp trails (static decorative rings) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`ring-${i}`}
          rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}
        >
          <torusGeometry args={[0.5 + i * 0.1, 0.015, 8, 32]} />
          <meshBasicMaterial
            color="#FF8844"
            transparent
            opacity={0.2 - i * 0.05}
          />
        </mesh>
      ))}

      {/* Fire Particles - Rising flames */}
      {particles.map((p, i) => (
        <mesh
          key={`particle-${i}`}
          ref={(el) => {
            if (el) particleRefs.current[i] = el;
          }}
          position={[p.offset.x, p.offset.y, p.offset.z]}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#FFDD00' : i % 3 === 1 ? '#FF8800' : '#FF4400'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Inner point light */}
      <pointLight
        color="#FF6B35"
        intensity={2 * intensity * flyingMultiplier}
        distance={8}
        position={[0, 0, 0]}
      />

      {/* Outer ambient glow */}
      <pointLight
        color="#FF4444"
        intensity={0.5 * intensity}
        distance={15}
        position={[0, 0.5, 0]}
      />
    </group>
  );
}

export default FireSpirit;
