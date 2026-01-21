import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { skillCategories } from '@/data/content';
import { SKILL_RANKS } from '@/utils/constants';
import type { Skill, SkillCategory } from '@/types';

interface SkillsSectionProps {
  position?: [number, number, number];
}

export function SkillsSection({ position = [0, 60, -200] }: SkillsSectionProps) {
  return (
    <group position={position}>
      {/* Main Platform */}
      <SkillsPlatform />

      {/* Central Altar */}
      <CentralAltar position={[0, 1, 0]} />

      {/* Skill Category Pillars */}
      <SkillPillars />

      {/* Floating Runes */}
      <FloatingRunes />

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
  const colors = ['#FF4444', '#FF8C00', '#FFD700', '#FF6B35'];
  const color = colors[index % colors.length];

  return (
    <group ref={pillarRef} position={position}>
      {/* Main pillar */}
      <mesh position={[0, 8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.5, 16, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 16.5, 0]}>
        <cylinderGeometry args={[3, 2, 1, 8]} />
        <meshStandardMaterial
          color="#3D2424"
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Category icon orb */}
      <Float speed={2} floatIntensity={0.3}>
        <mesh position={[0, 19, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Skill tablets floating around pillar */}
      {category.skills.map((skill, skillIndex) => (
        <SkillTablet
          key={skillIndex}
          skill={skill}
          position={[
            Math.cos((Math.PI * 2 * skillIndex) / category.skills.length) * 6,
            4 + skillIndex * 2.5,
            Math.sin((Math.PI * 2 * skillIndex) / category.skills.length) * 6,
          ]}
          color={color}
          index={skillIndex}
        />
      ))}

      {/* Pillar light */}
      <pointLight position={[0, 10, 0]} color={color} intensity={1} distance={15} />

      {/* Energy connection to center */}
      <EnergyBeam
        start={[0, 8, 0]}
        end={[-position[0], 10 - position[1], -position[2]]}
        color={color}
      />
    </group>
  );
}

interface SkillTabletProps {
  skill: Skill;
  position: [number, number, number];
  color: string;
  index: number;
}

function SkillTablet({ skill, position, color, index }: SkillTabletProps) {
  const [hovered, setHovered] = useState(false);
  const tabletRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const rankColor = SKILL_RANKS.colors[skill.rank] || color;

  useFrame((state) => {
    if (tabletRef.current) {
      tabletRef.current.rotation.y = state.clock.elapsedTime * 0.2 + index;
    }
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = hovered ? 0.6 : 0.3 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group
        ref={tabletRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Tablet base */}
        <mesh castShadow>
          <boxGeometry args={[3, 2, 0.3]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.8}
            metalness={0.2}
            emissive={rankColor}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Glow effect */}
        <mesh ref={glowRef} position={[0, 0, 0.16]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshBasicMaterial
            color={rankColor}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Skill level bar background */}
        <mesh position={[0, -0.6, 0.17]}>
          <planeGeometry args={[2.4, 0.2]} />
          <meshBasicMaterial color="#1A0A0A" />
        </mesh>

        {/* Skill level bar fill */}
        <mesh position={[(skill.level / 100 - 1) * 1.2, -0.6, 0.18]}>
          <planeGeometry args={[2.4 * (skill.level / 100), 0.15]} />
          <meshBasicMaterial color={rankColor} />
        </mesh>

        {/* HTML tooltip on hover */}
        {hovered && (
          <Html
            position={[0, 1.5, 0]}
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div className="glass px-3 py-2 rounded-lg text-center whitespace-nowrap">
              <p className="text-co-chi font-bold text-sm">{skill.name}</p>
              <p className="text-xs" style={{ color: rankColor }}>
                {skill.rank} - {skill.level}%
              </p>
            </div>
          </Html>
        )}

        {/* Point light when hovered */}
        {hovered && (
          <pointLight color={rankColor} intensity={1} distance={5} />
        )}
      </group>
    </Float>
  );
}

interface EnergyBeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

function EnergyBeam({ start, end, color }: EnergyBeamProps) {
  const beamRef = useRef<THREE.Line>(null);

  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state) => {
    if (beamRef.current) {
      const material = beamRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <line ref={beamRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={2} />
    </line>
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
