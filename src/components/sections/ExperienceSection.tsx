import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { experiences, certifications } from '@/data/content';
import { useGameStore } from '@/stores/gameStore';
import { useSoundEffects } from '@/hooks/useAudio';
import type { Experience, Certification } from '@/types';

interface ExperienceSectionProps {
  position?: [number, number, number];
}

export function ExperienceSection({ position = [0, 150, -450] }: ExperienceSectionProps) {
  return (
    <group position={position}>
      {/* Mountain Peak Platform */}
      <MountainPeak />

      {/* Timeline Path */}
      <TimelinePath />

      {/* Experience Monuments */}
      <ExperienceMonuments />

      {/* Certification Stones */}
      <CertificationStones />

      {/* Thượng Cổ Đồng Chung - Ancient Divine Bell (unlock Cưỡi Phượng) */}
      <AncientDivineBell position={[-55, 0, 0]} type="ice" sectionPosition={position} />
      <AncientDivineBell position={[55, 0, 0]} type="fire" sectionPosition={position} />

      {/* Ambient energy */}
      <Sparkles
        count={150}
        scale={[100, 50, 100]}
        position={[0, 25, 0]}
        size={2}
        speed={0.4}
        color="#FF4444"
      />
    </group>
  );
}

function MountainPeak() {
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group>
      {/* Physics collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[50, 1, 50]} position={[0, -1, 0]} />
      </RigidBody>

      {/* Main mountain top platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[50, 6]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.8}
          metalness={0.2}
          emissive="#FF4444"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Mountain body */}
      <mesh position={[0, -25, 0]} castShadow>
        <coneGeometry args={[60, 50, 6]} />
        <meshStandardMaterial
          color="#3D2424"
          roughness={0.9}
          metalness={0.1}
          flatShading
          emissive="#FF4444"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Outer rotating ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[45, 50, 6]} />
        <meshBasicMaterial color="#FF4444" transparent opacity={0.4} />
      </mesh>

      {/* Inner rotating ring */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[25, 28, 6]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>

      {/* Center glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.2} />
      </mesh>

      {/* Central flame pillar */}
      <CentralFlame position={[0, 1, 0]} />
    </group>
  );
}

interface CentralFlameProps {
  position: [number, number, number];
}

function CentralFlame({ position }: CentralFlameProps) {
  const flameRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.1;
        }
      });
    }
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      orbRef.current.position.y = 18 + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Physics colliders for CentralFlame */}
      <RigidBody type="fixed" colliders={false}>
        {/* Base pedestal collider */}
        <CuboidCollider args={[4.5, 2, 4.5]} position={[0, 2, 0]} />
        {/* Base pedestal top */}
        <CuboidCollider args={[4, 0.25, 4]} position={[0, 4, 0]} />
        {/* Flame pillar collider */}
        <CuboidCollider args={[2.5, 4, 2.5]} position={[0, 8, 0]} />
        {/* Pillar top */}
        <CuboidCollider args={[2, 0.25, 2]} position={[0, 12, 0]} />
      </RigidBody>

      {/* Base pedestal */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[4, 5, 4, 6]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Flame pillar */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[2, 3, 8, 6]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.5}
          metalness={0.5}
          emissive="#FF8C00"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Flame effects */}
      <group ref={flameRef} position={[0, 13, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.5, 0]}>
            <coneGeometry args={[1.5 - i * 0.3, 3 - i * 0.5, 8]} />
            <meshBasicMaterial
              color={['#FF4444', '#FF8C00', '#FFD700'][i]}
              transparent
              opacity={0.8 - i * 0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Floating orb */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh ref={orbRef} position={[0, 18, 0]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FF8C00"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Light */}
      <pointLight position={[0, 15, 0]} color="#FF8C00" intensity={3} distance={40} />

      {/* Fire sparkles */}
      <Sparkles
        count={50}
        scale={[8, 20, 8]}
        position={[0, 15, 0]}
        size={2}
        speed={1}
        color="#FFD700"
      />
    </group>
  );
}

function TimelinePath() {
  const pathRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pathRef.current) {
      pathRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshBasicMaterial;
          material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2;
        }
      });
    }
  });

  // Create spiral path points
  const pathPoints: [number, number, number][] = [];
  const numPoints = 20;
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 1.5;
    const radius = 20 + i * 0.5;
    pathPoints.push([
      Math.cos(angle) * radius,
      0.1,
      Math.sin(angle) * radius,
    ]);
  }

  return (
    <group ref={pathRef}>
      {pathPoints.map((point, index) => (
        <mesh key={index} position={point} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1, 8]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function ExperienceMonuments() {
  // Bố trí đều theo hình tam giác đều, bán kính 30 từ trung tâm
  const radius = 30;
  const monumentPositions: [number, number, number][] = [
    [0, 0, radius],                                           // Phía trước (0°)
    [radius * Math.sin((2 * Math.PI) / 3), 0, radius * Math.cos((2 * Math.PI) / 3)],   // Trái sau (120°)
    [radius * Math.sin((4 * Math.PI) / 3), 0, radius * Math.cos((4 * Math.PI) / 3)],   // Phải sau (240°)
  ];

  return (
    <>
      {experiences.map((exp, index) => (
        <ExperienceMonument
          key={index}
          experience={exp}
          position={monumentPositions[index]}
          index={index}
        />
      ))}
    </>
  );
}

interface ExperienceMonumentProps {
  experience: Experience;
  position: [number, number, number];
  index: number;
}

function ExperienceMonument({ experience, position, index }: ExperienceMonumentProps) {
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const monumentRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const colors = ['#FF4444', '#FF8C00', '#FFD700'];
  const color = colors[index % colors.length];

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (hovered || isOpen) ? 0.6 : 0.3 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.2}>
      <group
        ref={monumentRef}
        position={position}
      >
        {/* Physics colliders for ExperienceMonument */}
        <RigidBody type="fixed" colliders={false}>
          {/* Base collider */}
          <CuboidCollider args={[4.5, 1, 4.5]} position={[0, 1, 0]} />
          {/* Base top - player can stand */}
          <CuboidCollider args={[4, 0.25, 4]} position={[0, 2, 0]} />
          {/* Main body collider */}
          <CuboidCollider args={[2.5, 4, 0.75]} position={[0, 6, 0]} />
        </RigidBody>

        {/* Base */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[4, 5, 2, 6]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Main monument body */}
        <mesh position={[0, 6, 0]} castShadow>
          <boxGeometry args={[5, 8, 1.5]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.7}
            metalness={0.3}
            emissive={color}
            emissiveIntensity={(hovered || isOpen) ? 0.3 : 0.1}
          />
        </mesh>

        {/* Glow panel */}
        <mesh ref={glowRef} position={[0, 6, 0.76]}>
          <planeGeometry args={[4.5, 7.5]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Top ornament - clickable */}
        <mesh
          position={[0, 11, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={(hovered || isOpen) ? 1.4 : 1}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={(hovered || isOpen) ? 2 : 1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Detail panel - only show when clicked */}
        {isOpen && (
          <Html
            position={[0, 16, 0]}
            center
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
            }}
          >
            <div
              className="rounded-xl p-4 backdrop-blur-md relative animate-fadeIn"
              style={{
                backgroundColor: 'rgba(26, 10, 10, 0.95)',
                border: `2px solid ${color}`,
                boxShadow: `0 0 40px ${color}60`,
                minWidth: '220px',
                maxWidth: '280px',
              }}
            >
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                style={{ color: '#C4A77D' }}
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-700">
                <div>
                  <p className="text-xs" style={{ color: color }}>{experience.period}</p>
                  <h3 className="font-bold text-sm" style={{ color: '#F5E6D3' }}>
                    {experience.role}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm mb-2" style={{ color: '#C4A77D' }}>{experience.company}</p>
              <p className="text-xs mb-3" style={{ color: '#8B7355' }}>{experience.description}</p>

              {/* Achievements */}
              <div className="space-y-1">
                {experience.achievements.slice(0, 2).map((achievement, i) => (
                  <p key={i} className="text-xs" style={{ color: '#F5E6D3' }}>✦ {achievement}</p>
                ))}
              </div>
            </div>
          </Html>
        )}

        {/* Light */}
        <pointLight
          position={[0, 8, 2]}
          color={color}
          intensity={(hovered || isOpen) ? 1.5 : 0.5}
          distance={15}
        />

        {/* Sparkles */}
        {(hovered || isOpen) && (
          <Sparkles
            count={20}
            scale={[8, 12, 8]}
            position={[0, 8, 0]}
            size={2}
            speed={0.5}
            color={color}
          />
        )}
      </group>
    </Float>
  );
}

function CertificationStones() {
  // Bố trí đối xứng hai bên, giữa các monuments
  const stonePositions: [number, number, number][] = [
    [-38, 0, 0],   // Bên trái
    [38, 0, 0],    // Bên phải
  ];

  return (
    <>
      {certifications.map((cert, index) => (
        <CertificationStone
          key={index}
          certification={cert}
          position={stonePositions[index]}
          index={index}
        />
      ))}
    </>
  );
}

interface CertificationStoneProps {
  certification: Certification;
  position: [number, number, number];
  index: number;
}

function CertificationStone({ certification, position, index }: CertificationStoneProps) {
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const stoneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (stoneRef.current) {
      const material = stoneRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = (hovered || isOpen) ? 0.4 : 0.1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.05;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group position={position}>
        {/* Stone base */}
        <mesh ref={stoneRef} position={[0, 2.5, 0]} castShadow>
          <dodecahedronGeometry args={[3, 0]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.9}
            metalness={0.1}
            flatShading
            emissive="#FFD700"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Seal/Badge on top - clickable */}
        <mesh
          position={[0, 5.5, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={(hovered || isOpen) ? 1.3 : 1}
        >
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={(hovered || isOpen) ? 1.5 : 0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Detail panel - only show when clicked */}
        {isOpen && (
          <Html
            position={[0, 10, 0]}
            center
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
            }}
          >
            <div
              className="rounded-xl p-4 backdrop-blur-md relative animate-fadeIn"
              style={{
                backgroundColor: 'rgba(26, 10, 10, 0.95)',
                border: '2px solid #FFD700',
                boxShadow: '0 0 40px #FFD70060',
                minWidth: '200px',
              }}
            >
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                style={{ color: '#C4A77D' }}
              >
                ✕
              </button>

              {/* Header */}
              <div className="mb-2">
                <p className="text-xs" style={{ color: '#FFD700' }}>Chứng Chỉ</p>
                <h3 className="font-bold text-sm" style={{ color: '#F5E6D3' }}>
                  {certification.name}
                </h3>
              </div>

              <p className="text-xs text-center mt-2" style={{ color: '#C4A77D' }}>
                📅 {certification.year}
              </p>
            </div>
          </Html>
        )}

        {/* Sparkles */}
        {(hovered || isOpen) && (
          <Sparkles
            count={15}
            scale={[6, 6, 6]}
            position={[0, 4, 0]}
            size={1.5}
            speed={0.5}
            color="#FFD700"
          />
        )}
      </group>
    </Float>
  );
}

// ==================== THƯỢNG CỔ ĐỒNG CHUNG (ANCIENT DIVINE BELL) ====================
interface AncientDivineBellProps {
  position: [number, number, number];
  type: 'ice' | 'fire';
  sectionPosition: [number, number, number];
}

function AncientDivineBell({ position, type, sectionPosition }: AncientDivineBellProps) {
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
  const setPlayerFlying = useGameStore((state) => state.setPlayerFlying);
  const { playUnlock, playPhoenixCry } = useSoundEffects();

  const isIce = type === 'ice';
  const isFire = type === 'fire';

  // Calculate world position of bell
  const worldPosition: [number, number, number] = [
    sectionPosition[0] + position[0],
    sectionPosition[1] + position[1],
    sectionPosition[2] + position[2],
  ];

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
      // Calculate distance to player
      const dx = playerPosition[0] - worldPosition[0];
      const dy = playerPosition[1] - worldPosition[1];
      const dz = playerPosition[2] - worldPosition[2];
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
        setTransportMode('beast'); // Chuyển sang mode phượng hoàng
        setPlayerFlying(true); // Tự động bay phượng luôn khi unlock
        setIsUnlocked(true);
        setShowPrompt(true);
        playUnlock();
        playPhoenixCry(); // Play phoenix sound
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
                ? 'linear-gradient(135deg, rgba(255,140,0,0.95), rgba(255,100,0,0.9))'
                : 'linear-gradient(135deg, rgba(0,255,136,0.95), rgba(102,255,204,0.9))',
              border: `2px solid ${isUnlocked ? '#FF8C00' : '#00FF88'}`,
              boxShadow: `0 0 20px ${isUnlocked ? 'rgba(255,140,0,0.5)' : 'rgba(0,255,136,0.5)'}`,
            }}
          >
            {isUnlocked ? (
              <>
                <p className="text-white font-bold text-lg" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  🔥 Đã khai mở Cưỡi Phượng!
                </p>
                <p className="text-orange-100 text-sm mt-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  Click vào <span className="font-bold text-white">Phương Thức</span> ở góc trái để chọn
                </p>
                <p className="text-orange-200 text-xs mt-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  Sau đó nhấn <span className="font-bold text-white">F</span> để bay
                </p>
              </>
            ) : (
              <>
                <p className="text-white font-bold text-lg" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  🔔 Thượng Cổ Đồng Chung
                </p>
                <p className="text-green-100 text-sm mt-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
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
      {/* Physics colliders for BellPedestal */}
      <RigidBody type="fixed" colliders={false}>
        {/* Main platform collider */}
        <CuboidCollider args={[16, 2.5, 16]} position={[0, 0, 0]} />
        {/* Platform top - player can stand */}
        <CuboidCollider args={[14, 0.25, 14]} position={[0, 2.5, 0]} />
        {/* Upper tier collider */}
        <CuboidCollider args={[13, 1, 13]} position={[0, 3, 0]} />
        {/* Upper tier top - player can stand */}
        <CuboidCollider args={[12, 0.25, 12]} position={[0, 4, 0]} />
      </RigidBody>

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

export default ExperienceSection;
