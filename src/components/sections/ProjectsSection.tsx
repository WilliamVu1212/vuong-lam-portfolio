import { useRef, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Float, Sparkles, Html, Line } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { projects } from '@/data/content';
import { useGameStore, useUIStore } from '@/stores/gameStore';
import type { Project } from '@/types';

// Extend THREE.Line to avoid JSX conflicts
extend({ Line_: THREE.Line });

interface ProjectsSectionProps {
  position?: [number, number, number];
}

export function ProjectsSection({ position = [0, 100, -300] }: ProjectsSectionProps) {
  return (
    <group position={position}>
      {/* Left side - Projects 1-3 (Kim Đan) */}
      <ProjectCluster
        position={[-60, 0, 0]}
        projects={projects.slice(0, 3)}
        side="left"
      />

      {/* Right side - Projects 4-6 (Nguyên Anh) */}
      <ProjectCluster
        position={[60, 0, 0]}
        projects={projects.slice(3, 6)}
        side="right"
      />

      {/* Central bridge/connection */}
      <CentralBridge />

      {/* Ambient particles */}
      <Sparkles
        count={200}
        scale={[200, 60, 100]}
        position={[0, 30, 0]}
        size={2}
        speed={0.3}
        color="#FFD700"
      />
    </group>
  );
}

interface ProjectClusterProps {
  position: [number, number, number];
  projects: Project[];
  side: 'left' | 'right';
}

function ProjectCluster({ position, projects, side }: ProjectClusterProps) {
  const clusterPositions = side === 'left'
    ? [
        [0, 0, 20] as [number, number, number],
        [-25, 10, -10] as [number, number, number],
        [15, 20, -30] as [number, number, number],
      ]
    : [
        [0, 0, 20] as [number, number, number],
        [25, 10, -10] as [number, number, number],
        [-15, 20, -30] as [number, number, number],
      ];

  return (
    <group position={position}>
      {/* Main landing platform */}
      <ClusterPlatform side={side} />

      {/* Project islands */}
      {projects.map((project, index) => (
        <ProjectIsland
          key={project.id}
          project={project}
          position={clusterPositions[index]}
          index={index}
        />
      ))}

      {/* Connection beams between islands */}
      <ConnectionBeams positions={clusterPositions} color={side === 'left' ? '#FF4444' : '#FF8C00'} />
    </group>
  );
}

interface ClusterPlatformProps {
  side: 'left' | 'right';
}

function ClusterPlatform({ side }: ClusterPlatformProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const color = side === 'left' ? '#FF4444' : '#FF8C00';

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * (side === 'left' ? 0.05 : -0.05);
    }
  });

  return (
    <group position={[0, -5, 0]}>
      {/* Physics collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[25, 1, 25]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Main platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[25, 8]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[22, 25, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Inner design */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[10, 12, 8]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>

      {/* Platform light */}
      <pointLight position={[0, 5, 0]} color={color} intensity={1} distance={30} />
    </group>
  );
}

interface ProjectIslandProps {
  project: Project;
  position: [number, number, number];
  index: number;
}

function ProjectIsland({ project, position, index }: ProjectIslandProps) {
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const islandRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const viewProject = useGameStore((state) => state.viewProject);
  const openModal = useUIStore((state) => state.openModal);

  // Project icons based on type
  const projectIcons = ['⚡', '🔮', '📜', '🌟', '💎', '🔥'];

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const material = crystalRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = (hovered || isOpen) ? 2 : 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
    }
  });

  const handleViewDetail = () => {
    viewProject(project.id);
    openModal('project', project);
    setIsOpen(false);
  };

  return (
    <Float speed={1.2} floatIntensity={0.4}>
      <group
        ref={islandRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Physics collider for landing */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[10, 1, 10]} position={[0, 0, 0]} />
        </RigidBody>

        {/* Main island body */}
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[8, 1]} />
          <meshStandardMaterial
            color="#3D2424"
            roughness={0.7}
            metalness={0.2}
            flatShading
            emissive={project.color}
            emissiveIntensity={(hovered || isOpen) ? 0.2 : 0.1}
          />
        </mesh>

        {/* Bottom cone */}
        <mesh position={[0, -6, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[5, 8, 6]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.8}
            flatShading
            emissive="#FF4444"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Top platform */}
        <mesh position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[6, 8]} />
          <meshStandardMaterial
            color="#2D1B1B"
            roughness={0.6}
            emissive={project.color}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Project crystal */}
        <mesh ref={crystalRef} position={[0, 10, 0]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Glow sphere around crystal */}
        <mesh position={[0, 10, 0]} scale={(hovered || isOpen) ? 1.8 : 1.5}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={(hovered || isOpen) ? 0.3 : 0.15}
          />
        </mesh>

        {/* Project info pedestal */}
        <mesh position={[0, 7, 0]} castShadow>
          <cylinderGeometry args={[1.5, 2, 2, 6]} />
          <meshStandardMaterial
            color="#1A0A0A"
            metalness={0.4}
            roughness={0.6}
            emissive={project.color}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Decorative crystals */}
        {[0, 1, 2, 3].map((i) => (
          <SmallCrystal
            key={i}
            position={[
              Math.cos((Math.PI * 2 * i) / 4) * 5,
              4,
              Math.sin((Math.PI * 2 * i) / 4) * 5,
            ]}
            color={project.color}
            index={i}
          />
        ))}

        {/* Icon button - always visible */}
        <Html
          position={[0, 14, 0]}
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
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{
                backgroundColor: 'rgba(26, 10, 10, 0.9)',
                border: `3px solid ${project.color}`,
                boxShadow: (hovered || isOpen) ? `0 0 25px ${project.color}, 0 0 50px ${project.color}50` : `0 0 10px ${project.color}50`,
              }}
            >
              {projectIcons[index % projectIcons.length]}
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
                border: `2px solid ${project.color}`,
                boxShadow: `0 0 40px ${project.color}60`,
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
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: `${project.color}20`,
                    border: `2px solid ${project.color}`,
                  }}
                >
                  {projectIcons[index % projectIcons.length]}
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: project.color }}>
                    {project.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#C4A77D' }}>
                    {project.category}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs mb-3" style={{ color: '#8B7355' }}>
                {project.description.slice(0, 100)}...
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      color: project.color,
                      backgroundColor: `${project.color}20`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* View detail button */}
              <button
                onClick={handleViewDetail}
                className="w-full py-2 rounded-lg text-sm font-bold transition-all hover:brightness-110"
                style={{
                  backgroundColor: project.color,
                  color: '#1A0A0A',
                }}
              >
                Xem Chi Tiết
              </button>
            </div>
          </Html>
        )}

        {/* Island sparkles */}
        {(hovered || isOpen) && (
          <Sparkles
            count={25}
            scale={[15, 15, 15]}
            position={[0, 8, 0]}
            size={2}
            speed={0.5}
            color={project.color}
          />
        )}

        {/* Light */}
        <pointLight
          position={[0, 10, 0]}
          color={project.color}
          intensity={(hovered || isOpen) ? 2 : 1}
          distance={20}
        />
      </group>
    </Float>
  );
}

interface SmallCrystalProps {
  position: [number, number, number];
  color: string;
  index: number;
}

function SmallCrystal({ position, color, index }: SmallCrystalProps) {
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime + index * 2;
      const material = crystalRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.3}>
      <mesh ref={crystalRef} position={position}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

interface ConnectionBeamsProps {
  positions: [number, number, number][];
  color: string;
}

function ConnectionBeams({ positions, color }: ConnectionBeamsProps) {
  // Create connections between islands
  const connections: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
  ];

  return (
    <group>
      {connections.map(([from, to], index) => {
        const points: [number, number, number][] = [
          [positions[from][0], positions[from][1] + 8, positions[from][2]],
          [positions[to][0], positions[to][1] + 8, positions[to][2]],
        ];

        return (
          <Line
            key={index}
            points={points}
            color={color}
            lineWidth={2}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
}

function CentralBridge() {
  const bridgeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bridgeRef.current) {
      bridgeRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <group ref={bridgeRef} position={[0, 10, 0]}>
      {/* Central platform */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[15, 1, 15]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Platform visual */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[15, 6]} />
        <meshStandardMaterial
          color="#2D1B1B"
          roughness={0.7}
          metalness={0.3}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[12, 15, 6]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
      </mesh>

      {/* Central monument */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[2, 3, 8, 6]} />
        <meshStandardMaterial
          color="#3D2424"
          roughness={0.6}
          metalness={0.4}
          emissive="#FF8C00"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Top orb */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh position={[0, 10, 0]}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Energy beams to both clusters */}
      <EnergyConnection start={[0, 8, 0]} end={[-50, 3, 0]} color="#FF4444" />
      <EnergyConnection start={[0, 8, 0]} end={[50, 3, 0]} color="#FF8C00" />

      {/* Central light */}
      <pointLight position={[0, 10, 0]} color="#FFD700" intensity={2} distance={40} />

      {/* Sparkles */}
      <Sparkles
        count={50}
        scale={[30, 20, 30]}
        position={[0, 10, 0]}
        size={2}
        speed={0.5}
        color="#FFD700"
      />
    </group>
  );
}

interface EnergyConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

function EnergyConnection({ start, end, color }: EnergyConnectionProps) {
  // Create curved path
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3((start[0] + end[0]) / 2, start[1] + 10, (start[2] + end[2]) / 2),
    new THREE.Vector3(...end)
  );
  const points = curve.getPoints(20).map(p => [p.x, p.y, p.z] as [number, number, number]);

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

export default ProjectsSection;
