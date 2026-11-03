import { useMemo } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { encode } from "uqr";
import { DAY_NAMES, hubById } from "../lib/api.js";

export const cardUrl = (id) => `${location.origin}/c/${id}`;

// The member's calling card. Front: who they are. Back: a QR that opens the card on any phone.
// On a fine pointer the card tilts toward the cursor on a spring (decorative, so it may move).
export default function DigitalCard({ member, flipped = false, className = "" }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 18, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const sheen = useTransform([px, py], ([x, y]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgb(244 239 228 / 0.09), transparent 60%)`);

  function onMove(e) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  const onLeave = () => (px.set(0.5), py.set(0.5));

  const hub = hubById(member.hub);
  const face = "absolute inset-0 overflow-hidden rounded-[1.5rem] [backface-visibility:hidden]";

  return (
    <div className={`[perspective:1600px] ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="[transform-style:preserve-3d]">
        <div
          className="relative aspect-[1.66/1] w-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] [transform-style:preserve-3d]"
          style={{ transform: flipped && !reduce ? "rotateY(180deg)" : "none" }}
        >
          {/* front */}
          <div
            className={`${face} surface flex flex-col justify-between border-gold/25 p-5 transition-opacity duration-300 sm:p-7`}
            style={{ opacity: reduce && flipped ? 0 : 1 }}
            aria-hidden={flipped}
          >
            <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} aria-hidden="true" />
            {/* gold hairline frame, inset like a letterpress border */}
            <div className="pointer-events-none absolute inset-2.5 rounded-[1.1rem] border border-gold/15" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-3">
              <span className="font-display grid h-7 w-9 place-items-center rounded-md bg-gold text-[13px] leading-none font-bold text-ink" aria-hidden="true">
                BBH
              </span>
              <span className="tnum caption-5 font-mono text-mute">{member.id ?? "BBH-····"}</span>
            </div>
            <div className="relative min-w-0">
              <p className={`serif-2 sm:serif-1 truncate ${member.name ? "text-cream" : "text-faint"}`}>{member.name || "Your name"}</p>
              <p className={`body-6 sm:body-3 mt-1 truncate ${member.business ? "text-mute" : "text-faint"}`}>
                {[member.title, member.business].filter(Boolean).join(", ") || "Title, Business"}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-gold/20 pt-3">
                <p className="label truncate text-[10px] text-gold">{member.industry || "Field of business"}</p>
                <p className="caption-5 shrink-0 text-mute">{hub ? `${hub.name} · ${DAY_NAMES[hub.day].slice(0, 3)}` : "Your hub"}</p>
              </div>
            </div>
          </div>

          {/* back: the QR */}
          <div
            className={`${face} surface flex items-center gap-5 border-gold/25 p-5 transition-opacity duration-300 sm:gap-7 sm:p-7`}
            style={{ transform: reduce ? "none" : "rotateY(180deg)", opacity: reduce && !flipped ? 0 : 1 }}
            aria-hidden={!flipped}
          >
            <div className="aspect-square h-full shrink-0 rounded-xl bg-cream p-2.5">{member.id && <Qr value={cardUrl(member.id)} />}</div>
            <div className="min-w-0">
              <p className="label text-[10px] text-gold">Scan to save</p>
              <p className="serif-3 sm:serif-2 mt-2 text-cream">{member.name ? `${member.name.split(" ")[0]}’s card` : "Your card"}</p>
              <p className="caption-5 mt-2 break-all text-mute">{member.id ? cardUrl(member.id).replace(/^https?:\/\//, "") : ""}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Qr({ value, className = "" }) {
  const path = useMemo(() => {
    const { data } = encode(value, { border: 0, ecc: "M" });
    let d = "";
    data.forEach((row, y) => row.forEach((on, x) => on && (d += `M${x} ${y}h1v1h-1z`)));
    return { d, n: data.length };
  }, [value]);
  return (
    <svg viewBox={`0 0 ${path.n} ${path.n}`} className={`block size-full ${className}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${value}`}>
      <path d={path.d} fill="#15120c" />
    </svg>
  );
}

// A contact file phones open straight into "Add contact".
export function vcard(m) {
  const esc = (s = "") => String(s).replace(/([,;\\])/g, "\\$1").replace(/\r\n|\r|\n/g, "\\n"); // no line breaks, so a field can't add vCard lines
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(m.name)}`,
    `N:${esc(m.name.split(" ").slice(-1)[0])};${esc(m.name.split(" ").slice(0, -1).join(" "))};;;`,
    m.business && `ORG:${esc(m.business)}`,
    m.title && `TITLE:${esc(m.title)}`,
    m.phone && `TEL;TYPE=CELL:${esc(m.phone)}`,
    m.email && `EMAIL:${esc(m.email)}`,
    m.website && `URL:https://${esc(m.website)}`,
    `NOTE:${esc(`Met at Business Breakfast Hub${hubById(m.hub) ? `, ${hubById(m.hub).name}` : ""}`)}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadVcard(m) {
  const url = URL.createObjectURL(new Blob([vcard(m)], { type: "text/vcard" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: `${m.name.replace(/\s+/g, "-")}.vcf` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
