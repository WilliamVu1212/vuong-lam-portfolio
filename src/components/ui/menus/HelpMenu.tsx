import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/gameStore';
import { useSoundEffects } from '@/hooks/useAudio';

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="px-2 py-1 rounded text-xs font-mono"
      style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        color: '#1A0A0A',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      }}
    >
      {children}
    </kbd>
  );
}

interface TransportCardProps {
  icon: string;
  title: string;
  description: string;
  unlockText: string;
  controls: string;
  color: string;
}

function TransportCard({ icon, title, description, unlockText, controls, color }: TransportCardProps) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}33`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="font-body text-co-chi">{title}</span>
      </div>
      <p className="text-tho-kim text-xs mb-1">{description}</p>
      <p className="text-xs" style={{ color }}>
        <span className="opacity-70">Mở khóa:</span> {unlockText}
      </p>
      <p className="text-xs text-tho-kim mt-1">
        <span className="opacity-70">Điều khiển:</span> {controls}
      </p>
    </div>
  );
}

export function HelpMenu() {
  const activeMenu = useUIStore((state) => state.activeMenu);
  const openMenu = useUIStore((state) => state.openMenu);
  const { playUIClick } = useSoundEffects();

  const isOpen = activeMenu === 'help';

  const handleBack = () => {
    playUIClick();
    openMenu('main');
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

          {/* Help Panel - Same position as MainMenu on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[450px] max-h-[calc(100vh-2rem)] overflow-y-auto"
          >
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 60px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 140, 0, 0.1)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%)',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
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
                    color: '#FFD700',
                    textShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  ❓ Hướng Dẫn
                </h2>
                <div className="w-16" /> {/* Spacer for centering */}
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Controls */}
                <div>
                  <h3
                    className="text-sm font-accent mb-4 pb-2 flex items-center gap-2"
                    style={{
                      color: '#FFD700',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                    }}
                  >
                    <span>⌨</span> ĐIỀU KHIỂN CƠ BẢN
                  </h3>

                  {/* Keyboard Controls */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <KeyBadge>W</KeyBadge>
                        <KeyBadge>A</KeyBadge>
                        <KeyBadge>S</KeyBadge>
                        <KeyBadge>D</KeyBadge>
                      </div>
                      <span className="text-co-chi text-sm font-body">Di chuyển</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <KeyBadge>Space</KeyBadge>
                      <span className="text-co-chi text-sm font-body">Nhảy tại chỗ</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <KeyBadge>ESC</KeyBadge>
                      <span className="text-co-chi text-sm font-body">Mở/đóng menu</span>
                    </div>
                  </div>

                  {/* Mouse Controls */}
                  <div className="space-y-2 text-sm font-body">
                    <p className="text-tho-kim">
                      <span className="text-hoa-quang">🖱 Kéo trái</span> - Xoay camera
                    </p>
                    <p className="text-tho-kim">
                      <span className="text-hoa-quang">🖱 Kéo phải</span> - Di chuyển camera
                    </p>
                    <p className="text-tho-kim">
                      <span className="text-hoa-quang">🖱 Scroll</span> - Zoom
                    </p>
                    <p className="text-tho-kim">
                      <span className="text-hoa-quang">🖱 Click trái</span> - Nhảy đến vị trí
                    </p>
                  </div>
                </div>

                {/* Transport Modes */}
                <div>
                  <h3
                    className="text-sm font-accent mb-4 pb-2 flex items-center gap-2"
                    style={{
                      color: '#00CED1',
                      borderBottom: '1px solid rgba(0, 206, 209, 0.2)',
                    }}
                  >
                    <span>🚀</span> PHƯƠNG THỨC DI CHUYỂN
                  </h3>

                  <div className="space-y-3">
                    <TransportCard
                      icon="☁️"
                      title="Đạp Mây"
                      description="Nhảy trên mây, di chuyển cơ bản"
                      unlockText="Mặc định"
                      controls="WASD + Space"
                      color="#C4A77D"
                    />
                    <TransportCard
                      icon="⚔️"
                      title="Ngự Kiếm"
                      description="Bay tự do với kiếm tiên"
                      unlockText="Đến gần Trảm La Kiếm (Trúc Cơ)"
                      controls="F bật/tắt, Q/E lên/xuống"
                      color="#00CED1"
                    />
                    <TransportCard
                      icon="🔥"
                      title="Cưỡi Phượng"
                      description="Bay nhanh nhất trên Hỏa Phượng"
                      unlockText="Đến gần Thượng Cổ Đồng Chung (Hóa Thần)"
                      controls="F bật/tắt, Q/E lên/xuống"
                      color="#FF4500"
                    />
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3
                    className="text-sm font-accent mb-4 pb-2 flex items-center gap-2"
                    style={{
                      color: '#FF6B35',
                      borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
                    }}
                  >
                    <span>💡</span> MẸO HAY
                  </h3>

                  <ul className="space-y-2 text-sm text-tho-kim font-body">
                    <li className="flex gap-2">
                      <span className="text-hoa-quang">•</span>
                      <span>Click vào "Phương Thức" ở góc trái để đổi mode di chuyển</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-hoa-quang">•</span>
                      <span>Dùng LevelNavigator bên phải để nhảy nhanh đến các section</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-hoa-quang">•</span>
                      <span>Click vào crystals để xem chi tiết Skills/Projects</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-hoa-quang">•</span>
                      <span>Bật âm thanh để có trải nghiệm tốt nhất!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
