// ==========================================
// VƯƠNG LÂM PORTFOLIO - Type Definitions
// ==========================================

// -------------------- Game State --------------------

export type CultivationLevel =
  | 'pham_nhan'    // Phàm Nhân - Intro
  | 'luyen_khi'    // Luyện Khí - About
  | 'truc_co'      // Trúc Cơ - Skills
  | 'kim_dan'      // Kim Đan - Projects 1-3
  | 'nguyen_anh'   // Nguyên Anh - Projects 4-6
  | 'hoa_than'     // Hóa Thần - Experience
  | 'dai_thua';    // Đại Thừa - Contact

export type TransportMode =
  | 'walking'      // Đi bộ
  | 'cloud'        // Đạp mây
  | 'sword'        // Ngự kiếm
  | 'beast';       // Cưỡi linh thú

export type Section =
  | 'intro'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'contact';

export interface GameState {
  currentSection: Section;
  cultivationLevel: CultivationLevel;
  transportMode: TransportMode;
  unlockedTransports: TransportMode[];
  visitedSections: Section[];
  projectsViewed: number[];
}

// -------------------- Player --------------------

export interface PlayerState {
  position: [number, number, number];
  rotation: [number, number, number];
  velocity: [number, number, number];
  isGrounded: boolean;
  isFlying: boolean;
  isMounted: boolean;
}

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  ascend: boolean;
  descend: boolean;
  interact: boolean;
}

// -------------------- Content --------------------

export interface Project {
  id: number;
  name: string;
  category: string;
  description: string;
  tech: string[];
  features: string[];
  links: {
    demo?: string;
    github?: string;
  };
  image: string;
  color: string;
}

export interface Skill {
  name: string;
  level: number;  // 0-100
  rank: SkillRank;
}

export type SkillRank =
  | 'Sơ Học'      // 0-40
  | 'Luyện Tập'   // 41-55
  | 'Nhập Môn'    // 56-70
  | 'Tiểu Thành'  // 71-85
  | 'Đại Thành';  // 86-100

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
}

export interface Certification {
  name: string;
  year: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  availability: string;
  social: SocialLink[];
}

// -------------------- UI --------------------

export interface ModalState {
  isOpen: boolean;
  type: 'project' | 'skill' | 'settings' | 'help' | null;
  data?: Project | Skill | null;
}

export interface TooltipState {
  isVisible: boolean;
  content: string;
  position: { x: number; y: number };
}

export interface NotificationState {
  isVisible: boolean;
  type: 'success' | 'error' | 'info' | 'achievement';
  message: string;
}

// -------------------- Audio --------------------

export interface AudioState {
  isMuted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  currentTrack: string | null;
}

// -------------------- Settings --------------------

export interface Settings {
  graphics: 'low' | 'medium' | 'high';
  audio: AudioState;
  controls: {
    invertY: boolean;
    sensitivity: number;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
  };
}

// -------------------- 3D World --------------------

export interface WorldObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  interactive?: boolean;
  data?: Record<string, unknown>;
}

export interface SectionZone {
  id: Section;
  name: string;
  chineseName: string;
  position: [number, number, number];
  radius: number;
  unlockRequirement?: {
    type: 'section' | 'projects';
    value: Section | number;
  };
}

export interface CloudPlatform {
  id: string;
  position: [number, number, number];
  size: 'small' | 'medium' | 'large';
  targetSection?: Section;
}

// -------------------- Events --------------------

export interface GameEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
}

export type GameEventType =
  | 'section_enter'
  | 'section_leave'
  | 'project_view'
  | 'transport_unlock'
  | 'transport_change'
  | 'achievement_unlock'
  | 'contact_submit';

// -------------------- Contact Form --------------------

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}
