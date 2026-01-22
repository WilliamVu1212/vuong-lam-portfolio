import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';
import { useSoundEffects } from '@/hooks/useAudio';

interface AboutSectionProps {
  position?: [number, number, number];
}

export function AboutSection({ position = [0, 30, -100] }: AboutSectionProps) {
  return (
    <group position={position}>
      {/* Main Platform */}
      <AboutPlatform />

      {/* Pagoda Structure */}
      <Pagoda position={[0, 1, 0]} />

      {/* Info Stones */}
      <InfoStones />

      {/* Decorative Elements */}
      <Decorations />

      {/* Trảm La Kiếm - Soul Slaying Swords 2 bên (unlock Ngự Kiếm) */}
      <SoulSlayingSword position={[-45, 0, 0]} side="left" sectionPosition={position} />
      <SoulSlayingSword position={[45, 0, 0]} side="right" sectionPosition={position} />

      {/* Ambient Particles */}
      <Sparkles
        count={100}
        scale={[80, 30, 80]}
        position={[0, 15, 0]}
        size={2}
        speed={0.3}
        color="#FF8C00"
      />
    </group>
  );
}

function AboutPlatform() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group>
      {/* Physics collider for landing */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[40, 1, 40]} position={[0, -1, 0]} />
      </RigidBody>

      {/* Main circular platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Outer ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[38, 40, 64]} />
        <meshBasicMaterial color="#FF4444" transparent opacity={0.6} />
      </mesh>

      {/* Inner decorative rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[25, 26, 64]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.4} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[15, 16, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

interface PagodaProps {
  position: [number, number, number];
}

function Pagoda({ position }: PagodaProps) {
  return (
    <group position={position}>
      {/* Physics colliders for Pagoda - player can stand on roofs and floors */}
      <RigidBody type="fixed" colliders={false}>
        {/* Base platform collider */}
        <CuboidCollider args={[9, 0.5, 9]} position={[0, 0.5, 0]} />

        {/* First floor top (under first roof) */}
        <CuboidCollider args={[7.5, 0.25, 7.5]} position={[0, 4, 0]} />

        {/* First roof - flat top area */}
        <CuboidCollider args={[3, 0.3, 3]} position={[0, 6, 0]} />

        {/* Second floor top (under second roof) */}
        <CuboidCollider args={[5.5, 0.25, 5.5]} position={[0, 8.25, 0]} />

        {/* Second roof - flat top area */}
        <CuboidCollider args={[2, 0.3, 2]} position={[0, 9.9, 0]} />

        {/* Third floor top (under top roof) */}
        <CuboidCollider args={[4, 0.25, 4]} position={[0, 11.5, 0]} />

        {/* Top roof - flat top area */}
        <CuboidCollider args={[1.5, 0.3, 1.5]} position={[0, 13.5, 0]} />
      </RigidBody>

      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[8, 10, 1, 8]} />
        <meshStandardMaterial
          color="#3D2424"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* First floor */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[7, 8, 3, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* First roof */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[10, 2, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Second floor */}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[5, 6, 2.5, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Second roof */}
      <mesh position={[0, 9, 0]} castShadow>
        <coneGeometry args={[7.5, 1.8, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Third floor */}
      <mesh position={[0, 10.5, 0]} castShadow>
        <cylinderGeometry args={[3.5, 4.5, 2, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Top roof */}
      <mesh position={[0, 12.5, 0]} castShadow>
        <coneGeometry args={[5.5, 2, 8]} />
        <meshStandardMaterial
          color="#1A0A0A"
          roughness={0.6}
          metalness={0.4}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Spire orb */}
      <mesh position={[0, 17, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Light from pagoda */}
      <pointLight
        position={[0, 10, 0]}
        color="#FF8C00"
        intensity={2}
        distance={30}
      />

      {/* Lanterns on each corner */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Lantern
          key={i}
          position={[
            Math.cos((Math.PI * 2 * i) / 8) * 9,
            3,
            Math.sin((Math.PI * 2 * i) / 8) * 9,
          ]}
        />
      ))}
    </group>
  );
}

interface LanternProps {
  position: [number, number, number];
}

function Lantern({ position }: LanternProps) {
  const lanternRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lanternRef.current) {
      const material = lanternRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.3}>
      <group position={position}>
        {/* Lantern body */}
        <mesh ref={lanternRef}>
          <cylinderGeometry args={[0.4, 0.5, 1, 8]} />
          <meshStandardMaterial
            color="#FF4444"
            emissive="#FF4444"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Top cap */}
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.5, 0.3, 8]} />
          <meshStandardMaterial color="#1A0A0A" metalness={0.5} />
        </mesh>

        {/* Bottom cap */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.2, 8]} />
          <meshStandardMaterial color="#1A0A0A" metalness={0.5} />
        </mesh>

        {/* Light */}
        <pointLight color="#FF6B35" intensity={0.5} distance={8} />
      </group>
    </Float>
  );
}

function InfoStones() {
  const stones = [
    { position: [-20, 1, 15] as [number, number, number], rotation: 0.3, content: 'name' },
    { position: [20, 1, 15] as [number, number, number], rotation: -0.3, content: 'title' },
    { position: [-25, 1, -10] as [number, number, number], rotation: 0.5, content: 'bio' },
    { position: [25, 1, -10] as [number, number, number], rotation: -0.5, content: 'journey' },
  ];

  return (
    <>
      {stones.map((stone, index) => (
        <InfoStone
          key={index}
          position={stone.position}
          rotation={stone.rotation}
          contentType={stone.content}
          index={index}
        />
      ))}
    </>
  );
}

interface InfoStoneProps {
  position: [number, number, number];
  rotation: number;
  contentType: string;
  index: number;
}

function InfoStone({ position, rotation, index }: InfoStoneProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.2}>
      <group position={position} rotation={[0, rotation, 0]}>
        {/* Stone base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 8, 1]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Stone frame */}
        <mesh position={[0, 0, 0.51]}>
          <boxGeometry args={[5.5, 7.5, 0.1]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.8}
          />
        </mesh>

        {/* Glow border */}
        <mesh ref={glowRef} position={[0, 0, 0.52]}>
          <planeGeometry args={[5.8, 7.8]} />
          <meshBasicMaterial
            color="#FF8C00"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Title text (simplified - using plane with color) */}
        <mesh position={[0, 2.5, 0.55]}>
          <planeGeometry args={[4, 1]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>

        {/* Content indicator */}
        <mesh position={[0, 0, 0.55]}>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial color="#F5E6D3" transparent opacity={0.1} />
        </mesh>

        {/* Corner decorations */}
        {[[-2.5, 3.5], [2.5, 3.5], [-2.5, -3.5], [2.5, -3.5]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.53]}>
            <circleGeometry args={[0.3, 6]} />
            <meshBasicMaterial color="#FF4444" />
          </mesh>
        ))}

        {/* Light */}
        <pointLight
          position={[0, 0, 2]}
          color="#FF8C00"
          intensity={0.3}
          distance={5}
        />
      </group>
    </Float>
  );
}

function Decorations() {
  return (
    <>
      {/* Torii gates at entrance points */}
      <ToriiGate position={[0, 0, 35]} rotation={0} />
      <ToriiGate position={[0, 0, -35]} rotation={Math.PI} />
      <ToriiGate position={[35, 0, 0]} rotation={Math.PI / 2} />
      <ToriiGate position={[-35, 0, 0]} rotation={-Math.PI / 2} />

      {/* Cherry blossom trees */}
      <CherryTree position={[-15, 0, 25]} />
      <CherryTree position={[15, 0, 25]} />
      <CherryTree position={[-25, 0, -20]} />
      <CherryTree position={[25, 0, -20]} />
    </>
  );
}

interface ToriiGateProps {
  position: [number, number, number];
  rotation: number;
}

function ToriiGate({ position, rotation }: ToriiGateProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Physics colliders for Torii Gate */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left pillar collider */}
        <CuboidCollider args={[0.5, 4, 0.5]} position={[-3, 4, 0]} />
        {/* Right pillar collider */}
        <CuboidCollider args={[0.5, 4, 0.5]} position={[3, 4, 0]} />
        {/* Top beam collider */}
        <CuboidCollider args={[4, 0.3, 0.4]} position={[0, 8, 0]} />
        {/* Roof piece collider - player can stand on top */}
        <CuboidCollider args={[4.5, 0.15, 0.6]} position={[0, 8.5, 0]} />
      </RigidBody>

      {/* Left pillar */}
      <mesh position={[-3, 4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 8, 8]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right pillar */}
      <mesh position={[3, 4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 8, 8]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[8, 0.6, 0.8]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF4444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Second beam */}
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[6.5, 0.4, 0.6]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Roof piece */}
      <mesh position={[0, 8.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[9, 0.3, 1.2]} />
        <meshStandardMaterial
          color="#1A0A0A"
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

interface CherryTreeProps {
  position: [number, number, number];
}

function CherryTree({ position }: CherryTreeProps) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 6, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>

      {/* Branches/Foliage - using spheres for cherry blossoms */}
      <mesh position={[0, 7, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial
          color="#FF69B4"
          emissive="#FF1493"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh position={[-1.5, 6, 1]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#FF69B4"
          emissive="#FF1493"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh position={[1.5, 6.5, -1]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshStandardMaterial
          color="#FFB6C1"
          emissive="#FF69B4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Sparkles for falling petals effect */}
      <Sparkles
        count={30}
        scale={[8, 10, 8]}
        position={[0, 5, 0]}
        size={1}
        speed={0.5}
        color="#FFB6C1"
      />
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

  // Collider constants
  const PEDESTAL_HEIGHT = 6;
  const PEDESTAL_RADIUS = 6;

  const playerPosition = useGameStore((state) => state.player.position);
  const unlockedTransports = useGameStore((state) => state.unlockedTransports);
  const unlockTransport = useGameStore((state) => state.unlockTransport);
  const setTransportMode = useGameStore((state) => state.setTransportMode);
  const setPlayerFlying = useGameStore((state) => state.setPlayerFlying);
  const { playUnlock, playSwordWhoosh } = useSoundEffects();

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
      setPlayerFlying(true); // Tự động bay kiếm luôn khi unlock
      setIsUnlocked(true);
      playUnlock();
      playSwordWhoosh(); // Play sword sound
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
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '18px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 30px rgba(255,215,0,0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <div style={{ marginBottom: '8px', fontSize: '22px' }}>⚔️ Trảm La Kiếm ⚔️</div>
            <div style={{ color: '#F5E6D3', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>Đến gần để nhận Phi Kiếm</div>
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
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '18px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 30px rgba(0,255,0,0.5)',
            }}
          >
            <div>✓ Đã khai mở Ngự Kiếm!</div>
            <div style={{ color: '#90EE90', fontSize: '14px', marginTop: '8px', fontFamily: 'system-ui, sans-serif' }}>Nhấn F để bay</div>
          </div>
        </Html>
      )}

      {/* Physics colliders for SoulSlayingSword */}
      <RigidBody type="fixed" colliders={false}>
        {/* Pedestal collider */}
        <CuboidCollider args={[PEDESTAL_RADIUS, PEDESTAL_HEIGHT / 2, PEDESTAL_RADIUS]} position={[0, PEDESTAL_HEIGHT / 2, 0]} />
        {/* Pedestal top surface - player can stand on */}
        <CuboidCollider args={[5.5, 0.25, 5.5]} position={[0, PEDESTAL_HEIGHT, 0]} />
      </RigidBody>

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

export default AboutSection;
