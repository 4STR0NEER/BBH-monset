import { ArrowRight, CalendarCheck, Handshake, Megaphone, Newspaper, Plus } from "@phosphor-icons/react";
import Table from "../components/Table.jsx";
import { Reveal, Sample, TaglineReveal, fmtDate, fmtTime } from "../components/ui.jsx";
import { Link } from "../lib/router.jsx";
import { seatsFor, seatsLeft, useUser } from "../lib/api.js";
import { AGENDA, AGENDA_END, BOARD_PREVIEW, NEXT_BREAKFAST } from "../data/sample.js";

const nb = NEXT_BREAKFAST;

export default function Home() {
  return (
    <>
      <Hero />
      <Mornings />
      <section className="px-4 py-24 md:py-32">
        <TaglineReveal
          className="heading-3 md:heading-1 mx-auto max-w-[680px] text-ink"
          lines={["Most deals in Cebu still start over kape.", "We just set the table."]}
        />
      </section>
      <SeatGets />
      <BoardPreview />
      <Steps />
      <Faq />
      <FinalCta />
    </>
  );
}

function Hero() {
  const user = useUser();
  return (
    <section id="table" className="relative overflow-x-clip px-4 pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative z-10 max-w-[680px]">
          <h1 className="heading-2 sm:heading-1 text-ink">
            Pull up a chair.
            <span className="block text-cobalt">Cebu&rsquo;s owners meet over breakfast.</span>
          </h1>
          <p className="body-3 mt-6 max-w-[34rem] text-ink-2 md:text-lg md:leading-7">
            Business Breakfast Hub is a table of Cebu business owners who meet before the shops open. Reserve a seat, meet the people beside you, and follow
            what the table is working on.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {user ? (
              <>
                <Link to="/board" className="btn btn-primary button-lg px-6 py-3">
                  Go to the board <ArrowRight weight="bold" aria-hidden="true" />
                </Link>
                <Link to="/join" className="title-3 text-cobalt-deep underline">
                  {user.seat != null ? `You're in seat ${user.seat + 1}. See your card` : "See your card"}
                </Link>
              </>
            ) : (
              <>
                <Link to="/join" className="btn btn-primary button-lg px-6 py-3">
                  Reserve your seat <ArrowRight weight="bold" aria-hidden="true" />
                </Link>
                <Link to="/join?mode=signin" className="title-3 text-cobalt-deep underline">
                  Already a member? Take your seat
                </Link>
              </>
            )}
          </div>

          {/* proof: the next breakfast, as a small enamel plate */}
          <div className="enamel chipped mt-10 inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl px-4 py-3">
            <CalendarCheck size={28} weight="duotone" className="shrink-0 text-cobalt" aria-hidden="true" />
            <div className="min-w-0">
              <p className="title-4 text-ink">
                Next breakfast · {fmtDate(nb.date)} · <span className="tnum font-mono">{fmtTime(nb.date)}</span>
              </p>
              <p className="caption-5 text-ink-2">
                {nb.venue} · <span className="tnum font-mono">{seatsLeft()}</span> of <span className="tnum font-mono">{nb.seatsTotal}</span> seats open
              </p>
            </div>
            <Sample />
          </div>
        </div>

        <div className="relative -mx-4 w-[calc(100%+2rem)] max-w-[600px] sm:mx-auto sm:w-full lg:w-[118%] lg:max-w-none lg:-mr-[18%]">
          <Table seats={seatsFor(user)} />
          <p className="caption-5 mt-2 text-center text-ink-2">Tap a seat to see who sits there. The red ones are open.</p>
        </div>
      </div>
    </section>
  );
}

function Mornings() {
  return (
    <section id="mornings" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <h2 className="heading-3 md:heading-2 text-ink">One table, ninety minutes, then back to work.</h2>
            <p className="body-3 mt-4 text-ink-2">
              Every block below is as long as it runs. Kape gets the most time, because that is where most of the deals start.
            </p>
          </div>
          <Sample />
        </Reveal>

        <Reveal as="ol" delay={0.1} className="mt-12 flex flex-col gap-2 md:flex-row">
          {AGENDA.map((a) => (
            <li
              key={a.time}
              className="enamel flex flex-col rounded-2xl p-4 md:min-h-64 md:[flex:var(--g)_1_0%]"
              style={{ "--g": a.min, minHeight: `max(${a.min * 5}px, 7rem)` }}
            >
              <p className="flex items-baseline justify-between gap-2">
                <span className="tnum font-mono text-lg font-medium text-cobalt-deep">{a.time}</span>
                <span className="tnum caption-5 font-mono text-ink-2">{a.min} min</span>
              </p>
              <h3 className="title-2 mt-auto pt-6 text-ink">{a.title}</h3>
              <p className="body-6 mt-1 text-ink-2">{a.text}</p>
            </li>
          ))}
          <li className="flex items-center justify-center rounded-2xl border-3 border-dashed border-cobalt-soft px-4 py-3 md:w-24 md:flex-none">
            <span className="tnum font-mono text-lg font-medium text-ink-2">{AGENDA_END}</span>
          </li>
        </Reveal>
      </div>
    </section>
  );
}

const GETS = [
  { icon: CalendarCheck, title: "A seat at every breakfast", text: "See the schedule and reserve ahead, instead of catching it on Facebook the night before." },
  { icon: Newspaper, title: "The business board", text: "Member news, openings, and who needs what this month, in one place." },
  { icon: Megaphone, title: "A turn in the spotlight", text: "Members take turns as the featured business, in front of the whole table." },
  { icon: Handshake, title: "Asks and offers", text: "Need a supplier, a hire or a referral? Post it, and the table answers." },
];

function SeatGets() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="heading-3 md:heading-2 text-ink lg:sticky lg:top-32">What your seat gets you</h2>
        </Reveal>
        <Reveal as="ul" delay={0.1} className="divide-y-2 divide-cobalt-soft border-y-2 border-cobalt-soft">
          {GETS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 py-6">
              <span className="enamel grid size-12 shrink-0 place-items-center rounded-full">
                <Icon size={22} weight="bold" className="text-cobalt" aria-hidden="true" />
              </span>
              <div>
                <h3 className="heading-6 text-ink">{title}</h3>
                <p className="body-3 mt-1 text-ink-2">{text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function BoardPreview() {
  return (
    <section id="board" className="px-4 py-24">
      <Reveal className="enamel-cobalt speckle chipped mx-auto max-w-5xl rounded-[2rem] p-6 text-enamel md:p-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[680px]">
            <h2 className="heading-3 md:heading-2">The board</h2>
            <p className="body-3 mt-3 text-cobalt-soft">Business news, the breakfast schedule and member features. Here is the top of this week&rsquo;s.</p>
          </div>
          <span className="caption-3 rounded-full border-2 border-enamel/40 px-2 py-0.5">Sample</span>
        </div>
        <ul className="mt-10 divide-y-2 divide-enamel/15 border-y-2 border-enamel/15">
          {BOARD_PREVIEW.map((b, i) => (
            <li key={b.title} className={`flex flex-col gap-1 py-5 sm:flex-row sm:gap-6 ${i === 2 ? "select-none blur-[3px]" : ""}`} aria-hidden={i === 2 || undefined}>
              <span className="caption-3 w-20 shrink-0 pt-1 tracking-wide text-cobalt-soft uppercase">{b.tag}</span>
              <p className="title-2 text-enamel">{b.title}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/join" className="btn btn-primary button-md px-5 py-2.5">
            Reserve a seat to read the board
          </Link>
          <p className="body-6 text-cobalt-soft">Members see the full board after signing in.</p>
        </div>
      </Reveal>
    </section>
  );
}

const STEPS = [
  { title: "Fill in your place card", text: "Your name, your business, what you do. It takes about a minute." },
  { title: "Pick your seat", text: "Choose a chair at the next breakfast. Your place card waits there." },
  { title: "Come hungry", text: `Kape is poured at ${AGENDA[0].time}. Bring cards; the table brings the rest.` },
];

function Steps() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="heading-3 md:heading-2 max-w-[680px] text-ink">Three steps to the table</h2>
        </Reveal>
        <Reveal as="ol" delay={0.1} className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-3 border-cobalt pt-4">
              <h3 className="heading-5 text-ink">
                <span className="tnum mr-2 font-mono text-kettle">{i + 1}</span>
                {s.title}
              </h3>
              <p className="body-3 mt-2 text-ink-2">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Who is Business Breakfast Hub for?", a: "Owners, founders and managers who run a business in Cebu, from a single stall to a family company with branches." },
  { q: "What happens at a breakfast?", a: "Kape and arrivals, a quick round where everyone says what they do and need, one member feature, then asks and offers. You are out by eight." },
  { q: "Do I have to pitch?", a: "No. You get a minute to say who you are and what you need. Nobody sells across the plates." },
  { q: "Where is it held?", a: "The venue for each breakfast is posted on the schedule when it is confirmed." },
  { q: "What does membership cost?", a: "The organisers will post membership details here once they are confirmed. Reserving a seat on this site is free." },
  { q: "What do I get after reserving a seat?", a: "A member card and access to the board: business news, the breakfast schedule and member features." },
  { q: "How do I sign in next time?", a: "Choose Take your seat and use the email you registered with." },
];

function Faq() {
  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="heading-3 md:heading-2 text-ink">Questions before your first kape</h2>
        </Reveal>
        <Reveal delay={0.1} className="divide-y-2 divide-cobalt-soft border-y-2 border-cobalt-soft">
          {FAQ.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-5 [&::-webkit-details-marker]:hidden">
                <span className="title-2 text-ink">{f.q}</span>
                <Plus size={20} weight="bold" aria-hidden="true" className="shrink-0 text-cobalt transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45" />
              </summary>
              <p className="body-3 max-w-prose pb-6 text-ink-2">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pt-12 pb-24">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <svg viewBox="0 0 120 120" className="w-24" aria-hidden="true">
          <circle cx="60" cy="60" r="50" fill="#fbfcfd" stroke="#c6361d" strokeWidth="5" strokeDasharray="10 7" />
          <circle cx="60" cy="60" r="36" fill="none" stroke="#dde4ee" strokeWidth="3" />
        </svg>
        <h2 className="heading-3 md:heading-2 mt-8 text-ink">
          Your plate is set.
          <span className="block text-cobalt">The chair is still empty.</span>
        </h2>
        <p className="body-3 mt-4 max-w-md text-ink-2">
          {seatsLeft()} seats are open for {fmtDate(nb.date)}. Reserving is free and takes about a minute.
        </p>
        <Link to="/join" className="btn btn-primary button-lg mt-8 px-6 py-3">
          Reserve your seat <ArrowRight weight="bold" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
