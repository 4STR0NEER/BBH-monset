import { useSyncExternalStore } from "react";
import { NEXT_BREAKFAST, POSTS, SEATS } from "../data/sample.js";

// The backend seam. Every screen talks to these functions only, so swapping localStorage for
// Supabase later means rewriting this file and nothing else.
// ponytail: mock auth in the browser (SHA-256 of the password, no server). Fine for a demo;
// real accounts need Supabase Auth before launch.

const USERS = "bbh.users";
const SESSION = "bbh.session";
const MY_POSTS = "bbh.posts";
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

export function getUser() {
  const email = read(SESSION, null);
  const u = email && read(USERS, {})[email];
  return u ? publicUser(u) : null;
}

// Cached so useSyncExternalStore gets the same object until something changes.
let cache = { key: undefined, user: null };
function snapshot() {
  const key = localStorage.getItem(SESSION) + localStorage.getItem(USERS);
  if (key !== cache.key) cache = { key, user: getUser() };
  return cache.user;
}
export const useUser = () => useSyncExternalStore(subscribe, snapshot, () => null);

// Seats taken by sample members plus everyone registered on this browser.
export function takenSeats() {
  const taken = new Set(SEATS.flatMap((s, i) => (s ? [i] : [])));
  for (const u of Object.values(read(USERS, {}))) if (u.seat != null) taken.add(u.seat);
  return taken;
}

// The landing table, with the signed-in member sitting in their seat.
export function seatsFor(user) {
  return SEATS.map((s, i) => (user?.seat === i ? { name: user.name, business: user.business, area: user.area, you: true } : s));
}

export async function register({ name, business, industry, area, email, password, seat }) {
  await wait();
  const users = read(USERS, {});
  const key = norm(email);
  if (users[key]) throw new Error("That email already has a seat. Take your seat to sign in instead.");
  if (seat != null && takenSeats().has(seat)) throw new Error("Someone just took that seat. Pick another one.");
  const count = Object.keys(users).length;
  const user = {
    name: name.trim(),
    business: business.trim(),
    industry,
    area,
    email: key,
    seat,
    breakfast: NEXT_BREAKFAST.date,
    memberNo: `BBH-${String(48 + count).padStart(4, "0")}`, // sample numbering
    joined: new Date().toISOString(),
    passwordHash: await hash(key, password),
  };
  write(USERS, { ...users, [key]: user });
  write(SESSION, key);
  return publicUser(user);
}

export async function signIn({ email, password }) {
  await wait();
  const key = norm(email);
  const u = read(USERS, {})[key];
  if (!u || u.passwordHash !== (await hash(key, password))) throw new Error("That email and password don't match a seat. Check them and try again.");
  write(SESSION, key);
  return publicUser(u);
}

export function signOut() {
  localStorage.removeItem(SESSION);
  emit();
}

// Open seats for the next breakfast: the sample count, minus members on this browser with a seat.
export function seatsLeft() {
  const seated = Object.values(read(USERS, {})).filter((u) => u.seat != null).length;
  return Math.max(0, NEXT_BREAKFAST.seatsTotal - NEXT_BREAKFAST.seatsTaken - seated);
}

function updateMe(patch) {
  const users = read(USERS, {});
  const key = read(SESSION, null);
  if (!users[key]) throw new Error("You're signed out. Take your seat again to continue.");
  write(USERS, { ...users, [key]: { ...users[key], ...patch } });
  return publicUser(users[key]);
}

export async function reserveSeat(seat) {
  await wait(300);
  if (takenSeats().has(seat)) throw new Error("Someone just took that seat. Pick another one.");
  return updateMe({ seat });
}

export async function giveUpSeat() {
  await wait(200);
  return updateMe({ seat: null });
}

export const firstOpenSeat = () => SEATS.findIndex((_, i) => !takenSeats().has(i));

// Asks and offers: sample posts plus anything posted on this browser, newest first.
export function listPosts() {
  return [...read(MY_POSTS, []), ...POSTS].sort((a, b) => b.at.localeCompare(a.at));
}
let postsCache = { key: undefined, list: [] };
export const usePosts = () =>
  useSyncExternalStore(subscribe, () => {
    const key = localStorage.getItem(MY_POSTS);
    if (key !== postsCache.key) postsCache = { key, list: listPosts() };
    return postsCache.list;
  });

export async function addPost({ kind, text }) {
  await wait(300);
  const me = getUser();
  if (!me) throw new Error("You're signed out. Take your seat again to post.");
  const clean = text.trim();
  if (clean.length < 10) throw new Error("Say a little more so the table can help: at least 10 characters.");
  const post = { id: `m${Date.now()}`, kind, name: me.name, business: me.business, at: new Date().toISOString(), text: clean.slice(0, 280), mine: true };
  write(MY_POSTS, [post, ...read(MY_POSTS, [])]);
  return post;
}
