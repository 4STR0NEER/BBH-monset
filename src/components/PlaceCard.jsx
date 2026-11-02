import { useReducedMotion } from "motion/react";
import { fmtDate, fmtTime } from "./ui.jsx";

// Front: the folded place card you fill in, updating as you type.
// Back: the enamel member card it is fired into. `flipped` turns it over.
export default function PlaceCard({ card, flipped = false, className = "" }) {
  const reduce = useReducedMotion();
  const seat = card.seat != null ? card.seat + 1 : null;
  const face = "absolute inset-0 rounded-[1.75rem] [backface-visibility:hidden]";

  return (
    <div className={`[perspective:1400px] ${className}`}>
      <div
        className="relative aspect-[1.6/1] w-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] [transform-style:preserve-3d]"
        style={{ transform: flipped && !reduce ? "rotateY(180deg)" : "none" }}
      >
        {/* front: the place card */}
        <div
          className={`${face} enamel speckle flex flex-col overflow-hidden transition-opacity duration-300`}
          style={{ opacity: reduce && flipped ? 0 : 1 }}
          aria-hidden={flipped}
        >
          <div className="h-[16%] border-b-2 border-dashed border-cobalt-soft bg-enamel-2" />
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <p className="caption-3 tracking-wide text-cobalt uppercase">Business Breakfast Hub</p>
              <p className="tnum caption-3 shrink-0 rounded-full border-2 border-cobalt px-2 py-0.5 font-mono text-cobalt-deep">
                {seat ? `Seat ${seat}` : "Seat ·"}
              </p>
            </div>
            <div className="min-w-0">
              <p className={`heading-5 sm:heading-4 truncate ${card.name ? "text-ink" : "text-ink/30"}`}>{card.name || "Your name"}</p>
              <p className={`title-3 truncate ${card.business ? "text-cobalt-deep" : "text-ink/30"}`}>{card.business || "Your business"}</p>
              <p className="caption-5 mt-1 truncate text-ink-2">{[card.industry, card.area].filter(Boolean).join(" · ") || "What you do · Where you are"}</p>
              {/* the plate rim, repeated as two hairlines along the foot of the card */}
              <div className="mt-4 space-y-1" aria-hidden="true">
                <div className="h-[3px] rounded-full bg-cobalt" />
                <div className="h-px rounded-full bg-cobalt-soft" />
              </div>
            </div>
          </div>
        </div>

        {/* back: the member card */}
        <div
          className={`${face} enamel-cobalt speckle flex flex-col justify-between p-5 text-enamel transition-opacity duration-300 sm:p-7`}
          style={{ transform: reduce ? "none" : "rotateY(180deg)", opacity: reduce && !flipped ? 0 : 1 }}
          aria-hidden={!flipped}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="title-4">BBH member</p>
            <p className="tnum caption-3 font-mono text-cobalt-soft">{card.memberNo}</p>
          </div>
          <div className="min-w-0">
            <p className="heading-5 sm:heading-4 truncate">{card.name}</p>
            <p className="title-3 truncate text-cobalt-soft">{card.business}</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2 border-t-2 border-enamel/20 pt-3">
            <p className="caption-5 text-cobalt-soft">
              {card.breakfast ? (
                <>
                  Next breakfast · {fmtDate(card.breakfast)} · <span className="tnum font-mono">{fmtTime(card.breakfast)}</span>
                </>
              ) : (
                "Business Breakfast Hub · Cebu"
              )}
            </p>
            {seat && <p className="tnum caption-3 rounded-full bg-kettle px-2 py-0.5 font-mono">Seat {seat}</p>}
          </div>
          {/* a chip in the rim */}
          <svg viewBox="0 0 20 14" className="absolute top-6 -right-0.5 w-4" aria-hidden="true">
            <path d="M4 1c6-2 13 1 15 6-4 5-11 7-16 4-3-3-2-7 1-10z" fill="#15171c" />
          </svg>
        </div>
      </div>
    </div>
  );
}
