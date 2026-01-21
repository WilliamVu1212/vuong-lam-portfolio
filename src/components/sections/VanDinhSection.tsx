import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

interface VanDinhSectionProps {
  position?: [number, number, number];
}

export function VanDinhSection({ position = [0, 260, -650] }: VanDinhSectionProps) {
  return (
    <group position={position}>
      {/* Peak Platform - Dinh cao tu luyen */}
      <PeakPlatform />

      {/* Central Throne */}
      <ImmortalThrone position={[0, 1, 0]} />

      {/* Floating Dao Tablets */}
      <DaoTablets />

      {/* Celestial Gates */}
      <CelestialGates />

      {/* Ultimate Energy */}
      <Sparkles
        count={300}
        scale={[120, 80, 120]}
        position={[0, 40, 0]}
        size={2.5}
        speed={0.3}
        color="#00CED1"
      />
      <Sparkles
        count={150}
        scale={[80, 60, 80]}
        position={[0, 50, 0]}
        size={3}
        speed={0.5}
        color="#FFD700"
      />
    </group>
  );
}

function PeakPlatform() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.02;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.z = -t * 0.03;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.04;
    }
  });

  return (
    <group>
      {/* Physics collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[45, 1, 45]} position={[0, -1, 0]} />
      </RigidBody>

      {/* Main platform - Octagonal peak */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[45, 8]} />
        <meshStandardMaterial
          color="#0a1520"
          roughness={0.4}
          metalness={0.6}
          emissive="#00CED1"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Mountain body */}
      <mesh position={[0, -35, 0]} castShadow>
        <coneGeometry args={[55, 70, 8]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.8}
          metalness={0.2}
          flatShading
          emissive="#00CED1"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Rotating rings */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[40, 45, 8]} />
        <meshBasicMaterial color="#00CED1" transparent opacity={0.5} />
      </mesh>

      <mesh ref={middleRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[28, 32, 8]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
      </mesh>

      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[15, 18, 8]} />
        <meshBasicMaterial color="#9400D3" transparent opacity={0.4} />
      </mesh>

      {/* Center glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshBasicMaterial color="#00CED1" transparent opacity={0.2} />
      </mesh>

      {/* Corner pillars */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <CornerPillar
          key={i}
          position={[
            Math.cos((Math.PI * 2 * i) / 8 + Math.PI / 8) * 38,
            0,
            Math.sin((Math.PI * 2 * i) / 8 + Math.PI / 8) * 38,
          ]}
          index={i}
        />
      ))}
    </group>
  );
}

interface CornerPillarProps {
  position: [number, number, number];
  index: number;
}

function CornerPillar({ position, index }: CornerPillarProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const colors = ['#00CED1', '#FFD700', '#9400D3', '#FF4444'];
  const color = colors[index % colors.length];

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.5 + index;
      const material = crystalRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Pillar base */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[1.5, 2, 8, 6]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.6}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Crystal on top */}
      <Float speed={2} floatIntensity={0.3}>
        <mesh ref={crystalRef} position={[0, 10, 0]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Light */}
      <pointLight position={[0, 10, 0]} color={color} intensity={0.8} distance={15} />
    </group>
  );
}

interface ImmortalThroneProps {
  position: [number, number, number];
}

function ImmortalThrone({ position }: ImmortalThroneProps) {
  const throneRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.position.y = 25 + Math.sin(t) * 1;
    }
    if (runeRingRef.current) {
      runeRingRef.current.rotation.y = -t * 0.2;
      runeRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={throneRef} position={position}>
      {/* Base pedestal - multi-tier */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[8, 10, 4, 8]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.5}
          metalness={0.5}
          emissive="#00CED1"
          emissiveIntensity={0.15}
        />
      </mesh>

      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[6, 8, 2, 8]} />
        <meshStandardMaterial
          color="#0a1520"
          roughness={0.4}
          metalness={0.6}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[4, 6, 3, 8]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.4}
          metalness={0.6}
          emissive="#9400D3"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Central pillar */}
      <mesh position={[0, 14, 0]} castShadow>
        <cylinderGeometry args={[2, 3, 10, 6]} />
        <meshStandardMaterial
          color="#0a1520"
          roughness={0.3}
          metalness={0.7}
          emissive="#00CED1"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ultimate Core - Dao Core */}
      <Float speed={1.5} floatIntensity={0.5}>
        <mesh ref={coreRef} position={[0, 25, 0]}>
          <icosahedronGeometry args={[3, 1]} />
          <meshStandardMaterial
            color="#00CED1"
            emissive="#00CED1"
            emissiveIntensity={2}
            metalness={0.95}
            roughness={0.05}
            transparent
            opacity={0.95}
          />
        </mesh>
      </Float>

      {/* Inner glow */}
      <mesh position={[0, 25, 0]} scale={1.8}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#00CED1" transparent opacity={0.2} />
      </mesh>

      {/* Rotating rune ring */}
      <group ref={runeRingRef} position={[0, 20, 0]}>
        {[...Array(12)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((Math.PI * 2 * i) / 12) * 6,
              0,
              Math.sin((Math.PI * 2 * i) / 12) * 6,
            ]}
            rotation={[0, -(Math.PI * 2 * i) / 12, 0]}
          >
            <boxGeometry args={[0.4, 2, 0.1]} />
            <meshBasicMaterial
              color={['#00CED1', '#FFD700', '#9400D3'][i % 3]}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Achievement Display */}
      <Html
        position={[0, 35, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="text-center px-6 py-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(10, 21, 32, 0.9)',
            border: '2px solid #00CED1',
            boxShadow: '0 0 40px #00CED180',
          }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: '#00CED1', fontFamily: 'Cinzel, serif' }}>
            Van Dinh
          </h2>
          <p className="text-sm" style={{ color: '#FFD700', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
            Questioning the Peak
          </p>
        </div>
      </Html>

      {/* Lights */}
      <pointLight position={[0, 25, 0]} color="#00CED1" intensity={4} distance={50} />
      <pointLight position={[0, 10, 0]} color="#FFD700" intensity={1} distance={25} />

      {/* Core sparkles */}
      <Sparkles
        count={80}
        scale={[15, 25, 15]}
        position={[0, 20, 0]}
        size={2}
        speed={1}
        color="#00CED1"
      />
    </group>
  );
}

function DaoTablets() {
  const tabletPositions: [number, number, number][] = [
    [-25, 5, 20],
    [25, 5, 20],
    [-30, 5, -15],
    [30, 5, -15],
  ];

  const wisdoms = [
    { title: 'Dao', subtitle: 'The Way of Code' },
    { title: 'De', subtitle: 'Virtue in Creation' },
    { title: 'Wu', subtitle: 'Mastery through Practice' },
    { title: 'Wei', subtitle: 'Action without Force' },
  ];

  return (
    <>
      {tabletPositions.map((pos, index) => (
        <DaoTablet
          key={index}
          position={pos}
          wisdom={wisdoms[index]}
          index={index}
        />
      ))}
    </>
  );
}

interface DaoTabletProps {
  position: [number, number, number];
  wisdom: { title: string; subtitle: string };
  index: number;
}

function DaoTablet({ position, wisdom, index }: DaoTabletProps) {
  const tabletRef = useRef<THREE.Mesh>(null);
  const colors = ['#00CED1', '#FFD700', '#9400D3', '#FF4444'];
  const color = colors[index % colors.length];

  useFrame((state) => {
    if (tabletRef.current) {
      const material = tabletRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group position={position}>
        {/* Tablet stone */}
        <mesh ref={tabletRef} castShadow>
          <boxGeometry args={[6, 10, 1]} />
          <meshStandardMaterial
            color="#1a2a3a"
            roughness={0.7}
            metalness={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Glow panel */}
        <mesh position={[0, 0, 0.51]}>
          <planeGeometry args={[5, 9]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>

        {/* Wisdom text */}
        <Html position={[0, 0, 0.6]} center style={{ pointerEvents: 'none' }}>
          <div className="text-center">
            <p className="text-2xl font-bold mb-1" style={{ color: color, fontFamily: 'Cinzel, serif' }}>
              {wisdom.title}
            </p>
            <p className="text-xs" style={{ color: '#C4A77D', fontFamily: 'Cormorant Garamond, serif' }}>
              {wisdom.subtitle}
            </p>
          </div>
        </Html>

        {/* Light */}
        <pointLight position={[0, 0, 2]} color={color} intensity={0.5} distance={10} />
      </group>
    </Float>
  );
}

function CelestialGates() {
  return (
    <>
      {/* Main celestial gate */}
      <CelestialGate position={[0, 0, 40]} scale={2} />

      {/* Side gates */}
      <CelestialGate position={[-35, 0, 25]} scale={1.2} rotation={Math.PI / 5} />
      <CelestialGate position={[35, 0, 25]} scale={1.2} rotation={-Math.PI / 5} />
    </>
  );
}

interface CelestialGateProps {
  position: [number, number, number];
  scale: number;
  rotation?: number;
}

function CelestialGate({ position, scale, rotation = 0 }: CelestialGateProps) {
  const gateRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gateRef.current) {
      gateRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.name === 'portal') {
          const material = child.material as THREE.MeshBasicMaterial;
          material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
        }
      });
    }
  });

  return (
    <group ref={gateRef} position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Left pillar */}
      <mesh position={[-5, 8, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 16, 8]} />
        <meshStandardMaterial
          color="#00CED1"
          emissive="#00CED1"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Right pillar */}
      <mesh position={[5, 8, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 16, 8]} />
        <meshStandardMaterial
          color="#00CED1"
          emissive="#00CED1"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Top arch */}
      <mesh position={[0, 16.5, 0]} castShadow>
        <boxGeometry args={[12, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Decorative top */}
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[14, 0.5, 2]} />
        <meshStandardMaterial
          color="#0a1520"
          emissive="#00CED1"
          emissiveIntensity={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Portal effect */}
      <mesh name="portal" position={[0, 8, 0]}>
        <planeGeometry args={[8, 14]} />
        <meshBasicMaterial
          color="#00CED1"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top crystal */}
      <Float speed={2} floatIntensity={0.3}>
        <mesh position={[0, 20, 0]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Gate lights */}
      <pointLight position={[0, 8, 2]} color="#00CED1" intensity={1.5} distance={20} />
      <pointLight position={[0, 18, 0]} color="#FFD700" intensity={0.8} distance={15} />
    </group>
  );
}

export default VanDinhSection;
