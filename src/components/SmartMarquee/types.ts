export type AnimationState =
  | 'IDLE'
  | 'MOVING_LEFT'
  | 'PAUSED_LEFT'
  | 'MOVING_RIGHT'
  | 'PAUSED_RIGHT';

export interface SmartMarqueeProps {
  text: string;
  /** Scroll speed in pixels per second (default: 50) */
  speed?: number;
  /** Pause duration at each end in milliseconds (default: 1000) */
  pauseDuration?: number;
  /** Only animate on hover (default: false) */
  hoverOnly?: boolean;
  /** Additional CSS class for the container */
  className?: string;
}
