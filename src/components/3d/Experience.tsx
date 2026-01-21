import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Stars,
  Float,
  Cloud,
  Sparkles,
  OrbitControls,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import { WORLD } from '@/utils/constants';
import { useUIStore } from '@/stores/gameStore';
import Player from './Player';
import { IntroCloudPlatforms, SkillsCloudPlatforms, ProjectsCloudPlatforms, ExperienceCloudPlatforms } from './CloudPlatforms';
import {
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
} from '@/components/sections';

function Experience() {
  const isDebugMode = useUIStore((state) => state.isDebugMode);

  return (
    <>
      {/* Debug */}
      {isDebugMode && <Perf position="top-left" />}

      {/* Orbit Controls - Mouse to rotate/zoom */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={300}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={0.1}
        rotateSpeed={-0.5}
        zoomSpeed={1}
        panSpeed={0.5}
        enablePan={false}
      />

      {/* Environment */}
      <SceneEnvironment />

      {/* Physics World */}
      <Physics gravity={[0, -30, 0]} debug={false}>
        {/* Player */}
        <Player />

        {/* Ground Platform with collision */}
        <GroundCollider />

        {/* Cloud Platforms for navigation */}
        <IntroCloudPlatforms />
        <SkillsCloudPlatforms />
        <ProjectsCloudPlatforms />
        <ExperienceCloudPlatforms />

        {/* Content Sections (with their own physics colliders) */}
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </Physics>

      {/* Visual World Content (no physics) */}
      <WorldContent />

      {/* Post Processing */}
      <PostProcessing />
    </>
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
}

function SceneEnvironment() {
  return (
    <>
      {/* Background */}
      <color attach="background" args={['#0a0505']} />

      {/* Ambient Light */}
      <ambientLight intensity={0.4} color="#FF6B35" />

      {/* Main Directional Light (Moon) */}
      <directionalLight
        position={WORLD.sky.moonPosition}
        intensity={1}
        color="#FFE4C4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fire glow from below */}
      <pointLight position={[0, -20, 0]} intensity={2} color="#FF4444" distance={150} />

      {/* Accent lights */}
      <pointLight position={[50, 30, -50]} intensity={0.5} color="#FF8C00" distance={100} />
      <pointLight position={[-50, 30, -50]} intensity={0.5} color="#FFD700" distance={100} />

      {/* Hemisphere light */}
      <hemisphereLight color="#FF8C00" groundColor="#1A0A0A" intensity={0.3} />

      {/* Stars */}
      <Stars radius={400} depth={100} count={3000} factor={6} saturation={0.8} fade speed={0.3} />

      {/* Fog */}
      <fog attach="fog" args={['#1A0A0A', 100, 600]} />
    </>
  );
}

function GroundCollider() {
  return (
    <RigidBody type="fixed" colliders={false} position={[0, -2, 0]}>
      <CuboidCollider args={[30, 0.5, 30]} />
    </RigidBody>
  );
}

function WorldContent() {
  return (
    <>
      {/* Ground Platform Visual */}
      <IntroPlatform />

      {/* Floating Mountains */}
      <FloatingMountains />

      {/* Moon - Đã bỏ theo yêu cầu */}
      {/* <Moon /> */}

      {/* Cloud Sea */}
      <CloudSea />

      {/* Fire Particles */}
      <FireParticles />

      {/* Energy Orbs */}
      <EnergyOrbs />
    </>
  );
}

function IntroPlatform() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Main platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.6}
          metalness={0.3}
          emissive="#FF4444"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Animated ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[28, 30, 64]} />
        <meshBasicMaterial color="#FF4444" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[15, 16, 64]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.5} />
      </mesh>

      {/* Center glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>

      {/* Runes */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            Math.cos((Math.PI * 2 * i) / 6) * 22,
            0.04,
            Math.sin((Math.PI * 2 * i) / 6) * 22,
          ]}
        >
          <circleGeometry args={[2, 6]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Sparkles */}
      <Sparkles count={50} scale={[60, 5, 60]} position={[0, 2, 0]} size={2} speed={0.3} color="#FF8C00" />
    </group>
  );
}

function FloatingMountains() {
  return (
    <>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
        <FloatingIsland position={[0, 25, -80]} scale={1.5} color="#4a2828" accentColor="#FF4444" />
      </Float>

      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
        <FloatingIsland position={[0, 50, -160]} scale={2} color="#3D2424" accentColor="#FF8C00" />
      </Float>

      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.4}>
        <FloatingIsland position={[-60, 80, -240]} scale={1.3} color="#4a2828" accentColor="#FFD700" />
      </Float>

      <Float speed={0.9} rotationIntensity={0.05} floatIntensity={0.4}>
        <FloatingIsland position={[60, 80, -240]} scale={1.3} color="#3D2424" accentColor="#FF6B35" />
      </Float>

      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} floatIntensity={0.3}>
          <SmallRock
            position={[
              (Math.random() - 0.5) * 100,
              10 + Math.random() * 30,
              -50 - Math.random() * 150,
            ]}
            scale={0.3 + Math.random() * 0.5}
          />
        </Float>
      ))}
    </>
  );
}

interface FloatingIslandProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  accentColor?: string;
}

function FloatingIsland({ position, scale = 1, color = '#4a2828', accentColor = '#FF4444' }: FloatingIslandProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[10, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} flatShading emissive={accentColor} emissiveIntensity={0.1} />
      </mesh>

      <mesh position={[0, -8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[6, 10, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} flatShading emissive="#FF4444" emissiveIntensity={0.05} />
      </mesh>

      <mesh position={[0, 8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 8]} />
        <meshStandardMaterial color="#2D1B1B" roughness={0.6} emissive={accentColor} emissiveIntensity={0.05} />
      </mesh>

      <Crystal position={[4, 6, 3]} color={accentColor} scale={1.2} />
      <Crystal position={[-3, 7, 2]} color="#FF8C00" scale={0.8} />
      <Crystal position={[0, 9, -3]} color="#FFD700" scale={1} />
      <Crystal position={[-5, 5, -2]} color={accentColor} scale={0.6} />

      <Sparkles count={30} scale={[20, 15, 20]} position={[0, 5, 0]} size={1.5} speed={0.2} color={accentColor} />
    </group>
  );
}

function Crystal({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      const material = crystalRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={crystalRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} roughness={0.1} metalness={0.8} transparent opacity={0.9} />
    </mesh>
  );
}

function SmallRock({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[3, 0]} />
      <meshStandardMaterial color="#3D2424" roughness={0.9} flatShading emissive="#FF4444" emissiveIntensity={0.1} />
    </mesh>
  );
}

function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (moonRef.current) {
      const material = moonRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[80, 120, -200]}>
      <mesh ref={moonRef}>
        <sphereGeometry args={[25, 64, 64]} />
        <meshStandardMaterial color="#FFE8D6" emissive="#FFD4B8" emissiveIntensity={0.8} roughness={0.8} />
      </mesh>

      <mesh scale={1.15}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial color="#FFE4C4" transparent opacity={0.15} />
      </mesh>

      <mesh ref={haloRef} scale={1.5}>
        <ringGeometry args={[30, 45, 64]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <pointLight color="#FFE4C4" intensity={3} distance={400} />
    </group>
  );
}

function CloudSea() {
  return (
    <group position={[0, -30, 0]}>
      {[...Array(15)].map((_, i) => (
        <Cloud
          key={i}
          position={[(Math.random() - 0.5) * 300, Math.random() * 10 - 20, (Math.random() - 0.5) * 400 - 100]}
          speed={0.1 + Math.random() * 0.1}
          opacity={0.3 + Math.random() * 0.2}
          width={30 + Math.random() * 20}
          depth={5}
          segments={20}
          color="#2D1B1B"
        />
      ))}

      {[...Array(8)].map((_, i) => (
        <Cloud
          key={`glow-${i}`}
          position={[(Math.random() - 0.5) * 200, Math.random() * 5 - 25, (Math.random() - 0.5) * 300 - 50]}
          speed={0.05}
          opacity={0.15}
          width={40 + Math.random() * 30}
          depth={3}
          segments={15}
          color="#FF4444"
        />
      ))}
    </group>
  );
}

function FireParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const fireColors = [new THREE.Color('#FF4444'), new THREE.Color('#FF8C00'), new THREE.Color('#FFD700')];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 1] = Math.random() * 80 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300 - 50;

      const color = fireColors[Math.floor(Math.random() * fireColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] += 0.05 + Math.random() * 0.05;
        if (pos[i * 3 + 1] > 80) pos[i * 3 + 1] = -10;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function EnergyOrbs() {
  return (
    <>
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={2 + Math.random() * 2} floatIntensity={2} rotationIntensity={0.5}>
          <mesh position={[(Math.random() - 0.5) * 100, 5 + Math.random() * 40, (Math.random() - 0.5) * 150 - 30]}>
            <sphereGeometry args={[0.3 + Math.random() * 0.3, 16, 16]} />
            <meshBasicMaterial color={['#FF4444', '#FF8C00', '#FFD700'][Math.floor(Math.random() * 3)]} transparent opacity={0.8} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default Experience;
