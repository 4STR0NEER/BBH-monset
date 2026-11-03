import { cloneElement, useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";

export const EASE = [0.23, 1, 0.32, 1];

// The mark: "BBH" in condensed caps on a gold tile, as on BBH's own app and posts.
export function Logo({ className = "", full = true }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="font-display grid h-9 w-11 place-items-center rounded-[10px] bg-gold text-[17px] leading-none font-bold tracking-[0.02em] text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]" aria-hidden="true">
        BBH
      </span>
      {full && (
        <span aria-hidden="true" className="title-3 hidden text-cream sm:block">
          Business Breakfast Hub
        </span>
      )}
      <span className="sr-only">Business Breakfast Hub</span>
    </span>
  );
}

// Sections rise 24px and fade in once as they enter the viewport.
export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, transform: reduce ? "none" : "translateY(24px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Children rise one after another (50ms apart) when the list scrolls in.
export const stagger = {
  parent: { hidden: {}, show: { transition: { staggerChildren: 0.05 } } },
  child: (reduce) => ({
    hidden: { opacity: 0, transform: reduce ? "none" : "translateY(16px)" },
    show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, ease: EASE } },
  }),
};

// "Sample" tag for demo content, so nothing reads as a real claim.
export function Sample({ className = "" }) {
  return <span className={`label rounded-full border border-current/25 px-2 py-0.5 text-[10px] opacity-70 ${className}`}>Sample</span>;
}

export function Field({ id, label, hint, error, className = "", children }) {
  const uid = useId();
  const msg = `${uid}-msg`;
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="title-4 text-cream">
        {label}
      </label>
      <div className="relative mt-1.5">
        {cloneElement(children, {
          id: `f-${id}`,
          "aria-invalid": !!error || undefined,
          "aria-describedby": error || hint ? msg : undefined,
          className: "field",
        })}
        {children.type === "select" && <CaretDown size={14} weight="bold" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-gold" />}
      </div>
      {(error || hint) && (
        <p id={msg} className={`caption-5 mt-1.5 ${error ? "text-rust" : "text-mute"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export const initials = (n = "") => n.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
export const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Manila" });
