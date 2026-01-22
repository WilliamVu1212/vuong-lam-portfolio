import { useUIStore } from '@/stores/gameStore';
import { useSoundEffects } from '@/hooks/useAudio';

export function MenuButton() {
  const openMenu = useUIStore((state) => state.openMenu);
  const activeMenu = useUIStore((state) => state.activeMenu);
  const { playUIClick } = useSoundEffects();

  const handleClick = () => {
    playUIClick();
    openMenu('main');
  };

  // Hide when menu is already open
  if (activeMenu) return null;

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 right-4 glass rounded-lg px-3 py-2 hover:scale-105 transition-all group"
      title="Menu (ESC)"
      style={{
        boxShadow: '0 0 15px rgba(255, 68, 68, 0.2)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl group-hover:text-hoa-quang transition-colors">☰</span>
        <span className="text-tho-kim text-sm font-accent group-hover:text-co-chi transition-colors">
          Menu
        </span>
      </div>
    </button>
  );
}
