import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  Section,
  CultivationLevel,
  TransportMode,
  GameState,
  PlayerState,
  PlayerControls,
} from '@/types';

// ==========================================
// Game Store - Main game state
// ==========================================

interface GameStore extends GameState {
  // Player state
  player: PlayerState;
  controls: PlayerControls;

  // Actions - Section
  setCurrentSection: (section: Section) => void;
  visitSection: (section: Section) => void;

  // Actions - Cultivation
  setCultivationLevel: (level: CultivationLevel) => void;

  // Actions - Transport
  setTransportMode: (mode: TransportMode) => void;
  unlockTransport: (mode: TransportMode) => void;

  // Actions - Projects
  viewProject: (projectId: number) => void;

  // Actions - Player
  setPlayerPosition: (position: [number, number, number]) => void;
  setPlayerVelocity: (velocity: [number, number, number]) => void;
  setPlayerGrounded: (isGrounded: boolean) => void;
  setPlayerFlying: (isFlying: boolean) => void;

  // Actions - Controls
  setControl: (control: keyof PlayerControls, value: boolean) => void;
  resetControls: () => void;

  // Actions - Reset
  resetGame: () => void;
}

const initialPlayerState: PlayerState = {
  position: [0, 5, 0],
  rotation: [0, 0, 0],
  velocity: [0, 0, 0],
  isGrounded: false,
  isFlying: false,
  isMounted: false,
};

const initialControls: PlayerControls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  ascend: false,
  descend: false,
  interact: false,
};

const initialGameState: GameState = {
  currentSection: 'intro',
  cultivationLevel: 'pham_nhan',
  transportMode: 'cloud',
  unlockedTransports: ['cloud'],
  visitedSections: ['intro'],
  projectsViewed: [],
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    ...initialGameState,
    player: initialPlayerState,
    controls: initialControls,

    // Section actions
    setCurrentSection: (section) => {
      set({ currentSection: section });
      get().visitSection(section);
    },

    visitSection: (section) => {
      const { visitedSections } = get();
      if (!visitedSections.includes(section)) {
        set({ visitedSections: [...visitedSections, section] });

        // Update cultivation level based on section
        const sectionToLevel: Record<Section, CultivationLevel> = {
          intro: 'pham_nhan',
          about: 'luyen_khi',
          skills: 'truc_co',
          projects: 'kim_dan',
          experience: 'hoa_than',
          contact: 'dai_thua',
          vandinh: 'van_dinh',
        };
        set({ cultivationLevel: sectionToLevel[section] });
      }
    },

    // Cultivation actions
    setCultivationLevel: (level) => set({ cultivationLevel: level }),

    // Transport actions
    setTransportMode: (mode) => {
      const { unlockedTransports } = get();
      if (unlockedTransports.includes(mode)) {
        set({ transportMode: mode });
      }
    },

    unlockTransport: (mode) => {
      const { unlockedTransports } = get();
      if (!unlockedTransports.includes(mode)) {
        set({ unlockedTransports: [...unlockedTransports, mode] });
      }
    },

    // Project actions
    viewProject: (projectId) => {
      const { projectsViewed } = get();
      if (!projectsViewed.includes(projectId)) {
        set({ projectsViewed: [...projectsViewed, projectId] });

        // Unlock beast transport after viewing 3 projects
        if (projectsViewed.length + 1 >= 3) {
          get().unlockTransport('beast');
        }
      }
    },

    // Player actions
    setPlayerPosition: (position) =>
      set((state) => ({
        player: { ...state.player, position },
      })),

    setPlayerVelocity: (velocity) =>
      set((state) => ({
        player: { ...state.player, velocity },
      })),

    setPlayerGrounded: (isGrounded) =>
      set((state) => ({
        player: { ...state.player, isGrounded },
      })),

    setPlayerFlying: (isFlying) =>
      set((state) => ({
        player: { ...state.player, isFlying },
      })),

    // Control actions
    setControl: (control, value) =>
      set((state) => ({
        controls: { ...state.controls, [control]: value },
      })),

    resetControls: () => set({ controls: initialControls }),

    // Reset game
    resetGame: () =>
      set({
        ...initialGameState,
        player: initialPlayerState,
        controls: initialControls,
      }),
  }))
);

// ==========================================
// UI Store - UI state separate from game
// ==========================================

interface UIStore {
  // Modal
  isModalOpen: boolean;
  modalType: 'project' | 'skill' | 'settings' | 'help' | null;
  modalData: unknown;

  // Menu
  isMenuOpen: boolean;
  isPaused: boolean;

  // Loading
  isLoading: boolean;
  loadingProgress: number;

  // Debug
  isDebugMode: boolean;
  showCameraDebug: boolean;

  // Mobile
  isMobile: boolean;

  // Camera target for navigation
  cameraTarget: [number, number, number] | null;
  cameraLookAt: [number, number, number] | null;

  // Camera debug info (realtime)
  cameraDebugInfo: {
    position: [number, number, number];
    target: [number, number, number];
  };

  // Actions
  openModal: (type: UIStore['modalType'], data?: unknown) => void;
  closeModal: () => void;
  toggleMenu: () => void;
  setPaused: (paused: boolean) => void;
  setLoading: (loading: boolean, progress?: number) => void;
  toggleDebug: () => void;
  toggleCameraDebug: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setCameraTarget: (position: [number, number, number] | null, lookAt?: [number, number, number] | null) => void;
  setCameraDebugInfo: (position: [number, number, number], target: [number, number, number]) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  // Initial state
  isModalOpen: false,
  modalType: null,
  modalData: null,
  isMenuOpen: false,
  isPaused: false,
  isLoading: true,
  loadingProgress: 0,
  isDebugMode: false,
  showCameraDebug: true, // Mặc định bật để debug camera
  isMobile: false,
  cameraTarget: null,
  cameraLookAt: null,
  cameraDebugInfo: {
    position: [0, 0, 0],
    target: [0, 0, 0],
  },

  // Actions
  openModal: (type, data) =>
    set({
      isModalOpen: true,
      modalType: type,
      modalData: data,
      isPaused: true,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalType: null,
      modalData: null,
      isPaused: false,
    }),

  toggleMenu: () =>
    set((state) => ({
      isMenuOpen: !state.isMenuOpen,
      isPaused: !state.isMenuOpen,
    })),

  setPaused: (paused) => set({ isPaused: paused }),

  setLoading: (loading, progress = 0) =>
    set({
      isLoading: loading,
      loadingProgress: progress,
    }),

  toggleDebug: () => set((state) => ({ isDebugMode: !state.isDebugMode })),

  toggleCameraDebug: () => set((state) => ({ showCameraDebug: !state.showCameraDebug })),

  setIsMobile: (isMobile) => set({ isMobile }),

  setCameraTarget: (position, lookAt = null) =>
    set({
      cameraTarget: position,
      cameraLookAt: lookAt,
    }),

  setCameraDebugInfo: (position, target) =>
    set({
      cameraDebugInfo: { position, target },
    }),
}));

// ==========================================
// Audio Store - Sound management
// ==========================================

interface AudioStore {
  isMuted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;

  // Actions
  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>()((set) => ({
  isMuted: false,
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
  setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
  setSfxVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),
}));
