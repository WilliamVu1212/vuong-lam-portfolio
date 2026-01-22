import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, KeyboardControls } from '@react-three/drei';
import Experience from './components/3d/Experience';
import LoadingScreen from './components/ui/LoadingScreen';
import ProjectModal from './components/ui/ProjectModal';
import LevelNavigator from './components/ui/LevelNavigator';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useUIStore, useGameStore, useAudioStore } from './stores/gameStore';
import { useAudio, useBackgroundMusic, useSoundEffects } from './hooks/useAudio';
import { CAMERA, COLORS } from './utils/constants';

// Section positions for camera navigation
// Góc nhìn từ trên xuống chéo, X=0 để ở giữa màn hình
// Pattern: Camera ở phía sau + trên section, nhìn xuống chéo vào section
const SECTION_CAMERA_POSITIONS: Record<string, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  // Luyện Khí (Intro) - Y=0, Camera cao 35, phía sau Z=50
  intro: { position: [0, 35, 50], lookAt: [0, 0, -20] },
  // Trúc Cơ (About) - Y=30, Camera cao 65, nhìn xuống section
  about: { position: [0, 65, -30], lookAt: [0, 25, -100] },
  // Kết Đan (Skills) - Y=60, Camera cao 100, nhìn xuống section
  skills: { position: [0, 100, -120], lookAt: [0, 55, -200] },
  // Nguyên Anh (Projects) - Y=100, Camera cao 145, nhìn xuống section
  projects: { position: [0, 145, -220], lookAt: [0, 95, -300] },
  // Hóa Thần (Experience) - Y=150, Camera cao 200, nhìn xuống section
  experience: { position: [0, 200, -370], lookAt: [0, 145, -450] },
  // Anh Biến (Contact) - Y=200, Camera cao 255, nhìn xuống section
  contact: { position: [0, 255, -470], lookAt: [0, 195, -550] },
  // Vấn Đỉnh - Y=260, Camera cao 315, nhìn xuống section
  vandinh: { position: [0, 315, -570], lookAt: [0, 255, -650] },
  // Toàn Cảnh - Khớp với góc nhìn ban đầu khi vào game
  overview: { position: [0, 57, 85], lookAt: [0, 6, -156] },
};

// Keyboard control map for drei's KeyboardControls
const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
];

function GameController() {
  useKeyboardControls();
  return null;
}

// Audio Controller - manages background music
function AudioController() {
  const { startAmbient } = useBackgroundMusic();
  const { unlockAudio } = useAudio();
  const hasStarted = useRef(false);

  // Start ambient music when user interacts (audio context needs user gesture)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasStarted.current) {
        unlockAudio();
        startAmbient();
        hasStarted.current = true;
      }
    };

    // Listen for first interaction
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [unlockAudio, startAmbient]);

  return null;
}

// Audio Controls Panel
function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const isMuted = useAudioStore((state) => state.isMuted);
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);
  const sfxVolume = useAudioStore((state) => state.sfxVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const setMusicVolume = useAudioStore((state) => state.setMusicVolume);
  const setSfxVolume = useAudioStore((state) => state.setSfxVolume);

  const { playUIClick } = useSoundEffects();

  const handleToggleMute = () => {
    toggleMute();
    if (!isMuted) {
      // Don't play sound when muting
    } else {
      playUIClick();
    }
  };

  return (
    <div className="absolute bottom-4 right-4">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playUIClick();
        }}
        className="glass rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        title={isMuted ? 'Bật âm thanh' : 'Điều chỉnh âm thanh'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Volume Panel */}
      {isOpen && (
        <div
          className="absolute bottom-14 right-0 glass rounded-lg p-4 min-w-[220px]"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-hoa-quang font-display text-sm">🎵 Âm Thanh</p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-tho-kim hover:text-xich-viem text-xs"
            >
              ✕
            </button>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`w-full mb-4 py-2 rounded-lg font-body text-sm transition-all ${
              isMuted
                ? 'bg-red-900/50 text-red-400 border border-red-500/50'
                : 'bg-green-900/50 text-green-400 border border-green-500/50'
            }`}
          >
            {isMuted ? '🔇 Đã Tắt Tiếng' : '🔊 Đang Bật'}
          </button>

          {/* Master Volume */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-tho-kim">Tổng</span>
              <span className="text-hoa-quang">{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume * 100}
              onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FF8C00 0%, #FF8C00 ${masterVolume * 100}%, #3D2424 ${masterVolume * 100}%, #3D2424 100%)`,
              }}
            />
          </div>

          {/* Music Volume */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-tho-kim">Nhạc Nền</span>
              <span className="text-cyan-400">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume * 100}
              onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00CED1 0%, #00CED1 ${musicVolume * 100}%, #3D2424 ${musicVolume * 100}%, #3D2424 100%)`,
              }}
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-tho-kim">Hiệu Ứng</span>
              <span className="text-yellow-400">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume * 100}
              onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${sfxVolume * 100}%, #3D2424 ${sfxVolume * 100}%, #3D2424 100%)`,
              }}
            />
          </div>

          {/* Tip */}
          <p className="text-xs text-tho-kim mt-3 text-center opacity-70">
            Click vào game để bật nhạc
          </p>
        </div>
      )}
    </div>
  );
}

function HUD() {
  const cultivationLevel = useGameStore((state) => state.cultivationLevel);
  const transportMode = useGameStore((state) => state.transportMode);
  const isGrounded = useGameStore((state) => state.player.isGrounded);
  const isFlying = useGameStore((state) => state.player.isFlying);
  const unlockedTransports = useGameStore((state) => state.unlockedTransports);

  const levelNames: Record<string, string> = {
    pham_nhan: 'Phàm Nhân',
    luyen_khi: 'Luyện Khí',
    truc_co: 'Trúc Cơ',
    ket_dan: 'Kết Đan',
    nguyen_anh: 'Nguyên Anh',
    hoa_than: 'Hóa Thần',
    anh_bien: 'Anh Biến',
    van_dinh: 'Vấn Đỉnh',
  };

  const swordUnlocked = unlockedTransports.includes('sword');

  return (
    <div className="absolute top-4 left-4 space-y-2">
      {/* Cultivation Level */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs font-accent">Tu Vi</p>
        <p className="text-co-chi font-display text-lg">{levelNames[cultivationLevel]}</p>
      </div>

      {/* Transport Mode */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs font-accent">Phương Thức</p>
        <p className="text-co-chi font-body">
          {transportMode === 'cloud' && 'Đạp Mây'}
          {transportMode === 'sword' && 'Ngự Kiếm ⚔️'}
          {transportMode === 'beast' && 'Phượng Hoàng'}
        </p>
      </div>

      {/* Status */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs font-accent">Trạng Thái</p>
        <p className={`text-sm font-body ${isFlying ? (transportMode === 'beast' ? 'text-orange-400' : 'text-cyan-400') : isGrounded ? 'text-green-400' : 'text-yellow-400'}`}>
          {isFlying && transportMode === 'sword' && '⚔️ Ngự Kiếm Bay'}
          {isFlying && transportMode === 'beast' && '🔥 Cưỡi Phượng'}
          {!isFlying && isGrounded && 'Trên Mặt Đất'}
          {!isFlying && !isGrounded && 'Đang Bay'}
        </p>
      </div>

      {/* Sword Mode Indicator */}
      {swordUnlocked && transportMode === 'sword' && (
        <div className={`glass rounded-lg px-4 py-2 ${isFlying ? 'border border-cyan-500' : ''}`}>
          <p className="text-tho-kim text-xs font-accent">Phi Kiếm</p>
          <p className={`text-sm font-body ${isFlying ? 'text-cyan-400' : 'text-gray-400'}`}>
            {isFlying ? '✓ Đang Bay' : 'Nhấn F để bay'}
          </p>
        </div>
      )}

      {/* Phoenix Mode Indicator */}
      {unlockedTransports.includes('beast') && transportMode === 'beast' && (
        <div className={`glass rounded-lg px-4 py-2 ${isFlying ? 'border border-orange-500' : ''}`}>
          <p className="text-tho-kim text-xs font-accent">Cưỡi Phượng</p>
          <p className={`text-sm font-body ${isFlying ? 'text-orange-400' : 'text-gray-400'}`}>
            {isFlying ? '🔥 Đang Bay' : 'Nhấn F để bay'}
          </p>
        </div>
      )}
    </div>
  );
}

function ControlsHelp() {
  const isFlying = useGameStore((state) => state.player.isFlying);
  const transportMode = useGameStore((state) => state.transportMode);
  const unlockedTransports = useGameStore((state) => state.unlockedTransports);
  const swordUnlocked = unlockedTransports.includes('sword');
  const beastUnlocked = unlockedTransports.includes('beast');

  const flyColor = transportMode === 'beast' ? 'text-orange-400' : 'text-cyan-400';

  return (
    <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-3">
      <p className="text-tho-kim text-xs mb-2 font-accent">Điều Khiển</p>
      <div className="text-co-chi text-sm space-y-1 opacity-80 font-body">
        <p><span className="text-hoa-quang">W A S D</span> - Di chuyển</p>
        {!isFlying && (
          <>
            <p><span className="text-hoa-quang">Space</span> - Nhảy tại chỗ</p>
            <p><span className="text-hoa-quang">Left Click</span> - Nhảy đến vị trí</p>
          </>
        )}
        {isFlying && (
          <>
            <p><span className={flyColor}>Space / Q</span> - Bay lên</p>
            <p><span className={flyColor}>Shift / E</span> - Bay xuống</p>
          </>
        )}
        {(swordUnlocked || beastUnlocked) && (
          <p>
            <span className="text-yellow-400">F</span> -{' '}
            {isFlying
              ? 'Xuống đất'
              : transportMode === 'beast'
              ? 'Cưỡi Phượng'
              : 'Ngự Kiếm'}
          </p>
        )}
        <p><span className="text-hoa-quang">Kéo chuột trái</span> - Xoay camera</p>
        <p><span className="text-hoa-quang">Kéo chuột phải</span> - Di chuyển camera</p>
        <p><span className="text-hoa-quang">Scroll</span> - Zoom</p>
      </div>
    </div>
  );
}

// Tutorial popup khi unlock Ngự Kiếm
function SwordUnlockTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const swordUnlocked = useGameStore((state) => state.unlockedTransports).includes('sword');

  useEffect(() => {
    if (swordUnlocked && !hasShown) {
      setShowTutorial(true);
      setHasShown(true);
    }
  }, [swordUnlocked, hasShown]);

  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="pointer-events-auto animate-swordUnlock animate-glowPulse"
        style={{
          background: 'linear-gradient(135deg, rgba(26,10,10,0.98) 0%, rgba(45,27,27,0.98) 100%)',
          border: '3px solid #FFD700',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          boxShadow: '0 0 60px rgba(255,215,0,0.4), inset 0 0 30px rgba(255,140,0,0.1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚔️</div>
          <h2
            className="font-display text-2xl"
            style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
          >
            Ngự Kiếm Khai Mở!
          </h2>
          <p className="text-tho-kim text-sm mt-1 font-accent">Đã lĩnh ngộ Phi Kiếm Chi Thuật</p>
        </div>

        {/* Controls Guide */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,215,0,0.1)' }}>
            <kbd className="px-3 py-1 rounded font-bold text-lg" style={{ background: '#FFD700', color: '#1A0A0A' }}>F</kbd>
            <span className="text-co-chi font-body">Bật / Tắt chế độ bay</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(0,206,209,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>W</kbd>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>A</kbd>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>S</kbd>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>D</kbd>
            </div>
            <span className="text-co-chi font-body">Di chuyển ngang</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(0,206,209,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>Space</kbd>
              <span className="text-tho-kim">/</span>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>Q</kbd>
            </div>
            <span className="text-co-chi font-body">Bay lên cao</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(0,206,209,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>Shift</kbd>
              <span className="text-tho-kim">/</span>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>E</kbd>
            </div>
            <span className="text-co-chi font-body">Hạ xuống thấp</span>
          </div>
        </div>

        {/* Tip */}
        <div className="text-center mb-4 p-3 rounded-lg" style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)' }}>
          <p className="text-sm" style={{ color: '#FF6B35' }}>
            💡 Mẹo: Bay đến gần mặt đất và nhấn <kbd className="px-1 rounded" style={{ background: 'rgba(255,215,0,0.3)' }}>Shift</kbd> để hạ cánh
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowTutorial(false)}
          className="w-full py-3 rounded-lg font-display text-lg transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
            color: '#1A0A0A',
            boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
          }}
        >
          Đã Hiểu - Bắt Đầu Bay!
        </button>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const setUILoading = useUIStore((state) => state.setLoading);
  const setCameraTarget = useUIStore((state) => state.setCameraTarget);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUILoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [setUILoading]);

  // Handle navigation from LevelNavigator
  const handleNavigate = useCallback((sectionId: string) => {
    const cameraConfig = SECTION_CAMERA_POSITIONS[sectionId];
    if (cameraConfig) {
      setCameraTarget(cameraConfig.position, cameraConfig.lookAt);
    }
  }, [setCameraTarget]);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Game Controller */}
      <GameController />

      {/* 3D Canvas */}
      <div className="canvas-container">
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{
              fov: CAMERA.fov,
              near: CAMERA.near,
              far: CAMERA.far,
              // Góc nhìn toàn cảnh - thấy từ Phàm Nhân đến Vấn Đỉnh (X=0 để ở giữa)
              position: [0, 57, 85],
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(COLORS.primary);
            }}
          >
            <Suspense fallback={null}>
              <Experience />
              <Preload all />
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </div>

      {/* Audio Controller */}
      <AudioController />

      {/* UI Overlay */}
      {!isLoading && (
        <div className="ui-overlay">
          <HUD />
          <ControlsHelp />
          <LevelNavigator onNavigate={handleNavigate} />
          <CameraDebugPanel />
          <AudioControls />
        </div>
      )}

      {/* Modals */}
      <ProjectModal />

      {/* Sword Unlock Tutorial */}
      <SwordUnlockTutorial />

      {/* Phoenix Unlock Tutorial */}
      <PhoenixUnlockTutorial />
    </>
  );
}

// Camera Debug Panel - Hiển thị tọa độ camera realtime
function CameraDebugPanel() {
  const showCameraDebug = useUIStore((state) => state.showCameraDebug);
  const toggleCameraDebug = useUIStore((state) => state.toggleCameraDebug);
  const cameraDebugInfo = useUIStore((state) => state.cameraDebugInfo);

  if (!showCameraDebug) {
    return (
      <button
        onClick={toggleCameraDebug}
        className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-xs text-tho-kim hover:text-co-chi transition-colors"
      >
        📷 Show Camera
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 glass rounded-lg px-4 py-3 min-w-[200px]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-hoa-quang text-sm font-display">📷 Camera Debug</p>
        <button
          onClick={toggleCameraDebug}
          className="text-tho-kim hover:text-xich-viem text-xs"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {/* Camera Position */}
        <div className="p-2 rounded" style={{ background: 'rgba(0,206,209,0.1)' }}>
          <p className="text-cyan-400 mb-1">Position (camera):</p>
          <p className="text-co-chi">
            X: <span className="text-yellow-400">{cameraDebugInfo.position[0]}</span>
            {' | '}
            Y: <span className="text-yellow-400">{cameraDebugInfo.position[1]}</span>
            {' | '}
            Z: <span className="text-yellow-400">{cameraDebugInfo.position[2]}</span>
          </p>
        </div>

        {/* Camera Target (LookAt) */}
        <div className="p-2 rounded" style={{ background: 'rgba(255,140,0,0.1)' }}>
          <p className="text-orange-400 mb-1">Target (lookAt):</p>
          <p className="text-co-chi">
            X: <span className="text-yellow-400">{cameraDebugInfo.target[0]}</span>
            {' | '}
            Y: <span className="text-yellow-400">{cameraDebugInfo.target[1]}</span>
            {' | '}
            Z: <span className="text-yellow-400">{cameraDebugInfo.target[2]}</span>
          </p>
        </div>

        {/* Copy values hint */}
        <div className="text-tho-kim text-center pt-2 border-t border-gray-700">
          Xoay/zoom camera để tìm góc nhìn bạn muốn
        </div>
      </div>
    </div>
  );
}

// Tutorial popup khi unlock Cưỡi Phượng
function PhoenixUnlockTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const beastUnlocked = useGameStore((state) => state.unlockedTransports).includes('beast');

  useEffect(() => {
    if (beastUnlocked && !hasShown) {
      setShowTutorial(true);
      setHasShown(true);
    }
  }, [beastUnlocked, hasShown]);

  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className="pointer-events-auto animate-swordUnlock animate-glowPulse"
        style={{
          background: 'linear-gradient(135deg, rgba(26,10,10,0.98) 0%, rgba(45,27,27,0.98) 100%)',
          border: '3px solid #FF4500',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          boxShadow: '0 0 60px rgba(255,69,0,0.4), inset 0 0 30px rgba(255,140,0,0.1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔥</div>
          <h2
            className="font-display text-2xl"
            style={{ color: '#FF4500', textShadow: '0 0 20px rgba(255,69,0,0.5)' }}
          >
            Cưỡi Phượng Khai Mở!
          </h2>
          <p className="text-tho-kim text-sm mt-1 font-accent">Đã kết giao với Hỏa Phượng Thần Thú</p>
        </div>

        {/* Controls Guide */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,69,0,0.1)' }}>
            <kbd className="px-3 py-1 rounded font-bold text-lg" style={{ background: '#FF4500', color: '#1A0A0A' }}>F</kbd>
            <span className="text-co-chi font-body">Bật / Tắt chế độ cưỡi phượng</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,140,0,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>W</kbd>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>A</kbd>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>S</kbd>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>D</kbd>
            </div>
            <span className="text-co-chi font-body">Di chuyển ngang (nhanh hơn kiếm!)</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,140,0,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>Space</kbd>
              <span className="text-tho-kim">/</span>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>Q</kbd>
            </div>
            <span className="text-co-chi font-body">Bay lên cao</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,140,0,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>Shift</kbd>
              <span className="text-tho-kim">/</span>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>E</kbd>
            </div>
            <span className="text-co-chi font-body">Hạ xuống thấp</span>
          </div>
        </div>

        {/* Tip */}
        <div className="text-center mb-4 p-3 rounded-lg" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
          <p className="text-sm" style={{ color: '#FFD700' }}>
            💡 Phượng bay nhanh hơn kiếm! Tốc độ: 80 vs 50
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowTutorial(false)}
          className="w-full py-3 rounded-lg font-display text-lg transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)',
            color: '#1A0A0A',
            boxShadow: '0 4px 20px rgba(255,69,0,0.3)',
          }}
        >
          Đã Hiểu - Cưỡi Phượng Bay!
        </button>
      </div>
    </div>
  );
}

export default App;
