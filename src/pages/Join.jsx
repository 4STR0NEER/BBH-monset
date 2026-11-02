import { cloneElement, useEffect, useId, useState } from "react";
import { ArrowLeft, ArrowRight, CaretDown } from "@phosphor-icons/react";
import PlaceCard from "../components/PlaceCard.jsx";
import Table from "../components/Table.jsx";
import { Reveal, fmtDate, fmtTime } from "../components/ui.jsx";
import { EMAIL_RE, register, signIn, signOut, takenSeats, useUser } from "../lib/api.js";
import { Link, navigate, useSearch } from "../lib/router.jsx";
import { NEXT_BREAKFAST, SEATS } from "../data/sample.js";

const INDUSTRIES = ["Food and beverage", "Retail", "Construction and hardware", "Logistics and freight", "Health and wellness", "Professional services", "Tourism and hospitality", "Manufacturing", "Technology", "Other"];
const AREAS = ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Consolacion", "Liloan", "Minglanilla", "Elsewhere in Cebu"];

export default function Join() {
  const user = useUser();
  const params = new URLSearchParams(useSearch());
  const [justFired, setJustFired] = useState(false);

  if (user) return <MemberView user={user} animate={justFired} />;
  if (params.get("mode") === "signin") return <SignIn onDone={() => setJustFired(true)} />;
  return <Register initialSeat={Number(params.get("seat")) - 1} onDone={() => setJustFired(true)} />;
}

/* ─── Reserve a seat: fill your place card, then pick your chair ─── */

function Register({ initialSeat, onDone }) {
  const taken = takenSeats();
  const firstOpen = SEATS.findIndex((_, i) => !taken.has(i));
  const [card, setCard] = useState({
    name: "",
    business: "",
    industry: "",
    area: "",
    email: "",
    password: "",
    seat: initialSeat >= 0 && !taken.has(initialSeat) ? initialSeat : null,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  const set = (k) => (e) => {
    setCard((c) => ({ ...c, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  function validate() {
    const e = {};
    if (!card.name.trim()) e.name = "Add your name so the table knows who you are.";
    if (!card.business.trim()) e.business = "Add your business name.";
    if (!card.industry) e.industry = "Pick what your business does.";
    if (!card.area) e.area = "Pick where you're based.";
    if (!EMAIL_RE.test(card.email.trim())) e.email = "Enter an email like ana@limbuilders.ph.";
    if (card.password.length < 8) e.password = "Use at least 8 characters.";
    setErrors(e);
    if (Object.keys(e).length) document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
    return !Object.keys(e).length;
  }

  function next(e) {
    e.preventDefault();
    if (!validate()) return;
    if (card.seat == null && firstOpen >= 0) setCard((c) => ({ ...c, seat: firstOpen }));
    setStep(2);
    scrollTo({ top: 0, behavior: "smooth" });
  }

  async function reserve() {
    setBusy(true);
    setFailed("");
    try {
      onDone();
      await register(card);
    } catch (err) {
      setFailed(err.message);
      setBusy(false);
    }
  }

  const seats = SEATS.map((s, i) =>
    i === card.seat
      ? { name: card.name || "You", business: card.business, area: card.area, you: true }
      : (s ?? (taken.has(i) ? { name: "Member", business: "Reserved", area: "Cebu" } : null)),
  );

  return (
    <Shell
      title={step === 1 ? "Fill in your place card." : "Now pick your chair."}
      lede={
        step === 1
          ? "This is what the table sees when you sit down. Your card fills in as you type."
          : `Breakfast is ${fmtDate(NEXT_BREAKFAST.date)} at ${fmtTime(NEXT_BREAKFAST.date)}, ${NEXT_BREAKFAST.venue}. Red seats are open.`
      }
      step={step}
      card={<PlaceCard card={card} />}
    >
      {step === 1 ? (
        <form noValidate onSubmit={next} className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Your name" error={errors.name} className="sm:col-span-2">
            <input value={card.name} onChange={set("name")} autoComplete="name" placeholder="Ana Lim" maxLength={40} />
          </Field>
          <Field id="business" label="Business name" error={errors.business} className="sm:col-span-2">
            <input value={card.business} onChange={set("business")} autoComplete="organization" placeholder="Lim Builders Supply" maxLength={48} />
          </Field>
          <Field id="industry" label="What it does" error={errors.industry}>
            <select value={card.industry} onChange={set("industry")}>
              <option value="">Choose one</option>
              {INDUSTRIES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field id="area" label="Where you're based" error={errors.area}>
            <select value={card.area} onChange={set("area")}>
              <option value="">Choose one</option>
              {AREAS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input type="email" value={card.email} onChange={set("email")} autoComplete="email" inputMode="email" placeholder="ana@limbuilders.ph" />
          </Field>
          <Field id="password" label="Password" hint="At least 8 characters" error={errors.password}>
            <input type="password" value={card.password} onChange={set("password")} autoComplete="new-password" />
          </Field>
          <div className="mt-2 flex flex-wrap items-center gap-4 sm:col-span-2">
            <button type="submit" className="btn btn-primary button-md px-5 py-2.5">
              Next: pick your seat <ArrowRight weight="bold" aria-hidden="true" />
            </button>
            <Link to="/join?mode=signin" className="title-4 text-cobalt-deep underline">
              Already have a seat? Sign in
            </Link>
          </div>
        </form>
      ) : (
        <div>
          <Table seats={seats} onPick={(i) => setCard((c) => ({ ...c, seat: i }))} className="mx-auto max-w-[480px]" />
          {failed && (
            <p role="alert" className="body-6 enamel mt-6 rounded-xl border-kettle px-4 py-3 text-kettle-deep">
              {failed}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={reserve} disabled={busy || card.seat == null} className="btn btn-primary button-md px-5 py-2.5">
              {busy ? "Setting your place…" : card.seat == null ? "Pick an open seat" : `Reserve seat ${card.seat + 1}`}
            </button>
            <button type="button" onClick={() => setStep(1)} className="title-4 inline-flex items-center gap-1 rounded-full text-cobalt-deep hover:underline">
              <ArrowLeft weight="bold" aria-hidden="true" /> Edit my card
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}

/* ─── Take your seat: sign in ─── */

function SignIn({ onDone }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  async function submit(e) {
    e.preventDefault();
    const x = {};
    if (!EMAIL_RE.test(form.email.trim())) x.email = "Enter the email you registered with.";
    if (!form.password) x.password = "Enter your password.";
    setErrors(x);
    if (Object.keys(x).length) return document.getElementById(`f-${Object.keys(x)[0]}`)?.focus();
    setBusy(true);
    setFailed("");
    try {
      onDone();
      await signIn(form);
    } catch (err) {
      setFailed(err.message);
      setBusy(false);
    }
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Shell title="Take your seat." lede="Welcome back. Sign in and your member card turns over." card={<PlaceCard card={{ name: "Welcome back", business: "Your seat is waiting" }} />}>
      <form noValidate onSubmit={submit} className="grid max-w-md gap-4">
        <Field id="email" label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" inputMode="email" />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <input type="password" value={form.password} onChange={set("password")} autoComplete="current-password" />
        </Field>
        {failed && (
          <p role="alert" className="body-6 enamel rounded-xl border-kettle px-4 py-3 text-kettle-deep">
            {failed}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className="btn btn-primary button-md px-5 py-2.5">
            {busy ? "Finding your seat…" : "Take my seat"}
          </button>
          <Link to="/join" className="title-4 text-cobalt-deep underline">
            New here? Reserve a seat
          </Link>
        </div>
      </form>
    </Shell>
  );
}

/* ─── Signed in: the member card ─── */

function MemberView({ user, animate }) {
  const [flipped, setFlipped] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setFlipped(true), 120); // let the front land, then turn it over
    return () => clearTimeout(t);
  }, [animate]);

  return (
    <Shell
      title={animate ? "Your seat is set." : `Good morning, ${user.name.split(" ")[0]}.`}
      lede={
        user.seat != null
          ? `You're in seat ${user.seat + 1} for ${fmtDate(NEXT_BREAKFAST.date)} at ${fmtTime(NEXT_BREAKFAST.date)}. Kape is poured first; come a little early.`
          : "You're a member. Pick a seat for the next breakfast from the board."
      }
      card={<PlaceCard card={user} flipped={flipped} />}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/board" className="btn btn-primary button-md px-5 py-2.5">
          Go to the board <ArrowRight weight="bold" aria-hidden="true" />
        </Link>
        <Link to="/" className="btn btn-plain button-md px-5 py-2.5">
          See your seat at the table
        </Link>
      </div>
      <button
        type="button"
        onClick={() => {
          signOut();
          navigate("/");
        }}
        className="title-4 mt-8 rounded-full text-ink-2 underline hover:text-ink"
      >
        Sign out
      </button>
      <p className="caption-5 mt-6 max-w-sm text-ink-2">Demo: your account is saved in this browser only. Seat and schedule details are sample data.</p>
    </Shell>
  );
}

/* ─── shared bits ─── */

function Shell({ title, lede, step, card, children }) {
  return (
    <section className="px-4 pt-28 pb-24 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          {step && (
            <ol className="mb-6 flex items-center gap-2" aria-label={`Step ${step} of 2`}>
              {["Place card", "Seat"].map((s, i) => (
                <li key={s} className={`caption-3 flex items-center gap-2 ${i + 1 <= step ? "text-cobalt-deep" : "text-ink-2"}`}>
                  <span className={`tnum grid size-6 place-items-center rounded-full border-2 font-mono ${i + 1 < step ? "border-cobalt bg-cobalt text-enamel" : i + 1 === step ? "border-kettle text-kettle-deep" : "border-cobalt-soft"}`}>{i + 1}</span>
                  {s}
                  {i === 0 && <span className="h-0.5 w-8 rounded-full bg-cobalt-soft" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          )}
          <h1 className="heading-3 md:heading-2 text-ink">{title}</h1>
          <p className="body-3 mt-4 max-w-[34rem] text-ink-2">{lede}</p>
          <div className="mt-8">{children}</div>
        </div>
        <Reveal className="order-1 lg:sticky lg:top-32 lg:order-2">{card}</Reveal>
      </div>
    </section>
  );
}

function Field({ id, label, hint, error, className = "", children }) {
  const uid = useId();
  const msg = `${uid}-msg`;
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="title-4 text-ink">
        {label}
      </label>
      <div className="relative">
      {cloneElement(children, {
        id: `f-${id}`,
        "aria-invalid": !!error || undefined,
        "aria-describedby": error || hint ? msg : undefined,
        className:
          "body-3 mt-1.5 block h-12 w-full rounded-xl border-2 border-cobalt-soft bg-enamel px-3 text-ink shadow-[inset_0_2px_0_#fff] transition-colors duration-200 placeholder:text-ink/35 hover:border-cobalt/60 focus:border-cobalt focus-visible:outline-offset-2 aria-invalid:border-kettle appearance-none",
      })}
      {children.type === "select" && <CaretDown size={16} weight="bold" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 mt-[3px] -translate-y-1/2 text-cobalt" />}
      </div>
      {(error || hint) && (
        <p id={msg} className={`caption-5 mt-1.5 ${error ? "text-kettle-deep" : "text-ink-2"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
