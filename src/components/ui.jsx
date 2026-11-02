import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

// The mark: "BBH" in a condensed sans inside a rounded square drawn in ochre line, as on BBH's page.
export function Logo({ className = "", tone = "ink" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`font-mark grid h-9 w-9 place-items-center rounded-[10px] border border-ochre text-[15px] leading-none font-semibold tracking-[0.02em] ${tone === "paper" ? "text-paper" : "text-ink"}`}
        aria-hidden="true"
      >
        BBH
      </span>
      <span aria-hidden="true" className={`title-4 hidden leading-tight sm:block ${tone === "paper" ? "text-paper" : "text-ink"}`}>
        Business
        <br />
        Breakfast Hub
      </span>
      <span className="sr-only">Business Breakfast Hub</span>
    </span>
  );
}

// Sections rise 32px and fade in once as they enter the viewport.
export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Big two-line tagline whose words darken one by one as it scrolls through the viewport.
export function TaglineReveal({ lines, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = lines.flatMap((l, li) => l.split(" ").map((w) => ({ w, li })));
  return (
    <p ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {words.map((x, i) =>
            x.li === li ? (
              <Word key={i} progress={scrollYProgress} at={i / words.length} span={1 / words.length} still={reduce}>
                {x.w}
              </Word>
            ) : null,
          )}
        </span>
      ))}
    </p>
  );
}

function Word({ progress, at, span, still, children }) {
  const opacity = useTransform(progress, [at, at + span], [0.28, 1], { ease: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <motion.span style={{ opacity: still ? 1 : opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

// "Sample" tag for demo content, so nothing reads as a real claim.
export function Sample({ className = "" }) {
  return <span className={`caption-3 rounded-full border border-current/30 px-2 py-0.5 opacity-80 ${className}`}>Sample</span>;
}

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Manila" });
export const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
