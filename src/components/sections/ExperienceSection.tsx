import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { experiences, certifications } from '@/data/content';
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

      {/* Phoenix Flames - Phượng Hỏa 2 bên */}
      <PhoenixFlame position={[-60, 0, 0]} color="#9932CC" secondaryColor="#DA70D6" side="left" />
      <PhoenixFlame position={[60, 0, 0]} color="#00CED1" secondaryColor="#40E0D0" side="right" />

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

// Phoenix Flame - Phượng Hỏa component với hình dáng phượng hoàng thật sự
interface PhoenixFlameProps {
  position: [number, number, number];
  color: string;
  secondaryColor: string;
  side: 'left' | 'right';
}

function PhoenixFlame({ position, color, secondaryColor, side }: PhoenixFlameProps) {
  const phoenixRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  // Particle trail data - thác lửa từ đuôi
  const trailCount = 100;
  const trailData = useRef(
    Array.from({ length: trailCount }, (_, i) => ({
      y: (i / trailCount) * 60 - 30,
      x: (Math.random() - 0.5) * 6,
      z: (Math.random() - 0.5) * 6 - 5,
      speed: 0.2 + Math.random() * 0.4,
      size: 0.2 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    }))
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Phoenix body hover và bay nhẹ nhàng
    if (phoenixRef.current) {
      phoenixRef.current.position.y = 30 + Math.sin(time * 0.6) * 4;
      const sway = side === 'left' ? Math.sin(time * 0.4) * 3 : Math.cos(time * 0.4) * 3;
      phoenixRef.current.position.x = sway;
      // Nghiêng theo hướng bay
      phoenixRef.current.rotation.z = Math.sin(time * 0.4) * 0.1;
      phoenixRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    }

    // Left wing flapping - đập cánh mượt mà
    if (leftWingRef.current) {
      const flapAngle = Math.sin(time * 2.5) * 0.4;
      leftWingRef.current.rotation.z = 0.3 + flapAngle;
      // Secondary motion cho cánh
      leftWingRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y = Math.sin(time * 3 + i * 0.5) * 0.1;
        }
      });
    }

    // Right wing flapping
    if (rightWingRef.current) {
      const flapAngle = Math.sin(time * 2.5) * 0.4;
      rightWingRef.current.rotation.z = -0.3 - flapAngle;
      rightWingRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y = -Math.sin(time * 3 + i * 0.5) * 0.1;
        }
      });
    }

    // Tail wave animation - đuôi lượn sóng
    if (tailRef.current) {
      tailRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x = Math.sin(time * 2 + i * 0.8) * 0.15;
          child.rotation.z = Math.sin(time * 1.5 + i * 0.5) * 0.1;
        }
      });
    }

    // Body pulse
    if (bodyRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05;
      bodyRef.current.scale.setScalar(scale);
    }

    // Trail particles - chảy xuống từ đuôi
    if (trailRef.current) {
      trailRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const data = trailData.current[i];

          data.y -= data.speed;
          if (data.y < -40) {
            data.y = 30;
            data.x = (Math.random() - 0.5) * 6;
            data.z = (Math.random() - 0.5) * 6 - 5;
          }

          const swirl = Math.sin(time * 1.5 + data.offset) * (2 + Math.abs(data.y) * 0.03);
          child.position.x = data.x + swirl;
          child.position.y = data.y;
          child.position.z = data.z + Math.cos(time * 1.5 + data.offset) * 1.5;

          const material = child.material as THREE.MeshBasicMaterial;
          const normalizedY = (data.y + 40) / 70;
          material.opacity = 0.2 + normalizedY * 0.6;

          const particleScale = data.size * (0.3 + normalizedY * 1.2);
          child.scale.setScalar(particleScale);
        }
      });
    }
  });

  // Material cho phượng hoàng - sheen effect cho lông
  const phoenixMaterial = (
    <meshPhysicalMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.5}
      metalness={0.6}
      roughness={0.3}
      transparent
      opacity={0.9}
    />
  );

  const glowMaterial = (
    <meshBasicMaterial color={secondaryColor} transparent opacity={0.7} />
  );

  return (
    <group position={position}>
      {/* Base pedestal */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[4, 6, 4, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.5}
          metalness={0.5}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Rune rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[6, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <ringGeometry args={[8, 9, 32]} />
        <meshBasicMaterial color={secondaryColor} transparent opacity={0.3} />
      </mesh>

      {/* Fire pillar */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[2, 4, 16, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.4}
          metalness={0.6}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* === PHOENIX BODY === */}
      <group ref={phoenixRef} position={[0, 30, 0]}>

        {/* Main body - ellipsoid */}
        <mesh ref={bodyRef} position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[3, 16, 12]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            emissive={color}
            emissiveIntensity={2}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 3, 2]} rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[1, 1.5, 4, 8]} />
          {phoenixMaterial}
        </mesh>

        {/* Head */}
        <mesh position={[0, 5.5, 3.5]} rotation={[-0.3, 0, 0]}>
          <sphereGeometry args={[1.8, 12, 10]} />
          {phoenixMaterial}
        </mesh>

        {/* Beak */}
        <mesh position={[0, 5.5, 5.5]} rotation={[-0.2, 0, 0]}>
          <coneGeometry args={[0.5, 2.5, 4]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FF8C00"
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Crown feathers - mào */}
        {[-1, 0, 1].map((i) => (
          <mesh key={`crown-${i}`} position={[i * 0.6, 7, 3]} rotation={[-0.5 + i * 0.1, 0, i * 0.2]}>
            <coneGeometry args={[0.3, 2.5, 4]} />
            <meshBasicMaterial color={secondaryColor} transparent opacity={0.8} />
          </mesh>
        ))}

        {/* Eyes - glowing */}
        {[-0.7, 0.7].map((x, i) => (
          <mesh key={`eye-${i}`} position={[x, 5.8, 4.8]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}

        {/* === LEFT WING === */}
        <group ref={leftWingRef} position={[-2, 0, 0]} rotation={[0, 0, 0.3]}>
          {/* Primary feathers - lông cánh chính */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={`left-primary-${i}`}
              position={[-3 - i * 2.5, -i * 0.8, -i * 0.3]}
              rotation={[0, 0.3 + i * 0.1, 0.5 + i * 0.15]}
            >
              <boxGeometry args={[4 - i * 0.3, 0.3, 1.5 - i * 0.15]} />
              <meshPhysicalMaterial
                color={i % 2 === 0 ? color : secondaryColor}
                emissive={i % 2 === 0 ? color : secondaryColor}
                emissiveIntensity={1.2 - i * 0.15}
                metalness={0.5}
                roughness={0.4}
                transparent
                opacity={0.85 - i * 0.1}
              />
            </mesh>
          ))}
          {/* Secondary feathers */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={`left-secondary-${i}`}
              position={[-2 - i * 1.5, 0.5, -i * 0.2]}
              rotation={[0, 0.2, 0.3 + i * 0.1]}
            >
              <boxGeometry args={[3 - i * 0.4, 0.2, 1.2]} />
              {glowMaterial}
            </mesh>
          ))}
        </group>

        {/* === RIGHT WING === */}
        <group ref={rightWingRef} position={[2, 0, 0]} rotation={[0, 0, -0.3]}>
          {/* Primary feathers */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={`right-primary-${i}`}
              position={[3 + i * 2.5, -i * 0.8, -i * 0.3]}
              rotation={[0, -0.3 - i * 0.1, -0.5 - i * 0.15]}
            >
              <boxGeometry args={[4 - i * 0.3, 0.3, 1.5 - i * 0.15]} />
              <meshPhysicalMaterial
                color={i % 2 === 0 ? color : secondaryColor}
                emissive={i % 2 === 0 ? color : secondaryColor}
                emissiveIntensity={1.2 - i * 0.15}
                metalness={0.5}
                roughness={0.4}
                transparent
                opacity={0.85 - i * 0.1}
              />
            </mesh>
          ))}
          {/* Secondary feathers */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={`right-secondary-${i}`}
              position={[2 + i * 1.5, 0.5, -i * 0.2]}
              rotation={[0, -0.2, -0.3 - i * 0.1]}
            >
              <boxGeometry args={[3 - i * 0.4, 0.2, 1.2]} />
              {glowMaterial}
            </mesh>
          ))}
        </group>

        {/* === TAIL === */}
        <group ref={tailRef} position={[0, -2, -3]}>
          {/* Main tail feathers - 7 lông đuôi dài */}
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <mesh
              key={`tail-${i}`}
              position={[i * 1.2, -Math.abs(i) * 0.5, -4 - Math.abs(i) * 2]}
              rotation={[0.8 + Math.abs(i) * 0.1, i * 0.05, i * 0.1]}
            >
              <boxGeometry args={[0.8, 0.2, 8 - Math.abs(i) * 0.8]} />
              <meshPhysicalMaterial
                color={Math.abs(i) % 2 === 0 ? color : secondaryColor}
                emissive={Math.abs(i) % 2 === 0 ? color : secondaryColor}
                emissiveIntensity={1.5 - Math.abs(i) * 0.15}
                metalness={0.5}
                roughness={0.3}
                transparent
                opacity={0.9 - Math.abs(i) * 0.08}
              />
            </mesh>
          ))}
          {/* Tail tip flames */}
          {[-2, 0, 2].map((i) => (
            <mesh key={`tail-tip-${i}`} position={[i * 1.2, -Math.abs(i) * 0.5 - 1, -12 - Math.abs(i)]}>
              <coneGeometry args={[0.6, 2, 6]} />
              <meshBasicMaterial color={secondaryColor} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>

        {/* Body glow aura */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Particle trail - thác lửa từ đuôi */}
      <group ref={trailRef} position={[0, 25, -8]}>
        {trailData.current.map((data, i) => (
          <mesh key={i} position={[data.x, data.y, data.z]}>
            <sphereGeometry args={[data.size, 6, 6]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#FFFFFF' : i % 2 === 0 ? color : secondaryColor}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Fire aura layers */}
      {[0, 1, 2].map((i) => (
        <mesh key={`aura-${i}`} position={[0, 30 + i * 3, 0]}>
          <sphereGeometry args={[10 + i * 3, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.06 - i * 0.015} />
        </mesh>
      ))}

      {/* Lights */}
      <pointLight position={[0, 35, 0]} color={color} intensity={10} distance={100} />
      <pointLight position={[0, 30, 5]} color={secondaryColor} intensity={5} distance={60} />
      <pointLight position={[0, 15, 0]} color={color} intensity={3} distance={40} />

      {/* Sparkles */}
      <Sparkles count={120} scale={[25, 70, 25]} position={[0, 30, 0]} size={3} speed={2} color={color} />
      <Sparkles count={80} scale={[20, 50, 20]} position={[0, 20, -5]} size={2} speed={1.5} color={secondaryColor} />
    </group>
  );
}

export default ExperienceSection;
