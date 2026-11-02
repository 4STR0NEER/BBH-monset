import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

// Adapted from Kokonut UI's Hold Button (MIT, github.com/kokonut-labs/kokonutui, @dorianbaffier).
// Changes: JSX, one surface style instead of five cva variants, icon passed in, no cn/lucide.
// Press and hold to confirm; an early release drains the fill back. Used for giving up a seat,
// so a stray tap can't cost someone their chair.

const EASE = [0.22, 1, 0.36, 1];
const HOLD_KEYS = new Set([" ", "Enter"]);

export default function HoldButton({ children, holdingLabel = "Keep holding", completeLabel = "Done", icon, holdDuration = 1200, onHoldComplete, disabled, className = "" }) {
  const [phase, setPhase] = useState("idle");
  const phaseRef = useRef("idle");
  const progress = useMotionValue(0);
  const anim = useRef(null);
  const reduce = useReducedMotion();
  const clipPath = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  useEffect(() => () => anim.current?.stop(), []);

  const set = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const start = () => {
    if (phaseRef.current !== "idle" || disabled) return;
    set("holding");
    anim.current?.stop();
    anim.current = animate(progress, 1, {
      duration: ((1 - progress.get()) * holdDuration) / 1000,
      ease: "linear", // the fill is a timer, so it moves at constant speed
      onComplete: () => {
        if (phaseRef.current !== "holding") return;
        set("complete");
        onHoldComplete?.();
      },
    });
  };

  const end = () => {
    if (phaseRef.current !== "holding") return;
    set("idle");
    anim.current?.stop();
    anim.current = animate(progress, 0, { duration: reduce ? 0 : progress.get() * 0.3, ease: EASE });
  };

  const label = phase === "holding" ? holdingLabel : phase === "complete" ? completeLabel : children;

  return (
    <button
      type="button"
      disabled={disabled}
      data-complete={phase === "complete" || undefined}
      className={`group relative inline-flex h-11 min-w-48 touch-none items-center justify-center overflow-hidden rounded-full border-[1.5px] border-current/40 bg-transparent px-4 select-none [-webkit-touch-callout:none] transition-colors duration-200 disabled:opacity-50 data-complete:border-ochre data-complete:bg-ochre data-complete:text-ink ${className}`}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={end}
      onPointerLeave={end}
      onPointerCancel={end}
      onBlur={end}
      onKeyDown={(e) => {
        if (!HOLD_KEYS.has(e.key)) return;
        e.preventDefault();
        if (!e.repeat) start();
      }}
      onKeyUp={(e) => HOLD_KEYS.has(e.key) && end()}
    >
      <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-current/15 group-data-complete:opacity-0" style={{ clipPath }} />
      <span className="button-sm relative flex items-center overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={phase}
            className="inline-flex items-center gap-2 whitespace-nowrap"
            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {phase !== "complete" && icon}
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-live="polite" className="sr-only">
        {phase === "complete" ? completeLabel : ""}
      </span>
    </button>
  );
}
