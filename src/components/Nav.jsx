import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "../lib/router.jsx";
import { EASE, Logo, initials } from "./ui.jsx";
import { isAdmin, useUser } from "../lib/api.js";

const LINKS = [
  { to: "/#hubs", label: "Hubs" },
  { to: "/#deals", label: "Deals" },
  { to: "/#card", label: "Your card" },
];

// Floating dark glass pill. On phones the menu opens as a full height panel.
export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const user = useUser();
  const admin = isAdmin(user);

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

  const mobile = [...LINKS, user ? (admin ? { to: "/admin", label: "Admin" } : { to: "/card", label: "My card" }) : { to: "/join?mode=signin", label: "Sign in" }];

  return (
    <header className="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex justify-center px-[max(1rem,env(safe-area-inset-left))]">
      <nav aria-label="Main" className="flex w-full max-w-5xl items-center gap-1 rounded-full border border-cream/10 bg-night/70 py-1.5 pr-1.5 pl-2 shadow-[0_20px_40px_-24px_rgb(0_0_0/0.9)] backdrop-blur-xl">
        <Link to="/" className="mr-auto rounded-full" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <ul className="hidden items-center md:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="title-4 rounded-full px-3.5 py-2 text-mute transition-colors duration-200 hover:text-cream">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        {user ? (
          admin ? (
            <Link to="/admin" className="btn btn-line title-4 min-h-10 px-4">
              Admin
            </Link>
          ) : (
            <Link to="/card" className="btn btn-line title-4 min-h-10 gap-2 py-1 pr-4 pl-1" aria-label={`My card, ${user.name}`}>
              <span className="font-display grid size-8 place-items-center rounded-full bg-gold text-sm font-bold text-ink" aria-hidden="true">
                {initials(user.name)}
              </span>
              My card
            </Link>
          )
        ) : (
          <>
            <Link to="/join?mode=signin" className="title-4 hidden rounded-full px-3.5 py-2 text-cream hover:underline sm:inline-flex">
              Sign in
            </Link>
            <Link to="/join" className="btn btn-gold title-4 min-h-10 px-5">
              Join a hub
            </Link>
          </>
        )}
        <button
          type="button"
          className="relative grid size-11 place-items-center rounded-full text-cream md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {[-5, 5].map((y, i) => (
            <span
              key={y}
              className="absolute h-px w-5 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]"
              style={{ transform: open ? `rotate(${i ? -45 : 45}deg)` : `translateY(${y / 2}px)` }}
            />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 -z-10 bg-night/95 px-6 pt-28 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <ul className="flex flex-col">
              {mobile.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, transform: reduce ? "none" : "translateY(16px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ delay: i * 0.05, duration: 0.45, ease: EASE }}
                >
                  <Link to={l.to} onClick={() => setOpen(false)} className="display-3 block border-b border-cream/10 py-4 text-cream">
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
