import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, DownloadSimple, MagnifyingGlass, SignOut } from "@phosphor-icons/react";
import AnimatedNumber from "../components/AnimatedNumber.jsx";
import { Field, Reveal, initials, fmtDay } from "../components/ui.jsx";
import { ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, EMAIL_RE, groupBy, hubById, hubsByNext, isAdmin, signIn, signOut, useMembers, useUser, whenLabel } from "../lib/api.js";
import { Link, navigate } from "../lib/router.jsx";
import { HUBS } from "../data/sample.js";

const TABS = [
  ["hubs", "Attendance by hub"],
  ["members", "Members"],
  ["fields", "By field"],
];

export default function Admin() {
  const user = useUser();
  const members = useMembers();
  const [tab, setTab] = useState("hubs");
  if (!isAdmin(user)) return <AdminSignIn signedInAs={user} />;

  const coming = members.filter((m) => m.attending).length;
  const fields = Object.keys(groupBy(members, "industry")).length;
  const stats = [
    ["Members", members.length],
    ["Coming this week", coming],
    ["Hubs", HUBS.length],
    ["Fields of business", fields],
  ];

  return (
    <section className="px-4 pt-32 pb-24 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label text-gold">Admin</p>
            <h1 className="display-2 mt-2 text-cream">The week at BBH</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="btn btn-line title-4 px-4"
          >
            <SignOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-cream/10 bg-cream/10 lg:grid-cols-4">
          {stats.map(([label, n]) => (
            <div key={label} className="bg-coal p-5 md:p-6">
              <dt className="caption-5 text-mute">{label}</dt>
              <dd className="display-2 mt-2 text-cream">
                <AnimatedNumber value={n} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="caption-5 mt-3 text-faint">Sample members plus anyone who joined on this browser.</p>

        <div role="tablist" aria-label="Admin views" className="mt-12 flex gap-1 overflow-x-auto border-b border-cream/10">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`title-4 relative min-h-12 shrink-0 px-4 transition-colors duration-200 ${tab === id ? "text-cream" : "text-mute hover:text-cream"}`}
            >
              {label}
              {tab === id && <motion.span layoutId="tab-line" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold" transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
          {tab === "hubs" && <ByHub members={members} />}
          {tab === "members" && <MemberTable members={members} />}
          {tab === "fields" && <ByField members={members} />}
        </div>
      </div>
    </section>
  );
}

function Bar({ value, max, className = "bg-gold" }) {
  return (
    <span className="block h-1 overflow-hidden rounded-full bg-coal-3" aria-hidden="true">
      <span className={`block h-full origin-left rounded-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${className}`} style={{ transform: `scaleX(${max ? value / max : 0})` }} />
    </span>
  );
}

function Avatar({ name }) {
  return (
    <span className="font-display grid size-9 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold-soft text-sm font-bold text-gold" aria-hidden="true">
      {initials(name)}
    </span>
  );
}

// Attendants per hub: who said "I'm coming" for each hub's next breakfast.
function ByHub({ members }) {
  const byHub = groupBy(members, "hub");
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {hubsByNext().map((h, i) => {
        const all = byHub[h.id] ?? [];
        const coming = all.filter((m) => m.attending);
        return (
          <Reveal as="li" key={h.id} delay={i * 0.04} className="surface rounded-[1.5rem] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="serif-2 truncate text-cream">{h.name}</h2>
                <p className="tnum caption-5 mt-1 font-mono text-gold">{whenLabel(h)}</p>
                <p className="caption-5 text-mute">
                  {h.venue}, {h.city}
                </p>
              </div>
              <p className="shrink-0 text-right">
                <span className="display-3 tnum text-cream">{coming.length}</span>
                <span className="tnum caption-5 block font-mono text-mute">of {all.length} coming</span>
              </p>
            </div>
            <div className="mt-4">
              <Bar value={coming.length} max={all.length} />
            </div>
            <ul className="mt-5 flex flex-col divide-y divide-cream/10">
              {coming.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <Avatar name={m.name} />
                  <Link to={`/c/${m.id}`} className="min-w-0 flex-1 rounded-md hover:underline">
                    <span className="title-4 block truncate text-cream">{m.name}</span>
                    <span className="caption-5 block truncate text-mute">
                      {m.business} · {m.industry}
                    </span>
                  </Link>
                </li>
              ))}
              {!coming.length && <li className="body-6 py-3 text-mute">Nobody has said they&rsquo;re coming yet.</li>}
            </ul>
          </Reveal>
        );
      })}
    </ul>
  );
}

const toCsv = (rows) =>
  rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""').replace(/^[=+\-@]/, "'$&")}"`).join(",")).join("\r\n");

function MemberTable({ members }) {
  const [q, setQ] = useState("");
  const [hub, setHub] = useState("all");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members
      .filter((m) => (hub === "all" || m.hub === hub) && (!needle || [m.name, m.business, m.industry, m.area].join(" ").toLowerCase().includes(needle)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [members, q, hub]);

  function exportCsv() {
    const rows = [["Member no", "Name", "Title", "Business", "Field", "Hub", "Area", "Phone", "Email", "Website", "Joined", "Coming"]];
    list.forEach((m) => rows.push([m.id, m.name, m.title, m.business, m.industry, hubById(m.hub)?.name, m.area, m.phone, m.email, m.website, m.joined, m.attending ? "Yes" : "No"]));
    const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "bbh-members.csv" }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search members</span>
          <MagnifyingGlass size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-mute" aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, business, field, area" className="field pl-10" />
        </label>
        <button type="button" onClick={exportCsv} className="btn btn-line title-4 px-4">
          <DownloadSimple size={16} weight="bold" aria-hidden="true" /> Export CSV
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by hub">
        {[{ id: "all", name: "All hubs" }, ...HUBS].map((h) => (
          <button
            key={h.id}
            type="button"
            aria-pressed={hub === h.id}
            onClick={() => setHub(h.id)}
            className={`title-4 min-h-11 rounded-full border px-4 ${hub === h.id ? "border-gold bg-gold text-ink" : "border-cream/15 text-mute hover:text-cream"}`}
          >
            {h.name}
          </button>
        ))}
      </div>

      <p className="caption-5 mt-6 text-mute" aria-live="polite">
        <span className="tnum font-mono">{list.length}</span> {list.length === 1 ? "member" : "members"}
      </p>
      <div className="mt-2 overflow-x-auto rounded-[1.25rem] border border-cream/10">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-coal">
            <tr className="caption-5 text-mute">
              {["Member", "Field of business", "Hub", "Area", "Joined", "This week"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/10">
            {list.map((m) => (
              <tr key={m.id} className="transition-colors duration-150 hover:bg-coal">
                <td className="px-4 py-3">
                  <Link to={`/c/${m.id}`} className="flex items-center gap-3 rounded-md hover:underline">
                    <Avatar name={m.name} />
                    <span className="min-w-0">
                      <span className="title-4 block text-cream">{m.name}</span>
                      <span className="caption-5 block text-mute">{m.business}</span>
                    </span>
                  </Link>
                </td>
                <td className="body-6 px-4 py-3 text-cream">{m.industry}</td>
                <td className="body-6 px-4 py-3 text-cream">{hubById(m.hub)?.name}</td>
                <td className="body-6 px-4 py-3 text-mute">{m.area}</td>
                <td className="tnum caption-5 px-4 py-3 font-mono text-mute">{fmtDay(m.joined)}</td>
                <td className="px-4 py-3">
                  {m.attending ? (
                    <span className="caption-5 inline-flex items-center gap-1 text-sage">
                      <Check size={12} weight="bold" aria-hidden="true" /> Coming
                    </span>
                  ) : (
                    <span className="caption-5 text-faint">Not yet</span>
                  )}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={6} className="body-6 px-4 py-10 text-center text-mute">
                  No members match. Try a shorter search or another hub.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Members grouped by field of business, biggest field first.
function ByField({ members }) {
  const groups = Object.entries(groupBy(members, "industry")).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const max = groups[0]?.[1].length ?? 0;
  return (
    <ul className="divide-y divide-cream/10 border-y border-cream/10">
      {groups.map(([field, list]) => (
        <li key={field} className="grid gap-4 py-6 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-8">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="title-2 text-cream">{field}</h2>
              <span className="tnum font-mono text-gold">{list.length}</span>
            </div>
            <div className="mt-2">
              <Bar value={list.length} max={max} />
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            {list.map((m) => (
              <li key={m.id}>
                <Link to={`/c/${m.id}`} className="flex items-center gap-2 rounded-full border border-cream/10 py-1 pr-3.5 pl-1 transition-colors duration-200 hover:border-gold/40">
                  <Avatar name={m.name} />
                  <span className="min-w-0">
                    <span className="title-4 block leading-tight text-cream">{m.name}</span>
                    <span className="caption-5 block leading-tight text-mute">
                      {m.business} · {hubById(m.hub)?.name}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function AdminSignIn({ signedInAs }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email.trim()) || !form.password) return setError("Enter the admin email and password.");
    setBusy(true);
    setError("");
    try {
      const u = await signIn(form);
      if (!isAdmin(u)) {
        signOut();
        throw new Error("That account isn't an admin.");
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <section className="lamp grid min-h-svh place-items-center px-4 pt-24 pb-16">
      <form onSubmit={submit} noValidate className="surface w-full max-w-sm rounded-[1.75rem] p-6 md:p-8">
        <h1 className="display-3 text-cream">Admin</h1>
        <p className="body-6 mt-2 text-mute">{signedInAs ? `You're signed in as ${signedInAs.name}, a member. Admins sign in separately.` : "For BBH organisers."}</p>
        <div className="mt-6 grid gap-4">
          <Field id="a-email" label="Email">
            <input type="email" value={form.email} onChange={set("email")} autoComplete="username" />
          </Field>
          <Field id="a-password" label="Password">
            <input type="password" value={form.password} onChange={set("password")} autoComplete="current-password" />
          </Field>
        </div>
        {error && (
          <p role="alert" className="body-6 mt-4 text-rust">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn btn-gold mt-6 w-full">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="caption-5 mt-5 border-t border-cream/10 pt-4 text-faint">
          Demo login: <span className="font-mono text-mute">{ADMIN_EMAIL}</span> / <span className="font-mono text-mute">{DEMO_ADMIN_PASSWORD}</span>
        </p>
      </form>
    </section>
  );
}
