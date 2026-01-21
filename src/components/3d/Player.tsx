import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { Vector3, Raycaster, Vector2, Plane } from 'three';
import { useGameStore } from '@/stores/gameStore';
import { useControls } from '@/hooks/useKeyboardControls';

const MOVE_SPEED = 8;
const JUMP_FORCE = 12;
const AIR_CONTROL = 0.3;
const GRAVITY = 30; // Must match Rapier gravity (negative Y) in Experience.tsx

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera, gl } = useThree();
  const { rapier, world } = useRapier();

  const controls = useControls();
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerGrounded = useGameStore((state) => state.setPlayerGrounded);
  const isGrounded = useGameStore((state) => state.player.isGrounded);

  // Movement vectors
  const moveDirection = useRef(new Vector3());
  const frontVector = useRef(new Vector3());
  const sideVector = useRef(new Vector3());
  const cameraDirection = useRef(new Vector3());

  // Click-to-move
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);
  const [isJumpingToTarget, setIsJumpingToTarget] = useState(false);
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const groundPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));

  /**
   * Calculate velocity to land at target position
   * Using simpler approach: fixed arc height based on distance
   */
  const calculateTrajectoryVelocity = (
    startPos: { x: number; y: number; z: number },
    targetX: number,
    targetZ: number
  ): { vx: number; vy: number; vz: number } => {
    // Horizontal displacement
    const dx = targetX - startPos.x;
    const dz = targetZ - startPos.z;
    const horizontalDist = Math.sqrt(dx * dx + dz * dz);

    // If clicking very close, just do a small hop
    if (horizontalDist < 0.5) {
      return { vx: 0, vy: JUMP_FORCE * 0.5, vz: 0 };
    }

    // Calculate jump height based on distance (higher jump for longer distance)
    // Min 3 units, max 12 units, scales with distance
    const jumpHeight = Math.min(12, Math.max(3, horizontalDist * 0.3));

    // Time to reach peak: from v = v0 - gt, at peak v=0, so t_up = v0/g
    // Height at peak: h = v0*t - 0.5*g*t^2 = v0^2/(2g)
    // So v0 = sqrt(2*g*h)
    const vy = Math.sqrt(2 * GRAVITY * jumpHeight);

    // Time to go up
    const t_up = vy / GRAVITY;

    // Time to come down (same as up for same height landing)
    const t_down = t_up;

    // Total flight time
    const totalTime = t_up + t_down;

    // Horizontal velocities to cover the distance in that time
    const vx = dx / totalTime;
    const vz = dz / totalTime;

    return { vx, vy, vz };
  };

  // Check if player is grounded using raycast
  const checkGrounded = () => {
    if (!rigidBodyRef.current) return false;

    const position = rigidBodyRef.current.translation();
    const rayOrigin = { x: position.x, y: position.y, z: position.z };
    const rayDir = { x: 0, y: -1, z: 0 };
    const maxToi = 1.1;

    const ray = new rapier.Ray(rayOrigin, rayDir);
    const hit = world.castRay(ray, maxToi, true);

    return hit !== null;
  };

  // Jump to click position helper
  const jumpToPosition = (event: MouseEvent) => {
    if (!rigidBodyRef.current) return;
    if (!checkGrounded()) return; // Only jump when grounded

    const playerPos = rigidBodyRef.current.translation();

    // Convert mouse position to normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster from camera
    raycaster.current.setFromCamera(mouse.current, camera);

    // Create a ground plane at Y = -1.5 (ground collider is at Y = -2)
    // The plane normal points UP (0, 1, 0), and constant is negative of Y position
    groundPlane.current.set(new Vector3(0, 1, 0), 1.5);

    const intersectPoint = new Vector3();
    const hit = raycaster.current.ray.intersectPlane(groundPlane.current, intersectPoint);

    if (hit) {
      // Set target position for visual indicator (at ground level Y = -1.5)
      const targetPos = new Vector3(intersectPoint.x, -1.5, intersectPoint.z);
      setTargetPosition(targetPos);

      const rb = rigidBodyRef.current;

      // Calculate trajectory velocity
      const velocity = calculateTrajectoryVelocity(playerPos, intersectPoint.x, intersectPoint.z);

      // Disable damping during jump for accurate trajectory
      rb.setLinearDamping(0);
      setIsJumpingToTarget(true);

      // Apply velocity
      rb.setLinvel(
        {
          x: velocity.vx,
          y: velocity.vy,
          z: velocity.vz,
        },
        true
      );
    }
  };

  // Handle single click to jump to position
  useEffect(() => {
    let mouseDownTime = 0;
    let mouseDownPos = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownTime = Date.now();
      mouseDownPos = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = (event: MouseEvent) => {
      // Only left click
      if (event.button !== 0) return;

      const clickDuration = Date.now() - mouseDownTime;
      const moveDistance = Math.sqrt(
        Math.pow(event.clientX - mouseDownPos.x, 2) +
        Math.pow(event.clientY - mouseDownPos.y, 2)
      );

      // Only trigger if it's a quick click (not a drag for orbit controls)
      // Short duration AND minimal mouse movement
      if (clickDuration < 200 && moveDistance < 5) {
        jumpToPosition(event);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [camera, gl, rapier, world]);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const velocity = rb.linvel();
    const position = rb.translation();

    // Update grounded state
    const grounded = checkGrounded();
    if (grounded !== isGrounded) {
      setPlayerGrounded(grounded);
    }

    // Restore damping when landing from a target jump
    if (grounded && isJumpingToTarget) {
      rb.setLinearDamping(0.5);
      setIsJumpingToTarget(false);
    }

    // Get camera direction for movement
    camera.getWorldDirection(cameraDirection.current);
    cameraDirection.current.y = 0;
    cameraDirection.current.normalize();

    // Calculate movement direction based on input
    frontVector.current.set(0, 0, 0);
    sideVector.current.set(0, 0, 0);

    if (controls.forward) frontVector.current.z = -1;
    if (controls.backward) frontVector.current.z = 1;
    if (controls.left) sideVector.current.x = -1;
    if (controls.right) sideVector.current.x = 1;

    // Transform movement direction based on camera orientation
    moveDirection.current
      .set(0, 0, 0)
      .addScaledVector(cameraDirection.current, -frontVector.current.z)
      .addScaledVector(
        new Vector3().crossVectors(new Vector3(0, 1, 0), cameraDirection.current),
        -sideVector.current.x
      )
      .normalize();

    // Apply movement - Skip if jumping to target (let physics handle trajectory)
    const speed = grounded ? MOVE_SPEED : MOVE_SPEED * AIR_CONTROL;
    const hasInput = controls.forward || controls.backward || controls.left || controls.right;

    if (hasInput) {
      rb.setLinvel(
        {
          x: moveDirection.current.x * speed,
          y: velocity.y,
          z: moveDirection.current.z * speed,
        },
        true
      );
      // Clear target when using keyboard
      setTargetPosition(null);
      // Cancel target jump and restore damping
      if (isJumpingToTarget) {
        rb.setLinearDamping(0.5);
        setIsJumpingToTarget(false);
      }
    } else if (grounded && !isJumpingToTarget) {
      // Apply friction when grounded, no input, AND not in target jump mode
      rb.setLinvel(
        {
          x: velocity.x * 0.9,
          y: velocity.y,
          z: velocity.z * 0.9,
        },
        true
      );
    }
    // When isJumpingToTarget && !grounded: let physics engine handle trajectory naturally

    // Keyboard jump
    if (controls.jump && grounded) {
      rb.setLinvel(
        {
          x: velocity.x,
          y: JUMP_FORCE,
          z: velocity.z,
        },
        true
      );
    }

    // Update player position in store
    setPlayerPosition([position.x, position.y, position.z]);

    // Clear target when reached (only when actually landed near target)
    if (targetPosition && grounded && !isJumpingToTarget) {
      const dist = Math.sqrt(
        Math.pow(position.x - targetPosition.x, 2) +
        Math.pow(position.z - targetPosition.z, 2)
      );
      // Clear when within 1.5 units of target
      if (dist < 1.5) {
        setTargetPosition(null);
      }
    }
  });

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        position={[0, 5, 0]}
        colliders={false}
        mass={1}
        type="dynamic"
        lockRotations
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <CapsuleCollider args={[0.5, 0.5]} />

        {/* Player visual */}
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 1, 8, 16]} />
          <meshStandardMaterial
            color="#FF6B35"
            emissive="#FF4444"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Glow effect */}
        <mesh scale={1.2}>
          <capsuleGeometry args={[0.5, 1, 8, 16]} />
          <meshBasicMaterial
            color="#FF4444"
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Point light on player */}
        <pointLight
          color="#FF6B35"
          intensity={1}
          distance={10}
          position={[0, 0.5, 0]}
        />
      </RigidBody>

      {/* Target indicator - shows where player will land */}
      {targetPosition && (
        <group position={[targetPosition.x, -1.45, targetPosition.z]}>
          {/* Outer ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.6} depthTest={false} />
          </mesh>
          {/* Inner ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.3, 0.5, 32]} />
            <meshBasicMaterial color="#FF8C00" transparent opacity={0.9} depthTest={false} />
          </mesh>
          {/* Center dot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={1} depthTest={false} />
          </mesh>
        </group>
      )}
    </>
  );
}

export default Player;
