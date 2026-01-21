import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { contactInfo } from '@/data/content';
import { useGameStore } from '@/stores/gameStore';

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

      {/* Thượng Cổ Đồng Chung - Ancient Divine Bell trấn yểm 2 bên */}
      {/* Thanh Minh Chung bên trái - Cyan Bell */}
      <AncientDivineBell position={[-60, 0, 0]} type="ice" />
      {/* Hoàng Kim Chung bên phải - Golden Bell */}
      <AncientDivineBell position={[60, 0, 0]} type="fire" />

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
// THƯỢNG CỔ ĐỒNG CHUNG - ANCIENT DIVINE BELL
// Pháp bảo thượng cổ hình chuông đồng phát sáng màu xanh lục
// Một con bên trái (Băng - Ice), một con bên phải (Hỏa - Fire)
// ============================================================

interface AncientDivineBellProps {
  position: [number, number, number];
  type: 'ice' | 'fire';
}

function AncientDivineBell({ position, type }: AncientDivineBellProps) {
  const bellRef = useRef<THREE.Group>(null);
  const runeRingRef = useRef<THREE.Group>(null);

  // Unlock trigger state - only fire bell can unlock
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Store hooks
  const playerPosition = useGameStore((state) => state.player.position);
  const unlockedTransports = useGameStore((state) => state.unlockedTransports);
  const unlockTransport = useGameStore((state) => state.unlockTransport);
  const setTransportMode = useGameStore((state) => state.setTransportMode);

  const isIce = type === 'ice';
  const isFire = type === 'fire';

  // Color scheme - Xanh lục như trong ảnh
  const colors = isIce ? {
    primary: '#00FF88',      // Bright green
    secondary: '#00FFAA',    // Cyan-green
    glow: '#66FFCC',         // Light green
    accent: '#AAFFDD',       // Pale green
    body: '#33CC77',         // Medium green
    dark: '#006644',         // Dark green
    rune: '#00FFFF',         // Cyan runes
  } : {
    primary: '#44FF44',      // Lime green
    secondary: '#88FF00',    // Yellow-green
    glow: '#99FF66',         // Light lime
    accent: '#CCFF99',       // Pale lime
    body: '#66CC33',         // Medium lime
    dark: '#336600',         // Dark lime
    rune: '#FFFF00',         // Yellow runes
  };

  // Particles data
  const particles = useMemo(() => {
    const arr: { pos: [number, number, number]; speed: number; size: number; delay: number }[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 40,
          Math.random() * 50 - 5,
          (Math.random() - 0.5) * 40
        ],
        speed: 0.2 + Math.random() * 0.5,
        size: 0.15 + Math.random() * 0.4,
        delay: Math.random() * Math.PI * 2
      });
    }
    return arr;
  }, []);

  // Ancient rune symbols on the bell
  const runeSymbols = useMemo(() => {
    const symbols: { angle: number; height: number; scale: number }[] = [];
    // 3 rows of runes
    for (let row = 0; row < 3; row++) {
      const runeCount = 8 - row * 2;
      for (let i = 0; i < runeCount; i++) {
        symbols.push({
          angle: (Math.PI * 2 * i) / runeCount + row * 0.2,
          height: 12 + row * 8,
          scale: 1 - row * 0.2
        });
      }
    }
    return symbols;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Bell gentle hover and swing
    if (bellRef.current) {
      bellRef.current.position.y = Math.sin(t * 0.3) * 1.5;
      bellRef.current.rotation.y = Math.sin(t * 0.15) * 0.05;
      bellRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
    }

    // Rune ring rotation
    if (runeRingRef.current) {
      runeRingRef.current.rotation.y = t * 0.3;
    }

    // ===== UNLOCK TRIGGER - Only Fire Bell can unlock =====
    if (isFire && !unlockedTransports.includes('beast')) {
      // Calculate world position of bell (ContactSection is at [0, 200, -550])
      const worldPos = [
        position[0],
        200 + position[1],
        -550 + position[2]
      ];

      // Calculate distance to player
      const dx = playerPosition[0] - worldPos[0];
      const dy = playerPosition[1] - worldPos[1];
      const dz = playerPosition[2] - worldPos[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Show prompt when close
      if (distance < 25 && !isUnlocked) {
        setShowPrompt(true);
      } else if (distance >= 25) {
        setShowPrompt(false);
      }

      // Auto-unlock when very close
      if (distance < 15 && !isUnlocked) {
        unlockTransport('beast');
        setTransportMode('beast');
        setIsUnlocked(true);
        setShowPrompt(true);
      }
    }
  });

  return (
    <group position={position}>
      {/* Main bell group */}
      <group ref={bellRef}>

        {/* ===== THÂN CHUÔNG (BELL BODY) ===== */}
        {/* Main bell shape - hình chuông đồng cổ */}
        <mesh position={[0, 20, 0]}>
          {/* Bell body using lathe geometry for authentic bell shape */}
          <cylinderGeometry args={[8, 14, 25, 32, 1, true]} />
          <meshPhysicalMaterial
            color={colors.body}
            emissive={colors.primary}
            emissiveIntensity={0.8}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Bell top dome */}
        <mesh position={[0, 33, 0]}>
          <sphereGeometry args={[8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color={colors.body}
            emissive={colors.primary}
            emissiveIntensity={0.8}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Bell bottom rim - thick ring */}
        <mesh position={[0, 7.5, 0]}>
          <torusGeometry args={[14, 1.5, 16, 32]} />
          <meshPhysicalMaterial
            color={colors.secondary}
            emissive={colors.glow}
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Decorative rings around bell */}
        {[15, 22, 28].map((height, i) => (
          <mesh key={i} position={[0, height, 0]}>
            <torusGeometry args={[9 - i * 0.8, 0.4, 12, 32]} />
            <meshPhysicalMaterial
              color={colors.secondary}
              emissive={colors.accent}
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* ===== NÚM CHUÔNG (BELL CROWN/HANDLE) ===== */}
        <group position={[0, 36, 0]}>
          {/* Dragon/creature handle */}
          <mesh position={[0, 3, 0]}>
            <torusGeometry args={[3, 1.2, 16, 32]} />
            <meshPhysicalMaterial
              color={colors.secondary}
              emissive={colors.glow}
              emissiveIntensity={1}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Crown ornament */}
          <mesh position={[0, 0, 0]}>
            <dodecahedronGeometry args={[2, 0]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.accent}
              emissiveIntensity={2}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Top gem */}
          <mesh position={[0, 6, 0]}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial
              color={colors.rune}
              emissive={colors.rune}
              emissiveIntensity={3}
            />
          </mesh>
        </group>

        {/* ===== CỔ VĂN (ANCIENT RUNES) trên thân chuông ===== */}
        {runeSymbols.map((rune, i) => {
          const radius = 9.5 - (rune.height - 12) * 0.15;
          const x = Math.cos(rune.angle) * radius;
          const z = Math.sin(rune.angle) * radius;
          return (
            <group key={i} position={[x, rune.height, z]} rotation={[0, -rune.angle + Math.PI / 2, 0]}>
              {/* Rune glyph - vertical bar */}
              <mesh>
                <boxGeometry args={[0.3 * rune.scale, 3 * rune.scale, 0.2]} />
                <meshStandardMaterial
                  color={colors.rune}
                  emissive={colors.rune}
                  emissiveIntensity={2}
                />
              </mesh>
              {/* Rune glyph - horizontal bars */}
              {[0.8, -0.8].map((y, j) => (
                <mesh key={j} position={[0, y * rune.scale, 0]}>
                  <boxGeometry args={[0.8 * rune.scale, 0.25 * rune.scale, 0.2]} />
                  <meshStandardMaterial
                    color={colors.rune}
                    emissive={colors.rune}
                    emissiveIntensity={2}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* ===== LÕI CHUÔNG (BELL CLAPPER/TONGUE) ===== */}
        <group position={[0, 12, 0]}>
          {/* Clapper rod */}
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 15, 8]} />
            <meshStandardMaterial
              color={colors.secondary}
              emissive={colors.glow}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Clapper ball */}
          <mesh position={[0, -8, 0]}>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshPhysicalMaterial
              color={colors.accent}
              emissive={colors.glow}
              emissiveIntensity={1.5}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
        </group>

{/* Bỏ outer glow sphere và inner glow sphere */}

        {/* ===== ENERGY EFFECTS ===== */}
        {/* Rotating rune ring */}
        <group ref={runeRingRef} position={[0, 20, 0]}>
          {[...Array(12)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / 12;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 18, Math.sin(angle * 3) * 3, Math.sin(angle) * 18]}
                rotation={[0, -angle, 0]}
              >
                <boxGeometry args={[0.4, 2, 0.2]} />
                <meshBasicMaterial
                  color={colors.rune}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>

        {/* Vertical energy beams */}
        {[...Array(6)].map((_, i) => {
          const angle = (Math.PI * 2 * i) / 6;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 16, 20, Math.sin(angle) * 16]}
            >
              <cylinderGeometry args={[0.2, 0.2, 40, 8]} />
              <meshBasicMaterial
                color={colors.glow}
                transparent
                opacity={0.3}
              />
            </mesh>
          );
        })}

        {/* ===== PARTICLES ===== */}
        {particles.map((p, i) => (
          <BellParticle
            key={i}
            initialPos={p.pos}
            speed={p.speed}
            size={p.size}
            delay={p.delay}
            color={colors.glow}
            isIce={isIce}
          />
        ))}

        {/* Sparkles */}
        <Sparkles
          count={120}
          scale={[40, 50, 40]}
          position={[0, 20, 0]}
          size={2}
          speed={0.4}
          color={colors.secondary}
        />
        <Sparkles
          count={80}
          scale={[30, 40, 30]}
          position={[0, 25, 0]}
          size={3}
          speed={0.6}
          color={colors.accent}
        />

        {/* Lights */}
        <pointLight position={[0, 35, 0]} color={colors.secondary} intensity={5} distance={60} />
        <pointLight position={[0, 20, 0]} color={colors.glow} intensity={8} distance={50} />
        <pointLight position={[0, 5, 0]} color={colors.accent} intensity={3} distance={30} />
      </group>

      {/* ===== ĐẾ CHUÔNG (BELL PEDESTAL) ===== */}
      <BellPedestal colors={colors} />

      {/* ===== UNLOCK PROMPT - Only for Fire Bell ===== */}
      {isFire && showPrompt && (
        <Html position={[0, 50, 0]} center>
          <div
            className="px-4 py-3 rounded-lg text-center whitespace-nowrap animate-fadeIn"
            style={{
              background: isUnlocked
                ? 'linear-gradient(135deg, rgba(0,206,209,0.95), rgba(64,224,208,0.9))'
                : 'linear-gradient(135deg, rgba(0,255,136,0.95), rgba(102,255,204,0.9))',
              border: `2px solid ${isUnlocked ? '#00FFFF' : '#00FF88'}`,
              boxShadow: `0 0 20px ${isUnlocked ? 'rgba(0,255,255,0.5)' : 'rgba(0,255,136,0.5)'}`,
            }}
          >
            {isUnlocked ? (
              <>
                <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cinzel' }}>
                  ✓ Đã khai mở Cưỡi Phượng!
                </p>
                <p className="text-cyan-100 text-sm mt-1">
                  Nhấn <span className="font-bold text-white">F</span> để bay trên lưng Hỏa Phượng
                </p>
              </>
            ) : (
              <>
                <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cinzel' }}>
                  🔔 Thượng Cổ Đồng Chung
                </p>
                <p className="text-green-100 text-sm mt-1">
                  Đến gần để khai mở Cưỡi Linh Thú
                </p>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

interface BellColors {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
  body: string;
  dark: string;
  rune: string;
}

interface BellParticleProps {
  initialPos: [number, number, number];
  speed: number;
  size: number;
  delay: number;
  color: string;
  isIce: boolean;
}

function BellParticle({ initialPos, speed, size, delay, color, isIce }: BellParticleProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + delay;

      if (isIce) {
        // Ice bell: particles spiral down
        ref.current.position.y = initialPos[1] - (t % 30) + 25;
        ref.current.position.x = initialPos[0] + Math.sin(t * 0.5) * 5;
        ref.current.position.z = initialPos[2] + Math.cos(t * 0.5) * 5;
      } else {
        // Fire bell: particles spiral up
        ref.current.position.y = initialPos[1] + (t % 30);
        ref.current.position.x = initialPos[0] + Math.sin(t * 0.6) * 4;
        ref.current.position.z = initialPos[2] + Math.cos(t * 0.6) * 4;
      }

      ref.current.rotation.y = t * 2;
      ref.current.rotation.x = t;
    }
  });

  return (
    <mesh ref={ref} position={initialPos}>
      <octahedronGeometry args={[size, 0]} />
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

function BellPedestal({ colors }: { colors: BellColors }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    if (runeRingRef.current) {
      runeRingRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[0, -5, 0]}>
      {/* Main platform - octagonal */}
      <mesh receiveShadow>
        <cylinderGeometry args={[15, 18, 5, 8]} />
        <meshStandardMaterial
          color="#0A1A1A"
          roughness={0.5}
          metalness={0.5}
          emissive={colors.dark}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Upper tier */}
      <mesh position={[0, 3, 0]} receiveShadow>
        <cylinderGeometry args={[12, 15, 2, 8]} />
        <meshStandardMaterial
          color={colors.dark}
          emissive={colors.primary}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Rotating energy ring */}
      <mesh ref={ringRef} position={[0, 4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[10, 12, 64]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner pillars with gems */}
      <group ref={runeRingRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (Math.PI * 2 * i) / 8;
          return (
            <group key={i} position={[Math.cos(angle) * 16, 0, Math.sin(angle) * 16]}>
              {/* Pillar */}
              <mesh>
                <cylinderGeometry args={[0.8, 1, 10, 6]} />
                <meshStandardMaterial
                  color={colors.dark}
                  emissive={colors.primary}
                  emissiveIntensity={0.5}
                  metalness={0.6}
                  roughness={0.3}
                />
              </mesh>
              {/* Gem on top */}
              <mesh position={[0, 6, 0]}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color={colors.accent}
                  emissive={colors.accent}
                  emissiveIntensity={2.5}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Central glow */}
      <mesh position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshBasicMaterial
          color={colors.glow}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Platform lights */}
      <pointLight position={[0, 8, 0]} color={colors.glow} intensity={4} distance={35} />
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
