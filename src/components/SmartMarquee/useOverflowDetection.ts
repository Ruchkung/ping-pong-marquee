import { useEffect, useState, type RefObject } from 'react';

interface OverflowInfo {
  isOverflowing: boolean;
  overflowAmount: number;
}

export function useOverflowDetection(
  containerRef: RefObject<HTMLDivElement | null>,
  textRef: RefObject<HTMLSpanElement | null>,
): OverflowInfo {
  const [overflow, setOverflow] = useState<OverflowInfo>({
    isOverflowing: false,
    overflowAmount: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const measure = () => {
      const textWidth = text.scrollWidth;
      const style = getComputedStyle(container);
      const innerWidth =
        container.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const amount = textWidth - innerWidth;
      setOverflow({
        isOverflowing: amount > 0,
        overflowAmount: Math.max(0, amount),
      });
    };

    // Initial measurement
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(text);

    return () => observer.disconnect();
  // containerRef and textRef are stable useRef objects — their identity never changes,
  // so [] is correct here. The ResizeObserver is set up once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return overflow;
}
