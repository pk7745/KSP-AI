export type AnimationState = 
  | 'idle'
  | 'talk'
  | 'wave'
  | 'salute'
  | 'thinking'
  | 'point'
  | 'greeting'
  | 'hidden';

export const ANIMATION_STATES: Record<AnimationState, string> = {
  idle: 'idle',
  talk: 'talk',
  wave: 'wave',
  salute: 'salute',
  thinking: 'thinking',
  point: 'point',
  greeting: 'greeting',
  hidden: 'hidden'
};

export function getAnimationClass(state: AnimationState): string {
  switch (state) {
    case 'talk':
      return 'animate-pulse scale-102';
    case 'wave':
    case 'greeting':
      return 'translate-y--1 rotate-1 scale-102';
    case 'salute':
      return 'translate-y--2 scale-103';
    case 'thinking':
      return 'rotate--2 scale-98';
    case 'point':
      return 'translate-x-2';
    case 'hidden':
      return 'opacity-0 pointer-events-none scale-75';
    case 'idle':
    default:
      return 'scale-100';
  }
}
