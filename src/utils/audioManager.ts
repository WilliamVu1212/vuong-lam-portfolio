// ==========================================
// VƯƠNG LÂM PORTFOLIO - Audio Manager
// Centralized audio management with Howler.js
// ==========================================

import { Howl, Howler } from 'howler';
import { AUDIO } from './constants';

// Sound types
export type SFXKey = keyof typeof AUDIO.sfx;
export type TrackKey = keyof typeof AUDIO.tracks;

// Audio instance cache
const sounds: Map<string, Howl> = new Map();
const music: Map<string, Howl> = new Map();

// Currently playing music tracks (supports multiple simultaneous tracks)
const playingTracks: Set<string> = new Set();

// ==========================================
// Sound Effects (SFX)
// ==========================================

/**
 * Preload all SFX sounds
 */
export const preloadSFX = (): void => {
  Object.entries(AUDIO.sfx).forEach(([key, src]) => {
    if (!sounds.has(key)) {
      const sound = new Howl({
        src: [src],
        preload: true,
        volume: 0.8,
        onloaderror: (_id, error) => {
          console.warn(`[AudioManager] Failed to load SFX: ${key}`, error);
        },
      });
      sounds.set(key, sound);
    }
  });
};

/**
 * Play a sound effect
 */
export const playSFX = (
  key: SFXKey,
  options?: { volume?: number; rate?: number }
): number | null => {
  const sound = sounds.get(key);
  if (!sound) {
    console.warn(`[AudioManager] SFX not found: ${key}`);
    return null;
  }

  if (options?.volume !== undefined) {
    sound.volume(options.volume);
  }
  if (options?.rate !== undefined) {
    sound.rate(options.rate);
  }

  return sound.play();
};

/**
 * Stop a specific SFX
 */
export const stopSFX = (key: SFXKey): void => {
  const sound = sounds.get(key);
  if (sound) {
    sound.stop();
  }
};

// ==========================================
// Music / Background Tracks
// ==========================================

/**
 * Preload music tracks
 */
export const preloadMusic = (): void => {
  Object.entries(AUDIO.tracks).forEach(([key, src]) => {
    if (!music.has(key)) {
      const track = new Howl({
        src: [src],
        preload: true,
        loop: true,
        volume: 0.5,
        html5: false, // Use Web Audio API instead of HTML5 Audio
        onload: () => {
          console.log(`[AudioManager] Music loaded: ${key}`);
        },
        onloaderror: (_id, error) => {
          console.warn(`[AudioManager] Failed to load music: ${key}`, error);
        },
        onplay: () => {
          console.log(`[AudioManager] Music ACTUALLY playing: ${key}`);
        },
        onplayerror: (_id, error) => {
          console.error(`[AudioManager] Play error for ${key}:`, error);
        },
      });
      music.set(key, track);
    }
  });
};

/**
 * Play a music track with optional fade-in
 * Supports multiple simultaneous tracks (ambient + music can layer)
 */
export const playMusic = (
  key: TrackKey,
  options?: { volume?: number; fadeIn?: number }
): void => {
  const track = music.get(key);
  if (!track) {
    console.warn(`[AudioManager] Music track not found: ${key}`);
    return;
  }

  // Debug: Check audio context state
  console.log(`[AudioManager] Audio context state: ${Howler.ctx?.state}`);
  console.log(`[AudioManager] Howler muted: ${Howler._muted}`);
  console.log(`[AudioManager] Track state: ${track.state()}`);

  // Don't restart if already playing
  if (track.playing()) {
    console.log(`[AudioManager] Track already playing: ${key}`);
    return;
  }

  // Ensure audio context is running
  if (Howler.ctx?.state === 'suspended') {
    console.log(`[AudioManager] Resuming suspended audio context...`);
    Howler.ctx.resume();
  }

  // Unmute Howler globally before playing
  Howler.mute(false);

  const targetVolume = options?.volume ?? 0.5;

  // Set volume (don't use fadeIn for now to test basic playback)
  track.volume(targetVolume);

  // Play and get the sound ID
  const soundId = track.play();
  console.log(`[AudioManager] Called play() for ${key}, soundId: ${soundId}, volume: ${targetVolume}`);

  // Check if actually playing after a short delay
  setTimeout(() => {
    console.log(`[AudioManager] After 500ms - ${key} playing: ${track.playing()}`);
  }, 500);

  playingTracks.add(key);
  console.log(`[AudioManager] Started playing: ${key}, volume: ${targetVolume}`);
};

/**
 * Stop music with optional fade-out
 */
export const stopMusic = (
  key: TrackKey,
  options?: { fadeOut?: number }
): void => {
  const track = music.get(key);
  if (!track) return;

  if (options?.fadeOut) {
    track.fade(track.volume(), 0, options.fadeOut);
    track.once('fade', () => {
      track.stop();
      playingTracks.delete(key);
    });
  } else {
    track.stop();
    playingTracks.delete(key);
  }

  console.log(`[AudioManager] Stopped: ${key}`);
};

/**
 * Pause all playing music
 */
export const pauseMusic = (): void => {
  playingTracks.forEach((key) => {
    const track = music.get(key);
    if (track?.playing()) {
      track.pause();
    }
  });
};

/**
 * Resume all paused music
 */
export const resumeMusic = (): void => {
  playingTracks.forEach((key) => {
    const track = music.get(key);
    if (track && !track.playing()) {
      track.play();
    }
  });
};

// ==========================================
// Global Volume Control
// ==========================================

/**
 * Set master volume (affects all sounds)
 */
export const setMasterVolume = (volume: number): void => {
  Howler.volume(Math.max(0, Math.min(1, volume)));
};

/**
 * Mute/Unmute all sounds
 */
export const setMuted = (muted: boolean): void => {
  Howler.mute(muted);
};

/**
 * Set music volume
 */
export const setMusicVolume = (volume: number): void => {
  music.forEach((track) => {
    track.volume(Math.max(0, Math.min(1, volume)));
  });
};

/**
 * Set SFX volume
 */
export const setSFXVolume = (volume: number): void => {
  sounds.forEach((sound) => {
    sound.volume(Math.max(0, Math.min(1, volume)));
  });
};

// ==========================================
// Initialization & Cleanup
// ==========================================

/**
 * Initialize audio system - preload all sounds
 */
export const initAudio = (): void => {
  preloadSFX();
  preloadMusic();
  console.log('[AudioManager] Audio system initialized');
};

/**
 * Cleanup - stop and unload all sounds
 */
export const cleanupAudio = (): void => {
  sounds.forEach((sound) => {
    sound.unload();
  });
  sounds.clear();

  music.forEach((track) => {
    track.unload();
  });
  music.clear();

  playingTracks.clear();
  console.log('[AudioManager] Audio system cleaned up');
};

/**
 * Get all currently playing music tracks
 */
export const getPlayingTracks = (): string[] => Array.from(playingTracks);

/**
 * Check if a specific track is playing
 */
export const isTrackPlaying = (key: TrackKey): boolean => playingTracks.has(key);

/**
 * Stop all music tracks
 */
export const stopAllTracks = (fadeOut?: number): void => {
  const keys = Array.from(playingTracks) as TrackKey[];
  keys.forEach((key) => {
    stopMusic(key, fadeOut ? { fadeOut } : undefined);
  });
};

/**
 * Check if audio context is unlocked (user interaction required)
 */
export const isAudioUnlocked = (): boolean => {
  return Howler.ctx?.state === 'running';
};

/**
 * Unlock audio context (call on first user interaction)
 * Returns a promise that resolves when audio is unlocked
 */
export const unlockAudio = async (): Promise<void> => {
  if (Howler.ctx?.state === 'suspended') {
    console.log('[AudioManager] Unlocking audio context...');
    try {
      await Howler.ctx.resume();
      console.log('[AudioManager] Audio context unlocked! State:', Howler.ctx.state);
    } catch (err) {
      console.error('[AudioManager] Failed to unlock audio context:', err);
    }
  } else {
    console.log('[AudioManager] Audio context already running:', Howler.ctx?.state);
  }
};
