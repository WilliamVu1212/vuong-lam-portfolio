/**
 * MobileControls Component
 * Dual joystick controls for mobile/tablet devices
 *
 * Layout:
 * - Left Joystick: Movement (W/A/S/D)
 * - Right Joystick: Vertical control (ascend/descend for flight)
 * - Action Buttons: Jump, Fly Toggle, Transport Mode
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import nipplejs from 'nipplejs';
import { useGameStore } from '@/stores/gameStore';

// Joystick config
const JOYSTICK_SIZE = 120;
const BUTTON_SIZE = 60;

export function MobileControls() {
  const leftJoystickRef = useRef<HTMLDivElement>(null);
  const rightJoystickRef = useRef<HTMLDivElement>(null);
  const leftManagerRef = useRef<nipplejs.JoystickManager | null>(null);
  const rightManagerRef = useRef<nipplejs.JoystickManager | null>(null);

  // Track joystick active state for visual feedback
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  const { setControl, setPlayerFlying } = useGameStore();
  const {
    transportMode,
    unlockedTransports,
    setTransportMode,
    player,
  } = useGameStore();

  const isFlying = player.isFlying;

  // Ref to avoid stale closure in joystick callbacks
  const isFlyingRef = useRef(isFlying);
  useEffect(() => {
    isFlyingRef.current = isFlying;
  }, [isFlying]);

  // Debug log để kiểm tra state
  useEffect(() => {
    console.log('[MobileControls] isFlying:', isFlying, 'transportMode:', transportMode);
  }, [isFlying, transportMode]);

  const DEADZONE = 0.15;
  const THRESHOLD = 0.3;

  // Handle left joystick (movement)
  const handleLeftMove = useCallback(
    (_evt: Event, data: nipplejs.JoystickOutputData) => {
      const { force, angle } = data;

      if (force < DEADZONE) {
        setControl('forward', false);
        setControl('backward', false);
        setControl('left', false);
        setControl('right', false);
        return;
      }

      // Convert angle to direction
      const rad = angle.radian;
      const x = Math.cos(rad) * force;
      const y = Math.sin(rad) * force;

      setControl('forward', y > THRESHOLD);
      setControl('backward', y < -THRESHOLD);
      setControl('left', x < -THRESHOLD);
      setControl('right', x > THRESHOLD);
    },
    [setControl]
  );

  const handleLeftEnd = useCallback(() => {
    setLeftActive(false);
    setControl('forward', false);
    setControl('backward', false);
    setControl('left', false);
    setControl('right', false);
  }, [setControl]);

  const handleLeftStart = useCallback(() => {
    setLeftActive(true);
  }, []);

  // Handle right joystick (vertical control for flight)
  // Uses ref to avoid stale closure - joystick callback is only set once
  const handleRightMove = useCallback(
    (_evt: Event, data: nipplejs.JoystickOutputData) => {
      // Use ref to get latest isFlying value (avoids stale closure)
      if (!isFlyingRef.current) {
        // Still track the input even when not flying (for debug)
        console.log('[MobileControls] Right joystick moved but not flying');
        return;
      }

      const { force, angle } = data;

      if (force < DEADZONE) {
        setControl('ascend', false);
        setControl('descend', false);
        return;
      }

      // Only care about vertical (Y) component
      const y = Math.sin(angle.radian) * force;

      console.log('[MobileControls] Vertical input - y:', y.toFixed(2), 'ascend:', y > THRESHOLD, 'descend:', y < -THRESHOLD);
      setControl('ascend', y > THRESHOLD);
      setControl('descend', y < -THRESHOLD);
    },
    [setControl] // Remove isFlying dependency - using ref instead
  );

  const handleRightEnd = useCallback(() => {
    setRightActive(false);
    setControl('ascend', false);
    setControl('descend', false);
  }, [setControl]);

  const handleRightStart = useCallback(() => {
    setRightActive(true);
  }, []);

  // Initialize joysticks
  useEffect(() => {
    if (!leftJoystickRef.current || !rightJoystickRef.current) return;

    // Left joystick - Movement
    leftManagerRef.current = nipplejs.create({
      zone: leftJoystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: '#FFD700', // Gold color
      size: JOYSTICK_SIZE,
      restOpacity: 0.7,
    });

    leftManagerRef.current.on('start', handleLeftStart);
    leftManagerRef.current.on('move', handleLeftMove);
    leftManagerRef.current.on('end', handleLeftEnd);

    // Right joystick - Vertical control
    rightManagerRef.current = nipplejs.create({
      zone: rightJoystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: '#00CED1', // Cyan color
      size: JOYSTICK_SIZE,
      restOpacity: 0.7,
      lockX: true, // Only vertical movement
    });

    rightManagerRef.current.on('start', handleRightStart);
    rightManagerRef.current.on('move', handleRightMove);
    rightManagerRef.current.on('end', handleRightEnd);

    return () => {
      leftManagerRef.current?.destroy();
      rightManagerRef.current?.destroy();
    };
  }, [handleLeftStart, handleLeftMove, handleLeftEnd, handleRightStart, handleRightMove, handleRightEnd]);

  // Jump button handler
  const handleJump = useCallback(() => {
    if (!isFlying) {
      setControl('jump', true);
      setTimeout(() => setControl('jump', false), 100);
    }
  }, [setControl, isFlying]);

  // Fly toggle handler - gọi trực tiếp thay vì dispatch keyboard event
  const handleFlyToggle = useCallback(() => {
    console.log('[MobileControls] Fly toggle pressed, current isFlying:', isFlying);
    // Toggle flight state directly
    setPlayerFlying(!isFlying);
  }, [isFlying, setPlayerFlying]);

  // Transport mode cycle handler
  const handleModeChange = useCallback(() => {
    if (unlockedTransports.length <= 1) return;

    const currentIndex = unlockedTransports.indexOf(transportMode);
    const nextIndex = (currentIndex + 1) % unlockedTransports.length;
    const nextMode = unlockedTransports[nextIndex];

    // Exit flight if changing mode
    if (isFlying) {
      handleFlyToggle();
    }

    setTransportMode(nextMode);
  }, [unlockedTransports, transportMode, setTransportMode, isFlying, handleFlyToggle]);

  // Get transport mode display info
  const getModeInfo = () => {
    switch (transportMode) {
      case 'sword':
        return { icon: '⚔️', name: 'Ngự Kiếm' };
      case 'beast':
        return { icon: '🔥', name: 'Cưỡi Phượng' };
      default:
        return { icon: '☁️', name: 'Đạp Mây' };
    }
  };

  const modeInfo = getModeInfo();
  const canFly = transportMode === 'sword' || transportMode === 'beast';

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Left Joystick Zone - Movement */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        {/* Joystick label */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-yellow-400/80 font-semibold whitespace-nowrap">
          DI CHUYỂN
        </div>
        {/* Joystick container */}
        <div
          ref={leftJoystickRef}
          className="relative transition-all duration-200"
          style={{
            width: JOYSTICK_SIZE + 20,
            height: JOYSTICK_SIZE + 20,
            background: 'radial-gradient(circle, rgba(26,10,10,0.9) 0%, rgba(45,27,27,0.8) 100%)',
            borderRadius: '50%',
            border: leftActive ? '3px solid #FFD700' : '2px solid rgba(255, 215, 0, 0.4)',
            boxShadow: leftActive
              ? '0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 140, 0, 0.2)'
              : '0 0 15px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 140, 0, 0.1)',
          }}
        />
        {/* Direction indicators */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ width: JOYSTICK_SIZE + 20, height: JOYSTICK_SIZE + 20 }}>
          <div className="absolute top-1 text-yellow-500/40 text-lg">▲</div>
          <div className="absolute bottom-1 text-yellow-500/40 text-lg">▼</div>
          <div className="absolute left-1 text-yellow-500/40 text-lg">◀</div>
          <div className="absolute right-1 text-yellow-500/40 text-lg">▶</div>
        </div>
      </div>

      {/* Right Joystick Zone - Vertical (for flight) */}
      <div
        className="absolute bottom-6 pointer-events-auto transition-all duration-300"
        style={{
          right: BUTTON_SIZE + 30,
          opacity: isFlying ? 1 : 0.4,
        }}
      >
        {/* Joystick label */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-cyan-400/80 font-semibold whitespace-nowrap">
          {isFlying ? 'LÊN / XUỐNG' : 'CHẾ ĐỘ BAY'}
        </div>
        {/* Joystick container */}
        <div
          ref={rightJoystickRef}
          className="relative transition-all duration-200"
          style={{
            width: JOYSTICK_SIZE + 20,
            height: JOYSTICK_SIZE + 20,
            background: 'radial-gradient(circle, rgba(10,26,26,0.9) 0%, rgba(27,45,45,0.8) 100%)',
            borderRadius: '50%',
            border: rightActive ? '3px solid #00CED1' : '2px solid rgba(0, 206, 209, 0.4)',
            boxShadow: rightActive
              ? '0 0 30px rgba(0, 206, 209, 0.5), inset 0 0 20px rgba(0, 206, 209, 0.2)'
              : '0 0 15px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 206, 209, 0.1)',
          }}
        />
        {/* Vertical indicators */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-3 pointer-events-none" style={{ width: JOYSTICK_SIZE + 20, height: JOYSTICK_SIZE + 20 }}>
          <span className="text-cyan-400/50 text-lg">▲</span>
          <span className="text-cyan-400/50 text-lg">▼</span>
        </div>
      </div>

      {/* Action Buttons - Right side */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-3 pointer-events-auto">
        {/* Jump Button */}
        <button
          onTouchStart={handleJump}
          disabled={isFlying}
          className="flex items-center justify-center text-2xl
                     rounded-full transition-all duration-150 active:scale-90
                     disabled:opacity-30"
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            background: isFlying
              ? 'rgba(100, 100, 100, 0.5)'
              : 'linear-gradient(135deg, #FF8C00 0%, #FF4444 100%)',
            border: '2px solid rgba(255, 215, 0, 0.6)',
            boxShadow: isFlying ? 'none' : '0 0 20px rgba(255, 140, 0, 0.4)',
          }}
        >
          ⬆️
        </button>

        {/* Fly Toggle Button */}
        {canFly && (
          <button
            onTouchStart={handleFlyToggle}
            className="flex items-center justify-center text-xl
                       rounded-full transition-all duration-150 active:scale-90"
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              background: isFlying
                ? 'linear-gradient(135deg, #00CED1 0%, #0099AA 100%)'
                : 'linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)',
              border: isFlying ? '2px solid #00CED1' : '2px solid #A855F7',
              boxShadow: isFlying
                ? '0 0 25px rgba(0, 206, 209, 0.6)'
                : '0 0 20px rgba(147, 51, 234, 0.4)',
            }}
          >
            {isFlying ? '🛬' : '🛫'}
          </button>
        )}

        {/* Transport Mode Button */}
        {unlockedTransports.length > 1 && (
          <button
            onTouchStart={handleModeChange}
            className="flex items-center justify-center text-xl
                       rounded-full transition-all duration-150 active:scale-90"
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
              border: '2px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
            }}
          >
            {modeInfo.icon}
          </button>
        )}
      </div>

      {/* Flight status indicator - Hiện khi đang bay */}
      {isFlying && (
        <div className="absolute top-24 left-4 pointer-events-none">
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 animate-pulse"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: transportMode === 'beast' ? '2px solid #FF4500' : '2px solid #00CED1',
              boxShadow: transportMode === 'beast'
                ? '0 0 15px rgba(255,69,0,0.5)'
                : '0 0 15px rgba(0,206,209,0.5)',
            }}
          >
            <span>{modeInfo.icon}</span>
            <span className={transportMode === 'beast' ? 'text-orange-400' : 'text-cyan-400'}>
              Đang Bay
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
