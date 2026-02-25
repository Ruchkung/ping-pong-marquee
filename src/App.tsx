import { useState } from 'react';
import { SmartMarquee } from './components/SmartMarquee';
import styles from './App.module.css';

const LONG_TEXT =
  'Flight AA-2847 — Tokyo Narita (NRT) → Los Angeles International (LAX) — Gate B42 — Boarding at 14:35 — Status: ON TIME';
const SHORT_TEXT = 'Gate B12 — On Time';
const THAI_LONG =
  'เที่ยวบิน TG-672 — ท่าอากาศยานสุวรรณภูมิ (BKK) → ท่าอากาศยานนานาชาติเชียงใหม่ (CNX) — ประตู C8 — ขึ้นเครื่อง 14:35 น. — สถานะ: ตรงเวลา';
const THAI_SHORT = 'ประตู A3 — ตรงเวลา';

function App() {
  const [dynamicText, setDynamicText] = useState(
    'Type here to see the marquee react to dynamic text changes...',
  );

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>SmartMarquee</h1>
      <p className={styles.subtitle}>Airport departure board ping-pong text</p>

      <div className={styles.demos}>
        {/* 1. Short text — no overflow, stays static */}
        <div className={styles.section}>
          <span className={styles.label}>Short text (no overflow — static)</span>
          <SmartMarquee text={SHORT_TEXT} />
        </div>

        {/* 2. Long text — auto-animating */}
        <div className={styles.section}>
          <span className={styles.label}>Long text (auto ping-pong)</span>
          <SmartMarquee text={LONG_TEXT} />
        </div>

        {/* 3. Hover only */}
        <div className={styles.section}>
          <span className={styles.label}>Hover to animate</span>
          <SmartMarquee text={LONG_TEXT} hoverOnly />
        </div>

        {/* 4. Fast speed */}
        <div className={styles.section}>
          <span className={styles.label}>Fast speed (150 px/s)</span>
          <SmartMarquee text={LONG_TEXT} speed={150} />
        </div>

        {/* 5. Slow speed, long pause */}
        <div className={styles.section}>
          <span className={styles.label}>Slow (25 px/s) + 3s pause</span>
          <SmartMarquee text={LONG_TEXT} speed={25} pauseDuration={3000} />
        </div>

        {/* 6. Resizable container */}
        <div className={styles.section}>
          <span className={styles.label}>Resizable container</span>
          <span className={styles.resizableHint}>
            Drag the right edge to resize
          </span>
          <div className={styles.resizable}>
            <SmartMarquee text={LONG_TEXT} />
          </div>
        </div>

        {/* 7. Thai — short (no overflow) */}
        <div className={styles.section}>
          <span className={styles.label}>Thai short (no overflow — static)</span>
          <SmartMarquee text={THAI_SHORT} />
        </div>

        {/* 8. Thai — long (auto ping-pong) */}
        <div className={styles.section}>
          <span className={styles.label}>Thai long (auto ping-pong)</span>
          <SmartMarquee text={THAI_LONG} />
        </div>

        {/* 9. Thai — hover only */}
        <div className={styles.section}>
          <span className={styles.label}>Thai hover to animate</span>
          <SmartMarquee text={THAI_LONG} hoverOnly />
        </div>

        {/* 10. Dynamic text */}
        <div className={styles.section}>
          <span className={styles.label}>Dynamic text</span>
          <div className={styles.inputRow}>
            <input
              className={styles.textInput}
              type="text"
              value={dynamicText}
              onChange={(e) => setDynamicText(e.target.value)}
              placeholder="Type something..."
            />
            <SmartMarquee text={dynamicText} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
