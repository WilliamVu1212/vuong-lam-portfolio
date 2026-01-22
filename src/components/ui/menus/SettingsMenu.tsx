import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useAudioStore } from '@/stores/gameStore';
import { useSoundEffects } from '@/hooks/useAudio';

interface VolumeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

function VolumeSlider({ label, value, onChange, color = '#FFD700' }: VolumeSliderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-co-chi font-body text-sm w-32">{label}</span>
      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(value * 100)}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          className="volume-slider flex-1"
          style={{
            '--slider-color': color,
          } as React.CSSProperties}
        />
        <span className="text-tho-kim text-xs w-10 text-right">{Math.round(value * 100)}%</span>
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  const { playUIClick } = useSoundEffects();

  const handleChange = () => {
    playUIClick();
    onChange(!checked);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-co-chi font-body text-sm">{label}</span>
      <button
        onClick={handleChange}
        className="w-12 h-6 rounded-full transition-all relative"
        style={{
          background: checked
            ? 'linear-gradient(135deg, #FF4444 0%, #FF8C00 100%)'
            : 'rgba(45, 27, 27, 0.8)',
          border: checked ? '1px solid #FFD700' : '1px solid rgba(255, 68, 68, 0.3)',
          boxShadow: checked ? '0 0 10px rgba(255, 140, 0, 0.4)' : 'none',
        }}
      >
        <div
          className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
          style={{
            background: checked ? '#FFD700' : '#8B7355',
            left: checked ? '26px' : '2px',
            boxShadow: checked ? '0 0 8px rgba(255, 215, 0, 0.5)' : 'none',
          }}
        />
      </button>
    </div>
  );
}

export function SettingsMenu() {
  const activeMenu = useUIStore((state) => state.activeMenu);
  const openMenu = useUIStore((state) => state.openMenu);
  const showCameraDebug = useUIStore((state) => state.showCameraDebug);
  const toggleCameraDebug = useUIStore((state) => state.toggleCameraDebug);
  const showFPS = useUIStore((state) => state.showFPS);
  const setShowFPS = useUIStore((state) => state.setShowFPS);
  const resetSettings = useUIStore((state) => state.resetSettings);
  const isMobile = useUIStore((state) => state.isMobile);

  const masterVolume = useAudioStore((state) => state.masterVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);
  const sfxVolume = useAudioStore((state) => state.sfxVolume);
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const setMusicVolume = useAudioStore((state) => state.setMusicVolume);
  const setSfxVolume = useAudioStore((state) => state.setSfxVolume);

  const { playUIClick } = useSoundEffects();

  const isOpen = activeMenu === 'settings';

  const handleBack = () => {
    playUIClick();
    openMenu('main');
  };

  const handleReset = () => {
    playUIClick();
    setMasterVolume(0.7);
    setMusicVolume(0.5);
    setSfxVolume(0.8);
    resetSettings();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-huyet-da/60 backdrop-blur-sm z-40"
            onClick={handleBack}
          />

          {/* Settings Panel - Same position as MainMenu on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[calc(100vh-2rem)] overflow-y-auto"
          >
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 60px rgba(255, 140, 0, 0.3), inset 0 0 30px rgba(255, 68, 68, 0.1)',
                border: '2px solid rgba(255, 140, 0, 0.3)',
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.2) 0%, rgba(255, 68, 68, 0.1) 100%)',
                  borderBottom: '1px solid rgba(255, 140, 0, 0.2)',
                }}
              >
                <button
                  onClick={handleBack}
                  className="text-tho-kim hover:text-co-chi transition-colors flex items-center gap-1"
                >
                  <span>←</span>
                  <span className="text-sm font-body">Quay lại</span>
                </button>
                <h2
                  className="font-display text-xl"
                  style={{
                    color: '#FF8C00',
                    textShadow: '0 0 15px rgba(255, 140, 0, 0.5)',
                  }}
                >
                  ⚙ Cài Đặt
                </h2>
                <div className="w-16" /> {/* Spacer for centering */}
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Audio Section */}
                <div>
                  <h3
                    className="text-sm font-accent mb-4 pb-2 flex items-center gap-2"
                    style={{
                      color: '#FFD700',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                    }}
                  >
                    <span>♪</span> ÂM THANH
                  </h3>
                  <div className="space-y-4">
                    <VolumeSlider
                      label="Tổng Âm Lượng"
                      value={masterVolume}
                      onChange={setMasterVolume}
                      color="#FF4444"
                    />
                    <VolumeSlider
                      label="Nhạc Nền"
                      value={musicVolume}
                      onChange={setMusicVolume}
                      color="#FF8C00"
                    />
                    <VolumeSlider
                      label="Hiệu Ứng"
                      value={sfxVolume}
                      onChange={setSfxVolume}
                      color="#FFD700"
                    />
                  </div>
                </div>

                {/* Display Section */}
                <div>
                  <h3
                    className="text-sm font-accent mb-4 pb-2 flex items-center gap-2"
                    style={{
                      color: '#00CED1',
                      borderBottom: '1px solid rgba(0, 206, 209, 0.2)',
                    }}
                  >
                    <span>⊙</span> HIỂN THỊ
                  </h3>
                  <div className="space-y-3">
                    <Toggle label="Hiện FPS" checked={showFPS} onChange={setShowFPS} />
                    {!isMobile && (
                      <Toggle
                        label="Debug Camera"
                        checked={showCameraDebug}
                        onChange={toggleCameraDebug}
                      />
                    )}
                  </div>
                </div>

                {/* Controls Summary */}
                <div>
                  <h3
                    className="text-sm font-accent mb-4 pb-2 flex items-center gap-2"
                    style={{
                      color: '#FF6B35',
                      borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
                    }}
                  >
                    <span>⌨</span> ĐIỀU KHIỂN
                  </h3>
                  <div className="text-sm text-tho-kim space-y-1 font-body">
                    <p><span className="text-hoa-quang">W A S D</span> - Di chuyển</p>
                    <p><span className="text-hoa-quang">Space</span> - Nhảy</p>
                    <p><span className="text-hoa-quang">Q / E</span> - Bay lên / xuống</p>
                    <p><span className="text-hoa-quang">F</span> - Bật/tắt bay</p>
                    <p><span className="text-hoa-quang">ESC</span> - Menu</p>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-lg font-body text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'rgba(45, 27, 27, 0.8)',
                    border: '1px solid rgba(255, 68, 68, 0.3)',
                    color: '#C4A77D',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF4444';
                    e.currentTarget.style.color = '#F5E6D3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.3)';
                    e.currentTarget.style.color = '#C4A77D';
                  }}
                >
                  Đặt Lại Mặc Định
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
