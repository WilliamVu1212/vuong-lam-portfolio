import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { contactInfo } from '@/data/content';

// Note: Contact form moved to VanDinhSection

interface ContactSectionProps {
  position?: [number, number, number];
}

export function ContactSection({ position = [0, 200, -550] }: ContactSectionProps) {
  return (
    <group position={position}>
      {/* Cloud Palace Platform */}
      <CloudPalace />

      {/* Central Crystal (decorative, no form) */}
      <CentralCrystal position={[0, 1, 0]} />

      {/* Social Links Pillars */}
      <SocialPillars />

      {/* Heavenly gates */}
      <HeavenlyGates />

      {/* Thần Phượng - Divine Phoenix trấn yểm 2 bên */}
      {/* Băng Phượng bên trái - Ice Phoenix */}
      <DivinePhoenix position={[-60, 0, 0]} type="ice" />
      {/* Hỏa Phượng bên phải - Fire Phoenix */}
      <DivinePhoenix position={[60, 0, 0]} type="fire" />

      {/* Ambient clouds and particles */}
      <AmbientEffects />
    </group>
  );
}

function CloudPalace() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.z = -state.clock.elapsedTime * 0.03;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group>
      {/* Physics collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[35, 1, 35]} position={[0, -1, 0]} />
      </RigidBody>

      {/* Main ethereal platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[35, 64]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.5}
          metalness={0.5}
          emissive="#FFD700"
          emissiveIntensity={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Multiple rotating rings */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[32, 35, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
      </mesh>

      <mesh ref={middleRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[22, 25, 64]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.4} />
      </mesh>

      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[12, 14, 64]} />
        <meshBasicMaterial color="#FF4444" transparent opacity={0.3} />
      </mesh>

      {/* Rune circles */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            Math.cos((Math.PI * 2 * i) / 8) * 28,
            0.06,
            Math.sin((Math.PI * 2 * i) / 8) * 28,
          ]}
        >
          <circleGeometry args={[2, 6]} />
          <meshBasicMaterial
            color={['#FF4444', '#FF8C00', '#FFD700', '#FF6B35'][i % 4]}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Central platform glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

interface CentralCrystalProps {
  position: [number, number, number];
}

function CentralCrystal({ position }: CentralCrystalProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      crystalRef.current.position.y = 15 + Math.sin(state.clock.elapsedTime) * 0.5;
    }
    if (runeRingRef.current) {
      runeRingRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      runeRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main altar base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[6, 8, 3, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.6}
          metalness={0.4}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Altar steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 3.5 + i * 1.5, 0]} castShadow>
          <cylinderGeometry args={[5 - i, 5.5 - i, 1.2, 8]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.7}
            metalness={0.3}
            emissive="#FF8C00"
            emissiveIntensity={0.05 + i * 0.05}
          />
        </mesh>
      ))}

      {/* Central pedestal */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[2, 3, 3, 6]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.4}
          metalness={0.6}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating crystal */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh ref={crystalRef} position={[0, 15, 0]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FF8C00"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* Crystal glow */}
      <mesh position={[0, 15, 0]} scale={1.5}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
      </mesh>

      {/* Rotating rune ring around crystal */}
      <group ref={runeRingRef} position={[0, 12, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((Math.PI * 2 * i) / 8) * 5,
              0,
              Math.sin((Math.PI * 2 * i) / 8) * 5,
            ]}
            rotation={[0, -(Math.PI * 2 * i) / 8, 0]}
          >
            <boxGeometry args={[0.3, 1.5, 0.1]} />
            <meshBasicMaterial
              color={['#FF4444', '#FF8C00', '#FFD700', '#FF6B35'][i % 4]}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Altar lights */}
      <pointLight position={[0, 15, 0]} color="#FFD700" intensity={3} distance={40} />
      <pointLight position={[0, 8, 0]} color="#FF8C00" intensity={1} distance={20} />

      {/* Energy sparkles */}
      <Sparkles
        count={80}
        scale={[15, 20, 15]}
        position={[0, 12, 0]}
        size={2}
        speed={0.8}
        color="#FFD700"
      />
    </group>
  );
}

function SocialPillars() {
  const socialLinks = contactInfo.social;
  const pillarPositions: [number, number, number][] = [
    [-20, 0, 15],
    [0, 0, 25],
    [20, 0, 15],
  ];

  return (
    <>
      {socialLinks.map((link, index) => (
        <SocialPillar
          key={link.platform}
          platform={link.platform}
          url={link.url}
          position={pillarPositions[index]}
          index={index}
        />
      ))}
    </>
  );
}

interface SocialPillarProps {
  platform: string;
  url: string;
  position: [number, number, number];
  index: number;
}

function SocialPillar({ platform, url, position, index }: SocialPillarProps) {
  const [hovered, setHovered] = useState(false);
  const orbRef = useRef<THREE.Mesh>(null);
  const colors = ['#FF4444', '#FF8C00', '#FFD700'];
  const color = colors[index % colors.length];

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5 + index;
      const material = orbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = hovered ? 2 : 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
    }
  });

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Pillar base */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[2, 2.5, 4, 6]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.7}
            metalness={0.3}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Pillar body */}
        <mesh position={[0, 6, 0]} castShadow>
          <cylinderGeometry args={[1.5, 2, 4, 6]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.6}
            metalness={0.4}
            emissive={color}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Top platform */}
        <mesh position={[0, 8.5, 0]}>
          <cylinderGeometry args={[2, 1.5, 1, 6]} />
          <meshStandardMaterial
            color="#1A0A0A"
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>

        {/* Social icon orb */}
        <mesh ref={orbRef} position={[0, 11, 0]}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Glow effect */}
        <mesh position={[0, 11, 0]} scale={hovered ? 2 : 1.5}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.4 : 0.2}
          />
        </mesh>

        {/* Platform label */}
        {hovered && (
          <Html position={[0, 14, 0]} center>
            <div className="glass px-3 py-2 rounded text-center whitespace-nowrap">
              <p className="text-co-chi font-bold">{platform}</p>
              <p className="text-xs text-tho-kim">Click để mở</p>
            </div>
          </Html>
        )}

        {/* Light */}
        <pointLight
          position={[0, 11, 0]}
          color={color}
          intensity={hovered ? 2 : 1}
          distance={15}
        />

        {/* Sparkles */}
        <Sparkles
          count={15}
          scale={[5, 8, 5]}
          position={[0, 10, 0]}
          size={1}
          speed={0.5}
          color={color}
        />
      </group>
    </Float>
  );
}

function HeavenlyGates() {
  return (
    <>
      {/* Main entrance gate - phía sau */}
      <HeavenlyGate position={[0, 0, -30]} rotation={Math.PI} scale={1.5} />

      {/* Side gates - phía sau */}
      <HeavenlyGate position={[-25, 0, -15]} rotation={Math.PI - Math.PI / 4} scale={1} />
      <HeavenlyGate position={[25, 0, -15]} rotation={Math.PI + Math.PI / 4} scale={1} />
    </>
  );
}

interface HeavenlyGateProps {
  position: [number, number, number];
  rotation: number;
  scale: number;
}

function HeavenlyGate({ position, rotation, scale }: HeavenlyGateProps) {
  const gateRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gateRef.current) {
      gateRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.name === 'glow') {
          const material = child.material as THREE.MeshBasicMaterial;
          material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={gateRef} position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Left pillar */}
      <mesh position={[-4, 6, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 12, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Right pillar */}
      <mesh position={[4, 6, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 12, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Top arch */}
      <mesh position={[0, 12.5, 0]} castShadow>
        <boxGeometry args={[10, 1, 1.5]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Decorative top piece */}
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[12, 0.5, 2]} />
        <meshStandardMaterial
          color="#1A0A0A"
          emissive="#FFD700"
          emissiveIntensity={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Gate glow */}
      <mesh name="glow" position={[0, 6, 0]}>
        <planeGeometry args={[6, 10]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top orb */}
      <mesh position={[0, 15, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Gate lights */}
      <pointLight position={[0, 6, 0]} color="#FFD700" intensity={1} distance={15} />
    </group>
  );
}

function AmbientEffects() {
  return (
    <>
      {/* Cloud layer below */}
      <CloudLayer position={[0, -20, 0]} />

      {/* Upper sparkles */}
      <Sparkles
        count={200}
        scale={[80, 40, 80]}
        position={[0, 20, 0]}
        size={1.5}
        speed={0.2}
        color="#FFD700"
      />

      {/* Fire particles rising */}
      <Sparkles
        count={100}
        scale={[60, 60, 60]}
        position={[0, 30, 0]}
        size={2}
        speed={0.8}
        color="#FF8C00"
      />
    </>
  );
}

// ============================================================
// THẦN PHƯỢNG - DIVINE PHOENIX
// Phượng hoàng uy nghi với cánh xòe rộng, nhìn chính diện
// Một con Băng Phượng (Ice), một con Hỏa Phượng (Fire)
// ============================================================

interface DivinePhoenixProps {
  position: [number, number, number];
  type: 'ice' | 'fire';
}

function DivinePhoenix({ position, type }: DivinePhoenixProps) {
  const phoenixRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const isIce = type === 'ice';

  // Color scheme
  const colors = isIce ? {
    primary: '#00BFFF',      // Deep sky blue
    secondary: '#00FFFF',    // Cyan
    glow: '#87CEEB',         // Sky blue
    accent: '#E0FFFF',       // Light cyan
    body: '#B0E0E6',         // Powder blue
    dark: '#1E90FF',         // Dodger blue
  } : {
    primary: '#FF4500',      // Orange red
    secondary: '#FFD700',    // Gold
    glow: '#FF8C00',         // Dark orange
    accent: '#FFFF00',       // Yellow
    body: '#FF6347',         // Tomato
    dark: '#DC143C',         // Crimson
  };

  // Particles data
  const particles = useMemo(() => {
    const arr: { pos: [number, number, number]; speed: number; size: number; delay: number }[] = [];
    for (let i = 0; i < 150; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 80,
          Math.random() * 60 - 10,
          (Math.random() - 0.5) * 40
        ],
        speed: 0.3 + Math.random() * 0.8,
        size: 0.2 + Math.random() * 0.6,
        delay: Math.random() * Math.PI * 2
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Body gentle hover
    if (phoenixRef.current) {
      phoenixRef.current.position.y = Math.sin(t * 0.5) * 2;
    }

    // Wings majestic flap - rất nhẹ nhàng
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = Math.PI / 4 + Math.sin(t * 1.2) * 0.08;
      leftWingRef.current.rotation.y = Math.sin(t * 0.8) * 0.05;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -Math.PI / 4 - Math.sin(t * 1.2) * 0.08;
      rightWingRef.current.rotation.y = -Math.sin(t * 0.8) * 0.05;
    }

    // Aura rotation
    if (auraRef.current) {
      auraRef.current.rotation.y = t * 0.2;
    }

    // Halo pulse
    if (haloRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.1;
      haloRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={position}>
      {/* Main phoenix body - nhìn chính diện về phía camera */}
      <group ref={phoenixRef}>

        {/* ===== VẦNG HÀO QUANG (DIVINE HALO) ===== */}
        <group ref={auraRef} position={[0, 25, -5]}>
          {/* Main halo ring */}
          <mesh ref={haloRef} rotation={[0, 0, 0]}>
            <ringGeometry args={[18, 22, 64]} />
            <meshBasicMaterial
              color={colors.secondary}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Inner glow */}
          <mesh rotation={[0, 0, 0]}>
            <circleGeometry args={[18, 64]} />
            <meshBasicMaterial
              color={colors.glow}
              transparent
              opacity={0.15}
            />
          </mesh>

          {/* Divine rays */}
          {[...Array(12)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / 12;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 20, Math.sin(angle) * 20, 0]}
                rotation={[0, 0, angle + Math.PI / 2]}
              >
                <planeGeometry args={[1.5, 15]} />
                <meshBasicMaterial
                  color={colors.accent}
                  transparent
                  opacity={0.4}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </group>

        {/* ===== THÂN PHƯỢNG (PHOENIX BODY) ===== */}
        <group position={[0, 10, 0]}>
          {/* Ngực/Bụng - oval lớn */}
          <mesh scale={[1, 1.3, 0.8]}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshPhysicalMaterial
              color={colors.body}
              emissive={colors.primary}
              emissiveIntensity={0.5}
              metalness={0.4}
              roughness={0.3}
              clearcoat={0.5}
            />
          </mesh>

          {/* Lông ngực chi tiết */}
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[0, -2 - i * 1.2, 3]} rotation={[-0.4, 0, 0]} scale={[1 - i * 0.1, 1, 1]}>
              <coneGeometry args={[2.5 - i * 0.3, 3, 8]} />
              <meshPhysicalMaterial
                color={colors.secondary}
                emissive={colors.glow}
                emissiveIntensity={0.3 + i * 0.1}
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>

        {/* ===== CỔ PHƯỢNG (NECK) ===== */}
        <group position={[0, 18, 2]}>
          <mesh rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[2, 3.5, 8, 16]} />
            <meshPhysicalMaterial
              color={colors.body}
              emissive={colors.primary}
              emissiveIntensity={0.4}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>

          {/* Lông cổ */}
          {[...Array(8)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / 8;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 2.5, -2, Math.sin(angle) * 2.5]}
                rotation={[0.5, angle, 0]}
              >
                <coneGeometry args={[0.4, 2, 6]} />
                <meshPhysicalMaterial
                  color={colors.secondary}
                  emissive={colors.glow}
                  emissiveIntensity={0.5}
                />
              </mesh>
            );
          })}
        </group>

        {/* ===== ĐẦU PHƯỢNG (HEAD) ===== */}
        <group position={[0, 26, 4]}>
          {/* Đầu chính */}
          <mesh scale={[1, 1.1, 0.9]}>
            <sphereGeometry args={[3, 32, 32]} />
            <meshPhysicalMaterial
              color={colors.body}
              emissive={colors.primary}
              emissiveIntensity={0.5}
              metalness={0.4}
              roughness={0.3}
              clearcoat={0.8}
            />
          </mesh>

          {/* Mỏ */}
          <mesh position={[0, 0, 3.5]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.8, 4, 8]} />
            <meshStandardMaterial
              color={colors.secondary}
              emissive={colors.accent}
              emissiveIntensity={1}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Mắt trái */}
          <mesh position={[-1.5, 0.8, 2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={3}
            />
          </mesh>

          {/* Mắt phải */}
          <mesh position={[1.5, 0.8, 2]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={3}
            />
          </mesh>

          {/* MÀO PHƯỢNG - Crown (7 lông cao ngất) */}
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
            const height = 8 - Math.abs(i) * 0.8;
            const xOffset = i * 0.8;
            return (
              <group key={i} position={[xOffset, 3, -1]} rotation={[-0.4 + Math.abs(i) * 0.05, 0, i * 0.08]}>
                {/* Lông chính */}
                <mesh>
                  <cylinderGeometry args={[0.1, 0.25, height, 8]} />
                  <meshPhysicalMaterial
                    color={colors.primary}
                    emissive={colors.secondary}
                    emissiveIntensity={1.2}
                    metalness={0.6}
                    roughness={0.2}
                  />
                </mesh>
                {/* Đầu lông phát sáng */}
                <mesh position={[0, height / 2 + 0.3, 0]}>
                  <sphereGeometry args={[0.3, 12, 12]} />
                  <meshStandardMaterial
                    color={colors.accent}
                    emissive={colors.accent}
                    emissiveIntensity={3}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* ===== CÁNH TRÁI (LEFT WING) - XÒE RỘNG ===== */}
        <group ref={leftWingRef} position={[-5, 15, 0]}>
          <MajesticWing colors={colors} side="left" />
        </group>

        {/* ===== CÁNH PHẢI (RIGHT WING) - XÒE RỘNG ===== */}
        <group ref={rightWingRef} position={[5, 15, 0]}>
          <MajesticWing colors={colors} side="right" />
        </group>

        {/* ===== ĐUÔI PHƯỢNG (MAJESTIC TAIL) ===== */}
        <group position={[0, 5, -8]}>
          <MajesticTail colors={colors} />
        </group>

        {/* ===== CHÂN PHƯỢNG (LEGS) ===== */}
        <group position={[0, 0, 0]}>
          {/* Chân trái */}
          <group position={[-2, 0, 2]}>
            <mesh rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.7, 6, 8]} />
              <meshStandardMaterial
                color={colors.secondary}
                emissive={colors.glow}
                emissiveIntensity={0.3}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Móng */}
            {[-0.4, 0, 0.4].map((x, i) => (
              <mesh key={i} position={[x, -4, 1]} rotation={[0.6, 0, (i - 1) * 0.15]}>
                <coneGeometry args={[0.15, 1.5, 6]} />
                <meshStandardMaterial
                  color={colors.secondary}
                  emissive={colors.accent}
                  emissiveIntensity={0.5}
                  metalness={0.8}
                />
              </mesh>
            ))}
          </group>

          {/* Chân phải */}
          <group position={[2, 0, 2]}>
            <mesh rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.7, 6, 8]} />
              <meshStandardMaterial
                color={colors.secondary}
                emissive={colors.glow}
                emissiveIntensity={0.3}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Móng */}
            {[-0.4, 0, 0.4].map((x, i) => (
              <mesh key={i} position={[x, -4, 1]} rotation={[0.6, 0, (i - 1) * 0.15]}>
                <coneGeometry args={[0.15, 1.5, 6]} />
                <meshStandardMaterial
                  color={colors.secondary}
                  emissive={colors.accent}
                  emissiveIntensity={0.5}
                  metalness={0.8}
                />
              </mesh>
            ))}
          </group>
        </group>

        {/* ===== PARTICLES VÀ EFFECTS ===== */}
        {particles.map((p, i) => (
          <PhoenixParticle
            key={i}
            initialPos={p.pos}
            speed={p.speed}
            size={p.size}
            delay={p.delay}
            color={colors.glow}
            isIce={isIce}
          />
        ))}

        {/* Sparkles chung quanh */}
        <Sparkles
          count={100}
          scale={[60, 50, 30]}
          position={[0, 20, 0]}
          size={2}
          speed={0.5}
          color={colors.secondary}
        />
        <Sparkles
          count={80}
          scale={[70, 40, 25]}
          position={[0, 15, 0]}
          size={3}
          speed={0.8}
          color={colors.accent}
        />

        {/* Lights */}
        <pointLight position={[0, 30, 10]} color={colors.secondary} intensity={5} distance={80} />
        <pointLight position={[-25, 20, 5]} color={colors.primary} intensity={3} distance={50} />
        <pointLight position={[25, 20, 5]} color={colors.primary} intensity={3} distance={50} />
        <pointLight position={[0, 10, 5]} color={colors.glow} intensity={4} distance={40} />
      </group>

      {/* ===== ĐẾ PHƯỢNG HOÀNG (PEDESTAL) ===== */}
      <DivinePedestal colors={colors} />
    </group>
  );
}

interface WingColors {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
  body: string;
  dark: string;
}

function MajesticWing({ colors, side }: { colors: WingColors; side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  const direction = isLeft ? -1 : 1;

  // Cánh xòe rộng với nhiều lớp lông
  return (
    <group rotation={[0, 0, direction * Math.PI / 4]}>
      {/* LAYER 1: Primary flight feathers - Lông bay chính (dài nhất) */}
      {[...Array(9)].map((_, i) => {
        const length = 35 - i * 2;
        const spreadAngle = direction * (i * 0.12);
        const yOffset = -i * 2;
        const xOffset = direction * i * 3;

        return (
          <group key={`primary-${i}`} position={[xOffset, yOffset, i * 0.3]} rotation={[0.1 * i, spreadAngle, direction * 0.05 * i]}>
            {/* Lông chính */}
            <mesh rotation={[0, 0, direction * Math.PI / 2]}>
              <coneGeometry args={[1.2 - i * 0.08, length, 8]} />
              <meshPhysicalMaterial
                color={colors.primary}
                emissive={colors.glow}
                emissiveIntensity={0.8 - i * 0.05}
                metalness={0.5}
                roughness={0.2}
                transparent
                opacity={0.95}
              />
            </mesh>
            {/* Viền phát sáng */}
            <mesh rotation={[0, 0, direction * Math.PI / 2]} scale={[1.15, 1.02, 1.15]}>
              <coneGeometry args={[1.2 - i * 0.08, length, 8]} />
              <meshBasicMaterial
                color={colors.accent}
                transparent
                opacity={0.35}
              />
            </mesh>
          </group>
        );
      })}

      {/* LAYER 2: Secondary feathers - Lông phụ (ngắn hơn) */}
      {[...Array(7)].map((_, i) => {
        const length = 22 - i * 1.5;
        const spreadAngle = direction * (i * 0.1 + 0.05);

        return (
          <group key={`secondary-${i}`} position={[direction * (i * 2 + 2), -i * 1.5 + 3, i * 0.2 - 1]} rotation={[0.05 * i, spreadAngle, direction * 0.03 * i]}>
            <mesh rotation={[0, 0, direction * Math.PI / 2]}>
              <coneGeometry args={[0.8 - i * 0.06, length, 6]} />
              <meshPhysicalMaterial
                color={colors.secondary}
                emissive={colors.glow}
                emissiveIntensity={0.6}
                metalness={0.4}
                roughness={0.3}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* LAYER 3: Covert feathers - Lông phủ (ngắn nhất, gần thân) */}
      {[...Array(5)].map((_, i) => {
        const length = 12 - i;

        return (
          <group key={`covert-${i}`} position={[direction * (i * 1.5 + 1), -i + 5, -2]} rotation={[0, direction * i * 0.08, direction * 0.1]}>
            <mesh rotation={[0, 0, direction * Math.PI / 2]}>
              <coneGeometry args={[0.6, length, 6]} />
              <meshPhysicalMaterial
                color={colors.body}
                emissive={colors.primary}
                emissiveIntensity={0.4}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* Hiệu ứng năng lượng tỏa ra từ cánh */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={`energy-${i}`}
          position={[
            direction * (8 + Math.random() * 20),
            Math.random() * 15 - 10,
            Math.random() * 8 - 4
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <tetrahedronGeometry args={[0.5 + Math.random() * 1, 0]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Wing glow aura */}
      <mesh position={[direction * 15, -5, 0]} rotation={[0, direction * 0.3, direction * Math.PI / 4]}>
        <planeGeometry args={[40, 35]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function MajesticTail({ colors }: { colors: WingColors }) {
  const tailFeathers = 11;

  return (
    <group rotation={[-0.4, 0, 0]}>
      {/* Lông đuôi chính - xòe như quạt */}
      {[...Array(tailFeathers)].map((_, i) => {
        const normalizedI = i - (tailFeathers - 1) / 2;
        const spreadAngle = normalizedI * 0.15;
        const length = 40 - Math.abs(normalizedI) * 3;
        const heightOffset = Math.abs(normalizedI) * 0.5;

        return (
          <group
            key={i}
            position={[normalizedI * 1.5, heightOffset, 0]}
            rotation={[heightOffset * 0.1, spreadAngle, 0]}
          >
            {/* Lông chính */}
            <mesh position={[0, 0, -length / 2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.6, length, 8]} />
              <meshPhysicalMaterial
                color={colors.primary}
                emissive={colors.glow}
                emissiveIntensity={0.7}
                metalness={0.5}
                roughness={0.2}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Lông tơ hai bên */}
            {[...Array(6)].map((_, j) => (
              <group key={j}>
                <mesh
                  position={[-0.8, 0, -8 - j * 5]}
                  rotation={[0, -0.4, 0]}
                >
                  <coneGeometry args={[0.25, 4 + j * 0.5, 6]} />
                  <meshPhysicalMaterial
                    color={colors.secondary}
                    emissive={colors.glow}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
                <mesh
                  position={[0.8, 0, -8 - j * 5]}
                  rotation={[0, 0.4, 0]}
                >
                  <coneGeometry args={[0.25, 4 + j * 0.5, 6]} />
                  <meshPhysicalMaterial
                    color={colors.secondary}
                    emissive={colors.glow}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
              </group>
            ))}

            {/* Đầu lông đuôi phát sáng */}
            <mesh position={[0, 0, -length + 2]}>
              <sphereGeometry args={[0.8, 12, 12]} />
              <meshStandardMaterial
                color={colors.accent}
                emissive={colors.accent}
                emissiveIntensity={2.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* Glow aura cho đuôi */}
      <mesh position={[0, 0, -25]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[20, 32]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

interface PhoenixParticleProps {
  initialPos: [number, number, number];
  speed: number;
  size: number;
  delay: number;
  color: string;
  isIce: boolean;
}

function PhoenixParticle({ initialPos, speed, size, delay, color, isIce }: PhoenixParticleProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + delay;

      if (isIce) {
        // Ice: particles rơi xuống và tan dần
        ref.current.position.y = initialPos[1] - (t % 40) + 20;
        ref.current.position.x = initialPos[0] + Math.sin(t * 0.3) * 3;
        ref.current.position.z = initialPos[2] + Math.cos(t * 0.2) * 2;
      } else {
        // Fire: particles bay lên
        ref.current.position.y = initialPos[1] + (t % 35);
        ref.current.position.x = initialPos[0] + Math.sin(t * 0.8) * 2;
        ref.current.position.z = initialPos[2] + Math.cos(t * 0.6) * 1.5;
      }

      ref.current.rotation.y = t;
      ref.current.rotation.x = t * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={initialPos}>
      {isIce ? (
        <octahedronGeometry args={[size, 0]} />
      ) : (
        <tetrahedronGeometry args={[size, 0]} />
      )}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function DivinePedestal({ colors }: { colors: WingColors }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
    if (runeRingRef.current) {
      runeRingRef.current.rotation.y = -state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, -5, 0]}>
      {/* Main platform */}
      <mesh receiveShadow>
        <cylinderGeometry args={[12, 15, 4, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.5}
          metalness={0.5}
          emissive={colors.dark}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Upper ring */}
      <mesh position={[0, 2.5, 0]} receiveShadow>
        <cylinderGeometry args={[10, 12, 1, 8]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.glow}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Rotating energy ring */}
      <mesh ref={ringRef} position={[0, 3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 10, 64]} />
        <meshBasicMaterial
          color={colors.secondary}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rune pillars xung quanh */}
      <group ref={runeRingRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (Math.PI * 2 * i) / 8;
          return (
            <group key={i} position={[Math.cos(angle) * 14, 0, Math.sin(angle) * 14]}>
              {/* Pillar */}
              <mesh>
                <cylinderGeometry args={[0.5, 0.7, 8, 6]} />
                <meshStandardMaterial
                  color={colors.primary}
                  emissive={colors.glow}
                  emissiveIntensity={0.6}
                  metalness={0.6}
                  roughness={0.3}
                />
              </mesh>
              {/* Rune on top */}
              <mesh position={[0, 5, 0]}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                  color={colors.accent}
                  emissive={colors.accent}
                  emissiveIntensity={2}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Central glow */}
      <mesh position={[0, 3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Platform light */}
      <pointLight position={[0, 5, 0]} color={colors.secondary} intensity={3} distance={30} />
    </group>
  );
}

interface CloudLayerProps {
  position: [number, number, number];
}

function CloudLayer({ position }: CloudLayerProps) {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={cloudsRef} position={position}>
      {[...Array(12)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 12;
        const radius = 30 + Math.random() * 20;
        return (
          <Float key={i} speed={0.5} floatIntensity={0.5}>
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.random() * 10,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[5 + Math.random() * 5, 8, 8]} />
              <meshStandardMaterial
                color="#2D1B1B"
                transparent
                opacity={0.4}
                emissive="#FF8C00"
                emissiveIntensity={0.1}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default ContactSection;
