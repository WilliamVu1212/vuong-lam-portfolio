import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { Vector3, Raycaster, Vector2, Plane } from 'three';
import { useGameStore } from '@/stores/gameStore';
import { useControls } from '@/hooks/useKeyboardControls';
import { useSoundEffects, useBackgroundMusic, useAudio } from '@/hooks/useAudio';
import { FlyingSword } from './FlyingSword';
import { RidingPhoenix } from './RidingPhoenix';
import { SwordCultivator } from './SwordCultivator';
import { PHYSICS, WORLD } from '@/utils/constants';

const MOVE_SPEED = 8;
const JUMP_FORCE = 12;
const AIR_CONTROL = 0.3;
const GRAVITY = 30; // Must match Rapier gravity (negative Y) in Experience.tsx

// Sword flight constants
const SWORD_MAX_SPEED = PHYSICS.sword.maxSpeed;
const SWORD_ACCELERATION = PHYSICS.sword.acceleration;
const SWORD_DECELERATION = PHYSICS.sword.deceleration;
const SWORD_VERTICAL_SPEED = PHYSICS.sword.verticalSpeed;

// Beast (Phoenix) flight constants
const BEAST_MAX_SPEED = PHYSICS.beast.maxSpeed;
const BEAST_ACCELERATION = PHYSICS.beast.acceleration;
const BEAST_VERTICAL_SPEED = PHYSICS.beast.verticalSpeed;

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { camera, gl } = useThree();
  const { rapier, world } = useRapier();

  const controls = useControls();
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerGrounded = useGameStore((state) => state.setPlayerGrounded);
  const setPlayerFlying = useGameStore((state) => state.setPlayerFlying);
  const setPlayerVelocity = useGameStore((state) => state.setPlayerVelocity);
  const isGrounded = useGameStore((state) => state.player.isGrounded);
  const isFlying = useGameStore((state) => state.player.isFlying);
  const transportMode = useGameStore((state) => state.transportMode);

  // Sound effects
  const { playJump, playLand, playSwordWhoosh, playPhoenixCry } = useSoundEffects();
  const { startAmbient, startMainTheme } = useBackgroundMusic();
  const { unlockAudio } = useAudio();
  const musicStarted = useRef(false);
  const wasGrounded = useRef(isGrounded);

  // Flight sound loop timing (để phát âm thanh liên tục khi bay di chuyển)
  const lastSwordSoundTime = useRef(0);
  const lastPhoenixSoundTime = useRef(0);

  // Track previous flying state to detect external activation
  const prevIsFlying = useRef(isFlying);
  const SWORD_SOUND_INTERVAL = 600; // ms - khoảng cách giữa các tiếng kiếm
  const PHOENIX_SOUND_INTERVAL = 1200; // ms - khoảng cách giữa các tiếng phượng

  // Movement vectors
  const moveDirection = useRef(new Vector3());
  const frontVector = useRef(new Vector3());
  const sideVector = useRef(new Vector3());
  const cameraDirection = useRef(new Vector3());

  // Sword flight velocity (smooth acceleration)
  const flightVelocity = useRef(new Vector3(0, 0, 0));

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

    // Debug: log when ground state changes
    const result = hit !== null;
    return result;
  };

  // Start background music on first interaction
  const startMusicIfNeeded = () => {
    if (!musicStarted.current) {
      unlockAudio();
      startAmbient();
      startMainTheme();
      musicStarted.current = true;
      console.log('[Player] Music started on first click!');
    }
  };

  // Jump to click position helper
  const jumpToPosition = (event: MouseEvent) => {
    // Start music on first click
    startMusicIfNeeded();

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

      // Reset wasGrounded so landing will be detected
      wasGrounded.current = false;

      // Play jump sound
      playJump();

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

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const velocity = rb.linvel();
    const position = rb.translation();

    // ==========================================
    // SWORD FLIGHT MODE
    // ==========================================
    if (isFlying && transportMode === 'sword') {
      // Disable gravity effect by countering it
      rb.setGravityScale(0, true);
      rb.setLinearDamping(0);

      // Di chuyển theo hướng cố định trong world space (không phụ thuộc camera)
      // Forward = Z âm (đi sâu vào thế giới), Backward = Z dương
      // Left = X âm, Right = X dương
      const targetVel = new Vector3(0, 0, 0);
      const hasInput = controls.forward || controls.backward || controls.left || controls.right;

      if (controls.forward) {
        targetVel.z -= 1;  // Z âm = tiến về phía trước (vào sâu thế giới)
      }
      if (controls.backward) {
        targetVel.z += 1;  // Z dương = lùi về phía sau
      }
      if (controls.left) {
        targetVel.x -= 1;  // X âm = sang trái
      }
      if (controls.right) {
        targetVel.x += 1;  // X dương = sang phải
      }

      // Normalize and scale to max speed
      if (targetVel.length() > 0) {
        targetVel.normalize().multiplyScalar(SWORD_MAX_SPEED);
      }

      // Vertical movement (ascend/descend)
      // Khi bấm cả ascend + descend cùng lúc (Shift+Q), ưu tiên bay lên
      const wantAscend = controls.ascend || controls.jump;
      const wantDescend = controls.descend;

      if (wantAscend && wantDescend) {
        // Bấm cả 2: ưu tiên bay lên
        targetVel.y = SWORD_VERTICAL_SPEED;
      } else if (wantAscend) {
        targetVel.y = SWORD_VERTICAL_SPEED;
      } else if (wantDescend) {
        targetVel.y = -SWORD_VERTICAL_SPEED;
      }

      // Smoothly interpolate velocity (acceleration/deceleration)
      const accelRate = hasInput || controls.ascend || controls.descend || controls.jump
        ? SWORD_ACCELERATION
        : SWORD_DECELERATION;

      flightVelocity.current.lerp(targetVel, accelRate * delta);

      // Clamp velocity
      const horizontalSpeed = Math.sqrt(
        flightVelocity.current.x ** 2 + flightVelocity.current.z ** 2
      );
      if (horizontalSpeed > SWORD_MAX_SPEED) {
        const scale = SWORD_MAX_SPEED / horizontalSpeed;
        flightVelocity.current.x *= scale;
        flightVelocity.current.z *= scale;
      }

      // World bounds clamping - CHỈ chặn khi đang đi RA XA bounds
      // Cho phép di chuyển VỀ PHÍA TRONG bounds (để player thoát khi bị kẹt ngoài)
      const minYSword = WORLD.bounds.minY + 5;

      // X: chỉ chặn khi đang ở ngoài VÀ đang đi xa hơn
      if (position.x < WORLD.bounds.minX && flightVelocity.current.x < 0) {
        flightVelocity.current.x = 0;
      } else if (position.x > WORLD.bounds.maxX && flightVelocity.current.x > 0) {
        flightVelocity.current.x = 0;
      }

      // Y: cho phép bay LÊN khi đang ở dưới minY, chỉ chặn bay XUỐNG
      if (position.y < minYSword && flightVelocity.current.y < 0) {
        flightVelocity.current.y = 0;
      } else if (position.y > WORLD.bounds.maxY && flightVelocity.current.y > 0) {
        flightVelocity.current.y = 0;
      }

      // Z: chỉ chặn khi đang ở ngoài VÀ đang đi xa hơn
      if (position.z < WORLD.bounds.minZ && flightVelocity.current.z < 0) {
        flightVelocity.current.z = 0;
      } else if (position.z > WORLD.bounds.maxZ && flightVelocity.current.z > 0) {
        flightVelocity.current.z = 0;
      }

      // Apply velocity
      rb.setLinvel(
        {
          x: flightVelocity.current.x,
          y: flightVelocity.current.y,
          z: flightVelocity.current.z,
        },
        true
      );

      // Update store
      setPlayerPosition([position.x, position.y, position.z]);
      setPlayerVelocity([flightVelocity.current.x, flightVelocity.current.y, flightVelocity.current.z]);

      // Play sword whoosh sound loop khi đang di chuyển
      const currentSpeed = Math.sqrt(
        flightVelocity.current.x ** 2 + flightVelocity.current.z ** 2
      );
      const now = Date.now();
      if (currentSpeed > 5 && now - lastSwordSoundTime.current > SWORD_SOUND_INTERVAL) {
        playSwordWhoosh();
        lastSwordSoundTime.current = now;
      }

      // CHỈ thoát chế độ bay khi bấm F (xử lý ở useEffect bên dưới)
      // Không tự động thoát khi bay xuống gần mặt đất

      return; // Skip ground movement logic
    }

    // ==========================================
    // BEAST (PHOENIX) FLIGHT MODE
    // ==========================================
    if (isFlying && transportMode === 'beast') {
      // Disable gravity
      rb.setGravityScale(0, true);
      rb.setLinearDamping(0);

      // Di chuyển theo hướng cố định trong world space (không phụ thuộc camera)
      // Forward = Z âm (đi sâu vào thế giới), Backward = Z dương
      // Left = X âm, Right = X dương
      const targetVel = new Vector3(0, 0, 0);
      const hasInput = controls.forward || controls.backward || controls.left || controls.right;

      if (controls.forward) {
        targetVel.z -= 1;  // Z âm = tiến về phía trước (vào sâu thế giới)
      }
      if (controls.backward) {
        targetVel.z += 1;  // Z dương = lùi về phía sau
      }
      if (controls.left) {
        targetVel.x -= 1;  // X âm = sang trái
      }
      if (controls.right) {
        targetVel.x += 1;  // X dương = sang phải
      }

      // Normalize and scale to max speed (phoenix is faster!)
      if (targetVel.length() > 0) {
        targetVel.normalize().multiplyScalar(BEAST_MAX_SPEED);
      }

      // Vertical movement (ascend/descend)
      // Khi bấm cả ascend + descend cùng lúc (Shift+Q), ưu tiên bay lên
      const wantAscendBeast = controls.ascend || controls.jump;
      const wantDescendBeast = controls.descend;

      if (wantAscendBeast && wantDescendBeast) {
        // Bấm cả 2: ưu tiên bay lên
        targetVel.y = BEAST_VERTICAL_SPEED;
      } else if (wantAscendBeast) {
        targetVel.y = BEAST_VERTICAL_SPEED;
      } else if (wantDescendBeast) {
        targetVel.y = -BEAST_VERTICAL_SPEED;
      }

      // Smoothly interpolate velocity
      const accelRate = hasInput || wantAscendBeast || wantDescendBeast
        ? BEAST_ACCELERATION
        : BEAST_ACCELERATION * 0.5; // Slower deceleration for phoenix

      flightVelocity.current.lerp(targetVel, accelRate * delta);

      // Clamp velocity
      const horizontalSpeed = Math.sqrt(
        flightVelocity.current.x ** 2 + flightVelocity.current.z ** 2
      );
      if (horizontalSpeed > BEAST_MAX_SPEED) {
        const scale = BEAST_MAX_SPEED / horizontalSpeed;
        flightVelocity.current.x *= scale;
        flightVelocity.current.z *= scale;
      }

      // World bounds clamping - CHỈ chặn khi đang đi RA XA bounds
      // Cho phép di chuyển VỀ PHÍA TRONG bounds (để player thoát khi bị kẹt ngoài)
      const minYBeast = WORLD.bounds.minY + 5;

      // X: chỉ chặn khi đang ở ngoài VÀ đang đi xa hơn
      if (position.x < WORLD.bounds.minX && flightVelocity.current.x < 0) {
        flightVelocity.current.x = 0;
      } else if (position.x > WORLD.bounds.maxX && flightVelocity.current.x > 0) {
        flightVelocity.current.x = 0;
      }

      // Y: cho phép bay LÊN khi đang ở dưới minY, chỉ chặn bay XUỐNG
      if (position.y < minYBeast && flightVelocity.current.y < 0) {
        flightVelocity.current.y = 0;
      } else if (position.y > WORLD.bounds.maxY && flightVelocity.current.y > 0) {
        flightVelocity.current.y = 0;
      }

      // Z: chỉ chặn khi đang ở ngoài VÀ đang đi xa hơn
      if (position.z < WORLD.bounds.minZ && flightVelocity.current.z < 0) {
        flightVelocity.current.z = 0;
      } else if (position.z > WORLD.bounds.maxZ && flightVelocity.current.z > 0) {
        flightVelocity.current.z = 0;
      }

      // Apply velocity
      rb.setLinvel(
        {
          x: flightVelocity.current.x,
          y: flightVelocity.current.y,
          z: flightVelocity.current.z,
        },
        true
      );

      // Update store
      setPlayerPosition([position.x, position.y, position.z]);
      setPlayerVelocity([flightVelocity.current.x, flightVelocity.current.y, flightVelocity.current.z]);

      // Play phoenix cry sound loop khi đang di chuyển
      const currentSpeedBeast = Math.sqrt(
        flightVelocity.current.x ** 2 + flightVelocity.current.z ** 2
      );
      const nowBeast = Date.now();
      if (currentSpeedBeast > 5 && nowBeast - lastPhoenixSoundTime.current > PHOENIX_SOUND_INTERVAL) {
        playPhoenixCry();
        lastPhoenixSoundTime.current = nowBeast;
      }

      // CHỈ thoát chế độ bay khi bấm F (xử lý ở useEffect bên dưới)
      // Không tự động thoát khi bay xuống gần mặt đất

      return; // Skip ground movement logic
    }

    // ==========================================
    // GROUND MOVEMENT MODE (Original code)
    // ==========================================

    // Ensure gravity is enabled for ground mode
    rb.setGravityScale(1, true);

    // Update grounded state
    const grounded = checkGrounded();
    if (grounded !== isGrounded) {
      setPlayerGrounded(grounded);
    }

    // Play landing sound when transitioning from air to ground
    // IMPORTANT: Only play if velocity.y <= 0 (falling or stationary, NOT rising)
    // This fixes the bug where land sound plays immediately after jumping
    if (grounded && !wasGrounded.current && velocity.y <= 0) {
      console.log('[DEBUG] Landing detected! grounded:', grounded, 'wasGrounded:', wasGrounded.current, 'velocity.y:', velocity.y);
      playLand();
    }
    // Update wasGrounded AFTER playing sound
    // Also detect when player walks off edge (grounded: true → false)
    if (grounded !== wasGrounded.current) {
      console.log('[DEBUG] wasGrounded changing from', wasGrounded.current, 'to', grounded, 'velocity.y:', velocity.y.toFixed(2));
      wasGrounded.current = grounded;
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
      console.log('[DEBUG] Keyboard jump! Setting wasGrounded to false');
      wasGrounded.current = false; // Force reset so landing will be detected
      playJump();
      rb.setLinvel(
        {
          x: velocity.x,
          y: JUMP_FORCE,
          z: velocity.z,
        },
        true
      );
    }

    // Update player position and velocity in store
    setPlayerPosition([position.x, position.y, position.z]);
    setPlayerVelocity([velocity.x, velocity.y, velocity.z]);

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

  // Function to enter sword flight mode
  const enterSwordFlight = () => {
    if (!rigidBodyRef.current) return;
    const rb = rigidBodyRef.current;
    const velocity = rb.linvel();

    // Play sword whoosh sound
    playSwordWhoosh();

    // Reset wasGrounded so landing sound will play when exiting flight
    wasGrounded.current = false;

    // Initialize flight velocity with current velocity
    flightVelocity.current.set(velocity.x, Math.max(velocity.y, 10), velocity.z);

    // Give initial upward boost
    rb.setLinvel({ x: velocity.x, y: 15, z: velocity.z }, true);

    setPlayerFlying(true);
  };

  // Function to exit sword flight mode
  const exitSwordFlight = () => {
    if (!rigidBodyRef.current) return;

    // Reset flight velocity
    flightVelocity.current.set(0, 0, 0);

    // Re-enable gravity
    rigidBodyRef.current.setGravityScale(1, true);
    rigidBodyRef.current.setLinearDamping(0.5);

    setPlayerFlying(false);
  };

  // Function to enter beast (phoenix) flight mode
  const enterBeastFlight = () => {
    if (!rigidBodyRef.current) return;
    const rb = rigidBodyRef.current;
    const velocity = rb.linvel();

    // Play phoenix cry sound
    playPhoenixCry();

    // Reset wasGrounded so landing sound will play when exiting flight
    wasGrounded.current = false;

    // Initialize flight velocity with current velocity + upward boost
    flightVelocity.current.set(velocity.x, Math.max(velocity.y, 25), velocity.z);

    // Give initial upward boost (stronger than sword) - high enough to escape colliders
    rb.setLinvel({ x: velocity.x, y: 40, z: velocity.z }, true);

    setPlayerFlying(true);
  };

  // Function to exit beast flight mode
  const exitBeastFlight = () => {
    if (!rigidBodyRef.current) return;

    // Reset flight velocity
    flightVelocity.current.set(0, 0, 0);

    // Re-enable gravity
    rigidBodyRef.current.setGravityScale(1, true);
    rigidBodyRef.current.setLinearDamping(0.5);

    setPlayerFlying(false);
  };

  // Listen for flight mode toggle (F key)
  useEffect(() => {
    const handleToggleFlight = (e: KeyboardEvent) => {
      // Bỏ qua nếu phím đang được giữ (repeat) - chỉ toggle 1 lần khi nhấn
      if (e.repeat) return;

      if (e.code === 'KeyF') {
        if (transportMode === 'sword') {
          if (isFlying) {
            exitSwordFlight();
          } else {
            enterSwordFlight();
          }
        } else if (transportMode === 'beast') {
          if (isFlying) {
            exitBeastFlight();
          } else {
            enterBeastFlight();
          }
        }
      }
    };

    window.addEventListener('keydown', handleToggleFlight);
    return () => window.removeEventListener('keydown', handleToggleFlight);
  }, [isFlying, transportMode]);

  // Watch for external flight activation (e.g., from unlock triggers in sections)
  useEffect(() => {
    if (isFlying && !prevIsFlying.current && rigidBodyRef.current) {
      // Flight was activated externally (not via F key), give initial boost
      const rb = rigidBodyRef.current;
      const velocity = rb.linvel();

      // Reset wasGrounded so landing sound will play when exiting flight
      wasGrounded.current = false;

      if (transportMode === 'sword') {
        // Initialize sword flight velocity and give upward boost
        flightVelocity.current.set(velocity.x, Math.max(velocity.y, 10), velocity.z);
        rb.setLinvel({ x: velocity.x, y: 15, z: velocity.z }, true);
        rb.setGravityScale(0, true);
        rb.setLinearDamping(0);
      } else if (transportMode === 'beast') {
        // Initialize beast flight velocity and give stronger upward boost
        // High enough to escape BellPedestal collider when unlocking
        flightVelocity.current.set(velocity.x, Math.max(velocity.y, 25), velocity.z);
        rb.setLinvel({ x: velocity.x, y: 40, z: velocity.z }, true);
        rb.setGravityScale(0, true);
        rb.setLinearDamping(0);
      }
    }
    prevIsFlying.current = isFlying;
  }, [isFlying, transportMode]);

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

        {/* Sword Cultivator - Player visual */}
        <SwordCultivator isFlying={isFlying} />

        {/* Flying Sword - renders under player when flying sword mode */}
        <FlyingSword velocity={flightVelocity.current} />

        {/* Riding Phoenix - renders under player when flying beast mode */}
        <RidingPhoenix velocity={flightVelocity.current} phoenixType="fire" />
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
