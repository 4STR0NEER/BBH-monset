import { useEffect, useState } from "react";
import { ArrowRight, ArrowsClockwise, Check, DownloadSimple, EnvelopeSimple, Globe, PencilSimple, Phone, ShareNetwork } from "@phosphor-icons/react";
import DigitalCard, { cardUrl, downloadVcard } from "../components/DigitalCard.jsx";
import { Field, Reveal } from "../components/ui.jsx";
import { DAY_NAMES, getMember, hubById, isAdmin, signOut, updateProfile, useMembers, useUser, whenLabel } from "../lib/api.js";
import { Link, navigate, useSearch } from "../lib/router.jsx";
import { AREAS, HUBS, INDUSTRIES } from "../data/sample.js";

const greeting = () => {
  const h = Number(new Date().toLocaleString("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Manila" }));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

/* ─── /card: the member's own card, the page they land on after signing in ─── */

export default function MyCard() {
  const user = useUser();
  const fresh = new URLSearchParams(useSearch()).has("new");
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (isAdmin(user)) navigate("/admin");
  }, [user]);
  // A new card turns over once to show its QR, then settles back.
  useEffect(() => {
    if (!fresh) return;
    const a = setTimeout(() => setFlipped(true), 900);
    const b = setTimeout(() => setFlipped(false), 3200);
    return () => (clearTimeout(a), clearTimeout(b));
  }, [fresh]);

  if (!user) return <SignedOut />;
  if (isAdmin(user)) return null;

  return (
    <section className="lamp px-4 pt-32 pb-24 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-32">
          <DigitalCard member={user} flipped={flipped} />
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} className="btn btn-line title-4 px-4">
              <ArrowsClockwise size={16} weight="bold" aria-hidden="true" /> {flipped ? "Front" : "QR"}
            </button>
            <ShareButton member={user} />
            <button type="button" onClick={() => downloadVcard(user)} className="btn btn-line title-4 px-4">
              <DownloadSimple size={16} weight="bold" aria-hidden="true" /> Save contact
            </button>
          </div>
        </Reveal>

        <div>
          <h1 className="serif-1 text-cream">{fresh ? "Your card is ready." : `${greeting()}, ${user.name.split(" ")[0]}.`}</h1>
          <p className="body-3 mt-3 max-w-md text-mute">
            {fresh ? "Show the QR at breakfast and people can save you in one tap." : "Here is your card. Share it, or show the QR at the table."}
          </p>

          <HubPanel user={user} />

          {editing ? (
            <EditCard user={user} onDone={() => setEditing(false)} />
          ) : (
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="label text-gold">On your card</h2>
                <button type="button" onClick={() => setEditing(true)} className="title-4 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-cream hover:underline">
                  <PencilSimple size={16} aria-hidden="true" /> Edit
                </button>
              </div>
              <Contacts member={user} />
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-cream/10 pt-6">
            <Link to={`/c/${user.id}`} className="title-4 inline-flex items-center gap-1.5 text-cream hover:underline">
              See what others see <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="title-4 min-h-11 text-mute underline hover:text-cream"
            >
              Sign out
            </button>
          </div>
          <p className="caption-5 mt-4 max-w-sm text-faint">Demo: your account lives in this browser only, so your card link opens here but not on other phones yet.</p>
        </div>
      </div>
    </section>
  );
}

// Your hub this week, and the one switch members use most: "I'm coming".
function HubPanel({ user }) {
  const hub = hubById(user.hub);
  const [coming, setComing] = useState(!!user.attending);
  const [error, setError] = useState("");
  const others = useMembers().filter((m) => m.hub === user.hub && m.attending && m.id !== user.id).length;

  async function toggle() {
    const next = !coming;
    setComing(next); // optimistic: the switch moves now, the save follows
    setError("");
    try {
      await updateProfile({ attending: next });
    } catch (e) {
      setComing(!next);
      setError(e.message);
    }
  }

  if (!hub) return null;
  return (
    <div className="surface mt-8 rounded-[1.5rem] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label text-[10px] text-mute">Your hub</p>
          <p className="serif-2 mt-1 text-cream">{hub.name}</p>
          <p className="tnum body-6 mt-1 font-mono text-gold">{whenLabel(hub)}</p>
          <p className="body-6 text-mute">
            {hub.venue}, {hub.city}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={coming}
          onClick={toggle}
          className={`btn title-4 gap-3 border pr-2 pl-4 ${coming ? "border-sage/40 text-sage" : "border-cream/15 text-cream"}`}
        >
          I&rsquo;m coming this {DAY_NAMES[hub.day].slice(0, 3)}
          <span className={`relative h-6 w-10 rounded-full transition-colors duration-200 ${coming ? "bg-sage" : "bg-coal-3"}`} aria-hidden="true">
            <span
              className="absolute top-1 left-1 grid size-4 place-items-center rounded-full bg-cream transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: coming ? "translateX(16px)" : "none" }}
            >
              {coming && <Check size={10} weight="bold" className="text-ink" />}
            </span>
          </span>
        </button>
      </div>
      <p className="caption-5 mt-4 border-t border-cream/10 pt-3 text-mute" aria-live="polite">
        {error ? <span className="text-rust">{error}</span> : `${others + (coming ? 1 : 0)} ${others + (coming ? 1 : 0) === 1 ? "member" : "members"} coming${coming ? ", including you" : ""}.`}
      </p>
    </div>
  );
}

function Contacts({ member }) {
  const rows = [
    member.phone && { icon: Phone, label: member.phone, href: `tel:${member.phone.replace(/\s/g, "")}` },
    member.email && { icon: EnvelopeSimple, label: member.email, href: `mailto:${member.email}` },
    member.website && { icon: Globe, label: member.website, href: `https://${member.website}` },
  ].filter(Boolean);
  return (
    <ul className="mt-3 divide-y divide-cream/10 border-y border-cream/10">
      {rows.map(({ icon: Icon, label, href }) => (
        <li key={href}>
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex min-h-14 items-center gap-4 py-3">
            <Icon size={18} className="shrink-0 text-gold" aria-hidden="true" />
            <span className="body-3 min-w-0 truncate text-cream group-hover:underline">{label}</span>
          </a>
        </li>
      ))}
      {!rows.length && <li className="body-6 py-4 text-mute">No contact details yet.</li>}
    </ul>
  );
}

function ShareButton({ member }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = cardUrl(member.id);
    if (navigator.share) {
      try {
        return await navigator.share({ title: `${member.name}, ${member.business}`, url });
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button type="button" onClick={share} className="btn btn-line title-4 px-4">
      {copied ? <Check size={16} weight="bold" className="text-sage" aria-hidden="true" /> : <ShareNetwork size={16} weight="bold" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}

function EditCard({ user, onDone }) {
  const [form, setForm] = useState(() => ({ ...user }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await updateProfile({ ...form, website: form.website.trim().replace(/^https?:\/\//, "") });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} noValidate className="mt-10 grid gap-4 sm:grid-cols-2">
      <h2 className="label text-gold sm:col-span-2">Edit your card</h2>
      <Field id="name" label="Your name" className="sm:col-span-2">
        <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={40} />
      </Field>
      <Field id="title" label="Title">
        <input value={form.title} onChange={set("title")} maxLength={32} />
      </Field>
      <Field id="business" label="Business name">
        <input value={form.business} onChange={set("business")} maxLength={48} />
      </Field>
      <Field id="industry" label="Field of business">
        <select value={form.industry} onChange={set("industry")}>
          {INDUSTRIES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Field>
      <Field id="area" label="Where you're based">
        <select value={form.area} onChange={set("area")}>
          {AREAS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Field>
      <Field id="hub" label="Hub" className="sm:col-span-2">
        <select value={form.hub} onChange={set("hub")}>
          {HUBS.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} · {DAY_NAMES[h.day]} {h.time}
            </option>
          ))}
        </select>
      </Field>
      <Field id="phone" label="Mobile">
        <input type="tel" value={form.phone} onChange={set("phone")} inputMode="tel" maxLength={20} />
      </Field>
      <Field id="website" label="Website">
        <input value={form.website} onChange={set("website")} inputMode="url" maxLength={60} />
      </Field>
      {error && (
        <p role="alert" className="body-6 text-rust sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className="btn btn-gold px-6">
          {busy ? "Saving…" : "Save card"}
        </button>
        <button type="button" onClick={onDone} className="btn btn-line px-5">
          Cancel
        </button>
      </div>
    </form>
  );
}

function SignedOut() {
  return (
    <section className="lamp grid min-h-svh place-items-center px-4 pt-24 text-center">
      <div className="max-w-md">
        <h1 className="serif-1 text-cream">Your card lives here.</h1>
        <p className="body-3 mt-3 text-mute">Sign in to open it, or join a hub to make one.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/join?mode=signin" className="btn btn-gold px-6">
            Sign in
          </Link>
          <Link to="/join" className="btn btn-line px-6">
            Join a hub
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── /c/:id: the card someone opens after scanning a QR ─── */

export function PublicCard({ id }) {
  const member = getMember(id);
  const [flipped, setFlipped] = useState(false);
  if (!member) {
    return (
      <section className="lamp grid min-h-svh place-items-center px-4 pt-24 text-center">
        <div className="max-w-md">
          <p className="tnum font-mono text-gold">{id}</p>
          <h1 className="serif-1 mt-2 text-cream">We can&rsquo;t find this card.</h1>
          <p className="body-3 mt-3 text-mute">The link may be mistyped, or the card was made on another phone (this demo keeps cards in one browser).</p>
          <Link to="/" className="btn btn-line mt-8 px-6">
            See the hubs
          </Link>
        </div>
      </section>
    );
  }
  const hub = hubById(member.hub);
  return (
    <section className="lamp px-4 pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-xl">
        <Reveal>
          <DigitalCard member={member} flipped={flipped} />
        </Reveal>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => downloadVcard(member)} className="btn btn-gold px-6">
            <DownloadSimple size={18} weight="bold" aria-hidden="true" /> Save to contacts
          </button>
          <button type="button" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} className="btn btn-line title-4 px-4">
            <ArrowsClockwise size={16} weight="bold" aria-hidden="true" /> {flipped ? "Front" : "QR"}
          </button>
          <ShareButton member={member} />
        </div>
        <Contacts member={member} />
        {member.sample && <p className="caption-5 mt-3 text-faint">Sample member for the demo.</p>}
        {hub && (
          <div className="surface mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] p-5">
            <p className="body-6 text-mute">
              Meet {member.name.split(" ")[0]} at <span className="text-cream">{hub.name}</span>, {DAY_NAMES[hub.day]}s at <span className="tnum font-mono text-cream">{hub.time}</span>.
            </p>
            <Link to={`/join?hub=${hub.id}`} className="title-4 inline-flex items-center gap-1.5 text-gold hover:underline">
              Join this hub <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
