import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, KeyboardControls } from '@react-three/drei';
import Experience from './components/3d/Experience';
import LoadingScreen from './components/ui/LoadingScreen';
import ProjectModal from './components/ui/ProjectModal';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useUIStore, useGameStore } from './stores/gameStore';
import { CAMERA, COLORS } from './utils/constants';

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
  const currentSection = useGameStore((state) => state.currentSection);
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
        <p><span className="text-hoa-quang">Click</span> - Nhảy đến vị trí</p>
        <p><span className="text-hoa-quang">Kéo chuột</span> - Xoay camera</p>
        <p><span className="text-hoa-quang">Scroll</span> - Zoom</p>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const setUILoading = useUIStore((state) => state.setLoading);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUILoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [setUILoading]);

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
        </div>
      )}

      {/* Modals */}
      <ProjectModal />
    </>
  );
}

export default App;
