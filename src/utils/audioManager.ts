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

// Current playing music track
let currentMusicTrack: string | null = null;

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
        html5: true, // Better for long audio files
        onloaderror: (_id, error) => {
          console.warn(`[AudioManager] Failed to load music: ${key}`, error);
        },
      });
      music.set(key, track);
    }
  });
};

/**
 * Play a music track with optional fade-in
 */
export const playMusic = (
  key: TrackKey,
  options?: { volume?: number; fadeIn?: number }
): void => {
  // Stop current music if different track
  if (currentMusicTrack && currentMusicTrack !== key) {
    stopMusic(currentMusicTrack as TrackKey, { fadeOut: 1000 });
  }

  const track = music.get(key);
  if (!track) {
    console.warn(`[AudioManager] Music track not found: ${key}`);
    return;
  }

  // Don't restart if already playing
  if (track.playing()) {
    return;
  }

  const targetVolume = options?.volume ?? 0.5;

  if (options?.fadeIn) {
    track.volume(0);
    track.play();
    track.fade(0, targetVolume, options.fadeIn);
  } else {
    track.volume(targetVolume);
    track.play();
  }

  currentMusicTrack = key;
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
    });
  } else {
    track.stop();
  }

  if (currentMusicTrack === key) {
    currentMusicTrack = null;
  }
};

/**
 * Pause/Resume music
 */
export const pauseMusic = (): void => {
  if (currentMusicTrack) {
    const track = music.get(currentMusicTrack);
    if (track?.playing()) {
      track.pause();
    }
  }
};

export const resumeMusic = (): void => {
  if (currentMusicTrack) {
    const track = music.get(currentMusicTrack);
    if (track && !track.playing()) {
      track.play();
    }
  }
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

  currentMusicTrack = null;
  console.log('[AudioManager] Audio system cleaned up');
};

/**
 * Get current music track name
 */
export const getCurrentMusicTrack = (): string | null => currentMusicTrack;

/**
 * Check if audio context is unlocked (user interaction required)
 */
export const isAudioUnlocked = (): boolean => {
  return Howler.ctx?.state === 'running';
};

/**
 * Unlock audio context (call on first user interaction)
 */
export const unlockAudio = (): void => {
  if (Howler.ctx?.state === 'suspended') {
    Howler.ctx.resume();
  }
};
