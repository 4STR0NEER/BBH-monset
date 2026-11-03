import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import DigitalCard from "../components/DigitalCard.jsx";
import { Field, Reveal } from "../components/ui.jsx";
import { DAY_NAMES, EMAIL_RE, isAdmin, register, signIn, useUser } from "../lib/api.js";
import { Link, navigate, useSearch } from "../lib/router.jsx";
import { AREAS, HUBS, INDUSTRIES } from "../data/sample.js";

export default function Join() {
  const user = useUser();
  const params = new URLSearchParams(useSearch());
  useEffect(() => {
    if (user) navigate(isAdmin(user) ? "/admin" : "/card");
  }, [user]);
  if (user) return null;
  if (params.get("mode") === "signin") return <SignIn />;
  return <Register initialHub={params.get("hub")} />;
}

function useForm(initial) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const check = (rules) => {
    const e = Object.fromEntries(Object.entries(rules).filter(([, bad]) => bad));
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return !first;
  };
  return { form, set, errors, check };
}

/* ─── Join: fill in your card, pick your hub ─── */

function Register({ initialHub }) {
  const { form, set, errors, check } = useForm({
    name: "", title: "", business: "", industry: "", area: "", phone: "", website: "", email: "", password: "",
    hub: HUBS.some((h) => h.id === initialHub) ? initialHub : "",
  });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  async function submit(e) {
    e.preventDefault();
    const ok = check({
      name: !form.name.trim() && "Add your name so the table knows who you are.",
      business: !form.business.trim() && "Add your business name.",
      industry: !form.industry && "Pick your field of business.",
      area: !form.area && "Pick where you're based.",
      hub: !form.hub && "Pick the hub you'll go to.",
      email: !EMAIL_RE.test(form.email.trim()) && "Enter an email like ana@limbuilders.ph.",
      password: form.password.length < 8 && "Use at least 8 characters.",
    });
    if (!ok) return;
    setBusy(true);
    setFailed("");
    try {
      await register(form);
      navigate("/card?new=1");
    } catch (err) {
      setFailed(err.message);
      setBusy(false);
    }
  }

  return (
    <Shell title="Join a hub" lede="Fill in your card. This is what people see when they scan you at breakfast." card={<DigitalCard member={form} />}>
      <form noValidate onSubmit={submit} className="flex flex-col gap-10">
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="label mb-4 text-gold">Your card</legend>
          <Field id="name" label="Your name" error={errors.name} className="sm:col-span-2">
            <input value={form.name} onChange={set("name")} autoComplete="name" placeholder="Ana Lim" maxLength={40} />
          </Field>
          <Field id="title" label="Title" hint="Optional">
            <input value={form.title} onChange={set("title")} autoComplete="organization-title" placeholder="Owner" maxLength={32} />
          </Field>
          <Field id="business" label="Business name" error={errors.business}>
            <input value={form.business} onChange={set("business")} autoComplete="organization" placeholder="Lim Builders Supply" maxLength={48} />
          </Field>
          <Field id="industry" label="Field of business" error={errors.industry}>
            <select value={form.industry} onChange={set("industry")}>
              <option value="">Choose one</option>
              {INDUSTRIES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field id="area" label="Where you're based" error={errors.area}>
            <select value={form.area} onChange={set("area")}>
              <option value="">Choose one</option>
              {AREAS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field id="phone" label="Mobile" hint="Optional, shown on your card">
            <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" placeholder="+63 917 000 0000" maxLength={20} />
          </Field>
          <Field id="website" label="Website" hint="Optional">
            <input value={form.website} onChange={set("website")} autoComplete="url" inputMode="url" placeholder="limbuilders.ph" maxLength={60} />
          </Field>
        </fieldset>

        <fieldset aria-describedby={errors.hub ? "hub-err" : undefined}>
          <legend className="label mb-4 text-gold">Your hub</legend>
          <div className="grid gap-2 sm:grid-cols-2" id="f-hub" tabIndex={-1}>
            {HUBS.map((h) => (
              <label
                key={h.id}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                  form.hub === h.id ? "border-gold bg-gold-soft" : "border-cream/12 hover:border-cream/25"
                }`}
              >
                <input type="radio" name="hub" value={h.id} checked={form.hub === h.id} onChange={set("hub")} className="sr-only" />
                <span className="min-w-0">
                  <span className="title-3 block truncate text-cream">{h.name}</span>
                  <span className="caption-5 block truncate text-mute">
                    {h.venue}, {h.city}
                  </span>
                </span>
                <span className={`tnum caption-5 shrink-0 text-right font-mono ${form.hub === h.id ? "text-gold" : "text-mute"}`}>
                  {DAY_NAMES[h.day].slice(0, 3)}
                  <br />
                  {h.time}
                </span>
              </label>
            ))}
          </div>
          {errors.hub && (
            <p id="hub-err" className="caption-5 mt-2 text-rust">
              {errors.hub}
            </p>
          )}
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="label mb-4 text-gold">Your account</legend>
          <Field id="email" label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={set("email")} autoComplete="email" inputMode="email" placeholder="ana@limbuilders.ph" />
          </Field>
          <Field id="password" label="Password" hint="At least 8 characters" error={errors.password}>
            <input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
          </Field>
        </fieldset>

        {failed && (
          <p role="alert" className="body-6 rounded-xl border border-rust/40 px-4 py-3 text-rust">
            {failed}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-5">
          <button type="submit" disabled={busy} className="btn btn-gold px-6">
            {busy ? "Making your card…" : "Make my card"} {!busy && <ArrowRight weight="bold" aria-hidden="true" />}
          </button>
          <Link to="/join?mode=signin" className="title-4 text-cream underline decoration-cream/30 hover:decoration-cream">
            Already a member? Sign in
          </Link>
        </div>
      </form>
    </Shell>
  );
}

/* ─── Sign in ─── */

function SignIn() {
  const { form, set, errors, check } = useForm({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!check({ email: !EMAIL_RE.test(form.email.trim()) && "Enter the email you joined with.", password: !form.password && "Enter your password." })) return;
    setBusy(true);
    setFailed("");
    try {
      await signIn(form); // Join's effect sends you to your card (or the admin)
    } catch (err) {
      setFailed(err.message);
      setBusy(false);
    }
  }

  return (
    <Shell title="Welcome back" lede="Sign in to open your card." card={<DigitalCard member={{ name: "Welcome back", business: "Your card is waiting" }} />}>
      <form noValidate onSubmit={submit} className="grid max-w-md gap-4">
        <Field id="email" label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" inputMode="email" />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <input type="password" value={form.password} onChange={set("password")} autoComplete="current-password" />
        </Field>
        {failed && (
          <p role="alert" className="body-6 rounded-xl border border-rust/40 px-4 py-3 text-rust">
            {failed}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-5">
          <button type="submit" disabled={busy} className="btn btn-gold px-6">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <Link to="/join" className="title-4 text-cream underline decoration-cream/30 hover:decoration-cream">
            New here? Join a hub
          </Link>
        </div>
      </form>
    </Shell>
  );
}

function Shell({ title, lede, card, children }) {
  return (
    <section className="lamp px-4 pt-32 pb-24 md:pt-40">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h1 className="display-2 text-cream">{title}</h1>
          <p className="body-3 mt-4 max-w-[34rem] text-mute">{lede}</p>
          <div className="mt-10">{children}</div>
        </div>
        <Reveal className="order-1 lg:sticky lg:top-32 lg:order-2">{card}</Reveal>
      </div>
    </section>
  );
}
