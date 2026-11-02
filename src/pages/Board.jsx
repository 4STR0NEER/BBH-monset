import { useEffect, useState } from "react";
import { Armchair, ArrowRight, CalendarBlank, HandHeart, Question, Quotes } from "@phosphor-icons/react";
import AnimatedNumber from "../components/AnimatedNumber.jsx";
import HoldButton from "../components/HoldButton.jsx";
import { Reveal, Sample, fmtDate, fmtTime } from "../components/ui.jsx";
import { addPost, firstOpenSeat, giveUpSeat, reserveSeat, seatsLeft, usePosts, useUser } from "../lib/api.js";
import { Link } from "../lib/router.jsx";
import { NEWS, NEXT_BREAKFAST, SCHEDULE, SEATS, SPOTLIGHT } from "../data/sample.js";

const SECTIONS = [
  ["next", "Next breakfast"],
  ["news", "News"],
  ["schedule", "Schedule"],
  ["features", "Features"],
  ["asks", "Asks and offers"],
];

const greeting = () => {
  const h = Number(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Manila" }));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);
const shortDate = (iso) => new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", timeZone: "Asia/Manila" });

// Which section is under the sticky nav, so its pill can show "you are here".
function useActiveSection(ids, enabled) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    ids.forEach((id) => document.getElementById(id) && io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

export default function Board() {
  const user = useUser();
  const active = useActiveSection(SECTIONS.map(([id]) => id), !!user);
  if (!user) return <Gate />;
  return (
    <div className="px-4 pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-3 md:heading-2 text-ink">
              {greeting()}, {user.name.split(" ")[0]}.
            </h1>
            <p className="body-3 mt-3 max-w-[40rem] text-ink-2">Here&rsquo;s what the table is working on this week.</p>
          </div>
          <p className="caption-5 max-w-xs text-ink-2">Demo board: every story, date and member here is sample content.</p>
        </header>

        <nav aria-label="Board sections" className="sticky top-24 z-30 -mx-4 mt-8 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
          <ul className="enamel flex w-max gap-1 rounded-full bg-enamel/90 p-1 backdrop-blur-md">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <Link
                  to={`/board#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className="title-4 block rounded-full px-3 py-1.5 whitespace-nowrap text-ink-2 transition-[background-color] duration-300 hover:bg-enamel-2 hover:text-ink aria-[current=location]:bg-cobalt aria-[current=location]:hover:bg-cobalt aria-[current=location]:text-enamel"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <NextBreakfast user={user} />

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <News />
          <Schedule user={user} />
        </div>

        <Features />
        <AsksOffers />
      </div>
    </div>
  );
}

/* ─── The next breakfast, as the big cobalt enamel sign ─── */

function NextBreakfast({ user }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const left = seatsLeft();
  const open = firstOpenSeat();

  async function run(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  return (
    <section id="next" aria-labelledby="next-h" className="mt-6 scroll-mt-40">
      <div className="enamel-cobalt speckle chipped grid gap-8 rounded-[2rem] p-6 text-enamel md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:p-10">
        <div>
          <h2 id="next-h" className="title-4 text-cobalt-soft">
            Next breakfast
          </h2>
          <p className="heading-4 md:heading-3 mt-2">
            {fmtDate(NEXT_BREAKFAST.date)} · <span className="tnum font-mono">{fmtTime(NEXT_BREAKFAST.date)}</span>
          </p>
          <p className="body-3 mt-1 text-cobalt-soft">{NEXT_BREAKFAST.venue}</p>
          <div className="mt-6 border-t-2 border-enamel/20 pt-4">
            <p className="title-2">{NEXT_BREAKFAST.topic}</p>
            <p className="body-6 text-cobalt-soft">Member feature by {NEXT_BREAKFAST.speaker}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {user.seat != null ? (
              <>
                <span className="caption-3 inline-flex h-11 items-center gap-2 rounded-full bg-kettle px-4">
                  <Armchair size={18} weight="bold" aria-hidden="true" /> You&rsquo;re in seat {user.seat + 1}
                </span>
                <HoldButton
                  icon={<Armchair size={16} weight="bold" aria-hidden="true" />}
                  holdingLabel="Keep holding to give it up"
                  completeLabel="Seat released"
                  disabled={busy}
                  onHoldComplete={() => run(giveUpSeat)}
                >
                  Hold to give up my seat
                </HoldButton>
              </>
            ) : (
              <button type="button" disabled={busy || open < 0} onClick={() => run(() => reserveSeat(open))} className="btn btn-primary button-md h-11 px-5">
                {busy ? "Setting your place…" : open < 0 ? "This breakfast is full" : `Take seat ${open + 1}`}
              </button>
            )}
            <Link to="/#table" className="title-4 text-enamel underline">
              See the table
            </Link>
          </div>
          {error && (
            <p role="alert" className="body-6 mt-4 text-enamel">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border-2 border-enamel/25 p-6 md:items-end md:text-right">
          <p className="title-4 text-cobalt-soft">Seats open</p>
          <p className="font-mono text-8xl leading-none font-medium tracking-tight md:text-9xl">
            <AnimatedNumber value={left} />
          </p>
          <p className="body-6 text-cobalt-soft">
            of <span className="tnum font-mono">{NEXT_BREAKFAST.seatsTotal}</span> at the table
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Business news ─── */

const TAGS = ["All", "Members", "Cebu business", "Tips"];

function News() {
  const [tag, setTag] = useState("All");
  const items = tag === "All" ? NEWS : NEWS.filter((n) => n.tag === tag);
  return (
    <section id="news" aria-labelledby="news-h" className="scroll-mt-40">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="news-h" className="heading-4 text-ink">
            Business news
          </h2>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter news">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
                className="caption-3 rounded-full border-2 border-cobalt-soft px-3 py-1.5 text-ink-2 transition-colors duration-200 hover:border-cobalt aria-pressed:border-cobalt aria-pressed:bg-cobalt aria-pressed:text-enamel active:scale-[0.97]"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-6 divide-y-2 divide-cobalt-soft border-y-2 border-cobalt-soft">
          {items.map((n) => (
            <li key={n.id} className="grid gap-1 py-5 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
              <div className="flex gap-2 sm:flex-col sm:gap-1">
                <span className="tnum caption-5 font-mono text-ink-2">{shortDate(n.date)}</span>
                <span className="caption-3 text-cobalt">{n.tag}</span>
              </div>
              <div>
                <h3 className="title-2 text-ink">{n.title}</h3>
                <p className="body-6 mt-1 max-w-prose text-ink-2">{n.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ─── Schedule: upcoming breakfasts ─── */

function Schedule({ user }) {
  return (
    <section id="schedule" aria-labelledby="schedule-h" className="scroll-mt-40">
      <Reveal delay={0.1}>
        <h2 id="schedule-h" className="heading-4 text-ink">
          Schedule
        </h2>
        <ol className="mt-6 space-y-2">
          {SCHEDULE.map((b, i) => {
            const d = new Date(b.date);
            const mine = i === 0 && user.seat != null;
            return (
              <li key={b.date} className={`flex gap-4 rounded-2xl border-2 p-3 ${i === 0 ? "enamel" : "border-cobalt-soft"}`}>
                <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-enamel-2 py-2 text-cobalt-deep">
                  <span className="caption-3 uppercase">{d.toLocaleDateString("en-PH", { month: "short", timeZone: "Asia/Manila" })}</span>
                  <span className="tnum font-mono text-2xl leading-8 font-medium">{d.toLocaleDateString("en-PH", { day: "numeric", timeZone: "Asia/Manila" })}</span>
                </div>
                <div className="min-w-0">
                  <p className="title-3 text-ink">{b.topic}</p>
                  <p className="caption-5 text-ink-2">{b.lead}</p>
                  <p className="caption-3 mt-1 flex items-center gap-1.5 text-cobalt">
                    <CalendarBlank size={14} weight="bold" aria-hidden="true" />
                    <span className="tnum font-mono">{fmtTime(b.date)}</span>
                    {mine ? <span className="text-kettle-deep">· Your seat: {user.seat + 1}</span> : <span>· {i === 0 ? seatsLeft() : b.seatsLeft} seats open</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <Link to="/#mornings" className="title-4 mt-4 inline-flex items-center gap-1 text-cobalt-deep hover:underline">
          How a breakfast runs <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}

/* ─── Member features ─── */

function Features() {
  const others = SEATS.filter(Boolean).filter((m) => m.name !== SPOTLIGHT.name);
  return (
    <section id="features" aria-labelledby="features-h" className="mt-24 scroll-mt-40">
      <Reveal>
        <h2 id="features-h" className="heading-4 text-ink">
          Member features
        </h2>
        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <article className="enamel chipped rounded-[2rem] p-6 md:p-10" style={{ "--chip-y": "64%" }}>
            <div className="flex items-center gap-4">
              <span className="title-2 grid size-16 shrink-0 place-items-center rounded-full border-3 border-cobalt bg-enamel-2 text-cobalt-deep">{initials(SPOTLIGHT.name)}</span>
              <div>
                <p className="title-3 text-ink">{SPOTLIGHT.name}</p>
                <p className="caption-5 text-ink-2">
                  {SPOTLIGHT.business} · {SPOTLIGHT.area}
                </p>
              </div>
              <Sample className="ml-auto" />
            </div>
            <h3 className="heading-5 md:heading-4 mt-8 text-ink">{SPOTLIGHT.title}</h3>
            <blockquote className="mt-6 flex gap-3 border-y-2 border-cobalt-soft py-4">
              <Quotes size={28} weight="fill" className="shrink-0 text-kettle" aria-hidden="true" />
              <p className="title-2 text-cobalt-deep">{SPOTLIGHT.quote}</p>
            </blockquote>
            {SPOTLIGHT.text.map((p) => (
              <p key={p.slice(0, 20)} className="body-3 mt-4 max-w-prose text-ink-2">
                {p}
              </p>
            ))}
          </article>

          <div>
            <h3 className="title-2 text-ink">Members to meet</h3>
            <ul className="mt-4 divide-y-2 divide-cobalt-soft border-y-2 border-cobalt-soft">
              {others.map((m) => (
                <li key={m.name} className="flex items-center gap-3 py-3">
                  <span className="caption-3 grid size-9 shrink-0 place-items-center rounded-full bg-cobalt-deep text-enamel">{initials(m.name)}</span>
                  <div className="min-w-0">
                    <p className="title-4 truncate text-ink">{m.name}</p>
                    <p className="caption-5 truncate text-ink-2">
                      {m.business} · {m.area}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Asks and offers ─── */

function AsksOffers() {
  const posts = usePosts();
  const [kind, setKind] = useState("ask");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setDone("");
    try {
      await addPost({ kind, text });
      setText("");
      setDone(kind === "ask" ? "Your ask is on the board." : "Your offer is on the board.");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <section id="asks" aria-labelledby="asks-h" className="mt-24 scroll-mt-40">
      <Reveal>
        <h2 id="asks-h" className="heading-4 text-ink">
          Asks and offers
        </h2>
        <p className="body-3 mt-2 max-w-[40rem] text-ink-2">Need a supplier, a hire or a referral? Say it here. Have something to share? Offer it.</p>

        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <form onSubmit={submit} noValidate className="enamel chipped h-fit rounded-[2rem] p-6 lg:sticky lg:top-40">
            <fieldset>
              <legend className="title-4 text-ink">I want to post an</legend>
              <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-enamel-2 p-1">
                {[
                  ["ask", "Ask"],
                  ["offer", "Offer"],
                ].map(([k, l]) => (
                  <label key={k} className="button-sm cursor-pointer rounded-full py-2 text-center text-ink-2 transition-colors duration-200 has-checked:bg-cobalt has-checked:text-enamel has-focus-visible:outline-3 has-focus-visible:outline-cobalt">
                    <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
                    {l}
                  </label>
                ))}
              </div>
            </fieldset>
            <label htmlFor="post-text" className="title-4 mt-4 block text-ink">
              {kind === "ask" ? "What do you need?" : "What can you offer?"}
            </label>
            <textarea
              id="post-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
              rows={4}
              aria-invalid={!!error || undefined}
              aria-describedby="post-msg"
              placeholder={kind === "ask" ? "Looking for a supplier of food grade packaging in Mandaue." : "Free use of our meeting room in Banilad on Saturdays."}
              className="body-3 mt-1.5 block w-full resize-none rounded-xl border-2 border-cobalt-soft bg-enamel px-3 py-2 text-ink placeholder:text-ink-2/75 hover:border-cobalt/60 focus:border-cobalt aria-invalid:border-kettle"
            />
            <p id="post-msg" className={`caption-5 mt-1.5 ${error ? "text-kettle-deep" : "text-ink-2"}`} role={error ? "alert" : undefined}>
              {error || done || `${text.length} of 280 characters`}
            </p>
            <button type="submit" disabled={busy} className="btn btn-primary button-md mt-4 px-5 py-2.5">
              {busy ? "Posting…" : kind === "ask" ? "Post my ask" : "Post my offer"}
            </button>
          </form>

          <ul className="space-y-2">
            {posts.length === 0 && <li className="body-3 rounded-2xl border-2 border-dashed border-cobalt-soft p-6 text-ink-2">No asks or offers yet. Be the first to post one.</li>}
            {posts.map((p) => (
              <li key={p.id} className={`rounded-2xl border-2 p-4 ${p.mine ? "enamel" : "border-cobalt-soft"}`}>
                <div className="flex items-center gap-2">
                  <span className={`caption-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${p.kind === "ask" ? "bg-enamel-2 text-cobalt-deep" : "bg-celadon/15 text-[#3c6b5c]"}`}>
                    {p.kind === "ask" ? <Question size={12} weight="bold" aria-hidden="true" /> : <HandHeart size={12} weight="bold" aria-hidden="true" />}
                    {p.kind === "ask" ? "Ask" : "Offer"}
                  </span>
                  <span className="tnum caption-5 ml-auto font-mono text-ink-2">{shortDate(p.at)}</span>
                </div>
                <p className="body-3 mt-2 text-ink">{p.text}</p>
                <p className="caption-5 mt-2 text-ink-2">
                  {p.mine ? "You" : p.name} · {p.business}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Guests see the gate ─── */

function Gate() {
  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24 pb-16">
      <div className="enamel-cobalt speckle max-w-md rounded-[2rem] p-8 text-center text-enamel">
        <h1 className="heading-4">The board is for members.</h1>
        <p className="body-3 mt-3 text-cobalt-soft">Reserve a seat to read business news, the schedule and member features.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/join" className="btn btn-primary button-md px-5 py-2.5">
            Reserve a seat
          </Link>
          <Link to="/join?mode=signin" className="btn btn-plain button-md px-5 py-2.5">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
