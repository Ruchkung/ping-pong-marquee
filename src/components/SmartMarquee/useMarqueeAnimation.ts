import { useEffect, useReducer, useRef } from 'react';
import type { AnimationState } from './types';

interface MarqueeAnimationConfig {
  isOverflowing: boolean;
  overflowAmount: number;
  speed: number;
  pauseDuration: number;
  hoverOnly: boolean;
  isHovered: boolean;
}

interface MarqueeAnimationResult {
  translateX: number;
  transitionDuration: number;
}

interface State {
  phase: AnimationState;
  translateX: number;
  transitionDuration: number;
}

type Action =
  | { type: 'START' }
  | { type: 'MOVE_LEFT'; overflowAmount: number; duration: number }
  | { type: 'PAUSE_LEFT' }
  | { type: 'MOVE_RIGHT'; duration: number }
  | { type: 'PAUSE_RIGHT' }
  | { type: 'STOP' }
  | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return { phase: 'PAUSED_RIGHT', translateX: 0, transitionDuration: 0 };
    case 'MOVE_LEFT':
      return {
        phase: 'MOVING_LEFT',
        translateX: -action.overflowAmount,
        transitionDuration: action.duration,
      };
    case 'PAUSE_LEFT':
      return { ...state, phase: 'PAUSED_LEFT' };
    case 'MOVE_RIGHT':
      return {
        phase: 'MOVING_RIGHT',
        translateX: 0,
        transitionDuration: action.duration,
      };
    case 'PAUSE_RIGHT':
      return { ...state, phase: 'PAUSED_RIGHT' };
    case 'STOP':
      return { phase: 'IDLE', translateX: 0, transitionDuration: 300 };
    case 'RESET':
      return { phase: 'IDLE', translateX: 0, transitionDuration: 0 };
    default:
      return state;
  }
}

const initialState: State = {
  phase: 'IDLE',
  translateX: 0,
  transitionDuration: 0,
};

export function useMarqueeAnimation(
  config: MarqueeAnimationConfig,
): MarqueeAnimationResult {
  const { isOverflowing, overflowAmount, speed, pauseDuration, hoverOnly, isHovered } = config;
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOverflowRef = useRef(overflowAmount);

  const shouldAnimate = isOverflowing && (!hoverOnly || isHovered);
  const moveDuration = speed > 0 ? (overflowAmount / speed) * 1000 : 0;

  // Handle overflow amount changes — reset the cycle during render to avoid an extra render cycle
  if (prevOverflowRef.current !== overflowAmount) {
    prevOverflowRef.current = overflowAmount;
    if (state.phase !== 'IDLE') {
      dispatch({ type: 'RESET' });
    }
  }

  // Handle hover leave when hoverOnly is active
  useEffect(() => {
    if (hoverOnly && !isHovered && state.phase !== 'IDLE') {
      dispatch({ type: 'STOP' });
    }
  }, [hoverOnly, isHovered, state.phase]);

  // Main state machine driver
  useEffect(() => {
    if (!isOverflowing) {
      if (state.phase !== 'IDLE') dispatch({ type: 'RESET' });
      return;
    }

    if (!shouldAnimate) return;

    switch (state.phase) {
      case 'IDLE':
        dispatch({ type: 'START' });
        break;

      case 'PAUSED_RIGHT':
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'MOVE_LEFT', overflowAmount, duration: moveDuration });
        }, pauseDuration);
        break;

      case 'MOVING_LEFT':
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'PAUSE_LEFT' });
        }, moveDuration);
        break;

      case 'PAUSED_LEFT':
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'MOVE_RIGHT', duration: moveDuration });
        }, pauseDuration);
        break;

      case 'MOVING_RIGHT':
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'PAUSE_RIGHT' });
        }, moveDuration);
        break;
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state.phase, isOverflowing, shouldAnimate, overflowAmount, speed, pauseDuration]);

  return {
    translateX: state.translateX,
    transitionDuration: state.transitionDuration,
  };
}
