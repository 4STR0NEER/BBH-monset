import { Link } from "../lib/router.jsx";

// Phase 2 replaces this with the place card registration and sign in.
export default function Join() {
  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24 pb-16">
      <div className="enamel max-w-md rounded-[2rem] p-8 text-center">
        <h1 className="heading-4 text-ink">Your place card is being set.</h1>
        <p className="body-3 mt-3 text-ink-2">Seat reservations open in the next build of this demo.</p>
        <Link to="/" className="btn btn-plain button-md mt-6 px-5 py-2.5">
          Back to the table
        </Link>
      </div>
    </section>
  );
}
