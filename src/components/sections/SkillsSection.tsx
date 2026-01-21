import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, Line } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { skillCategories } from '@/data/content';
import { SKILL_RANKS } from '@/utils/constants';
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

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

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

export default SkillsSection;
