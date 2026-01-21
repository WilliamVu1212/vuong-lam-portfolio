import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import {
  Stars,
  Float,
  Sparkles,
  OrbitControls,
  shaderMaterial,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';

// Waterfall shader material
const WaterfallMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#4488FF'),
    uColor2: new THREE.Color('#88CCFF'),
    uOpacity: 0.6,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Wave distortion
      float wave = sin(pos.y * 3.0 + uTime * 2.0) * 0.15;
      wave += sin(pos.y * 5.0 + uTime * 3.0) * 0.1;
      pos.x += wave;
      pos.z += wave * 0.5;

      vElevation = wave;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uOpacity;

    void main() {
      // Animated gradient
      float flow = fract(vUv.y * 3.0 - uTime * 0.8);

      // Mix colors based on flow
      vec3 color = mix(uColor1, uColor2, flow);

      // Add shimmer
      float shimmer = sin(vUv.x * 20.0 + uTime * 5.0) * 0.1 + 0.9;
      color *= shimmer;

      // Fade at edges
      float alpha = uOpacity;
      alpha *= smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
      alpha *= smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);

      // Add glow based on elevation
      color += vec3(0.2, 0.4, 0.6) * (vElevation + 0.2);

      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ WaterfallMaterial });
import { WORLD, CAMERA } from '@/utils/constants';
import { useUIStore, useGameStore } from '@/stores/gameStore';
import Player from './Player';
import { IntroCloudPlatforms, SkillsCloudPlatforms, ProjectsCloudPlatforms, ExperienceCloudPlatforms } from './CloudPlatforms';
import {
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
  VanDinhSection,
} from '@/components/sections';

// Camera controller for smooth navigation
function CameraController() {
  const { camera, controls } = useThree();
  const cameraTarget = useUIStore((state) => state.cameraTarget);
  const cameraLookAt = useUIStore((state) => state.cameraLookAt);
  const setCameraTarget = useUIStore((state) => state.setCameraTarget);

  // Sword flight camera follow
  const playerPosition = useGameStore((state) => state.player.position);
  const isFlying = useGameStore((state) => state.player.isFlying);
  const transportMode = useGameStore((state) => state.transportMode);

  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);

  // Stop animation when user interacts with controls (zoom, rotate, pan)
  useEffect(() => {
    if (controls) {
      const orbitControls = controls as any;
      const handleUserInteraction = () => {
        // User đang tương tác - dừng animation ngay lập tức
        if (isAnimating.current) {
          isAnimating.current = false;
          setCameraTarget(null, null);
        }
      };

      // Lắng nghe sự kiện user bắt đầu tương tác
      orbitControls.addEventListener('start', handleUserInteraction);

      return () => {
        orbitControls.removeEventListener('start', handleUserInteraction);
      };
    }
  }, [controls, setCameraTarget]);

  useEffect(() => {
    if (cameraTarget) {
      targetPosition.current.set(...cameraTarget);
      if (cameraLookAt) {
        targetLookAt.current.set(...cameraLookAt);
      }
      isAnimating.current = true;
    }
  }, [cameraTarget, cameraLookAt]);

  useFrame(() => {
    // ===== SWORD FLIGHT CAMERA FOLLOW =====
    if (isFlying && transportMode === 'sword') {
      const swordCam = CAMERA.follow.sword;

      // Get current camera direction (horizontal only)
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      camDir.y = 0;
      camDir.normalize();

      // Calculate camera position behind player
      const playerPos = new THREE.Vector3(...playerPosition);
      const idealOffset = camDir.clone().multiplyScalar(swordCam.distance);
      idealOffset.y = swordCam.height;

      const idealPosition = playerPos.clone().add(idealOffset);

      // Smoothly interpolate camera position
      camera.position.lerp(idealPosition, swordCam.smoothing);

      // Update OrbitControls target to follow player
      if (controls) {
        const orbitControls = controls as any;
        if (orbitControls.target) {
          orbitControls.target.lerp(playerPos, swordCam.smoothing * 2);
        }
      }

      return; // Skip normal camera animation
    }

    // ===== NORMAL CAMERA ANIMATION =====
    if (isAnimating.current && cameraTarget) {
      // Smoothly interpolate camera position
      camera.position.lerp(targetPosition.current, 0.02);

      // Update OrbitControls target if lookAt is specified
      if (cameraLookAt && controls) {
        const orbitControls = controls as any;
        if (orbitControls.target) {
          orbitControls.target.lerp(targetLookAt.current, 0.02);
        }
      }

      // Check if animation is complete
      const distance = camera.position.distanceTo(targetPosition.current);
      if (distance < 1) {
        isAnimating.current = false;
        setCameraTarget(null, null);
      }
    }
  });

  return null;
}

function Experience() {
  const isDebugMode = useUIStore((state) => state.isDebugMode);

  return (
    <>
      {/* Debug */}
      {isDebugMode && <Perf position="top-left" />}

      {/* Camera Controller for smooth navigation */}
      <CameraController />

      {/* Orbit Controls - Mouse to rotate/zoom/pan */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={800}
        maxPolarAngle={Math.PI * 0.9}
        minPolarAngle={0.05}
        rotateSpeed={0.8}
        zoomSpeed={1.5}
        panSpeed={1}
        enablePan={true}
        screenSpacePanning={true}
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
        <VanDinhSection />
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

      {/* Cloud Sea - Đã bỏ theo yêu cầu */}
      {/* <CloudSea /> */}

      {/* Waterfalls - Thác nước linh khí */}
      {/* Thác Hỏa Viêm - Lửa đỏ (trái) */}
      <Waterfall position={[-50, 40, -120]} height={35} width={10} color1="#FF2222" color2="#FF6600" />
      {/* Thác Thanh Lam - Xanh lam (phải) */}
      <Waterfall position={[50, 40, -120]} height={35} width={10} color1="#2266FF" color2="#66CCFF" />
      {/* Thác Tử Điện - Tím (trái xa) - Nguyên Anh */}
      <Waterfall position={[-70, 130, -320]} height={40} width={12} color1="#8B00FF" color2="#DA70D6" />
      {/* Thác Kim Quang - Vàng kim (phải xa) - Nguyên Anh */}
      <Waterfall position={[70, 130, -320]} height={40} width={12} color1="#FFD700" color2="#FFFACD" />

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

/* Moon component - removed as per user request
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
*/

/* CloudSea - Removed as per user request
function CloudSea() {
  return (
    <group position={[0, -30, 0]}>
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 300, Math.random() * 10 - 20, (Math.random() - 0.5) * 400 - 100]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#2D1B1B" transparent opacity={0.3 + Math.random() * 0.2} />
        </mesh>
      ))}
    </group>
  );
}
*/

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

// Waterfall Component - Thác nước linh khí
interface WaterfallProps {
  position: [number, number, number];
  height?: number;
  width?: number;
  color1?: string;
  color2?: string;
}

function Waterfall({ position, height = 30, width = 8, color1 = '#4488FF', color2 = '#88CCFF' }: WaterfallProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const mistRef = useRef<THREE.Mesh>(null);

  // Particle system for water droplets
  const { particlePositions, particleSpeeds } = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = Math.random() * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      speeds[i] = 0.3 + Math.random() * 0.4;
    }

    return { particlePositions: positions, particleSpeeds: speeds };
  }, [height, width]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Update shader time
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }

    // Animate particles falling
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] -= particleSpeeds[i];

        // Reset particle when it falls below
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = height;
          positions[i * 3] = (Math.random() - 0.5) * width;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate mist
    if (mistRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      mistRef.current.scale.set(scale, scale * 0.5, scale);
      (mistRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Main waterfall surface */}
      <mesh>
        <planeGeometry args={[width, height, 32, 64]} />
        {/* @ts-ignore - custom shader material */}
        <waterfallMaterial
          ref={materialRef}
          uColor1={new THREE.Color(color1)}
          uColor2={new THREE.Color(color2)}
          uOpacity={0.6}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Back glow layer */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[width + 2, height + 2]} />
        <meshBasicMaterial
          color={color1}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Water droplet particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color={color2}
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Mist at bottom */}
      <mesh ref={mistRef} position={[0, -height / 2 - 2, 2]}>
        <sphereGeometry args={[width * 0.8, 16, 16]} />
        <meshBasicMaterial
          color={color2}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Splash sparkles at bottom */}
      <Sparkles
        count={30}
        scale={[width * 1.5, 5, 5]}
        position={[0, -height / 2, 0]}
        size={1}
        speed={0.5}
        color={color2}
      />

      {/* Pool at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2 - 1, 3]}>
        <circleGeometry args={[width * 0.6, 32]} />
        <meshBasicMaterial
          color={color1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Rocks at base */}
      <group position={[0, -height / 2, 0]}>
        <mesh position={[-width * 0.4, 0, 2]} castShadow>
          <dodecahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#3D2424" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[width * 0.4, -0.5, 2.5]} castShadow>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#4a2828" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0, 0.5, 3]} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#3D2424" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Side rocks/cliff */}
      <mesh position={[-width / 2 - 2, 0, -1]} castShadow>
        <boxGeometry args={[4, height + 5, 3]} />
        <meshStandardMaterial color="#3D2424" roughness={0.9} />
      </mesh>
      <mesh position={[width / 2 + 2, 0, -1]} castShadow>
        <boxGeometry args={[4, height + 5, 3]} />
        <meshStandardMaterial color="#3D2424" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default Experience;
