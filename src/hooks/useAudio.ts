// ==========================================
// VƯƠNG LÂM PORTFOLIO - useAudio Hook
// React hook for audio playback integration
// ==========================================

import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '@/stores/gameStore';
import {
  playSFX,
  playMusic,
  stopMusic,
  pauseMusic,
  resumeMusic,
  setMasterVolume,
  setMuted,
  setMusicVolume,
  setSFXVolume,
  initAudio,
  cleanupAudio,
  unlockAudio,
  isAudioUnlocked,
  stopAllTracks,
  type SFXKey,
  type TrackKey,
} from '@/utils/audioManager';

// Module-level flag to ensure audio is only initialized once across all hook instances
let audioInitialized = false;
let audioInstanceCount = 0;

/**
 * Main audio hook - provides audio control functions
 * Syncs with AudioStore for global state management
 */
export const useAudio = () => {
  const { isMuted, masterVolume, musicVolume, sfxVolume } = useAudioStore();

  // Initialize audio system once (module-level, not per-instance)
  useEffect(() => {
    audioInstanceCount++;

    if (!audioInitialized) {
      initAudio();
      audioInitialized = true;
      console.log('[useAudio] Audio initialized (first instance)');
    }

    return () => {
      audioInstanceCount--;
      // Only cleanup when ALL instances are unmounted
      if (audioInstanceCount === 0) {
        cleanupAudio();
        audioInitialized = false;
        console.log('[useAudio] Audio cleaned up (last instance)');
      }
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    setMuted(isMuted);
  }, [isMuted]);

  // Sync master volume
  useEffect(() => {
    setMasterVolume(masterVolume);
  }, [masterVolume]);

  // Sync music volume
  useEffect(() => {
    setMusicVolume(musicVolume * masterVolume);
  }, [musicVolume, masterVolume]);

  // Sync SFX volume
  useEffect(() => {
    setSFXVolume(sfxVolume * masterVolume);
  }, [sfxVolume, masterVolume]);

  // Play SFX with current volume settings
  const playSound = useCallback(
    (key: SFXKey, options?: { volume?: number; rate?: number }) => {
      if (isMuted) {
        console.log(`[useAudio] playSound(${key}) blocked - isMuted=true`);
        return null;
      }
      const effectiveVolume = (options?.volume ?? 1) * sfxVolume * masterVolume;
      console.log(`[useAudio] playSound(${key}) - volume: ${effectiveVolume.toFixed(2)}`);
      return playSFX(key, { ...options, volume: effectiveVolume });
    },
    [isMuted, sfxVolume, masterVolume]
  );

  // Play background music
  const playBackgroundMusic = useCallback(
    (key: TrackKey, options?: { fadeIn?: number }) => {
      if (isMuted) return;
      const effectiveVolume = musicVolume * masterVolume;
      playMusic(key, { volume: effectiveVolume, fadeIn: options?.fadeIn });
    },
    [isMuted, musicVolume, masterVolume]
  );

  // Stop background music
  const stopBackgroundMusic = useCallback((key: TrackKey, fadeOut?: number) => {
    stopMusic(key, fadeOut ? { fadeOut } : undefined);
  }, []);

  return {
    // Sound controls
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseMusic,
    resumeMusic,

    // State
    isMuted,
    masterVolume,
    musicVolume,
    sfxVolume,

    // Audio context
    unlockAudio,
    isAudioUnlocked,
  };
};

/**
 * Hook for playing SFX on specific events
 * Provides memoized callbacks for common sound effects
 */
export const useSoundEffects = () => {
  const { playSound } = useAudio();

  const playJump = useCallback(() => {
    console.log('[SFX] Playing jump sound...');
    return playSound('jump');
  }, [playSound]);
  const playLand = useCallback(() => {
    console.log('[SFX] Playing land sound...');
    const result = playSound('land');
    console.log('[SFX] Land sound result:', result);
    return result;
  }, [playSound]);
  const playSwordWhoosh = useCallback(() => playSound('swordWhoosh', { volume: 0.3 }), [playSound]);
  const playPhoenixCry = useCallback(() => playSound('phoenixCry', { volume: 0.35 }), [playSound]);
  const playUIClick = useCallback(() => playSound('uiClick'), [playSound]);
  const playUnlock = useCallback(() => playSound('unlock'), [playSound]);

  return {
    playJump,
    playLand,
    playSwordWhoosh,
    playPhoenixCry,
    playUIClick,
    playUnlock,
  };
};

/**
 * Hook for background music management
 */
export const useBackgroundMusic = () => {
  const { playBackgroundMusic, pauseMusic, resumeMusic } = useAudio();
  const ambientPlaying = useRef(false);
  const musicPlaying = useRef(false);
  const hasEverStarted = useRef(false);

  const startAmbient = useCallback(() => {
    if (!ambientPlaying.current) {
      playBackgroundMusic('ambient', { fadeIn: 2000 });
      ambientPlaying.current = true;
      hasEverStarted.current = true;
    }
  }, [playBackgroundMusic]);

  const startMainTheme = useCallback(() => {
    if (!musicPlaying.current) {
      playBackgroundMusic('music', { fadeIn: 3000 });
      musicPlaying.current = true;
      hasEverStarted.current = true;
    }
  }, [playBackgroundMusic]);

  const stopAllMusic = useCallback(() => {
    // Use stopAllTracks from audioManager for clean stop
    stopAllTracks(1000);
    ambientPlaying.current = false;
    musicPlaying.current = false;
    console.log('[Audio] Stopped all music');
  }, []);

  // Force start all music - bypasses mute check
  // Used when user clicks sound button (OFF → ON)
  const forceStartAllMusic = useCallback(() => {
    // Reset refs to allow restart
    ambientPlaying.current = false;
    musicPlaying.current = false;

    // Play both tracks - audioManager now supports multiple simultaneous tracks
    playMusic('ambient', { volume: 0.35, fadeIn: 1500 });
    playMusic('music', { volume: 0.4, fadeIn: 2000 });

    ambientPlaying.current = true;
    musicPlaying.current = true;
    hasEverStarted.current = true;
    console.log('[Audio] Force started all music (ambient + main theme)');
  }, []);

  // Check if music has ever been started
  const hasMusicStarted = useCallback(() => hasEverStarted.current, []);

  return {
    startAmbient,
    startMainTheme,
    stopAllMusic,
    pauseMusic,
    resumeMusic,
    forceStartAllMusic,
    hasMusicStarted,
  };
};

export default useAudio;
