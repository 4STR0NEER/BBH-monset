import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

// A tiny router on the History API (same one as the Wander Cafe build): a handful of pages
// don't need a routing library. Page changes run inside a View Transition when the browser has one.

const listeners = new Set();
const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));
const emit = () => listeners.forEach((fn) => fn());

export const usePath = () => useSyncExternalStore(subscribe, () => location.pathname);
export const useSearch = () => useSyncExternalStore(subscribe, () => location.search);

function transition(update) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) return update();
  document.startViewTransition(() => flushSync(update)); // React renders before the snapshot
}

export function navigate(to) {
  const url = new URL(to, location.href);
  if (url.pathname === location.pathname && url.search === location.search) {
    if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" });
    else scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  transition(() => {
    history.pushState(null, "", url);
    emit();
    const target = url.hash && document.querySelector(url.hash);
    if (target) target.scrollIntoView();
    else scrollTo(0, 0);
  });
}

addEventListener("popstate", () => transition(emit));

// <a> that navigates in-app; modified clicks (new tab etc.) still behave like normal links
export function Link({ to, onClick, ...props }) {
  return (
    <a
      href={to}
      aria-current={to === location.pathname ? "page" : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    />
  );
}
