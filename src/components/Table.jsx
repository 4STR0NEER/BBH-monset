import { useState } from "react";
import { navigate } from "../lib/router.jsx";

// The breakfast table seen from above: a round cobalt enamel table, a white enamel plate and
// mug at every seat, the kettle and a bilao of pan de sal in the middle.
// Taken seats show who sits there; open seats breathe and lead to /join.

const S = 640; // viewBox size
const C = S / 2;
const polar = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function Table({ seats, onPick, className = "" }) {
  const pick = (i) => (onPick ? onPick(i) : navigate(`/join?seat=${i + 1}`));
  const [active, setActive] = useState(null);
  const step = (Math.PI * 2) / seats.length;
  const angleOf = (i) => -Math.PI / 2 + step * i + step / 2;

  // CSS animation (index.css .set-down): runs off the main thread, so the table sets itself
  // even while the page is still loading.
  const enter = (i) => ({ className: "set-down", style: { animationDelay: `${250 + i * 60}ms` } });

  const tip = active != null && seats[active] ? seats[active] : null;
  const [tx, ty] = active != null ? polar(272, angleOf(active)) : [0, 0];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${S} ${S}`} className="block h-auto w-full overflow-visible" role="group" aria-label="The breakfast table. Taken seats show sample members; open seats can be reserved.">
        <defs>
          <pattern id="tspeck" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="14" r="0.9" fill="#fff" fillOpacity=".22" />
            <circle cx="41" cy="33" r="0.7" fill="#fff" fillOpacity=".18" />
            <circle cx="22" cy="51" r="0.6" fill="#fff" fillOpacity=".2" />
          </pattern>
        </defs>

        {/* chairs first, so the table edge overlaps them */}
        {seats.map((s, i) => {
          const a = angleOf(i);
          const [x, y] = polar(262, a);
          const deg = (a * 180) / Math.PI + 90;
          const open = !s;
          return (
            <g key={`chair${i}`} {...enter(i)}>
              <g transform={`rotate(${deg} ${x} ${y})`}>
                <rect x={x - 34} y={y - 26} width="68" height="56" rx="16" fill="#fbfcfd" stroke="#1f3fa3" strokeWidth="3" strokeDasharray={open ? "7 6" : undefined} />
                <rect x={x - 26} y={y + 14} width="52" height="10" rx="5" fill={open ? "#eef2f7" : "#dde4ee"} />
              </g>
              {!open && (
                <g>
                  <circle cx={x} cy={y} r="19" fill={s.you ? "#c6361d" : "#142b78"} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#fbfcfd" letterSpacing=".04em">
                    {initials(s.name)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* the table */}
        <circle cx={C} cy={C} r="218" fill="#142b78" />
        <circle cx={C} cy={C} r="212" fill="#1f3fa3" />
        <circle cx={C} cy={C} r="212" fill="url(#tspeck)" />
        <circle cx={C} cy={C} r="200" fill="none" stroke="#fbfcfd" strokeOpacity=".85" strokeWidth="3" />
        {/* chips in the rim, bare steel showing */}
        <path d="M486 196c6-2 11 1 13 5-3 4-9 6-14 4-2-3-2-6 1-9z" fill="#15171c" />
        <path d="M150 452c4-3 9-2 11 2-2 4-6 6-10 5-3-2-3-5-1-7z" fill="#15171c" />

        {/* bilao of pan de sal */}
        <g>
          <circle cx="262" cy="330" r="50" fill="#b98a55" />
          <circle cx="262" cy="330" r="50" fill="none" stroke="#8a6234" strokeWidth="4" strokeDasharray="2 5" />
          {[[-18, -14], [6, -20], [22, 0], [-4, 6], [-24, 12], [10, 22]].map(([dx, dy], k) => (
            <ellipse key={k} cx={262 + dx} cy={330 + dy} rx="11" ry="9" fill="#c98b4f" stroke="#9c6230" strokeWidth="1.5" />
          ))}
        </g>
        {/* the red enamel kettle */}
        <g>
          <path d="M392 262 l26 -14" stroke="#a42a14" strokeWidth="10" strokeLinecap="round" />
          <circle cx="378" cy="292" r="38" fill="#c6361d" stroke="#a42a14" strokeWidth="3" />
          <circle cx="378" cy="292" r="18" fill="#d9573f" />
          <circle cx="378" cy="292" r="6" fill="#15171c" />
          <path d="M346 316 q32 30 64 0" fill="none" stroke="#15171c" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* plates and mugs */}
        {seats.map((s, i) => {
          const a = angleOf(i);
          const [px, py] = polar(156, a);
          const [mx, my] = polar(160, a + step * 0.38);
          const open = !s;
          return (
            <g key={`plate${i}`} {...enter(i)}>
              <circle cx={px} cy={py} r="36" fill="#fbfcfd" stroke={open ? "#c6361d" : "#142b78"} strokeWidth="4" strokeDasharray={open ? "8 6" : undefined} />
              <circle cx={px} cy={py} r="25" fill="none" stroke="#dde4ee" strokeWidth="2" />
              {open ? (
                <circle className="seat-open-ring" cx={px} cy={py} r="44" fill="none" stroke="#c6361d" strokeWidth="2.5" />
              ) : (
                <>
                  <ellipse cx={px - 6} cy={py + 2} rx="10" ry="8" fill="#c98b4f" stroke="#9c6230" strokeWidth="1.5" />
                  <ellipse cx={px + 9} cy={py - 5} rx="8" ry="7" fill="#c98b4f" stroke="#9c6230" strokeWidth="1.5" />
                  <circle cx={mx} cy={my} r="13" fill="#fbfcfd" stroke="#142b78" strokeWidth="3" />
                  <circle cx={mx} cy={my} r="8" fill="#4a2c1d" />
                </>
              )}
            </g>
          );
        })}

        {/* hit areas: one per seat, over chair and plate */}
        {seats.map((s, i) => {
          const [hx, hy] = polar(212, angleOf(i));
          const label = s ? `${s.you ? "Your seat" : s.name}, ${s.business}, ${s.area}.${s.you ? "" : " Sample member."}` : `Open seat ${i + 1}. ${onPick ? "Choose it." : "Reserve it."}`;
          return (
            <circle
              key={`hit${i}`}
              cx={hx}
              cy={hy}
              r="62"
              fill="transparent"
              role="button"
              tabIndex={0}
              aria-label={label}
              className="cursor-pointer outline-none"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => (s && !s.you ? setActive(i) : pick(i))}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && (!s || s.you)) {
                  e.preventDefault();
                  pick(i);
                }
              }}
            />
          );
        })}
        {active != null && (
          <circle cx={polar(212, angleOf(active))[0]} cy={polar(212, angleOf(active))[1]} r="66" fill="none" stroke="#1f3fa3" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" pointerEvents="none" />
        )}
      </svg>

      {/* seat card, an enamel nameplate that sits outside the chair */}
      {active != null && (
        <div
          className="enamel pointer-events-none absolute z-10 w-max max-w-56 -translate-x-1/2 -translate-y-1/2 rounded-xl px-3 py-2"
          style={{ left: `${(tx / S) * 100}%`, top: `${(ty / S) * 100}%` }}
          role="status"
        >
          {tip ? (
            <>
              <p className="title-4 text-ink">{tip.you ? `You, ${tip.name}` : tip.name}</p>
              <p className="caption-5 text-ink-2">
                {tip.business} · {tip.area}
              </p>
              <p className={`caption-3 mt-1 ${tip.you ? "text-kettle-deep" : "text-cobalt"}`}>{tip.you ? "Your seat" : "Sample member"}</p>
            </>
          ) : (
            <>
              <p className="title-4 text-kettle-deep">This seat is open</p>
              <p className="caption-5 text-ink-2">{onPick ? "Tap to sit here" : "Tap to reserve it"}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
