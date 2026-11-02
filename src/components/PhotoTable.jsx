import { useState } from "react";
import { Link } from "../lib/router.jsx";

// The hero table: a real top-down photo of a set breakfast table, with a live marker on each
// place setting. Taken places show who sits there; open places breathe in ochre and lead to /join.
// Photo: Martin Baron on Unsplash (Unsplash License). Swap for a photo of a real BBH breakfast later.

// Where each place setting sits in the photo (% of width/height), and which seat it is.
const PLACES = [
  { seat: 0, x: 11, y: 12 },
  { seat: 3, x: 72.5, y: 12 },
  { seat: 7, x: 9.5, y: 84 },
  { seat: 5, x: 71, y: 86 },
];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function PhotoTable({ seats, className = "" }) {
  const [active, setActive] = useState(null);

  return (
    <figure className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-paper-2 shadow-[0_30px_60px_-30px_rgb(21_19_15/0.45)]">
        <img
          src="/img/table-sm.jpg"
          srcSet="/img/table-sm.jpg 900w, /img/table.jpg 2000w"
          sizes="(min-width: 1024px) 50vw, 100vw"
          width="2000"
          height="1333"
          alt="A wooden breakfast table seen from above, set for four with plates, cups, bread and jam."
          className="block aspect-[3/2] h-auto w-full object-cover"
          fetchPriority="high"
        />
        {/* a light veil so the markers read on busy wood */}
        <div className="absolute inset-0 bg-ink/5" aria-hidden="true" />
      </div>

      <ul className="absolute inset-0" aria-label="Seats at this table">
        {PLACES.map((p, n) => {
          const s = seats[p.seat];
          const open = !s;
          const below = p.y < 50;
          const label = open ? `Open seat ${p.seat + 1}. Reserve it.` : `${s.you ? "Your seat" : s.name}, ${s.business}, ${s.area}.${s.you ? "" : " Sample member."}`;
          const show = active === n;
          return (
            <li key={p.seat} className="set-down absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${300 + n * 90}ms` }}>
              {open ? (
                <Link
                  to={`/join?seat=${p.seat + 1}`}
                  aria-label={label}
                  className="group relative grid size-14 place-items-center rounded-full sm:size-16"
                  onPointerEnter={() => setActive(n)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(n)}
                  onBlur={() => setActive(null)}
                >
                  <svg viewBox="0 0 64 64" className="absolute inset-0 overflow-visible" aria-hidden="true">
                    <circle className="seat-open-ring" cx="32" cy="32" r="30" fill="none" stroke="#d39b2a" strokeWidth="2.5" />
                  </svg>
                  <span className="caption-3 rounded-full bg-ochre px-2 py-1 text-ink shadow-sm transition-transform duration-200 group-hover:scale-105">Open</span>
                </Link>
              ) : (
                <button
                  type="button"
                  aria-label={label}
                  className={`caption-3 grid size-10 place-items-center rounded-full ring-2 ring-paper/90 shadow-md transition-transform duration-200 hover:scale-105 ${s.you ? "bg-ochre text-ink" : "bg-ink text-paper"}`}
                  onPointerEnter={() => setActive(n)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(n)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(show ? null : n)}
                >
                  {initials(s.name)}
                </button>
              )}

              {show && (
                <div
                  role="status"
                  className={`surface pointer-events-none absolute left-1/2 z-10 w-max max-w-56 -translate-x-1/2 rounded-xl px-3 py-2 ${below ? "top-full mt-2" : "bottom-full mb-2"}`}
                >
                  {open ? (
                    <>
                      <p className="title-4 text-ink">Seat {p.seat + 1} is open</p>
                      <p className="caption-5 text-ink-2">Tap to reserve it</p>
                    </>
                  ) : (
                    <>
                      <p className="title-4 text-ink">{s.you ? `You, ${s.name}` : s.name}</p>
                      <p className="caption-5 text-ink-2">
                        {s.business} · {s.area}
                      </p>
                      <p className="caption-3 mt-1 text-ochre-ink">{s.you ? "Your seat" : "Sample member"}</p>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <figcaption className="caption-5 mt-3 flex flex-wrap justify-between gap-2 text-ink-2">
        <span>Tap a place to see who sits there.</span>
        <a href="https://unsplash.com/photos/iFR8hUWJYYs" target="_blank" rel="noreferrer" className="underline hover:text-ink">
          Photo: Martin Baron, Unsplash
        </a>
      </figcaption>
    </figure>
  );
}
