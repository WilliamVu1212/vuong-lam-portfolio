declare module 'nipplejs' {
  export interface JoystickOptions {
    zone?: HTMLElement;
    color?: string;
    size?: number;
    threshold?: number;
    fadeTime?: number;
    multitouch?: boolean;
    maxNumberOfNipples?: number;
    dataOnly?: boolean;
    position?: { top?: string; left?: string; bottom?: string; right?: string };
    mode?: 'static' | 'semi' | 'dynamic';
    restJoystick?: boolean | object;
    restOpacity?: number;
    lockX?: boolean;
    lockY?: boolean;
    catchDistance?: number;
    shape?: 'circle' | 'square';
    dynamicPage?: boolean;
    follow?: boolean;
  }

  export interface JoystickOutputData {
    identifier: number;
    position: { x: number; y: number };
    force: number;
    pressure: number;
    distance: number;
    angle: {
      radian: number;
      degree: number;
    };
    vector: { x: number; y: number };
    raw: { x: number; y: number; distance: number };
    instance: JoystickInstance;
    direction?: {
      x: 'left' | 'right' | null;
      y: 'up' | 'down' | null;
      angle: string;
    };
  }

  export interface JoystickInstance {
    el: HTMLElement;
    id: number;
    identifier: number;
    position: { x: number; y: number };
    frontPosition: { x: number; y: number };
    ui: {
      el: HTMLElement;
      front: HTMLElement;
      back: HTMLElement;
    };
    options: JoystickOptions;
    on: (
      event: 'start' | 'end' | 'move' | 'dir' | 'plain' | 'shown' | 'hidden' | 'pressure',
      callback: (evt: Event, data: JoystickOutputData) => void
    ) => void;
    off: (event: string, callback?: () => void) => void;
    destroy: () => void;
  }

  export interface JoystickManager {
    on: (
      event: 'start' | 'end' | 'move' | 'dir' | 'plain' | 'shown' | 'hidden' | 'pressure' | 'added' | 'removed',
      callback: (evt: Event, data: JoystickOutputData) => void
    ) => void;
    off: (event: string, callback?: () => void) => void;
    destroy: () => void;
    get: (identifier: number) => JoystickInstance | undefined;
    ids: number[];
    options: JoystickOptions;
  }

  export function create(options: JoystickOptions): JoystickManager;
}
