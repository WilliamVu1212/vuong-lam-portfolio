import { useRef, useState } from 'react';
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

      {/* Contact Form */}
      <ContactAltar position={[0, 1, 25]} />

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
          <h2 className="text-2xl font-bold" style={{ color: '#00CED1', fontFamily: 'Cinzel, serif' }}>
            Vấn Đỉnh
          </h2>
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

interface ContactAltarProps {
  position: [number, number, number];
}

function ContactAltar({ position }: ContactAltarProps) {
  const [formHovered, setFormHovered] = useState(false);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      crystalRef.current.position.y = 12 + Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Altar base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5, 6, 3, 8]} />
        <meshStandardMaterial
          color="#0a1520"
          roughness={0.5}
          metalness={0.5}
          emissive="#00CED1"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Altar pedestal */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[3.5, 5, 2, 8]} />
        <meshStandardMaterial
          color="#1a2a3a"
          roughness={0.4}
          metalness={0.6}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Communication crystal */}
      <Float speed={2} floatIntensity={0.3}>
        <mesh ref={crystalRef} position={[0, 12, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#00CED1"
            emissive="#00CED1"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* Crystal glow */}
      <mesh position={[0, 12, 0]} scale={1.3}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#00CED1" transparent opacity={0.2} />
      </mesh>

      {/* Contact form display */}
      <group
        position={[0, 7, 3]}
        onPointerEnter={() => setFormHovered(true)}
        onPointerLeave={() => setFormHovered(false)}
      >
        {/* Display panel */}
        <mesh castShadow>
          <boxGeometry args={[8, 7, 0.5]} />
          <meshStandardMaterial
            color="#0a1520"
            roughness={0.4}
            metalness={0.6}
            emissive="#00CED1"
            emissiveIntensity={formHovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Panel glow */}
        <mesh position={[0, 0, 0.26]}>
          <planeGeometry args={[7.5, 6.5]} />
          <meshBasicMaterial
            color="#00CED1"
            transparent
            opacity={formHovered ? 0.3 : 0.15}
          />
        </mesh>

        {/* HTML Contact Form */}
        <Html
          position={[0, 0, 0.3]}
          center
          transform
          occlude
          style={{
            width: '280px',
            pointerEvents: formHovered ? 'auto' : 'none',
          }}
        >
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(10, 21, 32, 0.95)',
              border: '1px solid #00CED1',
              boxShadow: '0 0 20px #00CED140',
            }}
          >
            <h3
              className="text-center mb-3 text-lg font-bold"
              style={{ color: '#00CED1', fontFamily: 'Cinzel, serif' }}
            >
              Liên Hệ Vương Lâm VN
            </h3>
            <form className="space-y-2">
              <input
                type="text"
                placeholder="Tên của bạn"
                className="w-full px-3 py-2 rounded text-sm focus:outline-none"
                style={{
                  backgroundColor: 'rgba(0, 206, 209, 0.1)',
                  border: '1px solid rgba(0, 206, 209, 0.3)',
                  color: '#E0E0E0',
                }}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 rounded text-sm focus:outline-none"
                style={{
                  backgroundColor: 'rgba(0, 206, 209, 0.1)',
                  border: '1px solid rgba(0, 206, 209, 0.3)',
                  color: '#E0E0E0',
                }}
              />
              <select
                className="w-full px-3 py-2 rounded text-sm focus:outline-none"
                style={{
                  backgroundColor: 'rgba(10, 21, 32, 0.95)',
                  border: '1px solid rgba(0, 206, 209, 0.3)',
                  color: '#E0E0E0',
                }}
              >
                <option value="">Chọn chủ đề</option>
                <option value="project">Hợp tác dự án</option>
                <option value="job">Cơ hội việc làm</option>
                <option value="other">Khác</option>
              </select>
              <textarea
                placeholder="Tin nhắn..."
                rows={3}
                className="w-full px-3 py-2 rounded text-sm focus:outline-none resize-none"
                style={{
                  backgroundColor: 'rgba(0, 206, 209, 0.1)',
                  border: '1px solid rgba(0, 206, 209, 0.3)',
                  color: '#E0E0E0',
                }}
              />
              <button
                type="submit"
                className="w-full py-2 rounded font-bold transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(90deg, #00CED1, #FFD700)',
                  color: '#0a1520',
                }}
              >
                Gửi Tin Nhắn
              </button>
            </form>
          </div>
        </Html>
      </group>

      {/* Altar lights */}
      <pointLight position={[0, 12, 0]} color="#00CED1" intensity={2} distance={25} />
      <pointLight position={[0, 5, 0]} color="#FFD700" intensity={0.5} distance={15} />

      {/* Energy sparkles */}
      <Sparkles
        count={40}
        scale={[10, 15, 10]}
        position={[0, 8, 0]}
        size={1.5}
        speed={0.8}
        color="#00CED1"
      />
    </group>
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
