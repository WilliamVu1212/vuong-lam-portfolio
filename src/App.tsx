import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, KeyboardControls } from '@react-three/drei';
import Experience from './components/3d/Experience';
import LoadingScreen from './components/ui/LoadingScreen';
import ProjectModal from './components/ui/ProjectModal';
import LevelNavigator from './components/ui/LevelNavigator';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useUIStore, useGameStore } from './stores/gameStore';
import { CAMERA, COLORS } from './utils/constants';

// Section positions for camera navigation
const SECTION_CAMERA_POSITIONS: Record<string, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  intro: { position: [0, 30, 50], lookAt: [0, 0, 0] },
  about: { position: [0, 60, -50], lookAt: [0, 30, -100] },
  skills: { position: [0, 100, -150], lookAt: [0, 60, -200] },
  projects: { position: [0, 150, -250], lookAt: [0, 100, -300] },
  experience: { position: [0, 200, -400], lookAt: [0, 150, -450] },
  contact: { position: [0, 250, -500], lookAt: [0, 200, -550] },
  vandinh: { position: [0, 310, -600], lookAt: [0, 260, -650] },
  overview: { position: [200, 350, 100], lookAt: [0, 130, -325] }, // Bird's eye view
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
        <p className={`text-sm font-body ${isFlying ? 'text-cyan-400' : isGrounded ? 'text-green-400' : 'text-yellow-400'}`}>
          {isFlying ? '⚔️ Ngự Kiếm Bay' : isGrounded ? 'Trên Mặt Đất' : 'Đang Bay'}
        </p>
      </div>

      {/* Sword Mode Indicator */}
      {swordUnlocked && (
        <div className={`glass rounded-lg px-4 py-2 ${isFlying ? 'border border-cyan-500' : ''}`}>
          <p className="text-tho-kim text-xs font-accent">Phi Kiếm</p>
          <p className={`text-sm font-body ${isFlying ? 'text-cyan-400' : 'text-gray-400'}`}>
            {isFlying ? '✓ Đang Bay' : 'Nhấn F để bay'}
          </p>
        </div>
      )}
    </div>
  );
}

function ControlsHelp() {
  const isFlying = useGameStore((state) => state.player.isFlying);
  const swordUnlocked = useGameStore((state) => state.unlockedTransports).includes('sword');

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
            <p><span className="text-cyan-400">Space / Q</span> - Bay lên</p>
            <p><span className="text-cyan-400">Shift / E</span> - Bay xuống</p>
          </>
        )}
        {swordUnlocked && (
          <p><span className="text-yellow-400">F</span> - {isFlying ? 'Xuống đất' : 'Ngự Kiếm'}</p>
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
              position: [0, 8, 15],
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

      {/* UI Overlay */}
      {!isLoading && (
        <div className="ui-overlay">
          <HUD />
          <ControlsHelp />
          <LevelNavigator onNavigate={handleNavigate} />
        </div>
      )}

      {/* Modals */}
      <ProjectModal />

      {/* Sword Unlock Tutorial */}
      <SwordUnlockTutorial />
    </>
  );
}

export default App;
