# ping-pong-marquee

A smart ping-pong marquee React component with an airport departure board aesthetic. Text only scrolls when it overflows its container — bouncing back and forth instead of looping infinitely.

## Features

- **Overflow-aware** — text stays static when it fits, animates only when it overflows
- **Ping-pong motion** — slides left to reveal the end, pauses, slides back, pauses, repeats
- **Hover mode** — optional `hoverOnly` prop keeps text static until hovered
- **Resize-reactive** — `ResizeObserver` recalculates on container or text size changes
- **60fps** — uses CSS `transform: translateX()` with transitions (compositor-only, zero layout thrashing)
- **SSR-compatible** — renders as styled static text on the server, animates after hydration
- **i18n-ready** — tested with Thai script (stacking marks, ascenders/descenders)
- **Zero dependencies** — no animation libraries, just React + CSS transitions

## Quick Start

```bash
npm install
npm run dev
```

## Usage

```tsx
import { SmartMarquee } from './components/SmartMarquee';

// Auto-animating
<SmartMarquee text="Flight AA-2847 — Tokyo Narita (NRT) → Los Angeles (LAX) — Gate B42" />

// Only animate on hover
<SmartMarquee text="Long text..." hoverOnly />

// Custom speed and pause
<SmartMarquee text="Long text..." speed={100} pauseDuration={2000} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | *required* | Text content to display |
| `speed` | `number` | `50` | Scroll speed in pixels per second |
| `pauseDuration` | `number` | `1000` | Pause at each end in milliseconds |
| `hoverOnly` | `boolean` | `false` | Only animate while hovered |
| `className` | `string` | — | Additional CSS class for the container |

## Architecture

```
src/components/SmartMarquee/
  types.ts                  # SmartMarqueeProps, AnimationState
  useOverflowDetection.ts   # ResizeObserver hook → { isOverflowing, overflowAmount }
  useMarqueeAnimation.ts    # State machine (useReducer) → { translateX, transitionDuration }
  SmartMarquee.tsx           # Main component
  SmartMarquee.module.css    # Airport board styling
  index.ts                   # Barrel export
```

### Animation State Machine

```
IDLE → PAUSED_RIGHT → MOVING_LEFT → PAUSED_LEFT → MOVING_RIGHT → PAUSED_RIGHT → ...
```

All transitions are CSS-driven. JavaScript only runs at state boundaries (~5 dispatches per full cycle) via `setTimeout` matched to transition durations.

### How Overflow Detection Works

A `ResizeObserver` watches both the container and the text span. The overflow amount is calculated as:

```
overflowAmount = textScrollWidth - (containerClientWidth - paddingLeft - paddingRight)
```

This accounts for container padding so the text scrolls exactly to reveal the last character with symmetric spacing on both sides.

## Tech Stack

- React 19 + TypeScript
- Vite
- CSS Modules

## License

MIT
