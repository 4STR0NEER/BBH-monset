import { useReducedMotion } from "motion/react";
import { fmtDate, fmtTime } from "./ui.jsx";

// Front: the folded place card you fill in, updating as you type.
// Back: the surface member card it is fired into. `flipped` turns it over.
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
          className={`${face} surface flex flex-col overflow-hidden transition-opacity duration-300`}
          style={{ opacity: reduce && flipped ? 0 : 1 }}
          aria-hidden={flipped}
        >
          <div className="h-[16%] border-b border-dashed border-line bg-paper-2" />
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
            <div className="flex items-start justify-end gap-3">
              <p className="tnum caption-3 shrink-0 rounded-full border border-ink/40 px-2 py-0.5 font-mono text-ink">
                {seat ? `Seat ${seat}` : "Seat ·"}
              </p>
            </div>
            <div className="min-w-0">
              <p className={`heading-5 sm:heading-4 truncate ${card.name ? "text-ink" : "text-ink/30"}`}>{card.name || "Your name"}</p>
              <p className={`title-3 truncate ${card.business ? "text-ink" : "text-ink/30"}`}>{card.business || "Your business"}</p>
              <p className="caption-5 mt-1 truncate text-ink-2">{[card.industry, card.area].filter(Boolean).join(" · ") || "What you do · Where you are"}</p>
              {/* the plate rim, repeated as two hairlines along the foot of the card */}
              <div className="mt-4 space-y-1" aria-hidden="true">
                <div className="h-0.5 rounded-full bg-ochre" />
              </div>
              {/* the maker's mark at the foot of the card */}
              <p className="caption-3 mt-2 flex items-center gap-1.5 text-ochre-ink">
                <span className="font-mark grid h-5 w-8 place-items-center rounded-[5px] border border-ochre text-xs leading-none text-ink" aria-hidden="true">BBH</span>
                Business Breakfast Hub · Cebu
              </p>
            </div>
          </div>
        </div>

        {/* back: the member card */}
        <div
          className={`${face} panel-dark flex flex-col justify-between p-5 text-paper transition-opacity duration-300 sm:p-7`}
          style={{ transform: reduce ? "none" : "rotateY(180deg)", opacity: reduce && !flipped ? 0 : 1 }}
          aria-hidden={!flipped}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="title-4 flex items-center gap-2">
              <span className="font-mark grid h-6 w-8 place-items-center rounded-md border-[1.5px] border-ochre text-xs leading-none" aria-hidden="true">
                BBH
              </span>
              Member
            </p>
            <p className="tnum caption-3 font-mono text-paper/70">{card.memberNo}</p>
          </div>
          <div className="min-w-0">
            <p className="heading-5 sm:heading-4 truncate">{card.name}</p>
            <p className="title-3 truncate text-paper/70">{card.business}</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-2 border-t border-paper/20 pt-3">
            <p className="caption-5 text-paper/70">
              {card.breakfast ? (
                <>
                  Next breakfast · {fmtDate(card.breakfast)} · <span className="tnum font-mono">{fmtTime(card.breakfast)}</span>
                </>
              ) : (
                "Business Breakfast Hub · Cebu"
              )}
            </p>
            {seat && <p className="tnum caption-3 rounded-full bg-ochre px-2 py-0.5 font-mono text-ink">Seat {seat}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
