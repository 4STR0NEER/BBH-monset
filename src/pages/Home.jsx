import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowsClockwise, DownloadSimple, MapPin, QrCode, ShareNetwork } from "@phosphor-icons/react";
import DigitalCard from "../components/DigitalCard.jsx";
import { EASE, Reveal, Sample, stagger } from "../components/ui.jsx";
import { Link } from "../lib/router.jsx";
import { DAY_NAMES, getMember, hubById, hubsByNext, manilaNow, minutesUntil, useUser, whenLabel } from "../lib/api.js";
import { DEALS, HUBS, MEMBERS } from "../data/sample.js";

// Re-render once a minute so "next up" and "today" stay true while the page is open.
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function Home() {
  const now = useNow();
  const next = hubsByNext(now)[0];
  return (
    <>
      <Hero now={now} next={next} />
      <Hubs now={now} next={next} />
      <Deals />
      <CardShowcase />
      <Steps />
      <FinalCta />
    </>
  );
}

function Hero({ now, next }) {
  const user = useUser();
  const reduce = useReducedMotion();
  const rise = (i) => ({
    initial: { opacity: 0, transform: reduce ? "none" : "translateY(28px)", filter: reduce ? "none" : "blur(6px)" },
    animate: { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" },
    transition: { duration: 0.9, ease: EASE, delay: 0.08 + i * 0.09 },
  });
  return (
    <section className="lamp relative px-4 pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <h1 className="display-1 text-cream">
          <motion.span className="block" {...rise(0)}>
            Grow your business
          </motion.span>
          <motion.span className="block text-gold" {...rise(1)}>
            over breakfast
          </motion.span>
        </h1>
        <motion.div {...rise(2)} className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p className="body-2 max-w-[36rem] text-mute">
            Cebu business owners meet every week at a hub near them. Join a hub, come to breakfast, and carry a digital calling card anyone at the table can scan.
          </p>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <Link to="/card" className="btn btn-gold button-md px-6">
                Open my card <ArrowRight weight="bold" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link to="/join" className="btn btn-gold px-6">
                  Join a hub <ArrowRight weight="bold" aria-hidden="true" />
                </Link>
                <Link to="/join?mode=signin" className="btn btn-line px-6">
                  I&rsquo;m already a member
                </Link>
              </>
            )}
          </div>
        </motion.div>

        <motion.div {...rise(3)} className="mt-16 md:mt-20">
          <Week now={now} next={next} />
        </motion.div>
      </div>
    </section>
  );
}

// The week at a glance: Monday to Friday, each hub on its day, today lit.
function Week({ now, next }) {
  const today = manilaNow(now).day;
  return (
    <div className="surface rounded-[1.75rem] p-2">
      <a href={`#hub-${next.id}`} className="group flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[1.35rem] bg-coal-2 px-5 py-4 transition-colors duration-200 hover:bg-coal-3">
        <span className="label flex items-center gap-2 text-gold">
          <span className="live-dot relative size-2 rounded-full bg-gold" aria-hidden="true" />
          Next up
        </span>
        <span className="serif-3 text-cream">{next.name}</span>
        <span className="tnum title-4 font-mono text-cream">{whenLabel(next, now)}</span>
        <span className="body-6 text-mute">
          {next.venue}, {next.city}
        </span>
        <ArrowRight size={16} weight="bold" aria-hidden="true" className="ml-auto text-mute transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cream" />
      </a>
      <ol className="mt-2 grid gap-1.5 sm:grid-cols-5" aria-label="This week">
        {[1, 2, 3, 4, 5].map((d) => {
          const hubs = HUBS.filter((h) => h.day === d);
          const isToday = d === today;
          return (
            <li key={d} className={`flex gap-4 rounded-[1.1rem] border p-3.5 sm:block sm:min-h-28 ${hubs.length ? "" : "hidden sm:block"} ${isToday ? "border-gold/40 bg-gold-soft" : "border-transparent"}`} aria-current={isToday ? "date" : undefined}>
              <p className={`label w-10 shrink-0 pt-0.5 text-[10px] sm:w-auto ${isToday ? "text-gold" : "text-mute"}`}>
                <span className="sm:hidden">{DAY_NAMES[d].slice(0, 3)}</span>
                <span className="hidden sm:inline">{DAY_NAMES[d]}</span>
                {isToday && <span className="sr-only"> (today)</span>}
              </p>
              <ul className="flex flex-col gap-2 sm:mt-3">
                {hubs.map((h) => (
                  <li key={h.id}>
                    <a href={`#hub-${h.id}`} className="block rounded-md hover:underline">
                      <span className="title-4 block leading-tight text-cream">{h.name}</span>
                      <span className="tnum caption-5 font-mono text-mute">{h.time}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Hubs({ now, next }) {
  const reduce = useReducedMotion();
  const ordered = [...HUBS].sort((a, b) => a.day - b.day || minutesUntil(a, now) - minutesUntil(b, now));
  return (
    <section id="hubs" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-2 max-w-[14ch] text-cream">
            {HUBS.length} tables <span className="text-gold">across Cebu</span>
          </h2>
          <p className="body-3 max-w-sm text-mute">Every hub is its own table: same faces each week, so introductions turn into business.</p>
        </Reveal>

        <motion.ul variants={stagger.parent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((h) => (
            <motion.li key={h.id} id={`hub-${h.id}`} variants={stagger.child(reduce)} className="scroll-mt-28">
              <Link
                to={`/join?hub=${h.id}`}
                className="surface group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[1.5rem] p-6 transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-gold/35 active:scale-[0.985] md:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="display-3 text-gold sm:text-[2.75rem]">{DAY_NAMES[h.day]}</p>
                  {h.id === next.id && (
                    <span className="label flex shrink-0 items-center gap-1.5 rounded-full border border-gold/30 px-2.5 py-1 text-[10px] text-gold">
                      <span className="live-dot relative size-1.5 rounded-full bg-gold" aria-hidden="true" />
                      Next up
                    </span>
                  )}
                </div>
                <p className="tnum title-3 mt-1 font-mono text-cream">{h.time}</p>
                <div className="mt-auto pt-10">
                  <h3 className="serif-1 text-cream">{h.name}</h3>
                  <p className="body-6 mt-2 flex items-center gap-1.5 text-mute">
                    <MapPin size={14} weight="fill" aria-hidden="true" className="text-gold/70" />
                    {h.venue}, {h.city}
                  </p>
                  <p className="title-4 mt-6 flex items-center gap-1.5 border-t border-cream/10 pt-4 text-cream">
                    Join {h.name}
                    <ArrowRight size={14} weight="bold" aria-hidden="true" className="text-gold transition-transform duration-200 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

const until = (iso) => new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", timeZone: "Asia/Manila" });

function Deals() {
  const reduce = useReducedMotion();
  return (
    <section id="deals" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="display-2 text-cream">
                Member <span className="text-gold">deals</span>
              </h2>
              <Sample className="text-mute" />
            </div>
            <p className="body-3 mt-4 max-w-md text-mute">Members give each other their best price. Show your BBH card at the counter to redeem.</p>
          </div>
        </Reveal>

        <motion.ul variants={stagger.parent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {DEALS.map((d) => {
            const by = getMember(d.by) ?? MEMBERS[0];
            return (
              <motion.li key={d.id} variants={stagger.child(reduce)} className="surface relative flex flex-col rounded-[1.5rem]">
                <div className="flex items-start gap-5 p-6">
                  <p className="display-2 shrink-0 text-gold">{d.value}</p>
                  <p className="title-2 pt-1 text-cream">{d.title}</p>
                </div>
                {/* perforation: a dashed tear line with notches, like a voucher */}
                <div className="relative mx-6 border-t border-dashed border-cream/15" aria-hidden="true">
                  <span className="absolute -top-3 -left-9 size-6 rounded-full bg-night" />
                  <span className="absolute -top-3 -right-9 size-6 rounded-full bg-night" />
                </div>
                <div className="flex items-end justify-between gap-3 p-6 pt-4">
                  <div className="min-w-0">
                    <p className="title-4 truncate text-cream">{by.business}</p>
                    <p className="caption-5 truncate text-mute">{hubById(d.hub)?.name} hub</p>
                  </div>
                  <p className="tnum caption-5 shrink-0 font-mono text-mute">Until {until(d.until)}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

const CARD_POINTS = [
  { icon: QrCode, text: "A QR on the back opens your card on any phone. No app to install." },
  { icon: DownloadSimple, text: "One tap saves you to their contacts: name, number, email, website." },
  { icon: ShareNetwork, text: "Share the link in Messenger or Viber after breakfast." },
];

function CardShowcase() {
  const [flipped, setFlipped] = useState(false);
  const sample = MEMBERS[1];
  return (
    <section id="card" className="px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <h2 className="display-2 text-cream">
            Your card, <span className="text-gold">in every pocket</span>
          </h2>
          <p className="body-3 mt-5 max-w-md text-mute">Every member gets a digital calling card. Hand it across the table without running out of paper ones.</p>
          <ul className="mt-8 flex flex-col divide-y divide-cream/10 border-y border-cream/10">
            {CARD_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4 py-4">
                <Icon size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <p className="body-3 text-cream">{text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <DigitalCard member={sample} flipped={flipped} className="mx-auto max-w-[520px]" />
          <div className="mt-6 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setFlipped((f) => !f)} className="btn btn-line title-4 px-5" aria-pressed={flipped}>
              <ArrowsClockwise size={16} weight="bold" aria-hidden="true" />
              {flipped ? "Show the front" : "Show the QR"}
            </button>
            <Sample className="text-mute" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS = [
  { title: "Join a hub", text: "Pick the table nearest you and fill in your card. It takes about a minute." },
  { title: "Come to breakfast", text: "Same day, same place, every week. Say who you are and what you need." },
  { title: "Trade cards", text: "Let people scan your QR. Follow up with the ones who can help." },
];

function Steps() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="display-2 text-cream">How it works</h2>
        </Reveal>
        <Reveal as="ol" delay={0.1} className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-gold/40 pt-5">
              <p className="tnum font-mono text-sm text-gold">0{i + 1}</p>
              <h3 className="serif-2 mt-3 text-cream">{s.title}</h3>
              <p className="body-3 mt-2 text-mute">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  const user = useUser();
  return (
    <section className="px-4 pt-12 pb-16">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-8 rounded-[2rem] bg-gold px-6 py-14 md:flex-row md:items-end md:justify-between md:px-12 md:py-20">
        <h2 className="display-1 max-w-[10ch] text-ink">See you at breakfast</h2>
        <Link to={user ? "/card" : "/join"} className="btn bg-ink px-6 text-cream hover:bg-coal-2">
          {user ? "Open my card" : "Join a hub"} <ArrowRight weight="bold" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
