import { useState } from "react";
import { navigate } from "../lib/router.jsx";

// The seat picker on /join: the breakfast table drawn as a fine line floor plan, the way an
// architect draws a dining room. Thin black lines, a plate and cup per place, ochre for open
// seats and for you. Taken seats show who sits there.

const S = 640; // viewBox size
const C = S / 2;
const polar = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);
const INK = "#15130f";
const OCHRE = "#d39b2a";
const LINE = "#b9b4a6";

export default function Table({ seats, onPick, className = "" }) {
  const [active, setActive] = useState(null);
  const pick = (i) => (onPick ? onPick(i) : navigate(`/join?seat=${i + 1}`));
  const step = (Math.PI * 2) / seats.length;
  const angleOf = (i) => -Math.PI / 2 + step * i + step / 2;
  const enter = (i) => ({ className: "set-down", style: { animationDelay: `${150 + i * 50}ms` } });

  const tip = active != null && seats[active] ? seats[active] : null;
  const [tx, ty] = active != null ? polar(286, angleOf(active)) : [0, 0];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${S} ${S}`} className="block h-auto w-full overflow-visible" role="group" aria-label="Floor plan of the breakfast table. Open seats can be chosen.">
        {/* table top: one confident line, a hairline inset */}
        <circle cx={C} cy={C} r="196" fill="#fbfaf7" stroke={INK} strokeWidth="2" />
        <circle cx={C} cy={C} r="186" fill="none" stroke={LINE} strokeWidth="1" />
        {/* a runner, the shared kettle and bread, drawn as plan symbols */}
        <rect x={C - 120} y={C - 26} width="240" height="52" rx="4" fill="none" stroke={LINE} strokeWidth="1" />
        <circle cx={C - 40} cy={C} r="20" fill="none" stroke={LINE} strokeWidth="1" />
        <circle cx={C + 42} cy={C} r="14" fill="none" stroke={LINE} strokeWidth="1" />
        <path d={`M${C + 56} ${C - 4} l14 -8`} stroke={LINE} strokeWidth="1" />

        {seats.map((s, i) => {
          const a = angleOf(i);
          const open = !s;
          const you = s?.you;
          const [cx, cy] = polar(250, a); // chair
          const [px, py] = polar(148, a); // plate
          const [mx, my] = polar(150, a + step * 0.32); // cup
          const deg = (a * 180) / Math.PI + 90;
          const stroke = open || you ? OCHRE : INK;
          return (
            <g key={i} {...enter(i)}>
              <g transform={`rotate(${deg} ${cx} ${cy})`}>
                <rect x={cx - 30} y={cy - 24} width="60" height="50" rx="10" fill={you ? OCHRE : "#fbfaf7"} stroke={stroke} strokeWidth="1.5" strokeDasharray={open ? "5 4" : undefined} />
                <path d={`M${cx - 24} ${cy + 18} h48`} stroke={you ? INK : stroke} strokeOpacity=".5" strokeWidth="1" />
              </g>
              <circle cx={px} cy={py} r="30" fill="none" stroke={open ? OCHRE : INK} strokeWidth="1.25" />
              <circle cx={px} cy={py} r="21" fill="none" stroke={LINE} strokeWidth="1" />
              <circle cx={mx} cy={my} r="9" fill="none" stroke={open ? OCHRE : INK} strokeWidth="1.25" />
              {open ? (
                <circle className="seat-open-ring" cx={cx} cy={cy} r="40" fill="none" stroke={OCHRE} strokeWidth="1.5" />
              ) : (
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="500" fill={INK} letterSpacing=".04em">
                  {initials(s.name)}
                </text>
              )}
              <text x={polar(300, a)[0]} y={polar(300, a)[1] + 4} textAnchor="middle" fontSize="11" fill="#514c43" fontFamily="Geist Mono Variable, monospace">
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* hit areas */}
        {seats.map((s, i) => {
          const [hx, hy] = polar(220, angleOf(i));
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
          <circle cx={polar(220, angleOf(active))[0]} cy={polar(220, angleOf(active))[1]} r="64" fill="none" stroke={INK} strokeWidth="1.25" strokeDasharray="2 5" strokeLinecap="round" pointerEvents="none" />
        )}
      </svg>

      {active != null && (
        <div
          className="surface pointer-events-none absolute z-10 w-max max-w-56 -translate-x-1/2 -translate-y-1/2 rounded-xl px-3 py-2"
          style={{ left: `${(tx / S) * 100}%`, top: `${(ty / S) * 100}%` }}
          role="status"
        >
          {tip ? (
            <>
              <p className="title-4 text-ink">{tip.you ? `You, ${tip.name}` : tip.name}</p>
              <p className="caption-5 text-ink-2">
                {tip.business} · {tip.area}
              </p>
              <p className="caption-3 mt-1 text-ochre-ink">{tip.you ? "Your seat" : "Sample member"}</p>
            </>
          ) : (
            <>
              <p className="title-4 text-ink">Seat {active + 1} is open</p>
              <p className="caption-5 text-ink-2">{onPick ? "Tap to sit here" : "Tap to reserve it"}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
