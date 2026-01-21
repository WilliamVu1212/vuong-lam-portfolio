import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, Line } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { skillCategories } from '@/data/content';
import { SKILL_RANKS } from '@/utils/constants';
import { useGameStore } from '@/stores/gameStore';
import type { SkillCategory } from '@/types';

interface SkillsSectionProps {
  position?: [number, number, number];
}

export function SkillsSection({ position = [0, 60, -200] }: SkillsSectionProps) {
  return (
    <group position={position}>
      {/* Section Title */}
      <SectionTitle />

      {/* Main Platform */}
      <SkillsPlatform />

      {/* Central Altar */}
      <CentralAltar position={[0, 1, 0]} />

      {/* Skill Category Pillars */}
      <SkillPillars />

      {/* Floating Runes */}
      <FloatingRunes />

      {/* Skill Rank Legend */}
      <SkillLegend />

      {/* Trảm La Kiếm - Soul Slaying Swords 2 bên (unlock Ngự Kiếm) */}
      <SoulSlayingSword position={[-55, 0, 0]} side="left" sectionPosition={position} />
      <SoulSlayingSword position={[55, 0, 0]} side="right" sectionPosition={position} />

      {/* Energy flow particles */}
      <Sparkles
        count={150}
        scale={[100, 40, 100]}
        position={[0, 20, 0]}
        size={2}
        speed={0.5}
        color="#FFD700"
      />
    </group>
  );
}

function SectionTitle() {
  // Đã bỏ tiêu đề theo yêu cầu
  return null;
}

function SkillLegend() {
  // Bỏ legend panel - sẽ hiển thị trong detail panel khi hover
  return null;
}

function SkillsPlatform() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = state.clock.elapsedTime * 0.03;
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

      {/* Main platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF8C00"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Outer rotating ring */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[46, 50, 64]} />
        <meshBasicMaterial color="#FF4444" transparent opacity={0.5} />
      </mesh>

      {/* Inner rotating ring */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[30, 32, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
      </mesh>

      {/* Category zone markers */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            Math.cos((Math.PI * 2 * i) / 4 + Math.PI / 4) * 38,
            0.03,
            Math.sin((Math.PI * 2 * i) / 4 + Math.PI / 4) * 38,
          ]}
        >
          <circleGeometry args={[8, 8]} />
          <meshBasicMaterial
            color={['#FF4444', '#FF8C00', '#FFD700', '#FF6B35'][i]}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

interface CentralAltarProps {
  position: [number, number, number];
}

function CentralAltar({ position }: CentralAltarProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = 12 + Math.sin(state.clock.elapsedTime) * 0.5;
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (runeRingRef.current) {
      runeRingRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base pedestal */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5, 6, 2, 8]} />
        <meshStandardMaterial
          color="#3D2424"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Middle section */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[3, 5, 4, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF4444"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Top section */}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[2, 3, 2, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.5}
          metalness={0.5}
          emissive="#FF8C00"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating orb */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh ref={orbRef} position={[0, 12, 0]}>
          <dodecahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FF8C00"
            emissiveIntensity={1.5}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Rotating rune ring */}
      <group ref={runeRingRef} position={[0, 10, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((Math.PI * 2 * i) / 6) * 4,
              0,
              Math.sin((Math.PI * 2 * i) / 6) * 4,
            ]}
            rotation={[0, -(Math.PI * 2 * i) / 6, 0]}
          >
            <boxGeometry args={[0.5, 1.5, 0.1]} />
            <meshBasicMaterial
              color="#FF4444"
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Light beam */}
      <pointLight position={[0, 12, 0]} color="#FFD700" intensity={3} distance={30} />

      {/* Energy sparkles */}
      <Sparkles
        count={50}
        scale={[10, 15, 10]}
        position={[0, 10, 0]}
        size={2}
        speed={1}
        color="#FFD700"
      />
    </group>
  );
}

function SkillPillars() {
  const pillarPositions = [
    { pos: [30, 0, 30] as [number, number, number], category: skillCategories[0] },
    { pos: [-30, 0, 30] as [number, number, number], category: skillCategories[1] },
    { pos: [-30, 0, -30] as [number, number, number], category: skillCategories[2] },
    { pos: [30, 0, -30] as [number, number, number], category: skillCategories[3] },
  ];

  return (
    <>
      {pillarPositions.map((item, index) => (
        <SkillPillar
          key={index}
          position={item.pos}
          category={item.category}
          index={index}
        />
      ))}
    </>
  );
}

interface SkillPillarProps {
  position: [number, number, number];
  category: SkillCategory;
  index: number;
}

function SkillPillar({ position, category, index }: SkillPillarProps) {
  const pillarRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const colors = ['#FF4444', '#FF8C00', '#FFD700', '#FF6B35'];
  const color = colors[index % colors.length];

  const categoryShortNames = ['Kiếm Pháp', 'Đan Pháp', 'Trận Pháp', 'Thần Thông'];

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group
      ref={pillarRef}
      position={position}
    >
      {/* Clickable area - invisible but larger for easier clicking */}
      <mesh position={[0, 10, 0]} visible={false}>
        <cylinderGeometry args={[5, 5, 25, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Main pillar */}
      <mesh position={[0, 8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.5, 16, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={hovered || isOpen ? 0.4 : 0.15}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 16.5, 0]}>
        <cylinderGeometry args={[3, 2, 1, 8]} />
        <meshStandardMaterial
          color="#3D2424"
          emissive={color}
          emissiveIntensity={hovered || isOpen ? 0.5 : 0.25}
        />
      </mesh>

      {/* Category icon orb - clickable */}
      <Float speed={2} floatIntensity={0.3}>
        <mesh
          ref={orbRef}
          position={[0, 19, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          scale={hovered || isOpen ? 1.3 : 1}
        >
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isOpen ? 2.5 : 1.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Skills Detail Panel - CHỈ HIỆN KHI CLICK */}
      {isOpen && (
        <Html
          position={[0, 26, 0]}
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
              animation: 'fadeIn 0.2s ease-out',
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

            {/* Header with category name */}
            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-700">
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${color}, ${color}60 50%, transparent)`,
                  boxShadow: `0 0 15px ${color}80, inset 0 0 8px ${color}40`,
                  border: `2px solid ${color}`,
                }}
              />
              <div>
                <h3 className="font-bold text-sm" style={{ color: color }}>
                  {categoryShortNames[index]}
                </h3>
                <p className="text-xs" style={{ color: '#C4A77D' }}>
                  {category.name.match(/\(([^)]+)\)/)?.[1] || category.name.split('(')[0].trim()}
                </p>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-2">
              {category.skills.map((skill, idx) => {
                const rankColor = SKILL_RANKS.colors[skill.rank] || color;
                return (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs" style={{ color: '#F5E6D3' }}>{skill.name}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          color: rankColor,
                          backgroundColor: `${rankColor}20`,
                        }}
                      >
                        {skill.rank}
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#1A0A0A' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: rankColor,
                          boxShadow: `0 0 6px ${rankColor}`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Html>
      )}

      {/* Pillar light - intensifies on hover/open */}
      <pointLight
        position={[0, 10, 0]}
        color={color}
        intensity={hovered || isOpen ? 2.5 : 1.5}
        distance={hovered || isOpen ? 30 : 20}
      />

      {/* Additional glow light when active */}
      {(hovered || isOpen) && (
        <pointLight
          position={[0, 19, 0]}
          color={color}
          intensity={4}
          distance={25}
        />
      )}

      {/* Sparkles around pillar when active */}
      {(hovered || isOpen) && (
        <Sparkles
          count={50}
          scale={[15, 25, 15]}
          position={[0, 12, 0]}
          size={3}
          speed={2}
          color={color}
        />
      )}

      {/* Energy connection to center */}
      <EnergyBeam
        start={[0, 8, 0]}
        end={[-position[0], 10 - position[1], -position[2]]}
        color={color}
      />
    </group>
  );
}

interface EnergyBeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

function EnergyBeam({ start, end, color }: EnergyBeamProps) {
  const points = useMemo(() => [start, end], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.4}
    />
  );
}

function FloatingRunes() {
  const runesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (runesRef.current) {
      runesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={runesRef} position={[0, 25, 0]}>
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} floatIntensity={0.5}>
          <mesh
            position={[
              Math.cos((Math.PI * 2 * i) / 12) * 20,
              Math.sin(i * 2) * 5,
              Math.sin((Math.PI * 2 * i) / 12) * 20,
            ]}
            rotation={[0, (Math.PI * 2 * i) / 12, 0]}
          >
            <planeGeometry args={[2, 3]} />
            <meshBasicMaterial
              color={['#FF4444', '#FF8C00', '#FFD700'][i % 3]}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ==================== TRẢM LA KIẾM (SOUL SLAYING SWORD) ====================
interface SoulSlayingSwordProps {
  position: [number, number, number];
  side: 'left' | 'right';
  sectionPosition: [number, number, number];
}

function SoulSlayingSword({ position, sectionPosition }: SoulSlayingSwordProps) {
  const swordRef = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const runesRef = useRef<THREE.Group>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const playerPosition = useGameStore((state) => state.player.position);
  const unlockedTransports = useGameStore((state) => state.unlockedTransports);
  const unlockTransport = useGameStore((state) => state.unlockTransport);
  const setTransportMode = useGameStore((state) => state.setTransportMode);

  // Calculate world position of sword
  const worldPosition: [number, number, number] = [
    sectionPosition[0] + position[0],
    sectionPosition[1] + position[1],
    sectionPosition[2] + position[2],
  ];

  // Check if sword is already unlocked
  useEffect(() => {
    setIsUnlocked(unlockedTransports.includes('sword'));
  }, [unlockedTransports]);

  // Check proximity to player
  useFrame(() => {
    const dx = playerPosition[0] - worldPosition[0];
    const dy = playerPosition[1] - worldPosition[1];
    const dz = playerPosition[2] - worldPosition[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Show prompt when player is within 20 units
    if (distance < 20 && !isUnlocked) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }

    // Auto unlock when very close (within 12 units)
    if (distance < 12 && !isUnlocked) {
      unlockTransport('sword');
      setTransportMode('sword');
      setIsUnlocked(true);
    }
  });

  // Main colors - vàng kim như trong ảnh
  const goldColor = '#FFD700';
  const brightGold = '#FFA500';
  const jadeColor = '#40E0D0'; // Ngọc bích trên kiếm

  // Particle system
  const particleCount = 120;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Sword hover animation - nhẹ nhàng
    if (swordRef.current) {
      swordRef.current.position.y = Math.sin(t * 0.5) * 2;
      // Slight rotation
      swordRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    }

    // Blade glow pulse
    if (bladeRef.current) {
      bladeRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.3;
          }
        }
      });
    }

    // Runes rotation
    if (runesRef.current) {
      runesRef.current.rotation.y = t * 0.2;
    }

    // Particle animation - energy swirl
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Spiral upward
        positions[i * 3 + 1] += 0.2;
        positions[i * 3] += Math.sin(t + i * 0.1) * 0.05;
        positions[i * 3 + 2] += Math.cos(t + i * 0.1) * 0.03;

        // Reset
        if (positions[i * 3 + 1] > 85) {
          positions[i * 3 + 1] = Math.random() * 10;
          positions[i * 3] = (Math.random() - 0.5) * 15;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Unlock Prompt */}
      {showPrompt && (
        <Html position={[0, 80, 0]} center distanceFactor={100}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(26,10,10,0.95) 0%, rgba(45,27,27,0.95) 100%)',
              border: '2px solid #FFD700',
              borderRadius: '12px',
              padding: '16px 24px',
              color: '#FFD700',
              fontFamily: 'Cinzel, serif',
              fontSize: '18px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 30px rgba(255,215,0,0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <div style={{ marginBottom: '8px', fontSize: '22px' }}>⚔️ Trảm La Kiếm ⚔️</div>
            <div style={{ color: '#F5E6D3', fontSize: '14px' }}>Đến gần để nhận Phi Kiếm</div>
          </div>
        </Html>
      )}

      {/* Unlocked notification */}
      {isUnlocked && showPrompt && (
        <Html position={[0, 80, 0]} center distanceFactor={100}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0,100,0,0.95) 0%, rgba(0,50,0,0.95) 100%)',
              border: '2px solid #00FF00',
              borderRadius: '12px',
              padding: '16px 24px',
              color: '#00FF00',
              fontFamily: 'Cinzel, serif',
              fontSize: '18px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 30px rgba(0,255,0,0.5)',
            }}
          >
            <div>✓ Đã khai mở Ngự Kiếm!</div>
            <div style={{ color: '#90EE90', fontSize: '14px', marginTop: '8px' }}>Nhấn F để bay</div>
          </div>
        </Html>
      )}

      {/* === BASE PEDESTAL === */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[5, 7, 6, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.5}
          metalness={0.6}
          emissive={goldColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Pedestal decorative rings */}
      <mesh position={[0, 6, 0]}>
        <torusGeometry args={[5.5, 0.3, 8, 32]} />
        <meshStandardMaterial
          color={goldColor}
          emissive={goldColor}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Ground rune circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[7, 10, 32]} />
        <meshBasicMaterial color={goldColor} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <ringGeometry args={[10, 11, 32]} />
        <meshBasicMaterial color={brightGold} transparent opacity={0.3} />
      </mesh>

      {/* Rotating runes around base */}
      <group ref={runesRef} position={[0, 1, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((Math.PI * 2 * i) / 8) * 9,
              0.5,
              Math.sin((Math.PI * 2 * i) / 8) * 9,
            ]}
            rotation={[-Math.PI / 2, 0, (Math.PI * 2 * i) / 8]}
          >
            <boxGeometry args={[1.5, 0.1, 0.4]} />
            <meshBasicMaterial color={goldColor} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* === MAIN SWORD === */}
      <group ref={swordRef} position={[0, 8, 0]}>
        {/* Sword blade group */}
        <group ref={bladeRef}>
          {/* Main blade body - wide rectangular like in image */}
          <mesh position={[0, 35, 0]} castShadow>
            <boxGeometry args={[8, 55, 1.5]} />
            <meshPhysicalMaterial
              color={goldColor}
              emissive={brightGold}
              emissiveIntensity={0.8}
              metalness={0.95}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>

          {/* Blade edge glow - left */}
          <mesh position={[-4.2, 35, 0]}>
            <boxGeometry args={[0.5, 55, 1.8]} />
            <meshBasicMaterial color={'#FFFACD'} transparent opacity={0.6} />
          </mesh>

          {/* Blade edge glow - right */}
          <mesh position={[4.2, 35, 0]}>
            <boxGeometry args={[0.5, 55, 1.8]} />
            <meshBasicMaterial color={'#FFFACD'} transparent opacity={0.6} />
          </mesh>

          {/* === BLADE DECORATIONS === */}
          {/* Central vertical line */}
          <mesh position={[0, 35, 0.8]}>
            <boxGeometry args={[0.4, 50, 0.2]} />
            <meshStandardMaterial
              color="#8B4513"
              emissive={brightGold}
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Horizontal pattern lines */}
          {[-15, -5, 5, 15, 25, 35, 45].map((y, i) => (
            <mesh key={`hline-${i}`} position={[0, y + 10, 0.8]}>
              <boxGeometry args={[6, 0.3, 0.15]} />
              <meshStandardMaterial
                color="#8B4513"
                emissive={goldColor}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}

          {/* Corner decorations - meander pattern */}
          {[[-2.5, 20], [2.5, 20], [-2.5, 50], [2.5, 50]].map(([x, y], i) => (
            <mesh key={`corner-${i}`} position={[x, y, 0.85]}>
              <boxGeometry args={[1.5, 1.5, 0.1]} />
              <meshStandardMaterial
                color="#8B4513"
                emissive={brightGold}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}

          {/* Central medallion - top */}
          <mesh position={[0, 52, 0.9]}>
            <circleGeometry args={[2.5, 16]} />
            <meshStandardMaterial
              color={goldColor}
              emissive={brightGold}
              emissiveIntensity={1}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 52, 1]}>
            <ringGeometry args={[1, 2, 16]} />
            <meshStandardMaterial
              color="#8B4513"
              emissive={goldColor}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Central medallion - middle */}
          <mesh position={[0, 35, 0.9]}>
            <circleGeometry args={[3, 16]} />
            <meshStandardMaterial
              color={goldColor}
              emissive={brightGold}
              emissiveIntensity={1.2}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
          {/* Inner jade gem */}
          <mesh position={[0, 35, 1.1]}>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshStandardMaterial
              color={jadeColor}
              emissive={jadeColor}
              emissiveIntensity={1.5}
              metalness={0.7}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Side jade gems */}
          {[-2.8, 2.8].map((x, i) => (
            <group key={`jade-${i}`}>
              <mesh position={[x, 35, 0.9]}>
                <sphereGeometry args={[0.6, 12, 12]} />
                <meshStandardMaterial
                  color={jadeColor}
                  emissive={jadeColor}
                  emissiveIntensity={1.2}
                  metalness={0.7}
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[x, 25, 0.9]}>
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshStandardMaterial
                  color={jadeColor}
                  emissive={jadeColor}
                  emissiveIntensity={1}
                  metalness={0.7}
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[x, 45, 0.9]}>
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshStandardMaterial
                  color={jadeColor}
                  emissive={jadeColor}
                  emissiveIntensity={1}
                  metalness={0.7}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}

          {/* Blade tip - pointed */}
          <mesh position={[0, 63, 0]}>
            <coneGeometry args={[4, 6, 4]} />
            <meshPhysicalMaterial
              color={goldColor}
              emissive={brightGold}
              emissiveIntensity={1}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>

          {/* === CROSSGUARD (TSUBA) === */}
          <mesh position={[0, 7, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[14, 2, 3]} />
            <meshPhysicalMaterial
              color={goldColor}
              emissive={brightGold}
              emissiveIntensity={0.7}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Crossguard ends - curved up */}
          {[-7, 7].map((x, i) => (
            <group key={`guard-${i}`}>
              <mesh position={[x, 8, 0]} rotation={[0, 0, i === 0 ? 0.3 : -0.3]}>
                <boxGeometry args={[2, 3, 2.5]} />
                <meshPhysicalMaterial
                  color={goldColor}
                  emissive={brightGold}
                  emissiveIntensity={0.6}
                  metalness={0.95}
                  roughness={0.15}
                />
              </mesh>
              {/* Guard end ornament */}
              <mesh position={[x * 1.15, 10, 0]}>
                <sphereGeometry args={[1, 12, 12]} />
                <meshStandardMaterial
                  color={goldColor}
                  emissive={goldColor}
                  emissiveIntensity={0.8}
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}

          {/* Crossguard center jade */}
          <mesh position={[0, 7, 1.6]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={jadeColor}
              emissive={jadeColor}
              emissiveIntensity={1.5}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* === HANDLE === */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[1.2, 1.5, 8, 8]} />
            <meshStandardMaterial
              color="#8B4513"
              roughness={0.8}
              metalness={0.3}
              emissive={goldColor}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Handle wrapping */}
          {[...Array(5)].map((_, i) => (
            <mesh key={`wrap-${i}`} position={[0, i * 1.5 - 1, 0]}>
              <torusGeometry args={[1.3, 0.15, 8, 16]} />
              <meshStandardMaterial
                color={goldColor}
                emissive={goldColor}
                emissiveIntensity={0.4}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          ))}

          {/* Pommel */}
          <mesh position={[0, -3, 0]}>
            <sphereGeometry args={[1.8, 16, 16]} />
            <meshPhysicalMaterial
              color={goldColor}
              emissive={brightGold}
              emissiveIntensity={0.8}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>

          {/* Pommel jade */}
          <mesh position={[0, -3.5, 1]}>
            <sphereGeometry args={[0.6, 12, 12]} />
            <meshStandardMaterial
              color={jadeColor}
              emissive={jadeColor}
              emissiveIntensity={1.2}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
        </group>

      </group>

      {/* === PARTICLES === */}
      <points ref={particlesRef} position={[0, 5, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          color={goldColor}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Sparkles */}
      <Sparkles
        count={100}
        scale={[20, 80, 15]}
        position={[0, 45, 0]}
        size={2.5}
        speed={0.8}
        color={goldColor}
      />
      <Sparkles
        count={50}
        scale={[15, 60, 10]}
        position={[0, 40, 0]}
        size={1.5}
        speed={0.5}
        color={jadeColor}
      />

      {/* Lights */}
      <pointLight position={[0, 50, 5]} color={goldColor} intensity={5} distance={60} />
      <pointLight position={[0, 30, 3]} color={brightGold} intensity={3} distance={40} />
      <pointLight position={[0, 15, 0]} color={goldColor} intensity={2} distance={30} />
      <pointLight position={[0, 45, 0]} color={jadeColor} intensity={1.5} distance={25} />
    </group>
  );
}

export default SkillsSection;
