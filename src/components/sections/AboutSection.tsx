import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
// Content data not currently used but kept for future reference

interface AboutSectionProps {
  position?: [number, number, number];
}

export function AboutSection({ position = [0, 30, -100] }: AboutSectionProps) {
  return (
    <group position={position}>
      {/* Main Platform */}
      <AboutPlatform />

      {/* Pagoda Structure */}
      <Pagoda position={[0, 1, 0]} />

      {/* Info Stones */}
      <InfoStones />

      {/* Decorative Elements */}
      <Decorations />

      {/* Ambient Particles */}
      <Sparkles
        count={100}
        scale={[80, 30, 80]}
        position={[0, 15, 0]}
        size={2}
        speed={0.3}
        color="#FF8C00"
      />
    </group>
  );
}

function AboutPlatform() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group>
      {/* Physics collider for landing */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[40, 1, 40]} position={[0, -1, 0]} />
      </RigidBody>

      {/* Main circular platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[38, 40, 64]} />
        <meshBasicMaterial color="#FF4444" transparent opacity={0.6} />
      </mesh>

      {/* Inner decorative rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[25, 26, 64]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.4} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[15, 16, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

interface PagodaProps {
  position: [number, number, number];
}

function Pagoda({ position }: PagodaProps) {
  const pagodaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pagodaRef.current) {
      // Subtle floating animation
      pagodaRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={pagodaRef} position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[8, 10, 1, 8]} />
        <meshStandardMaterial
          color="#3D2424"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* First floor */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[7, 8, 3, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* First roof */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[10, 2, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Second floor */}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[5, 6, 2.5, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Second roof */}
      <mesh position={[0, 9, 0]} castShadow>
        <coneGeometry args={[7.5, 1.8, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Third floor */}
      <mesh position={[0, 10.5, 0]} castShadow>
        <cylinderGeometry args={[3.5, 4.5, 2, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Top roof */}
      <mesh position={[0, 12.5, 0]} castShadow>
        <coneGeometry args={[5.5, 2, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Spire orb */}
      <mesh position={[0, 17, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Light from pagoda */}
      <pointLight
        position={[0, 10, 0]}
        color="#FF8C00"
        intensity={2}
        distance={30}
      />

      {/* Lanterns on each corner */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Lantern
          key={i}
          position={[
            Math.cos((Math.PI * 2 * i) / 8) * 9,
            3,
            Math.sin((Math.PI * 2 * i) / 8) * 9,
          ]}
        />
      ))}
    </group>
  );
}

interface LanternProps {
  position: [number, number, number];
}

function Lantern({ position }: LanternProps) {
  const lanternRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lanternRef.current) {
      const material = lanternRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.3}>
      <group position={position}>
        {/* Lantern body */}
        <mesh ref={lanternRef}>
          <cylinderGeometry args={[0.4, 0.5, 1, 8]} />
          <meshStandardMaterial
            color="#FF4444"
            emissive="#FF4444"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Top cap */}
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.5, 0.3, 8]} />
          <meshStandardMaterial color="#1A0A0A" metalness={0.5} />
        </mesh>

        {/* Bottom cap */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.2, 8]} />
          <meshStandardMaterial color="#1A0A0A" metalness={0.5} />
        </mesh>

        {/* Light */}
        <pointLight color="#FF6B35" intensity={0.5} distance={8} />
      </group>
    </Float>
  );
}

function InfoStones() {
  const stones = [
    { position: [-20, 1, 15] as [number, number, number], rotation: 0.3, content: 'name' },
    { position: [20, 1, 15] as [number, number, number], rotation: -0.3, content: 'title' },
    { position: [-25, 1, -10] as [number, number, number], rotation: 0.5, content: 'bio' },
    { position: [25, 1, -10] as [number, number, number], rotation: -0.5, content: 'journey' },
  ];

  return (
    <>
      {stones.map((stone, index) => (
        <InfoStone
          key={index}
          position={stone.position}
          rotation={stone.rotation}
          contentType={stone.content}
          index={index}
        />
      ))}
    </>
  );
}

interface InfoStoneProps {
  position: [number, number, number];
  rotation: number;
  contentType: string;
  index: number;
}

function InfoStone({ position, rotation, index }: InfoStoneProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group position={position} rotation={[0, rotation, 0]}>
        {/* Stone base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 8, 1]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Stone frame */}
        <mesh position={[0, 0, 0.51]}>
          <boxGeometry args={[5.5, 7.5, 0.1]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.8}
          />
        </mesh>

        {/* Glow border */}
        <mesh ref={glowRef} position={[0, 0, 0.52]}>
          <planeGeometry args={[5.8, 7.8]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Title text (simplified - using plane with color) */}
        <mesh position={[0, 2.5, 0.55]}>
          <planeGeometry args={[4, 1]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>

        {/* Content indicator */}
        <mesh position={[0, 0, 0.55]}>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial color="#F5E6D3" transparent opacity={0.1} />
        </mesh>

        {/* Corner decorations */}
        {[[-2.5, 3.5], [2.5, 3.5], [-2.5, -3.5], [2.5, -3.5]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.53]}>
            <circleGeometry args={[0.3, 6]} />
            <meshBasicMaterial color="#FF4444" />
          </mesh>
        ))}

        {/* Light */}
        <pointLight
          position={[0, 0, 2]}
          color="#FF8C00"
          intensity={0.3}
          distance={5}
        />
      </group>
    </Float>
  );
}

function Decorations() {
  return (
    <>
      {/* Torii gates at entrance points */}
      <ToriiGate position={[0, 0, 35]} rotation={0} />
      <ToriiGate position={[0, 0, -35]} rotation={Math.PI} />
      <ToriiGate position={[35, 0, 0]} rotation={Math.PI / 2} />
      <ToriiGate position={[-35, 0, 0]} rotation={-Math.PI / 2} />

      {/* Cherry blossom trees */}
      <CherryTree position={[-15, 0, 25]} />
      <CherryTree position={[15, 0, 25]} />
      <CherryTree position={[-25, 0, -20]} />
      <CherryTree position={[25, 0, -20]} />
    </>
  );
}

interface ToriiGateProps {
  position: [number, number, number];
  rotation: number;
}

function ToriiGate({ position, rotation }: ToriiGateProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Left pillar */}
      <mesh position={[-3, 4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 8, 8]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right pillar */}
      <mesh position={[3, 4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 8, 8]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[8, 0.6, 0.8]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Second beam */}
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[6.5, 0.4, 0.6]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Roof piece */}
      <mesh position={[0, 8.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[9, 0.3, 1.2]} />
        <meshStandardMaterial
          color="#1A0A0A"
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

interface CherryTreeProps {
  position: [number, number, number];
}

function CherryTree({ position }: CherryTreeProps) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 6, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>

      {/* Branches/Foliage - using spheres for cherry blossoms */}
      <mesh position={[0, 7, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial
          color="#FF69B4"
          emissive="#FF1493"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh position={[-1.5, 6, 1]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#FF69B4"
          emissive="#FF1493"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh position={[1.5, 6.5, -1]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshStandardMaterial
          color="#FFB6C1"
          emissive="#FF69B4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Sparkles for falling petals effect */}
      <Sparkles
        count={30}
        scale={[8, 10, 8]}
        position={[0, 5, 0]}
        size={1}
        speed={0.5}
        color="#FFB6C1"
      />
    </group>
  );
}

export default AboutSection;
