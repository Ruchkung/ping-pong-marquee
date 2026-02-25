import { useCallback, useRef, useState } from 'react';
import type { SmartMarqueeProps } from './types';
import { useOverflowDetection } from './useOverflowDetection';
import { useMarqueeAnimation } from './useMarqueeAnimation';
import styles from './SmartMarquee.module.css';

export function SmartMarquee({
  text,
  speed = 50,
  pauseDuration = 1000,
  hoverOnly = false,
  className,
}: SmartMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { isOverflowing, overflowAmount } = useOverflowDetection(containerRef, textRef);

  const { translateX, transitionDuration } = useMarqueeAnimation({
    isOverflowing,
    overflowAmount,
    speed,
    pauseDuration,
    hoverOnly,
    isHovered,
  });

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const textStyle: React.CSSProperties = {
    transform: `translateX(${translateX}px)`,
    transition:
      transitionDuration > 0
        ? `transform ${transitionDuration}ms linear`
        : 'none',
    willChange: isOverflowing ? 'transform' : 'auto',
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container}${className ? ` ${className}` : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={textRef} className={styles.text} style={textStyle}>
        {text}
      </span>
    </div>
  );
}
