import { useRef, useState } from 'react';
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

      {/* Chuông đã di chuyển sang ExperienceSection (Hóa Thần) */}

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
