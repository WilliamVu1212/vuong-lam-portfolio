// ==========================================
// VƯƠNG LÂM PORTFOLIO - Constants
// ==========================================

// -------------------- Colors (Xích Hỏa Theme) --------------------

export const COLORS = {
  // Primary - Backgrounds
  primary: '#1A0A0A',      // Huyết Dạ - Main bg
  secondary: '#2D1B1B',    // Ám Hồng - Section bg
  tertiary: '#3D2424',     // Thâm Hồng - Cards

  // Accent - Interactive
  accent1: '#FF4444',      // Xích Viêm - Primary accent
  accent2: '#FF8C00',      // Hỏa Quang - Secondary accent
  accent3: '#FF6B35',      // Liệt Diệm - Tertiary

  // Special
  gold: '#FFD700',         // Hoàng Kim - Important
  energy: '#FF4500',       // Linh Hỏa - Energy/particles

  // Text
  textPrimary: '#F5E6D3',  // Cổ Chỉ - Main text
  textSecondary: '#C4A77D',// Thổ Kim - Secondary text
  textMuted: '#8B7355',    // Ám Thổ - Muted text

  // Gradients (as arrays for Three.js)
  gradientFire: ['#FF4444', '#FF8C00', '#FFD700'],
  gradientDark: ['#1A0A0A', '#2D1B1B'],
} as const;

// -------------------- Physics --------------------

export const PHYSICS = {
  gravity: -30,

  // Cloud stepping
  cloud: {
    jumpHeight: 15,
    jumpForce: 20,
    airControl: 0.3,
    maxFallSpeed: -50,
  },

  // Sword flying
  sword: {
    maxSpeed: 50,
    acceleration: 20,
    deceleration: 15,
    turnSpeed: 3,
    tiltAngle: 0.3,
  },

  // Beast riding
  beast: {
    maxSpeed: 80,
    acceleration: 15,
    verticalSpeed: 30,
    turnSpeed: 2,
  },
} as const;

// -------------------- Camera --------------------

export const CAMERA = {
  fov: 75,
  near: 0.1,
  far: 2000,

  // Follow camera offsets - Góc nhìn từ trên xuống chéo để bao quát toàn cảnh
  // distance: khoảng cách phía sau player (Z offset)
  // height: độ cao so với player (Y offset)
  // lookAhead: khoảng cách nhìn về phía trước player (giúp thấy đường đi)
  follow: {
    walking: { distance: 45, height: 35, lookAhead: 30, smoothing: 0.025 },  // Góc nhìn bao quát từ trên
    cloud: { distance: 40, height: 30, lookAhead: 25, smoothing: 0.08 },     // Đạp mây
    sword: { distance: 55, height: 40, lookAhead: 35, smoothing: 0.04 },     // Bay kiếm nhìn rộng
    beast: { distance: 65, height: 50, lookAhead: 40, smoothing: 0.06 },     // Cưỡi phượng nhìn xa nhất
  },
} as const;

// -------------------- World --------------------

export const WORLD = {
  // Bounds
  bounds: {
    minX: -500,
    maxX: 500,
    minY: -50,
    maxY: 500,
    minZ: -700,
    maxZ: 100,
  },

  // Fog
  fog: {
    color: '#1A0A0A',
    near: 50,
    far: 500,
  },

  // Sky
  sky: {
    starCount: 2000,
    moonPosition: [100, 150, -300] as [number, number, number],
    moonSize: 30,
  },
} as const;

// -------------------- Sections --------------------

export const SECTIONS = {
  intro: {
    position: [0, 0, 0] as [number, number, number],
    size: 50,
  },
  about: {
    position: [0, 30, -100] as [number, number, number],
    size: 80,
  },
  skills: {
    position: [0, 60, -200] as [number, number, number],
    size: 100,
  },
  projects_left: {
    position: [-80, 100, -300] as [number, number, number],
    size: 60,
  },
  projects_right: {
    position: [80, 100, -300] as [number, number, number],
    size: 60,
  },
  experience: {
    position: [0, 150, -450] as [number, number, number],
    size: 100,
  },
  contact: {
    position: [0, 200, -550] as [number, number, number],
    size: 60,
  },
} as const;

// -------------------- Animation --------------------

export const ANIMATION = {
  // Durations (seconds)
  duration: {
    short: 0.3,
    medium: 0.5,
    long: 1,
    extraLong: 2,
  },

  // Easing
  easing: {
    default: 'power2.out',
    bounce: 'bounce.out',
    elastic: 'elastic.out(1, 0.5)',
    smooth: 'power3.inOut',
  },

  // Particles
  particles: {
    cherryPetals: 200,
    embers: 100,
    energyOrbs: 50,
  },
} as const;

// -------------------- Audio --------------------

export const AUDIO = {
  defaultVolume: {
    master: 0.7,
    music: 0.5,
    sfx: 0.8,
  },

  tracks: {
    ambient: '/sounds/ambient/night-wind.mp3',
    music: '/sounds/music/main-theme.mp3',
  },

  sfx: {
    jump: '/sounds/sfx/jump.mp3',
    land: '/sounds/sfx/land.mp3',
    swordWhoosh: '/sounds/sfx/sword-whoosh.mp3',
    phoenixCry: '/sounds/sfx/phoenix-cry.mp3',
    uiClick: '/sounds/sfx/ui-click.mp3',
    unlock: '/sounds/sfx/unlock.mp3',
  },
} as const;

// -------------------- UI --------------------

export const UI = {
  // Z-index layers
  zIndex: {
    world: 0,
    hud: 10,
    modal: 20,
    notification: 30,
    loading: 100,
  },

  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Minimap
  minimap: {
    size: 150,
    zoom: 0.1,
  },
} as const;

// -------------------- Performance --------------------

export const PERFORMANCE = {
  // Target FPS
  targetFPS: {
    high: 60,
    medium: 45,
    low: 30,
  },

  // LOD distances
  lod: {
    high: 50,
    medium: 100,
    low: 200,
  },

  // Shadow map size
  shadowMap: {
    high: 2048,
    medium: 1024,
    low: 512,
  },
} as const;

// -------------------- Controls --------------------

export const CONTROLS = {
  // Keyboard mappings
  keyboard: {
    forward: ['KeyW', 'ArrowUp'],
    backward: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    jump: ['Space'],
    ascend: ['Space', 'KeyQ'],
    descend: ['ShiftLeft', 'ShiftRight', 'KeyE'],  // Cả 2 phím Shift + E
    interact: ['Enter'],  // Bỏ KeyF vì F dùng để toggle flight
    pause: ['Escape'],
  },

  // Mouse sensitivity
  mouse: {
    sensitivity: 0.002,
    smoothing: 0.1,
  },

  // Touch/Mobile
  touch: {
    joystickSize: 120,
    joystickDeadzone: 0.1,
  },
} as const;

// -------------------- Skill Ranks --------------------

export const SKILL_RANKS = {
  thresholds: {
    'Sơ Học': 40,
    'Luyện Tập': 55,
    'Nhập Môn': 70,
    'Tiểu Thành': 85,
    'Đại Thành': 100,
  },

  colors: {
    'Sơ Học': '#8B7355',
    'Luyện Tập': '#C4A77D',
    'Nhập Môn': '#FF8C00',
    'Tiểu Thành': '#FFD700',
    'Đại Thành': '#FF4444',
  },
} as const;
