import { useSyncExternalStore } from "react";
import { HUBS, MEMBERS } from "../data/sample.js";

// The backend seam. Every screen talks to these functions only, so swapping localStorage for
// Supabase later means rewriting this file and nothing else.
// ponytail: mock auth in the browser (SHA-256 of the password, no server, admin role checked
// client side). Fine for a demo; real accounts and the admin role need Supabase Auth + RLS.

const USERS = "bbh.users";
const SESSION = "bbh.session";
export const ADMIN_EMAIL = "admin@bbh.ph";
export const DEMO_ADMIN_PASSWORD = "breakfast-admin"; // demo only, shown on the admin sign in
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms)); // feels like a network call

const read = (k, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => {
  localStorage.setItem(k, JSON.stringify(v));
  emit();
};

const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());
const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));

async function hash(email, password) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${email}:${password}`));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const norm = (email) => email.trim().toLowerCase();
const publicUser = ({ passwordHash, ...u }) => u;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isAdmin = (u) => u?.role === "admin";
export const hubById = (id) => HUBS.find((h) => h.id === id);

export function getUser() {
  const email = read(SESSION, null);
  const u = email && read(USERS, {})[email];
  return u ? publicUser(u) : null;
}

// Cached so useSyncExternalStore gets the same object until storage changes.
function cached(fn) {
  let c = { key: undefined, value: null };
  return () => {
    const key = localStorage.getItem(SESSION) + localStorage.getItem(USERS);
    if (key !== c.key) c = { key, value: fn() };
    return c.value;
  };
}
const userSnap = cached(getUser);
const membersSnap = cached(() => allMembers());
export const useUser = () => useSyncExternalStore(subscribe, userSnap, () => null);
export const useMembers = () => useSyncExternalStore(subscribe, membersSnap, () => MEMBERS);

// Sample members plus everyone who registered on this browser. Admin accounts aren't members.
export function allMembers() {
  const local = Object.values(read(USERS, {})).filter((u) => !isAdmin(u)).map(publicUser);
  return [...local, ...MEMBERS];
}
export const getMember = (id) => allMembers().find((x) => x.id.toLowerCase() === String(id).toLowerCase()) ?? null;

export async function register({ name, title, business, industry, area, hub, phone, website, email, password }) {
  await wait();
  const users = read(USERS, {});
  const key = norm(email);
  if (users[key] || key === ADMIN_EMAIL) throw new Error("That email already has a card. Sign in instead.");
  if (!hubById(hub)) throw new Error("Pick a hub to join.");
  const count = Object.keys(users).length;
  const user = {
    id: `BBH-${String(MEMBERS.length + 1 + count).padStart(4, "0")}`, // sample numbering
    name: name.trim(),
    title: title.trim(),
    business: business.trim(),
    industry,
    area,
    hub,
    phone: phone.trim(),
    website: website.trim().replace(/^https?:\/\//, ""),
    email: key,
    attending: false,
    joined: new Date().toISOString().slice(0, 10),
    passwordHash: await hash(key, password),
  };
  write(USERS, { ...users, [key]: user });
  write(SESSION, key);
  return publicUser(user);
}

export async function signIn({ email, password }) {
  await wait();
  const key = norm(email);
  const users = read(USERS, {});
  // The demo admin account is created on first sign in with the demo password.
  if (key === ADMIN_EMAIL && !users[key] && password === DEMO_ADMIN_PASSWORD) {
    write(USERS, { ...users, [key]: { id: "admin", name: "BBH Admin", email: key, role: "admin", passwordHash: await hash(key, password) } });
  }
  const u = read(USERS, {})[key];
  if (!u || u.passwordHash !== (await hash(key, password))) throw new Error("That email and password don't match. Check them and try again.");
  write(SESSION, key);
  return publicUser(u);
}

export function signOut() {
  localStorage.removeItem(SESSION);
  emit();
}

const EDITABLE = ["name", "title", "business", "industry", "area", "hub", "phone", "website", "attending"];
export async function updateProfile(patch) {
  await wait(250);
  const users = read(USERS, {});
  const key = read(SESSION, null);
  if (!users[key]) throw new Error("You're signed out. Sign in again to continue.");
  const clean = Object.fromEntries(Object.entries(patch).filter(([k]) => EDITABLE.includes(k)));
  if (clean.hub && !hubById(clean.hub)) throw new Error("Pick a hub to join.");
  if ("name" in clean && !String(clean.name).trim()) throw new Error("Your card needs a name.");
  write(USERS, { ...users, [key]: { ...users[key], ...clean } });
  return getUser();
}

// ─── The week: when each hub meets next, in Cebu time ───

export function manilaNow(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return { day, min: Number(p.hour) * 60 + Number(p.minute) };
}

// "8:30 AM" → 510. A time without AM/PM is read as morning: these are breakfasts.
export function minutesOf(time) {
  const [, h, mm, ap] = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i) ?? [, "0", "0"];
  return ((Number(h) % 12) + (ap?.toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(mm);
}

// Minutes until the hub's next breakfast starts (a breakfast that started under 90 min ago still counts as now).
export function minutesUntil(hub, now = new Date()) {
  const t = manilaNow(now);
  let diff = ((hub.day - t.day + 7) % 7) * 1440 + minutesOf(hub.time) - t.min;
  if (diff < -90) diff += 7 * 1440;
  return diff;
}

export const hubsByNext = (now = new Date()) => [...HUBS].sort((a, b) => minutesUntil(a, now) - minutesUntil(b, now));

export function whenLabel(hub, now = new Date()) {
  const d = minutesUntil(hub, now);
  if (d <= 0) return "Happening now";
  if (d < 1440 && hub.day === manilaNow(now).day) return `Today · ${hub.time}`;
  if (d < 2880 && (hub.day - manilaNow(now).day + 7) % 7 === 1) return `Tomorrow · ${hub.time}`;
  return `${DAY_NAMES[hub.day]} · ${hub.time}`;
}
export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Admin views ───

export const groupBy = (list, key) =>
  list.reduce((acc, x) => {
    (acc[x[key]] ??= []).push(x);
    return acc;
  }, {});
