import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "../lib/router.jsx";
import { Logo } from "./ui.jsx";
import { useUser } from "../lib/api.js";

const LINKS = [
  { to: "/#table", label: "The table" },
  { to: "/#mornings", label: "A morning" },
  { to: "/#board", label: "The board" },
  { to: "/#faq", label: "Questions" },
];
const EASE = [0.22, 1, 0.36, 1];

// Floating surface nameplate nav. On phones the menu opens as a full height glaze panel.
export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const user = useUser();
  const links = user ? LINKS.filter((l) => l.to !== "/#board") : LINKS; // members get the real board link

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <nav aria-label="Main" className="surface flex w-full max-w-4xl items-center gap-2 rounded-full bg-paper/90 py-1.5 pr-1.5 pl-4 backdrop-blur-md">
        <Link to="/" className="mr-auto rounded-full" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="title-4 rounded-full px-3 py-2 text-ink-2 transition-colors duration-300 hover:bg-paper-2 hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        {user ? (
          <>
            <Link to="/board" className="title-4 hidden rounded-full px-3 py-2 text-ink hover:underline sm:inline-flex">
              The board
            </Link>
            <Link to="/join" className="btn btn-plain button-sm gap-2 py-1 pr-3 pl-1" aria-label={`Your member card, ${user.name}`}>
              <span className="grid size-7 place-items-center rounded-full bg-ochre text-xs text-ink" aria-hidden="true">
                {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
              Your card
            </Link>
          </>
        ) : (
          <>
            <Link to="/join?mode=signin" className="title-4 hidden rounded-full px-3 py-2 text-ink hover:underline sm:inline-flex">
              Take your seat
            </Link>
            <Link to="/join" className="btn btn-primary button-sm px-4 py-2">
              Reserve a seat
            </Link>
          </>
        )}
        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {[-5, 5].map((y, i) => (
            <span
              key={y}
              className="absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: open ? `rotate(${i ? -45 : 45}deg)` : `translateY(${y / 2}px)` }}
            />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 -z-10 bg-paper/95 px-6 pt-28 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ul className="flex flex-col gap-2">
              {[...links, user ? { to: "/board", label: "The board" } : { to: "/join?mode=signin", label: "Take your seat" }].map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.5, ease: EASE }}
                >
                  <Link to={l.to} onClick={() => setOpen(false)} className="heading-4 block border-b-2 border-line py-3 text-ink">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
