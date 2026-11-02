// Run: node src/lib/api.check.mjs  (self-check for the mock auth seam)
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const api = await import("./api.js");
const card = { name: "Test Owner", business: "Test Co", industry: "Retail", area: "Mandaue", email: "Me@Test.ph", password: "longenough", seat: 3 };

const u = await api.register(card);
assert.equal(u.email, "me@test.ph");
assert.equal(u.passwordHash, undefined, "hash never leaves the seam");
assert.equal(api.getUser().name, "Test Owner");
assert.ok(api.takenSeats().has(3));
assert.equal(api.seatsFor(api.getUser())[3].you, true);

await assert.rejects(api.register({ ...card, seat: 7 }), /already has a seat/);
await assert.rejects(api.register({ ...card, email: "b@test.ph", seat: 3 }), /just took that seat/);

api.signOut();
assert.equal(api.getUser(), null);
await assert.rejects(api.signIn({ email: "me@test.ph", password: "wrong" }), /don't match/);
assert.equal((await api.signIn({ email: " ME@test.ph ", password: "longenough" })).seat, 3);

console.log("api ok");
