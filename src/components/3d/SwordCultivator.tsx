import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Mesh, Group } from 'three';

interface SwordCultivatorProps {
  /** Intensity multiplier for glow effects */
  intensity?: number;
  /** Whether the cultivator is currently flying */
  isFlying?: boolean;
}

// Lightning particle data
interface LightningParticle {
  startAngle: number;
  endAngle: number;
  radius: number;
  speed: number;
  phase: number;
}

// Hair strand data
interface HairStrand {
  offsetX: number;
  offsetZ: number;
  length: number;
  thickness: number;
  phase: number;
  speed: number;
  layer: number; // 0 = inner, 1 = middle, 2 = outer
}

export function SwordCultivator({ intensity = 1, isFlying = false }: SwordCultivatorProps) {
  const groupRef = useRef<Group>(null);
  const lightningRefs = useRef<Mesh[]>([]);
  const hairRefs = useRef<Mesh[]>([]);
  const hairGlowRefs = useRef<Mesh[]>([]);
  const auraRingRef = useRef<Mesh>(null);
  const innerAuraRef = useRef<Mesh>(null);

  // Generate lightning particles
  const lightningParticles = useMemo<LightningParticle[]>(() => {
    const result: LightningParticle[] = [];
    for (let i = 0; i < 16; i++) {
      result.push({
        startAngle: Math.random() * Math.PI * 2,
        endAngle: Math.random() * Math.PI * 2,
        radius: 1.5 + Math.random() * 1.0,
        speed: 2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return result;
  }, []);

  // Generate long flowing hair strands - 50 strands for full effect
  const hairStrands = useMemo<HairStrand[]>(() => {
    const result: HairStrand[] = [];

    // Inner layer - core strands (thicker, longer)
    for (let i = 0; i < 15; i++) {
      const spreadX = (Math.random() - 0.5) * 0.25;
      const spreadZ = -0.1 - Math.random() * 0.15;
      result.push({
        offsetX: spreadX,
        offsetZ: spreadZ,
        length: 1.8 + Math.random() * 0.8, // Long hair 1.8-2.6
        thickness: 0.025 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 0.5,
        layer: 0,
      });
    }

    // Middle layer - flowing strands
    for (let i = 0; i < 20; i++) {
      const spreadX = (Math.random() - 0.5) * 0.4;
      const spreadZ = -0.05 - Math.random() * 0.25;
      result.push({
        offsetX: spreadX,
        offsetZ: spreadZ,
        length: 1.5 + Math.random() * 1.0, // 1.5-2.5
        thickness: 0.02 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 0.8,
        layer: 1,
      });
    }

    // Outer layer - wispy strands (thinner, varied)
    for (let i = 0; i < 15; i++) {
      const spreadX = (Math.random() - 0.5) * 0.5;
      const spreadZ = Math.random() * 0.1 - 0.3;
      result.push({
        offsetX: spreadX,
        offsetZ: spreadZ,
        length: 1.2 + Math.random() * 1.2, // 1.2-2.4
        thickness: 0.015 + Math.random() * 0.008,
        phase: Math.random() * Math.PI * 2,
        speed: 1.8 + Math.random() * 1,
        layer: 2,
      });
    }

    return result;
  }, []);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const flyingMultiplier = isFlying ? 1.5 : 1;

    // Animate lightning particles
    lightningRefs.current.forEach((lightning, i) => {
      if (lightning && lightningParticles[i]) {
        const p = lightningParticles[i];
        const progress = ((time * p.speed + p.phase) % 1);
        const angle = p.startAngle + (p.endAngle - p.startAngle) * progress;

        lightning.position.x = Math.cos(angle) * p.radius;
        lightning.position.z = Math.sin(angle) * p.radius;
        lightning.position.y = (Math.random() - 0.5) * 2 + 0.5;

        // Flicker effect
        const flicker = Math.random() > 0.3 ? 1 : 0;
        lightning.scale.setScalar(flicker * (0.05 + Math.random() * 0.05));

        // Update opacity
        const material = lightning.material as THREE.MeshBasicMaterial;
        if (material) {
          material.opacity = flicker * 0.8;
        }
      }
    });

    // Animate hair - flowing in wind with more dramatic movement
    hairRefs.current.forEach((hair, i) => {
      if (hair && hairStrands[i]) {
        const h = hairStrands[i];
        const wave = Math.sin(time * h.speed + h.phase);
        const wave2 = Math.sin(time * h.speed * 0.7 + h.phase * 1.3);
        const flyWave = isFlying ? Math.sin(time * 3 + h.phase) * 0.4 : 0;

        // Different animation per layer
        const layerMultiplier = 1 + h.layer * 0.15;

        // Hair flows backward and waves dramatically
        hair.rotation.x = 0.4 + wave * 0.25 * layerMultiplier + flyWave;
        hair.rotation.z = wave2 * 0.2 * layerMultiplier;

        // Slight Y rotation for more natural look
        hair.rotation.y = Math.sin(time * h.speed * 0.3 + h.phase) * 0.1;
      }
    });

    // Animate hair glow layers
    hairGlowRefs.current.forEach((glow, i) => {
      if (glow && hairStrands[i]) {
        const h = hairStrands[i];
        const wave = Math.sin(time * h.speed + h.phase);
        const wave2 = Math.sin(time * h.speed * 0.7 + h.phase * 1.3);
        const flyWave = isFlying ? Math.sin(time * 3 + h.phase) * 0.4 : 0;
        const layerMultiplier = 1 + h.layer * 0.15;

        glow.rotation.x = 0.4 + wave * 0.25 * layerMultiplier + flyWave;
        glow.rotation.z = wave2 * 0.2 * layerMultiplier;
        glow.rotation.y = Math.sin(time * h.speed * 0.3 + h.phase) * 0.1;

        // Pulse glow
        const glowPulse = 1 + Math.sin(time * 2 + h.phase) * 0.2;
        const material = glow.material as THREE.MeshBasicMaterial;
        if (material) {
          material.opacity = 0.3 * glowPulse * flyingMultiplier;
        }
      }
    });

    // Animate aura ring - pulse and rotate
    if (auraRingRef.current) {
      auraRingRef.current.rotation.y = time * 0.2;
      auraRingRef.current.rotation.x = Math.PI / 2 + Math.sin(time) * 0.1;
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      auraRingRef.current.scale.setScalar(pulse);
    }

    // Animate inner aura
    if (innerAuraRef.current) {
      innerAuraRef.current.rotation.y = -time * 0.3;
      const innerPulse = 1 + Math.sin(time * 3 + Math.PI) * 0.15;
      innerAuraRef.current.scale.setScalar(innerPulse);
    }

    // Whole group gentle hover
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.05;

      // Slight tilt when flying
      if (isFlying) {
        groupRef.current.rotation.x = Math.sin(time * 0.8) * 0.08;
        groupRef.current.rotation.z = Math.sin(time * 0.6) * 0.05;
      } else {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
      }
    }
  });

  const flyingIntensity = isFlying ? 1.3 : 1;

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>

      {/* ============================================ */}
      {/* BODY - Robes */}
      {/* ============================================ */}

      {/* Main robe body - cone shape */}
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[0.45, 1.4, 8]} />
        <meshStandardMaterial
          color="#5D4E6D"
          emissive="#2A1B3D"
          emissiveIntensity={0.3 * intensity}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Inner robe layer */}
      <mesh position={[0, -0.15, 0.05]}>
        <coneGeometry args={[0.35, 1.2, 6]} />
        <meshStandardMaterial
          color="#3D2B4D"
          emissive="#1A0A2E"
          emissiveIntensity={0.2 * intensity}
          roughness={0.8}
        />
      </mesh>

      {/* Robe collar / shoulders */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.25]} />
        <meshStandardMaterial
          color="#6B5B7A"
          emissive="#2A1B3D"
          emissiveIntensity={0.3 * intensity}
          roughness={0.6}
        />
      </mesh>

      {/* Purple belt/sash */}
      <mesh position={[0, 0.1, 0.15]}>
        <boxGeometry args={[0.5, 0.08, 0.15]} />
        <meshStandardMaterial
          color="#9B59B6"
          emissive="#8E44AD"
          emissiveIntensity={0.5 * intensity}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Belt ornament */}
      <mesh position={[0, 0.1, 0.23]}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color="#E0B0FF"
          emissive="#9B59B6"
          emissiveIntensity={1 * intensity}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* ============================================ */}
      {/* HEAD */}
      {/* ============================================ */}

      {/* Head */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#E8D5C4"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Hair crown/top piece */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.1, 6]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#DAA520"
          emissiveIntensity={0.5 * intensity}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Crown ornament */}
      <mesh position={[0, 0.9, 0]}>
        <octahedronGeometry args={[0.04, 0]} />
        <meshStandardMaterial
          color="#00CED1"
          emissive="#00CED1"
          emissiveIntensity={1 * intensity * flyingIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ============================================ */}
      {/* LONG FLOWING WHITE HAIR - GLOWING */}
      {/* ============================================ */}

      {/* Hair base at head */}
      <mesh position={[0, 0.65, -0.08]}>
        <sphereGeometry args={[0.18, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.5 * intensity}
          roughness={0.4}
        />
      </mesh>

      {/* Main hair strands */}
      {hairStrands.map((strand, i) => (
        <group key={`hair-group-${i}`}>
          {/* Core hair strand */}
          <mesh
            ref={(el) => {
              if (el) hairRefs.current[i] = el;
            }}
            position={[strand.offsetX, 0.55, strand.offsetZ - 0.1]}
            rotation={[0.4, 0, 0]}
          >
            <capsuleGeometry args={[strand.thickness, strand.length, 4, 8]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.8 * intensity * flyingIntensity}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>

          {/* Glow layer around hair */}
          <mesh
            ref={(el) => {
              if (el) hairGlowRefs.current[i] = el;
            }}
            position={[strand.offsetX, 0.55, strand.offsetZ - 0.1]}
            rotation={[0.4, 0, 0]}
          >
            <capsuleGeometry args={[strand.thickness * 2, strand.length * 1.02, 4, 8]} />
            <meshBasicMaterial
              color="#E0E8FF"
              transparent
              opacity={0.3 * flyingIntensity}
            />
          </mesh>
        </group>
      ))}

      {/* Hair glow aura behind head */}
      <mesh position={[0, 0.4, -0.5]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[1.2, 2.5]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.1 * intensity * flyingIntensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Extra glow sphere around hair */}
      <mesh position={[0, 0.2, -0.4]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#E8E8FF"
          transparent
          opacity={0.08 * intensity * flyingIntensity}
        />
      </mesh>

      {/* ============================================ */}
      {/* AURA RING - Purple/Cyan circle behind */}
      {/* ============================================ */}

      {/* Main aura ring */}
      <mesh
        ref={auraRingRef}
        position={[0, 0.4, -0.3]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1.5, 0.04, 8, 64]} />
        <meshBasicMaterial
          color="#9B59B6"
          transparent
          opacity={0.6 * intensity * flyingIntensity}
        />
      </mesh>

      {/* Inner aura ring */}
      <mesh
        ref={innerAuraRef}
        position={[0, 0.4, -0.25]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1.2, 0.03, 8, 48]} />
        <meshBasicMaterial
          color="#00CED1"
          transparent
          opacity={0.5 * intensity * flyingIntensity}
        />
      </mesh>

      {/* Aura glow plane */}
      <mesh position={[0, 0.4, -0.4]} rotation={[0, 0, 0]}>
        <circleGeometry args={[1.6, 32]} />
        <meshBasicMaterial
          color="#6B3FA0"
          transparent
          opacity={0.15 * intensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ============================================ */}
      {/* LIGHTNING PARTICLES */}
      {/* ============================================ */}

      {lightningParticles.map((_, i) => (
        <mesh
          key={`lightning-${i}`}
          ref={(el) => {
            if (el) lightningRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00CED1' : '#9B59B6'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Static lightning bolts (decorative) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 8;
        return (
          <mesh
            key={`bolt-${i}`}
            position={[
              Math.cos(angle) * 1.7,
              0.3 + i * 0.15,
              Math.sin(angle) * 1.7,
            ]}
            rotation={[0, -angle, Math.PI / 4]}
          >
            <boxGeometry args={[0.4, 0.015, 0.01]} />
            <meshBasicMaterial
              color="#00CED1"
              transparent
              opacity={0.6 * intensity}
            />
          </mesh>
        );
      })}

      {/* ============================================ */}
      {/* GROUND CRYSTALS (when not flying) */}
      {/* ============================================ */}

      {!isFlying && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 0.8 + (i % 2) * 0.3;
            const height = 0.15 + Math.random() * 0.2;
            return (
              <mesh
                key={`crystal-${i}`}
                position={[
                  Math.cos(angle) * radius,
                  -0.85 + height / 2,
                  Math.sin(angle) * radius,
                ]}
                rotation={[0, angle, 0.1 * (i % 2 === 0 ? 1 : -1)]}
              >
                <coneGeometry args={[0.06, height, 4]} />
                <meshStandardMaterial
                  color="#9B59B6"
                  emissive="#6B3FA0"
                  emissiveIntensity={0.8 * intensity}
                  transparent
                  opacity={0.7}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* ============================================ */}
      {/* LIGHTS */}
      {/* ============================================ */}

      {/* Main purple glow */}
      <pointLight
        color="#9B59B6"
        intensity={1.5 * intensity * flyingIntensity}
        distance={10}
        position={[0, 0.5, 0]}
      />

      {/* Cyan accent light */}
      <pointLight
        color="#00CED1"
        intensity={0.8 * intensity * flyingIntensity}
        distance={8}
        position={[0, 0.8, -0.5]}
      />

      {/* Hair glow light - WHITE */}
      <pointLight
        color="#FFFFFF"
        intensity={1.2 * intensity * flyingIntensity}
        distance={5}
        position={[0, 0.5, -0.5]}
      />

      {/* Secondary hair glow */}
      <pointLight
        color="#E0E8FF"
        intensity={0.6 * intensity}
        distance={4}
        position={[0, 0, -0.8]}
      />
    </group>
  );
}

export default SwordCultivator;
