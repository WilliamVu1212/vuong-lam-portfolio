import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useGameStore } from '@/stores/gameStore';

interface RidingPhoenixProps {
  velocity: Vector3;
  phoenixType?: 'fire' | 'ice';
}

// Phoenix color schemes
const PHOENIX_COLORS = {
  fire: {
    primary: '#FF4500',    // Orange red
    secondary: '#FFD700',  // Gold
    accent: '#FFFF00',     // Yellow
    glow: '#FF6B35',       // Bright orange
  },
  ice: {
    primary: '#00BFFF',    // Deep sky blue
    secondary: '#00FFFF',  // Cyan
    accent: '#E0FFFF',     // Light cyan
    glow: '#40E0D0',       // Turquoise
  },
};

export function RidingPhoenix({ velocity, phoenixType = 'fire' }: RidingPhoenixProps) {
  const groupRef = useRef<Group>(null);
  const leftWingRef = useRef<Group>(null);
  const rightWingRef = useRef<Group>(null);
  const tailRef = useRef<Group>(null);

  const isFlying = useGameStore((state) => state.player.isFlying);
  const transportMode = useGameStore((state) => state.transportMode);

  const colors = PHOENIX_COLORS[phoenixType];

  // Trail particles
  const trailParticles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 1,
      z: Math.random() * 8,
      scale: 0.1 + Math.random() * 0.2,
      speed: 0.5 + Math.random() * 1,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !isFlying || transportMode !== 'beast') return;

    const t = state.clock.elapsedTime;
    const speed = velocity.length();
    const speedFactor = Math.min(speed / 80, 1); // Normalize to max speed

    // Tilt phoenix based on velocity
    const tiltX = velocity.z * 0.015; // Pitch
    const tiltZ = -velocity.x * 0.02; // Roll

    groupRef.current.rotation.x = tiltX;
    groupRef.current.rotation.z = tiltZ;

    // Subtle hover
    groupRef.current.position.y = Math.sin(t * 2) * 0.1;

    // Wing flapping - faster when moving fast
    const flapSpeed = 3 + speedFactor * 4;
    const flapAmount = 0.15 + speedFactor * 0.1;

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = Math.PI / 5 + Math.sin(t * flapSpeed) * flapAmount;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -Math.PI / 5 - Math.sin(t * flapSpeed) * flapAmount;
    }

    // Tail wave
    if (tailRef.current) {
      tailRef.current.rotation.x = Math.sin(t * 2) * 0.1;
      tailRef.current.children.forEach((child, i) => {
        child.rotation.y = Math.sin(t * 3 + i * 0.3) * 0.1;
      });
    }
  });

  if (!isFlying || transportMode !== 'beast') return null;

  return (
    <group ref={groupRef} position={[0, -2.5, 0]} scale={0.4}>
      {/* ========== BODY ========== */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshPhysicalMaterial
          color={colors.primary}
          emissive={colors.primary}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.4}
          clearcoat={0.5}
        />
      </mesh>

      {/* Body feathers - chest */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`chest-${i}`}
          position={[
            (i - 2) * 0.4,
            -0.5,
            1.5,
          ]}
          rotation={[-0.3, 0, 0]}
        >
          <coneGeometry args={[0.3, 1.2, 4]} />
          <meshPhysicalMaterial
            color={colors.secondary}
            emissive={colors.secondary}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* ========== NECK ========== */}
      <group position={[0, 1.5, 1]}>
        <mesh rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 2.5, 8]} />
          <meshPhysicalMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Neck feathers */}
        {[...Array(8)].map((_, i) => (
          <mesh
            key={`neck-${i}`}
            position={[
              Math.cos(i * Math.PI / 4) * 0.6,
              1 + (i % 2) * 0.3,
              Math.sin(i * Math.PI / 4) * 0.3,
            ]}
            rotation={[-0.3, i * Math.PI / 4, 0]}
          >
            <coneGeometry args={[0.15, 0.8, 4]} />
            <meshPhysicalMaterial
              color={colors.secondary}
              emissive={colors.accent}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ========== HEAD ========== */}
      <group position={[0, 3.5, 2]}>
        {/* Main head */}
        <mesh>
          <sphereGeometry args={[0.8, 12, 12]} />
          <meshPhysicalMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Beak */}
        <mesh position={[0, -0.1, 0.8]} rotation={[-0.2, 0, 0]}>
          <coneGeometry args={[0.25, 1, 4]} />
          <meshStandardMaterial
            color={colors.secondary}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.4, 0.2, 0.5]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.4, 0.2, 0.55]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.4, 0.2, 0.5]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.4, 0.2, 0.55]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Crown feathers */}
        {[...Array(7)].map((_, i) => (
          <group key={`crown-${i}`}>
            <mesh
              position={[
                (i - 3) * 0.2,
                0.6 + Math.abs(i - 3) * 0.1,
                -0.2,
              ]}
              rotation={[-0.3, 0, (i - 3) * 0.1]}
            >
              <coneGeometry args={[0.08, 1.5 - Math.abs(i - 3) * 0.15, 4]} />
              <meshPhysicalMaterial
                color={colors.secondary}
                emissive={colors.accent}
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* Glowing tip */}
            <mesh
              position={[
                (i - 3) * 0.2,
                1.8 - Math.abs(i - 3) * 0.15,
                -0.4,
              ]}
            >
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={colors.accent} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========== LEFT WING ========== */}
      <group ref={leftWingRef} position={[-1.8, 0.5, 0]} rotation={[0, 0, Math.PI / 5]}>
        {/* Primary feathers - longest */}
        {[...Array(9)].map((_, i) => (
          <mesh
            key={`left-primary-${i}`}
            position={[
              -2 - i * 0.8,
              -i * 0.3,
              i * 0.2,
            ]}
            rotation={[0, 0.2, -0.1 - i * 0.05]}
          >
            <coneGeometry args={[0.2, 6 - i * 0.3, 4]} />
            <meshPhysicalMaterial
              color={colors.primary}
              emissive={colors.primary}
              emissiveIntensity={0.3}
              side={2}
            />
          </mesh>
        ))}

        {/* Secondary feathers */}
        {[...Array(7)].map((_, i) => (
          <mesh
            key={`left-secondary-${i}`}
            position={[
              -1 - i * 0.6,
              0.3 - i * 0.2,
              -0.5 + i * 0.15,
            ]}
            rotation={[0, 0.1, -0.05 - i * 0.03]}
          >
            <coneGeometry args={[0.15, 4 - i * 0.2, 4]} />
            <meshPhysicalMaterial
              color={colors.secondary}
              emissive={colors.secondary}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Covert feathers - shortest, near body */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={`left-covert-${i}`}
            position={[
              -0.5 - i * 0.4,
              0.5,
              -0.8,
            ]}
            rotation={[0.1, 0, -0.02 * i]}
          >
            <coneGeometry args={[0.12, 2, 4]} />
            <meshPhysicalMaterial
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ========== RIGHT WING (Mirror of left) ========== */}
      <group ref={rightWingRef} position={[1.8, 0.5, 0]} rotation={[0, 0, -Math.PI / 5]}>
        {/* Primary feathers */}
        {[...Array(9)].map((_, i) => (
          <mesh
            key={`right-primary-${i}`}
            position={[
              2 + i * 0.8,
              -i * 0.3,
              i * 0.2,
            ]}
            rotation={[0, -0.2, 0.1 + i * 0.05]}
          >
            <coneGeometry args={[0.2, 6 - i * 0.3, 4]} />
            <meshPhysicalMaterial
              color={colors.primary}
              emissive={colors.primary}
              emissiveIntensity={0.3}
              side={2}
            />
          </mesh>
        ))}

        {/* Secondary feathers */}
        {[...Array(7)].map((_, i) => (
          <mesh
            key={`right-secondary-${i}`}
            position={[
              1 + i * 0.6,
              0.3 - i * 0.2,
              -0.5 + i * 0.15,
            ]}
            rotation={[0, -0.1, 0.05 + i * 0.03]}
          >
            <coneGeometry args={[0.15, 4 - i * 0.2, 4]} />
            <meshPhysicalMaterial
              color={colors.secondary}
              emissive={colors.secondary}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Covert feathers */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={`right-covert-${i}`}
            position={[
              0.5 + i * 0.4,
              0.5,
              -0.8,
            ]}
            rotation={[0.1, 0, 0.02 * i]}
          >
            <coneGeometry args={[0.12, 2, 4]} />
            <meshPhysicalMaterial
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ========== TAIL ========== */}
      <group ref={tailRef} position={[0, -0.5, -2]}>
        {/* Main tail feathers */}
        {[...Array(11)].map((_, i) => {
          const angle = ((i - 5) / 5) * 0.6;
          const length = 8 - Math.abs(i - 5) * 0.5;
          return (
            <group key={`tail-${i}`}>
              <mesh
                position={[
                  Math.sin(angle) * 1,
                  0,
                  -length / 2,
                ]}
                rotation={[0.2, angle, 0]}
              >
                <coneGeometry args={[0.15, length, 4]} />
                <meshPhysicalMaterial
                  color={i % 2 === 0 ? colors.primary : colors.secondary}
                  emissive={i % 2 === 0 ? colors.primary : colors.secondary}
                  emissiveIntensity={0.4}
                />
              </mesh>
              {/* Tail feather tip glow */}
              <mesh
                position={[
                  Math.sin(angle) * 1,
                  0,
                  -length - 0.5,
                ]}
              >
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color={colors.accent} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ========== LEGS (tucked during flight) ========== */}
      {[-1, 1].map((side) => (
        <group key={`leg-${side}`} position={[side * 0.8, -1.5, 0.5]} rotation={[0.8, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.1, 1.5, 6]} />
            <meshStandardMaterial color={colors.secondary} metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Claws */}
          {[0, 1, 2].map((claw) => (
            <mesh
              key={`claw-${claw}`}
              position={[
                Math.cos(claw * Math.PI / 3 - Math.PI / 3) * 0.15,
                -0.9,
                Math.sin(claw * Math.PI / 3 - Math.PI / 3) * 0.15,
              ]}
              rotation={[0.3, 0, (claw - 1) * 0.3]}
            >
              <coneGeometry args={[0.05, 0.4, 4]} />
              <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ========== TRAIL PARTICLES ========== */}
      <group position={[0, 0, -4]}>
        {trailParticles.map((particle) => (
          <mesh
            key={particle.id}
            position={[particle.x, particle.y, particle.z]}
          >
            <sphereGeometry args={[particle.scale, 6, 6]} />
            <meshBasicMaterial
              color={phoenixType === 'fire' ? colors.glow : colors.secondary}
              transparent
              opacity={0.6 - particle.z * 0.05}
            />
          </mesh>
        ))}
      </group>

      {/* ========== LIGHTS ========== */}
      <pointLight
        color={colors.glow}
        intensity={3}
        distance={15}
        position={[0, 0, 0]}
      />
      <pointLight
        color={colors.secondary}
        intensity={2}
        distance={10}
        position={[0, 2, 2]}
      />
      <pointLight
        color={colors.accent}
        intensity={1.5}
        distance={8}
        position={[0, 0, -5]}
      />

      {/* Body glow aura */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
}

export default RidingPhoenix;
