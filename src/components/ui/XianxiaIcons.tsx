interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// ========== SKILLS ICONS ==========

// Kiếm Pháp - Sword Arts (双剑)
export function SwordIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main sword blade */}
      <path
        d="M4 20L10 14M10 14L20 4L18 6L20 4M10 14L8 16L10 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Blade */}
      <path
        d="M14 4L20 4L20 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Guard */}
      <path
        d="M7 13L11 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Energy aura */}
      <path
        d="M16 2C17 3 18 4 18 6"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M22 8C21 7 20 6 18 6"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

// Đan Pháp - Alchemy/Pill Refinement (丹炉)
export function AlchemyIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cauldron body */}
      <path
        d="M6 10C6 10 5 12 5 15C5 18 7 20 12 20C17 20 19 18 19 15C19 12 18 10 18 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Cauldron rim */}
      <ellipse
        cx="12"
        cy="10"
        rx="6"
        ry="2"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Legs */}
      <path d="M7 20L6 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 20L12 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 20L18 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Flames */}
      <path
        d="M9 6C9 4 10 3 12 2C14 3 15 4 15 6C15 7 14 8 12 8C10 8 9 7 9 6Z"
        stroke={color}
        strokeWidth="1.2"
        fill={color}
        fillOpacity="0.2"
      />
      {/* Steam/Energy */}
      <path d="M10 5C10 3.5 11 2.5 12 2" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M14 5C14 3.5 13 2.5 12 2" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// Trận Pháp - Formation Arrays (阵法)
export function FormationIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer octagon */}
      <path
        d="M12 2L18.5 5.5L22 12L18.5 18.5L12 22L5.5 18.5L2 12L5.5 5.5L12 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner circle */}
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
      {/* Connection lines */}
      <path d="M12 2L12 8" stroke={color} strokeWidth="1" opacity="0.7" />
      <path d="M12 16L12 22" stroke={color} strokeWidth="1" opacity="0.7" />
      <path d="M2 12L8 12" stroke={color} strokeWidth="1" opacity="0.7" />
      <path d="M16 12L22 12" stroke={color} strokeWidth="1" opacity="0.7" />
      {/* Diagonal lines */}
      <path d="M5.5 5.5L9 9" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M18.5 5.5L15 9" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M5.5 18.5L9 15" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M18.5 18.5L15 15" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

// Thần Thông - Divine Powers (神通)
export function DivinePowerIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central eye/orb */}
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill={color} />
      {/* Radiating energy beams */}
      <path d="M12 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Diagonal beams */}
      <path d="M4.93 4.93L7.76 7.76" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16.24 16.24L19.07 19.07" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.93 19.07L7.76 16.24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16.24 7.76L19.07 4.93" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Outer aura */}
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}

// ========== PROJECT ICONS ==========

// Long - Dragon (龙)
export function DragonIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dragon head */}
      <path
        d="M6 8C4 8 3 10 3 12C3 14 5 15 6 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="5" cy="11" r="0.8" fill={color} />
      {/* Body curve */}
      <path
        d="M6 12C8 12 10 10 12 10C14 10 15 12 16 14C17 16 19 17 21 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Tail */}
      <path
        d="M21 16C22 15 22 14 21 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Horns */}
      <path d="M4 8L3 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 7L6 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Whiskers */}
      <path d="M3 12L1 11" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M3 13L1 14" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      {/* Scales/details */}
      <path d="M9 11C9 10 10 9 11 9" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M14 12C14 13 15 14 16 14" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Flame breath */}
      <path
        d="M6 15L8 18L6 17L7 20"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

// Phượng - Phoenix (凤)
export function PhoenixIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="8" cy="6" r="2.5" stroke={color} strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="8.5" cy="5.5" r="0.7" fill={color} />
      {/* Crown feathers */}
      <path d="M7 4L5 1" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 3.5L8 1" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 4L11 2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Body */}
      <path
        d="M8 8.5C8 10 10 12 12 13C14 14 16 14 18 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Wing */}
      <path
        d="M10 10C12 8 15 8 17 9C19 10 20 12 19 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Tail feathers */}
      <path d="M18 13L22 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 14L20 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 15L18 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 15L15 20" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      {/* Beak */}
      <path d="M10.5 6L12 6.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Hổ - Tiger (虎)
export function TigerIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head shape */}
      <path
        d="M6 10C4 10 3 12 3 14C3 17 6 19 12 19C18 19 21 17 21 14C21 12 20 10 18 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Ears */}
      <path d="M6 10L4 5L8 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 10L20 5L16 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Eyes */}
      <circle cx="8" cy="13" r="1.2" fill={color} />
      <circle cx="16" cy="13" r="1.2" fill={color} />
      {/* Nose */}
      <path d="M11 15L12 16L13 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Stripes on forehead */}
      <path d="M10 10L10 12" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M12 9L12 11" stroke={color} strokeWidth="1.2" opacity="0.7" />
      <path d="M14 10L14 12" stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Whiskers */}
      <path d="M6 15L3 14" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M6 16L3 17" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M18 15L21 14" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M18 16L21 17" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// Quy - Turtle (龟) - Symbol of longevity
export function TurtleIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shell */}
      <ellipse cx="12" cy="13" rx="8" ry="6" stroke={color} strokeWidth="1.5" />
      {/* Shell pattern - hexagonal */}
      <path d="M12 7L12 19" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M6 10L18 16" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M6 16L18 10" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Head */}
      <path
        d="M20 13C21 13 22 12 22 11C22 10 21 9 20 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="21" cy="10.5" r="0.5" fill={color} />
      {/* Legs */}
      <path d="M6 10L3 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16L3 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 16L20 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tail */}
      <path d="M4 13L2 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Lân - Qilin/Kirin (麟)
export function QilinIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <path
        d="M5 12C4 12 3 11 3 9C3 7 4 6 6 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="5" cy="8" r="0.7" fill={color} />
      {/* Horn */}
      <path d="M5 6L4 2L6 5" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Mane */}
      <path d="M6 6C7 5 8 5 9 6" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M7 7C8 6 9 6 10 7" stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Body */}
      <path
        d="M6 10C8 10 10 11 12 12C14 13 17 13 19 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Back curve */}
      <path
        d="M8 8C10 7 14 7 17 9C19 10 20 11 20 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Tail with flames */}
      <path d="M19 12L21 11L20 13L22 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Legs */}
      <path d="M10 12L9 16L10 15L9 18" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12L15 16L16 15L15 19" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Scales/fur pattern */}
      <circle cx="12" cy="10" r="0.5" fill={color} opacity="0.4" />
      <circle cx="15" cy="10" r="0.5" fill={color} opacity="0.4" />
    </svg>
  );
}

// Hỏa - Fire/Flame (火)
export function FlameIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main flame */}
      <path
        d="M12 2C12 2 8 6 8 11C8 14 9 16 10 17C10 15 11 13 12 12C13 13 14 15 14 17C15 16 16 14 16 11C16 6 12 2 12 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
      {/* Inner flame */}
      <path
        d="M12 8C12 8 10 10 10 13C10 15 11 16 12 17C13 16 14 15 14 13C14 10 12 8 12 8Z"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* Base glow */}
      <ellipse
        cx="12"
        cy="20"
        rx="5"
        ry="2"
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Sparks */}
      <circle cx="7" cy="8" r="0.5" fill={color} opacity="0.5" />
      <circle cx="17" cy="9" r="0.5" fill={color} opacity="0.5" />
      <circle cx="9" cy="5" r="0.5" fill={color} opacity="0.4" />
    </svg>
  );
}

// ========== EXPERIENCE ICONS ==========

// Cuộn thư - Scroll (卷轴)
export function ScrollIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main scroll body */}
      <rect x="5" y="4" width="14" height="16" rx="1" stroke={color} strokeWidth="1.5" />
      {/* Top roll */}
      <path d="M5 6C5 4 6 3 8 3L16 3C18 3 19 4 19 6" stroke={color} strokeWidth="1.5" />
      <ellipse cx="5" cy="6" rx="1.5" ry="2" stroke={color} strokeWidth="1.2" />
      <ellipse cx="19" cy="6" rx="1.5" ry="2" stroke={color} strokeWidth="1.2" />
      {/* Text lines */}
      <path d="M8 9L16 9" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M8 12L16 12" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M8 15L13 15" stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// Ngọc bội - Jade Pendant (玉佩)
export function JadeIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* String/cord */}
      <path d="M12 2L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Jade disc (bi) */}
      <circle cx="12" cy="14" r="7" stroke={color} strokeWidth="1.5" />
      {/* Center hole */}
      <circle cx="12" cy="14" r="2.5" stroke={color} strokeWidth="1.5" />
      {/* Decorative patterns */}
      <path d="M12 7L12 11.5" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M12 16.5L12 21" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M5 14L9.5 14" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M14.5 14L19 14" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Knot at top */}
      <circle cx="12" cy="5" r="1.5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// Ấn - Seal (印)
export function SealIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Seal body - 3D cube-ish */}
      <path
        d="M4 8L12 4L20 8L20 16L12 20L4 16L4 8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Top face */}
      <path d="M4 8L12 12L20 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Center line */}
      <path d="M12 12L12 20" stroke={color} strokeWidth="1.5" />
      {/* Seal character (simplified 印) */}
      <path d="M10 9L14 9" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d="M12 7L12 11" stroke={color} strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

// Linh thạch - Spirit Stone (灵石)
export function SpiritStoneIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crystal shape */}
      <path
        d="M12 2L18 8L18 16L12 22L6 16L6 8L12 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.1"
      />
      {/* Inner facets */}
      <path d="M12 2L12 22" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M6 8L18 16" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M18 8L6 16" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Glow center */}
      <circle cx="12" cy="12" r="2" fill={color} fillOpacity="0.3" />
      {/* Energy sparks */}
      <circle cx="9" cy="6" r="0.5" fill={color} opacity="0.6" />
      <circle cx="15" cy="18" r="0.5" fill={color} opacity="0.6" />
    </svg>
  );
}

// Lotus - Sen (莲)
export function LotusIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center petal */}
      <path
        d="M12 4C12 4 10 8 10 12C10 16 12 18 12 18C12 18 14 16 14 12C14 8 12 4 12 4Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
      {/* Left petals */}
      <path
        d="M8 6C8 6 5 9 5 13C5 16 8 18 8 18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 10C5 10 3 12 3 15C3 17 5 18 5 18"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Right petals */}
      <path
        d="M16 6C16 6 19 9 19 13C19 16 16 18 16 18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19 10C19 10 21 12 21 15C21 17 19 18 19 18"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Base/water */}
      <path
        d="M4 20C6 19 10 19 12 20C14 19 18 19 20 20"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

// Bát Quái - Bagua/Trigram (八卦)
export function BaguaIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      {/* Yin Yang center */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12 16.48 12 12 12 12C12 12 12 7.52 12 2Z"
        fill={color}
        fillOpacity="0.3"
      />
      <circle cx="12" cy="7" r="2" fill={color} />
      <circle cx="12" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      {/* Trigram lines (simplified) */}
      <path d="M4 8L6 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12L6 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 8L20 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 12L20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Export all icons as a collection
export const XianxiaIcons = {
  // Skills
  Sword: SwordIcon,
  Alchemy: AlchemyIcon,
  Formation: FormationIcon,
  DivinePower: DivinePowerIcon,
  // Projects - Mythical creatures
  Dragon: DragonIcon,
  Phoenix: PhoenixIcon,
  Tiger: TigerIcon,
  Turtle: TurtleIcon,
  Qilin: QilinIcon,
  Flame: FlameIcon,
  // Experience/General
  Scroll: ScrollIcon,
  Jade: JadeIcon,
  Seal: SealIcon,
  SpiritStone: SpiritStoneIcon,
  Lotus: LotusIcon,
  Bagua: BaguaIcon,
};

export default XianxiaIcons;
