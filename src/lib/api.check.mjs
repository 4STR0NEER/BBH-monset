// Run: node src/lib/api.check.mjs  (self-check for the mock backend seam)
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const api = await import("./api.js");
const { HUBS, MEMBERS } = await import("../data/sample.js");
const card = { name: "Test Owner", title: "Owner", business: "Test Co", industry: "Retail", area: "Mandaue", hub: "la-carne", phone: "", website: "https://test.ph", email: "Me@Test.ph", password: "longenough" };

const u = await api.register(card);
assert.equal(u.email, "me@test.ph");
assert.equal(u.website, "test.ph");
assert.equal(u.passwordHash, undefined, "hash never leaves the seam");
assert.equal(api.getMember(u.id.toLowerCase()).name, "Test Owner");
assert.equal(api.allMembers().length, MEMBERS.length + 1);
await assert.rejects(api.register(card), /already has a card/);
await assert.rejects(api.register({ ...card, email: "x@test.ph", hub: "nope" }), /Pick a hub/);

assert.equal((await api.updateProfile({ attending: true, role: "admin", passwordHash: "x" })).attending, true);
assert.notEqual(api.getUser().role, "admin", "role can't be set through the profile");

api.signOut();
assert.equal(api.getUser(), null);
await assert.rejects(api.signIn({ email: "me@test.ph", password: "wrong" }), /don't match/);
assert.equal((await api.signIn({ email: " ME@test.ph ", password: "longenough" })).hub, "la-carne");

// admin: wrong password never creates the account, the demo one does, and admins aren't members
await assert.rejects(api.signIn({ email: api.ADMIN_EMAIL, password: "guess" }), /don't match/);
assert.ok(api.isAdmin(await api.signIn({ email: api.ADMIN_EMAIL, password: api.DEMO_ADMIN_PASSWORD })));
assert.equal(api.allMembers().length, MEMBERS.length + 1);

// the week, in Manila time (UTC+8)
assert.equal(api.minutesOf("8:30 AM"), 510);
assert.equal(api.minutesOf("12:15 PM"), 735);
assert.equal(api.minutesOf("6:00"), 360);
const flora = HUBS.find((h) => h.id === "flora-faun"); // Tuesdays 8:30 AM
const monNight = new Date("2026-11-02T20:00:00+08:00"); // a Monday
assert.equal(api.minutesUntil(flora, monNight), 12 * 60 + 30);
assert.equal(api.whenLabel(flora, monNight), "Tomorrow · 8:30 AM");
assert.equal(api.whenLabel(flora, new Date("2026-11-03T08:45:00+08:00")), "Happening now");
assert.equal(api.hubsByNext(new Date("2026-11-03T11:00:00+08:00"))[0].id, "bakery-soesterberg");
assert.equal(api.hubsByNext(new Date("2026-11-07T09:00:00+08:00"))[0].id, "flora-faun", "Saturday wraps to next week");

console.log("api ok");
