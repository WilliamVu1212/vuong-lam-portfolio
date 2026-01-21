import { useRef, useState, useMemo } from 'react';
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

      {/* Trảm La Kiếm - Soul Slaying Swords 2 bên */}
      <SoulSlayingSword position={[-55, 0, 0]} side="left" />
      <SoulSlayingSword position={[55, 0, 0]} side="right" />

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

// ==================== TRẢM LA KIẾM (SOUL SLAYING SWORD) ====================
interface SoulSlayingSwordProps {
  position: [number, number, number];
  side: 'left' | 'right';
}

function SoulSlayingSword({ position }: SoulSlayingSwordProps) {
  const swordRef = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const runesRef = useRef<THREE.Group>(null);

  // Main colors - vàng kim như trong ảnh
  const goldColor = '#FFD700';
  const brightGold = '#FFA500';
  const paleGold = '#FFFACD';
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

    // Main glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 1.5) * 0.1;
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
            <meshBasicMaterial color={paleGold} transparent opacity={0.6} />
          </mesh>

          {/* Blade edge glow - right */}
          <mesh position={[4.2, 35, 0]}>
            <boxGeometry args={[0.5, 55, 1.8]} />
            <meshBasicMaterial color={paleGold} transparent opacity={0.6} />
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

        {/* === ENERGY EFFECTS === */}
        {/* Main glow aura */}
        <mesh ref={glowRef} position={[0, 35, 0]}>
          <planeGeometry args={[20, 70]} />
          <meshBasicMaterial
            color={goldColor}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Energy streaks */}
        {[-4, 4].map((x, i) => (
          <mesh key={`streak-${i}`} position={[x, 35, 2]}>
            <planeGeometry args={[0.5, 60]} />
            <meshBasicMaterial
              color={paleGold}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
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

export default ExperienceSection;
