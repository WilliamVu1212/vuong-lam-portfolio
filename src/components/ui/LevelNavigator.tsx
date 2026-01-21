import { cultivationTechniques } from '@/data/content';

interface LevelNavigatorProps {
  onNavigate?: (sectionId: string) => void;
}

// Level data with cultivation progression and techniques (highest level first - Van Dinh on top)
const levels = [
  {
    id: 'vandinh',
    name: 'Vấn Đỉnh',
    key: 'van_dinh',
    techniques: cultivationTechniques.van_dinh.techniques,
    color: '#00CED1'
  },
  {
    id: 'contact',
    name: 'Anh Biến',
    key: 'anh_bien',
    techniques: cultivationTechniques.anh_bien.techniques,
    color: '#9400D3'
  },
  {
    id: 'experience',
    name: 'Hóa Thần',
    key: 'hoa_than',
    techniques: cultivationTechniques.hoa_than.techniques,
    color: '#FF4500'
  },
  {
    id: 'projects',
    name: 'Nguyên Anh',
    key: 'nguyen_anh',
    techniques: cultivationTechniques.nguyen_anh.techniques,
    color: '#FF4444'
  },
  {
    id: 'skills',
    name: 'Kết Đan',
    key: 'ket_dan',
    techniques: cultivationTechniques.ket_dan.techniques,
    color: '#FFD700'
  },
  {
    id: 'about',
    name: 'Trúc Cơ',
    key: 'truc_co',
    techniques: cultivationTechniques.truc_co.techniques,
    color: '#FF8C00'
  },
  {
    id: 'intro',
    name: 'Luyện Khí',
    key: 'luyen_khi',
    techniques: cultivationTechniques.luyen_khi.techniques,
    color: '#C4A77D'
  },
];

export function LevelNavigator({ onNavigate }: LevelNavigatorProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
      {/* Vertical timeline */}
      <div className="relative flex flex-col items-center">
        {/* Connection line - gradient from top (Van Dinh) to bottom (Luyen Khi) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00CED1] via-[#FFD700] to-[#C4A77D] opacity-50 -translate-x-1/2" />

        {/* Level nodes */}
        <div className="relative flex flex-col gap-3">
          {levels.map((level) => (
            <LevelNode
              key={level.id}
              level={level}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

      {/* Overview button */}
      <button
        onClick={() => onNavigate?.('overview')}
        className="mt-4 w-full glass rounded-lg px-3 py-2 text-center hover:bg-white/10 transition-all"
        title="Nhìn toàn cảnh"
      >
        <span className="text-lg">🗺️</span>
        <p className="text-xs text-tho-kim mt-1">Toàn Cảnh</p>
      </button>
    </div>
  );
}

interface LevelNodeProps {
  level: typeof levels[0];
  onNavigate?: (sectionId: string) => void;
}

function LevelNode({ level, onNavigate }: LevelNodeProps) {
  return (
    <button
      onClick={() => onNavigate?.(level.id)}
      className="group relative flex items-center gap-2 py-1"
      title={level.name}
    >
      {/* Node dot */}
      <div
        className="relative z-10 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
        style={{
          borderColor: level.color,
          backgroundColor: 'rgba(26, 10, 10, 0.9)',
          boxShadow: `0 0 8px ${level.color}50`,
        }}
      >
        {/* Pulse effect on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
          style={{ backgroundColor: level.color }}
        />
      </div>

      {/* Hover panel with techniques */}
      <div
        className="absolute right-full mr-3 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none min-w-[160px]"
        style={{
          backgroundColor: 'rgba(26, 10, 10, 0.95)',
          border: `1px solid ${level.color}`,
          boxShadow: `0 0 20px ${level.color}40`,
        }}
      >
        {/* Level name */}
        <p className="text-sm font-bold mb-2 pb-1 border-b border-white/10" style={{ color: level.color }}>
          {level.name}
        </p>

        {/* Techniques list */}
        <div className="space-y-1">
          {level.techniques.map((tech, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-xs mt-0.5" style={{ color: level.color }}>◆</span>
              <div>
                <p className="text-xs font-medium text-co-chi">{tech.name}</p>
                <p className="text-[10px] text-tho-kim opacity-70">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

export default LevelNavigator;
