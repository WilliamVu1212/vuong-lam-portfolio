import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, KeyboardControls } from '@react-three/drei';
import Experience from './components/3d/Experience';
import LoadingScreen from './components/ui/LoadingScreen';
import ProjectModal from './components/ui/ProjectModal';
import LevelNavigator from './components/ui/LevelNavigator';
import { MobileControls } from './components/ui/MobileControls';
import { MenuButton, MainMenu, SettingsMenu, HelpMenu } from './components/ui/menus';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useMobileDetect } from './hooks/useMobileDetect';
import { useUIStore, useGameStore, useAudioStore } from './stores/gameStore';
import { useAudio, useBackgroundMusic, useSoundEffects } from './hooks/useAudio';
import { CAMERA, COLORS } from './utils/constants';

// ==========================================
// WebGL Support Detection
// ==========================================
const checkWebGLSupport = (): { supported: boolean; version: number } => {
  try {
    const canvas = document.createElement('canvas');
    // Try WebGL 2 first
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      return { supported: true, version: 2 };
    }
    // Fallback to WebGL 1
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      return { supported: true, version: 1 };
    }
    return { supported: false, version: 0 };
  } catch {
    return { supported: false, version: 0 };
  }
};

// WebGL Not Supported Fallback Component
function WebGLNotSupported() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#1A0A0A' }}>
      <div className="text-center p-8 max-w-lg">
        <div className="text-6xl mb-6">⚠️</div>
        <h1
          className="font-display text-3xl mb-4"
          style={{ color: '#FFD700' }}
        >
          WebGL Không Được Hỗ Trợ
        </h1>
        <p className="text-co-chi mb-6 leading-relaxed">
          Trình duyệt của bạn không hỗ trợ WebGL - công nghệ cần thiết để hiển thị đồ họa 3D.
        </p>
        <div className="space-y-4 text-left p-4 rounded-lg" style={{ background: 'rgba(45,27,27,0.8)' }}>
          <p className="text-tho-kim text-sm font-accent">Hãy thử:</p>
          <ul className="text-co-chi text-sm space-y-2 list-disc list-inside">
            <li>Cập nhật trình duyệt lên phiên bản mới nhất</li>
            <li>Sử dụng Chrome, Firefox, Edge, hoặc Safari</li>
            <li>Kiểm tra driver card đồ họa đã được cập nhật</li>
            <li>Tắt chế độ tiết kiệm pin (nếu có)</li>
          </ul>
        </div>
        <div className="mt-6 text-tho-kim text-xs">
          <p>Các trình duyệt được khuyến nghị:</p>
          <p className="text-hoa-quang">Chrome 90+ | Firefox 90+ | Safari 15+ | Edge 90+</p>
        </div>
      </div>
    </div>
  );
}

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

// Audio Controller - just initializes audio system (no auto-play)
function AudioController() {
  // Audio is now controlled entirely by AudioControls button
  // Music starts when user clicks the sound button (OFF → ON)
  return null;
}

// Audio Controls Panel
function AudioControls({ isMobileView }: { isMobileView?: boolean }) {
  const isMuted = useAudioStore((state) => state.isMuted);
  const toggleMute = useAudioStore((state) => state.toggleMute);
  const { playUIClick } = useSoundEffects();
  const { forceStartAllMusic, stopAllMusic } = useBackgroundMusic();
  const { unlockAudio } = useAudio();

  const handleToggle = async () => {
    const wasMuted = isMuted;
    toggleMute();

    if (wasMuted) {
      // Turning sound ON (OFF → ON)
      // IMPORTANT: Must unlock audio context DIRECTLY in click handler (not in setTimeout)
      // Browser autoplay policy requires user gesture context
      await unlockAudio();
      // Force start music (bypasses mute check)
      forceStartAllMusic();
      // Play click sound to confirm sound is on
      playUIClick();
      console.log('[Audio] Sound ON - Music started!');
    } else {
      // Turning sound OFF (ON → OFF)
      // Stop all music when muting
      stopAllMusic();
      console.log('[Audio] Sound OFF - Music stopped');
    }
  };

  // Mobile: hiển thị ở góc trên phải, dưới menu button
  // Desktop: hiển thị ở góc dưới phải
  const positionClass = isMobileView
    ? 'fixed top-16 right-4 z-[60]'
    : 'absolute bottom-4 right-4';

  // Sử dụng onPointerDown thay vì onClick/onTouchStart để tránh double trigger
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    handleToggle();
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      className={`${positionClass} glass rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all ${
        isMuted ? 'opacity-60' : ''
      }`}
      style={{ touchAction: 'manipulation' }}
      title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );
}

function HUD({ isMobileView }: { isMobileView?: boolean }) {
  const cultivationLevel = useGameStore((state) => state.cultivationLevel);
  const transportMode = useGameStore((state) => state.transportMode);
  const setTransportMode = useGameStore((state) => state.setTransportMode);
  const setPlayerFlying = useGameStore((state) => state.setPlayerFlying);
  const isGrounded = useGameStore((state) => state.player.isGrounded);
  const isFlying = useGameStore((state) => state.player.isFlying);
  const unlockedTransports = useGameStore((state) => state.unlockedTransports);
  const { playUIClick } = useSoundEffects();

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
  const beastUnlocked = unlockedTransports.includes('beast');
  const hasMultipleModes = (swordUnlocked ? 1 : 0) + (beastUnlocked ? 1 : 0) >= 1;

  // Cycle through unlocked transport modes
  const cycleTransportMode = () => {
    // Play UI click sound
    playUIClick();

    // Nếu đang bay, thoát bay trước khi đổi mode
    if (isFlying) {
      setPlayerFlying(false);
    }

    const modes: ('cloud' | 'sword' | 'beast')[] = ['cloud'];
    if (swordUnlocked) modes.push('sword');
    if (beastUnlocked) modes.push('beast');

    // Tìm mode hiện tại trong danh sách, nếu không có (walking) thì bắt đầu từ 0
    const currentMode = transportMode as 'cloud' | 'sword' | 'beast';
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modes.length;
    setTransportMode(modes[nextIndex]);
  };

  // Mobile: chỉ hiển thị Tu Vi và Phương Thức (compact)
  // Desktop: hiển thị đầy đủ
  if (isMobileView) {
    return (
      <div className="absolute top-4 left-4 space-y-2 max-w-[160px]">
        {/* Cultivation Level - Compact */}
        <div className="glass rounded-lg px-3 py-1.5">
          <p className="text-tho-kim text-[10px] font-accent">Tu Vi</p>
          <p className="text-co-chi font-display text-sm">{levelNames[cultivationLevel]}</p>
        </div>

        {/* Transport Mode - Compact, Clickable */}
        <div
          className={`glass rounded-lg px-3 py-1.5 ${hasMultipleModes ? 'cursor-pointer active:scale-95 transition-all' : ''}`}
          onClick={hasMultipleModes ? cycleTransportMode : undefined}
          onTouchStart={hasMultipleModes ? cycleTransportMode : undefined}
        >
          <p className="text-tho-kim text-[10px] font-accent">
            Phương Thức
            {hasMultipleModes && <span className="ml-1 text-hoa-quang">🔄</span>}
          </p>
          <p className="text-co-chi font-body text-sm">
            {transportMode === 'cloud' && '☁️ Đạp Mây'}
            {transportMode === 'sword' && '⚔️ Ngự Kiếm'}
            {transportMode === 'beast' && '🔥 Cưỡi Phượng'}
          </p>
        </div>
      </div>
    );
  }

  // Desktop: full HUD
  return (
    <div className="absolute top-4 left-4 space-y-2">
      {/* Cultivation Level */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs font-accent">Tu Vi</p>
        <p className="text-co-chi font-display text-lg">{levelNames[cultivationLevel]}</p>
      </div>

      {/* Transport Mode - Clickable to cycle */}
      <div
        className={`glass rounded-lg px-4 py-2 ${hasMultipleModes ? 'cursor-pointer hover:border hover:border-hoa-quang transition-all' : ''}`}
        onClick={hasMultipleModes ? cycleTransportMode : undefined}
        title={hasMultipleModes ? 'Click để đổi phương thức' : ''}
      >
        <p className="text-tho-kim text-xs font-accent">
          Phương Thức
          {hasMultipleModes && <span className="ml-1 text-hoa-quang">🔄</span>}
        </p>
        <p className="text-co-chi font-body">
          {transportMode === 'cloud' && 'Đạp Mây ☁️'}
          {transportMode === 'sword' && 'Ngự Kiếm ⚔️'}
          {transportMode === 'beast' && 'Cưỡi Phượng 🔥'}
        </p>
        {/* Sub-text showing available modes */}
        {hasMultipleModes && (
          <p className="text-xs text-tho-kim opacity-60 mt-1">
            {swordUnlocked && transportMode !== 'sword' && '⚔️ '}
            {beastUnlocked && transportMode !== 'beast' && '🔥 '}
            {transportMode !== 'cloud' && '☁️'}
          </p>
        )}
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
            <p><span className={flyColor}>Q / Space</span> - Bay lên</p>
            <p><span className={flyColor}>E</span> - Bay xuống</p>
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
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>Q</kbd>
              <span className="text-tho-kim">/</span>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>Space</kbd>
            </div>
            <span className="text-co-chi font-body">Bay lên cao</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(0,206,209,0.1)' }}>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#00CED1', color: '#1A0A0A' }}>E</kbd>
            </div>
            <span className="text-co-chi font-body">Hạ xuống thấp</span>
          </div>
        </div>

        {/* Tip */}
        <div className="text-center mb-4 p-3 rounded-lg" style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)' }}>
          <p className="text-sm" style={{ color: '#FF6B35' }}>
            💡 Mẹo: Bay đến gần mặt đất và nhấn <kbd className="px-1 rounded" style={{ background: 'rgba(255,215,0,0.3)' }}>E</kbd> để hạ cánh
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowTutorial(false)}
          className="w-full py-3 rounded-lg font-serif text-lg font-semibold transition-all hover:scale-105"
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
  const setIsMobile = useUIStore((state) => state.setIsMobile);
  const isMobile = useUIStore((state) => state.isMobile);
  const activeMenu = useUIStore((state) => state.activeMenu);
  const openMenu = useUIStore((state) => state.openMenu);
  const closeMenu = useUIStore((state) => state.closeMenu);
  const showFPS = useUIStore((state) => state.showFPS);

  // WebGL support check (memoized to prevent recalculation)
  const webglSupport = useMemo(() => checkWebGLSupport(), []);

  // Mobile detection
  const { isMobile: isMobileDevice, isTablet, isTouchDevice } = useMobileDetect();

  // Update store when mobile status changes
  useEffect(() => {
    const shouldShowMobile = isMobileDevice || isTablet || (isTouchDevice && window.innerWidth < 1024);
    setIsMobile(shouldShowMobile);
  }, [isMobileDevice, isTablet, isTouchDevice, setIsMobile]);

  // ESC key handler for menu toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Debug: Ctrl+M to toggle mobile mode for testing
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        setIsMobile(!isMobile);
        console.log('[Debug] Mobile mode:', !isMobile ? 'ON' : 'OFF');
        return;
      }

      // ESC key to toggle menu
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeMenu) {
          closeMenu();
        } else {
          openMenu('main');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, setIsMobile, activeMenu, openMenu, closeMenu]);

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

  // Show fallback if WebGL is not supported
  if (!webglSupport.supported) {
    return <WebGLNotSupported />;
  }

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
          <HUD isMobileView={isMobile} />
          {/* Show keyboard controls help on desktop, hide on mobile */}
          {!isMobile && <ControlsHelp />}
          <LevelNavigator onNavigate={handleNavigate} />
          {/* Menu button - hide camera debug button, use menu instead */}
          <MenuButton />
          {/* Show camera debug panel only when enabled in settings */}
          {!isMobile && <CameraDebugPanel />}
          {/* Audio Controls - different position on mobile */}
          <AudioControls isMobileView={isMobile} />
          {/* FPS Counter */}
          {showFPS && <FPSCounter />}
        </div>
      )}

      {/* Menus */}
      <MainMenu />
      <SettingsMenu />
      <HelpMenu />

      {/* Mobile Controls - only on mobile/tablet */}
      {!isLoading && isMobile && <MobileControls />}

      {/* Modals */}
      <ProjectModal />

      {/* Sword Unlock Tutorial */}
      <SwordUnlockTutorial />

      {/* Phoenix Unlock Tutorial */}
      <PhoenixUnlockTutorial />
    </>
  );
}

// FPS Counter
function FPSCounter() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className="absolute top-16 right-4 glass rounded-lg px-3 py-2"
      style={{
        background: 'rgba(26, 10, 10, 0.8)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
      }}
    >
      <span className="text-xs font-mono" style={{ color: fps >= 50 ? '#00FF00' : fps >= 30 ? '#FFD700' : '#FF4444' }}>
        FPS: {fps}
      </span>
    </div>
  );
}

// Camera Debug Panel - Hiển thị tọa độ camera realtime
function CameraDebugPanel() {
  const showCameraDebug = useUIStore((state) => state.showCameraDebug);
  const cameraDebugInfo = useUIStore((state) => state.cameraDebugInfo);

  // Only show when enabled in settings
  if (!showCameraDebug) {
    return null;
  }

  return (
    <div className="absolute top-16 right-4 glass rounded-lg px-4 py-3 min-w-[200px]" style={{ marginTop: '40px' }}>
      <div className="mb-3">
        <p className="text-hoa-quang text-sm font-display">📷 Camera Debug</p>
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
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>Q</kbd>
              <span className="text-tho-kim">/</span>
              <kbd className="px-2 py-1 rounded text-sm" style={{ background: '#FF8C00', color: '#1A0A0A' }}>Space</kbd>
            </div>
            <span className="text-co-chi font-body">Bay lên cao</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,140,0,0.1)' }}>
            <div className="flex gap-1">
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
          className="w-full py-3 rounded-lg font-serif text-lg font-semibold transition-all hover:scale-105"
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
