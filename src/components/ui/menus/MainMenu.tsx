import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/gameStore';
import { useSoundEffects } from '@/hooks/useAudio';

interface MenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
}

function MenuItem({ icon, label, onClick, color = '#FFD700' }: MenuItemProps) {
  const { playUIClick } = useSoundEffects();

  const handleClick = () => {
    playUIClick();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: 'rgba(45, 27, 27, 0.6)',
        border: '1px solid rgba(255, 68, 68, 0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 68, 68, 0.15)';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 20px ${color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(45, 27, 27, 0.6)';
        e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.2)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-co-chi font-body text-lg">{label}</span>
    </button>
  );
}

export function MainMenu() {
  const activeMenu = useUIStore((state) => state.activeMenu);
  const openMenu = useUIStore((state) => state.openMenu);
  const closeMenu = useUIStore((state) => state.closeMenu);

  const isOpen = activeMenu === 'main';

  const handleResume = () => {
    closeMenu();
  };

  const handleSettings = () => {
    openMenu('settings');
  };

  const handleHelp = () => {
    openMenu('help');
  };

  const handleReload = () => {
    window.location.reload();
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
            onClick={handleResume}
          />

          {/* Menu Panel - Top right dropdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-4 right-4 z-50 w-[280px]"
          >
            <div
              className="glass rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 60px rgba(255, 68, 68, 0.3), inset 0 0 30px rgba(255, 140, 0, 0.1)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-5 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%)',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                }}
              >
                <h1
                  className="font-display text-2xl tracking-wider"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                  }}
                >
                  VƯƠNG LÂM
                </h1>
                <p className="text-tho-kim text-sm font-accent mt-1">Tu Tiên Chi Lộ</p>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                <MenuItem icon="▶" label="Tiếp Tục" onClick={handleResume} color="#00CED1" />
                <MenuItem icon="⚙" label="Cài Đặt" onClick={handleSettings} color="#FF8C00" />
                <MenuItem icon="❓" label="Hướng Dẫn" onClick={handleHelp} color="#FFD700" />
                <MenuItem icon="↻" label="Tải Lại" onClick={handleReload} color="#FF4444" />
              </div>

              {/* Footer hint */}
              <div className="px-4 pb-4">
                <p className="text-center text-tho-kim text-xs opacity-60">
                  Nhấn ESC để đóng
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
