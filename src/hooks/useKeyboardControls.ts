import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { CONTROLS } from '@/utils/constants';

type ControlKey = keyof typeof CONTROLS.keyboard;

export function useKeyboardControls() {
  const setControl = useGameStore((state) => state.setControl);
  const resetControls = useGameStore((state) => state.resetControls);

  const getControlFromKey = useCallback((code: string): ControlKey | null => {
    for (const [control, keys] of Object.entries(CONTROLS.keyboard)) {
      if ((keys as readonly string[]).includes(code)) {
        return control as ControlKey;
      }
    }
    return null;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent default for game controls
      if (event.code === 'Space') {
        event.preventDefault();
      }

      const control = getControlFromKey(event.code);
      if (control && control !== 'pause') {
        // Map control names to store control names
        const controlMap: Record<string, keyof ReturnType<typeof useGameStore.getState>['controls']> = {
          forward: 'forward',
          backward: 'backward',
          left: 'left',
          right: 'right',
          jump: 'jump',
          ascend: 'ascend',
          descend: 'descend',
          interact: 'interact',
        };

        const mappedControl = controlMap[control];
        if (mappedControl) {
          setControl(mappedControl, true);
        }
      }
    },
    [getControlFromKey, setControl]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const control = getControlFromKey(event.code);
      if (control && control !== 'pause') {
        const controlMap: Record<string, keyof ReturnType<typeof useGameStore.getState>['controls']> = {
          forward: 'forward',
          backward: 'backward',
          left: 'left',
          right: 'right',
          jump: 'jump',
          ascend: 'ascend',
          descend: 'descend',
          interact: 'interact',
        };

        const mappedControl = controlMap[control];
        if (mappedControl) {
          setControl(mappedControl, false);
        }
      }
    },
    [getControlFromKey, setControl]
  );

  // Handle window blur - reset all controls
  const handleBlur = useCallback(() => {
    resetControls();
  }, [resetControls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);
}

// Hook to get current controls state
export function useControls() {
  return useGameStore((state) => state.controls);
}
