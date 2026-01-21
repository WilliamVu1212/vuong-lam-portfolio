import { useRef, useState, useMemo } from 'react';
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

      {/* Soul Banners - Cấm Phiên trấn yểm 2 bên */}
      <SoulBanner position={[-55, 0, 10]} rotation={Math.PI / 12} side="left" />
      <SoulBanner position={[55, 0, 10]} rotation={-Math.PI / 12} side="right" />

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
            width: '300px',
            pointerEvents: formHovered ? 'auto' : 'none',
          }}
        >
          <div
            className="p-5 rounded-lg"
            style={{
              backgroundColor: 'rgba(10, 21, 32, 0.95)',
              border: '1px solid #00CED1',
              boxShadow: '0 0 20px #00CED140',
            }}
          >
            <h3
              className="text-center mb-4 text-3xl"
              style={{
                color: '#00CED1',
                fontFamily: 'Dancing Script, cursive',
                fontWeight: 700,
                textShadow: '0 0 15px #00CED180'
              }}
            >
              William
            </h3>
            <div
              className="text-center leading-relaxed"
              style={{
                color: '#FFD700',
                fontFamily: 'Dancing Script, cursive',
                fontSize: '15px',
                fontWeight: 600,
                textShadow: '0 0 8px #FFD70060',
                lineHeight: '2'
              }}
            >
              <p>Thuận là Phàm</p>
              <p>Nghịch là Tiên</p>
              <p>Nghịch Thiên thành Tiên</p>
              <p>Nghịch Tiên thành Cổ</p>
            </div>
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

// ==================== SOUL BANNER (CẤM PHIÊN) ====================
interface SoulBannerProps {
  position: [number, number, number];
  rotation?: number;
  side: 'left' | 'right';
}

function SoulBanner({ position, rotation = 0, side }: SoulBannerProps) {
  const bannerRef = useRef<THREE.Group>(null);
  const clothRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Particle system for fire/energy effect
  const particleCount = 150;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Banner sway animation
    if (clothRef.current) {
      clothRef.current.rotation.z = Math.sin(t * 0.8 + (side === 'left' ? 0 : Math.PI)) * 0.03;
      clothRef.current.rotation.x = Math.sin(t * 0.6) * 0.02;
    }

    // Particle animation - fire rising effect
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.15 + Math.random() * 0.1;
        positions[i * 3] += Math.sin(t * 2 + i) * 0.02;

        // Reset particles that go too high
        if (positions[i * 3 + 1] > 55) {
          positions[i * 3 + 1] = Math.random() * 10;
          positions[i * 3] = (Math.random() - 0.5) * 8;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Glow pulsing
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  const mainColor = '#FF2222';
  const glowColor = '#FF4444';
  const goldColor = '#FFD700';

  return (
    <group ref={bannerRef} position={position} rotation={[0, rotation, 0]}>
      {/* === CÂY CỘT CHÍNH (POLE) === */}
      {/* Main pole - bamboo style */}
      <mesh position={[0, 30, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 60, 8]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.7}
          metalness={0.3}
          emissive={mainColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Pole top ornament - lotus bud */}
      <mesh position={[0, 61, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color={goldColor}
          emissive={goldColor}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Pole rings/joints */}
      {[15, 30, 45].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.6, 0.15, 8, 16]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* === THÂN PHƯỚN (BANNER CLOTH) === */}
      <group ref={clothRef} position={[0, 35, 0]}>
        {/* Top crossbar */}
        <mesh position={[0, 20, 0]} castShadow>
          <boxGeometry args={[12, 0.8, 0.8]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Crossbar end ornaments */}
        {[-6.5, 6.5].map((x, i) => (
          <group key={i} position={[x, 20, 0]}>
            <mesh>
              <sphereGeometry args={[0.8, 12, 12]} />
              <meshStandardMaterial
                color={goldColor}
                emissive={goldColor}
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Hanging tassels from crossbar ends */}
            <BannerTassel position={[0, -1, 0]} length={4} color={mainColor} />
          </group>
        ))}

        {/* Main banner body - trapezoidal shape like in image */}
        <group position={[0, 0, 0]}>
          {/* Banner back panel (darker) */}
          <mesh position={[0, 0, -0.2]} castShadow>
            <BannerShape />
            <meshStandardMaterial
              color="#660000"
              roughness={0.8}
              metalness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Banner front panel (main) */}
          <mesh position={[0, 0, 0]} castShadow>
            <BannerShape />
            <meshPhysicalMaterial
              color={mainColor}
              roughness={0.6}
              metalness={0.3}
              emissive={mainColor}
              emissiveIntensity={0.4}
              side={THREE.DoubleSide}
              transparent
              opacity={0.95}
              sheen={1}
              sheenColor={new THREE.Color(glowColor)}
            />
          </mesh>

          {/* Banner border - gold trim */}
          <BannerBorder color={goldColor} />

          {/* Center medallion/seal */}
          <mesh position={[0, 2, 0.3]}>
            <circleGeometry args={[3, 32]} />
            <meshStandardMaterial
              color={goldColor}
              emissive={goldColor}
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Inner seal ring */}
          <mesh position={[0, 2, 0.35]}>
            <ringGeometry args={[1.5, 2.5, 32]} />
            <meshStandardMaterial
              color="#220000"
              emissive={mainColor}
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Center core crystal */}
          <mesh position={[0, 2, 0.5]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={mainColor}
              emissive={mainColor}
              emissiveIntensity={2}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Rune circles on banner */}
          {[8, -6].map((y, i) => (
            <mesh key={i} position={[0, y, 0.25]}>
              <ringGeometry args={[1.5, 2, 32]} />
              <meshBasicMaterial
                color={goldColor}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}

          {/* Vertical rune lines */}
          {[-3, 3].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.25]}>
              <boxGeometry args={[0.15, 30, 0.05]} />
              <meshBasicMaterial color={goldColor} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>

        {/* Bottom tassels/fringe */}
        <group position={[0, -20, 0]}>
          {[-4, -2, 0, 2, 4].map((x, i) => (
            <BannerTassel
              key={i}
              position={[x, 0, 0]}
              length={8 + Math.abs(x) * 0.5}
              color={mainColor}
              hasOrnament={i === 2}
            />
          ))}
        </group>

        {/* Side hanging chains with coins */}
        {[-5.5, 5.5].map((x, i) => (
          <HangingChain key={i} position={[x, 15, 0.5]} side={i === 0 ? 'left' : 'right'} />
        ))}
      </group>

      {/* === HIỆU ỨNG PHÁT SÁNG === */}
      {/* Main glow aura */}
      <mesh ref={glowRef} position={[0, 35, 0]}>
        <planeGeometry args={[20, 50]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Fire particles */}
      <points ref={particlesRef} position={[0, 10, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color={glowColor}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Sparkles around banner */}
      <Sparkles
        count={60}
        scale={[15, 55, 8]}
        position={[0, 35, 0]}
        size={2}
        speed={0.5}
        color={glowColor}
      />

      {/* Lights */}
      <pointLight position={[0, 35, 5]} color={glowColor} intensity={3} distance={40} />
      <pointLight position={[0, 55, 0]} color={goldColor} intensity={1.5} distance={25} />
      <pointLight position={[0, 15, 3]} color={mainColor} intensity={2} distance={30} />
    </group>
  );
}

// Custom banner shape geometry - trapezoidal like Cấm Phiên
function BannerShape() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Top edge (wider)
    s.moveTo(-5, 18);
    s.lineTo(5, 18);
    // Right edge (curves inward slightly then out)
    s.lineTo(4.5, 10);
    s.lineTo(4, 0);
    s.lineTo(3.5, -10);
    s.lineTo(3, -18);
    // Bottom edge (narrower, pointed)
    s.lineTo(0, -20);
    s.lineTo(-3, -18);
    // Left edge
    s.lineTo(-3.5, -10);
    s.lineTo(-4, 0);
    s.lineTo(-4.5, 10);
    s.closePath();
    return s;
  }, []);

  return <shapeGeometry args={[shape]} />;
}

// Banner border/trim
function BannerBorder({ color }: { color: string }) {
  return (
    <group>
      {/* Border segments */}
      {[
        { start: [-5, 18], end: [5, 18] },
        { start: [5, 18], end: [3, -18] },
        { start: [3, -18], end: [0, -20] },
        { start: [0, -20], end: [-3, -18] },
        { start: [-3, -18], end: [-5, 18] },
      ].map((seg, i) => {
        const dx = seg.end[0] - seg.start[0];
        const dy = seg.end[1] - seg.start[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        return (
          <mesh
            key={i}
            position={[
              (seg.start[0] + seg.end[0]) / 2,
              (seg.start[1] + seg.end[1]) / 2,
              0.35
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[length, 0.4, 0.1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Tassel component
interface BannerTasselProps {
  position: [number, number, number];
  length: number;
  color: string;
  hasOrnament?: boolean;
}

function BannerTassel({ position, length, color, hasOrnament = false }: BannerTasselProps) {
  const tasselRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tasselRef.current) {
      const t = state.clock.elapsedTime;
      tasselRef.current.rotation.z = Math.sin(t * 1.5 + position[0]) * 0.1;
      tasselRef.current.rotation.x = Math.sin(t * 1.2) * 0.05;
    }
  });

  return (
    <group ref={tasselRef} position={position}>
      {/* Tassel knot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Tassel strands */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={i} position={[x, -length / 2 - 0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.05, length, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Bottom ornament for center tassel */}
      {hasOrnament && (
        <mesh position={[0, -length - 1, 0]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      )}
    </group>
  );
}

// Hanging chain with coins (like in the image)
interface HangingChainProps {
  position: [number, number, number];
  side: 'left' | 'right';
}

function HangingChain({ position, side }: HangingChainProps) {
  const chainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (chainRef.current) {
      const t = state.clock.elapsedTime;
      chainRef.current.rotation.z = Math.sin(t * 0.8 + (side === 'left' ? 0 : Math.PI)) * 0.08;
    }
  });

  return (
    <group ref={chainRef} position={position}>
      {/* Chain links */}
      {[0, -2, -4, -6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.08, 8, 12]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Coin at bottom */}
      <group position={[0, -8, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.15, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.6}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Square hole in coin */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.4, 0.2, 0.4]} />
          <meshStandardMaterial color="#220000" />
        </mesh>
      </group>
    </group>
  );
}

function CelestialGates() {
  return (
    <>
      {/* Main celestial gate - phía sau với title */}
      <CelestialGate position={[0, 0, -40]} scale={2} showTitle />

      {/* Side gates - phía sau */}
      <CelestialGate position={[-35, 0, -25]} scale={1.2} rotation={-Math.PI / 5} />
      <CelestialGate position={[35, 0, -25]} scale={1.2} rotation={Math.PI / 5} />
    </>
  );
}

interface CelestialGateProps {
  position: [number, number, number];
  scale: number;
  rotation?: number;
  showTitle?: boolean;
}

function CelestialGate({ position, scale, rotation = 0, showTitle = false }: CelestialGateProps) {
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

      {/* Title above main gate */}
      {showTitle && (
        <Html
          position={[0, 24, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="text-center px-8 py-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(10, 21, 32, 0.9)',
              border: '2px solid #00CED1',
              boxShadow: '0 0 40px #00CED180',
            }}
          >
            <h2 className="text-4xl" style={{
              color: '#00CED1',
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 700,
              textShadow: '0 0 20px #00CED180'
            }}>
              Vấn Đỉnh
            </h2>
          </div>
        </Html>
      )}

      {/* Gate lights */}
      <pointLight position={[0, 8, 2]} color="#00CED1" intensity={1.5} distance={20} />
      <pointLight position={[0, 18, 0]} color="#FFD700" intensity={0.8} distance={15} />
    </group>
  );
}

export default VanDinhSection;
