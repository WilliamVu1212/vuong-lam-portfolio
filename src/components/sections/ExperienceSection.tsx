import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { experiences, certifications } from '@/data/content';
import type { Experience, Certification } from '@/types';
import { ScrollIcon, SealIcon, SpiritStoneIcon, JadeIcon } from '@/components/ui/XianxiaIcons';

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
  const monumentPositions: [number, number, number][] = [
    [25, 0, 20],
    [-20, 0, 30],
    [30, 0, -15],
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

  // Experience icons (SVG components)
  const ExpIcons = [ScrollIcon, SealIcon, SpiritStoneIcon];
  const ExpIcon = ExpIcons[index % ExpIcons.length];

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
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
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

        {/* Top ornament */}
        <mesh position={[0, 11, 0]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={(hovered || isOpen) ? 1.5 : 1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Icon button - always visible */}
        <Html
          position={[0, 13, 0]}
          center
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          <div
            className="cursor-pointer transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            style={{
              transform: hovered ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(26, 10, 10, 0.9)',
                border: `3px solid ${color}`,
                boxShadow: (hovered || isOpen) ? `0 0 25px ${color}, 0 0 50px ${color}50` : `0 0 10px ${color}50`,
              }}
            >
              <ExpIcon size={24} color={color} />
            </div>
          </div>
        </Html>

        {/* Detail panel - only show when clicked */}
        {isOpen && (
          <Html
            position={[0, 22, 0]}
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
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${color}20`,
                    border: `2px solid ${color}`,
                  }}
                >
                  <ExpIcon size={20} color={color} />
                </div>
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
  const stonePositions: [number, number, number][] = [
    [-35, 0, -20],
    [40, 0, 5],
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
      <group
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
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

        {/* Seal/Badge on top */}
        <mesh position={[0, 5.5, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={(hovered || isOpen) ? 1 : 0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Icon button - always visible */}
        <Html
          position={[0, 7, 0]}
          center
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          <div
            className="cursor-pointer transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            style={{
              transform: hovered ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(26, 10, 10, 0.9)',
                border: '3px solid #FFD700',
                boxShadow: (hovered || isOpen) ? '0 0 25px #FFD700, 0 0 50px #FFD70050' : '0 0 10px #FFD70050',
              }}
            >
              <JadeIcon size={20} color="#FFD700" />
            </div>
          </div>
        </Html>

        {/* Detail panel - only show when clicked */}
        {isOpen && (
          <Html
            position={[0, 14, 0]}
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
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#FFD70020',
                    border: '2px solid #FFD700',
                  }}
                >
                  <JadeIcon size={20} color="#FFD700" />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#FFD700' }}>Chứng Chỉ</p>
                  <h3 className="font-bold text-sm" style={{ color: '#F5E6D3' }}>
                    {certification.name}
                  </h3>
                </div>
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

export default ExperienceSection;
