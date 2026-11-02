import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Adapted from VengeanceUI's AnimatedNumber (MIT, github.com/Ashutoshx7/VengeanceUI).
// Changes: JSX, motion/react, our ease, fixed 1em digit height via CSS instead of measuring,
// reduced motion shows the plain number. Each digit is a strip of 0-9 that rolls to its value,
// like a counter drum, so seat counts change as a physical event.

const DIGITS = Array.from({ length: 10 }, (_, k) => k);

export default function AnimatedNumber({ value, className = "" }) {
  const reduce = useReducedMotion();
  const text = String(value);
  if (reduce) return <span className={`tnum ${className}`}>{text}</span>;
  return (
    <span className={`tnum inline-flex leading-none ${className}`} aria-label={text} role="img">
      {text.split("").map((d, i) => (
        <Digit key={text.length - i} value={Number(d)} />
      ))}
    </span>
  );
}

function Digit({ value }) {
  const prev = useRef(value);
  const from = value - prev.current; // roll up when the number grows, down when it shrinks
  useEffect(() => {
    prev.current = value;
  }, [value]);

  return (
    <span className="relative inline-block h-[1em] overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="relative block"
          initial={{ y: `${from}em` }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute bottom-full left-0 flex flex-col">
            {DIGITS.filter((d) => d < value).map((d) => (
              <span key={d} className="h-[1em]">{d}</span>
            ))}
          </span>
          <span className="block h-[1em]">{value}</span>
          <span className="absolute top-full left-0 flex flex-col">
            {DIGITS.filter((d) => d > value).map((d) => (
              <span key={d} className="h-[1em]">{d}</span>
            ))}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
