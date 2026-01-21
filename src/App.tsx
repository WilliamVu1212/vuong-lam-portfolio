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
  overview: { position: [200, 300, 100], lookAt: [0, 100, -275] }, // Bird's eye view
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

  const levelNames: Record<string, string> = {
    pham_nhan: 'Phàm Nhân',
    luyen_khi: 'Luyện Khí',
    truc_co: 'Trúc Cơ',
    kim_dan: 'Kim Đan',
    nguyen_anh: 'Nguyên Anh',
    hoa_than: 'Hóa Thần',
    dai_thua: 'Đại Thừa',
  };

  return (
    <div className="absolute top-4 left-4 space-y-2">
      {/* Cultivation Level */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs">Tu Vi</p>
        <p className="text-co-chi font-heading text-lg">{levelNames[cultivationLevel]}</p>
      </div>

      {/* Transport Mode */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs">Phương Thức</p>
        <p className="text-co-chi">
          {transportMode === 'cloud' && '☁️ Đạp Mây'}
          {transportMode === 'sword' && '⚔️ Ngự Kiếm'}
          {transportMode === 'beast' && '🔥 Phượng Hoàng'}
        </p>
      </div>

      {/* Status */}
      <div className="glass rounded-lg px-4 py-2">
        <p className="text-tho-kim text-xs">Trạng Thái</p>
        <p className={`text-sm ${isGrounded ? 'text-green-400' : 'text-yellow-400'}`}>
          {isGrounded ? '🦶 Trên Mặt Đất' : '💨 Đang Bay'}
        </p>
      </div>
    </div>
  );
}

function ControlsHelp() {
  return (
    <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-3">
      <p className="text-tho-kim text-xs mb-2">Điều Khiển</p>
      <div className="text-co-chi text-sm space-y-1 opacity-80">
        <p><span className="text-hoa-quang">W A S D</span> - Di chuyển</p>
        <p><span className="text-hoa-quang">Space</span> - Nhảy tại chỗ</p>
        <p><span className="text-hoa-quang">Left Click</span> - Nhảy đến vị trí</p>
        <p><span className="text-hoa-quang">Kéo chuột trái</span> - Xoay camera</p>
        <p><span className="text-hoa-quang">Kéo chuột phải</span> - Di chuyển camera</p>
        <p><span className="text-hoa-quang">Scroll</span> - Zoom</p>
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
    </>
  );
}

export default App;
