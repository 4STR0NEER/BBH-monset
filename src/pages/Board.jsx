import { useUser } from "../lib/api.js";
import { Link } from "../lib/router.jsx";

// Phase 3 builds the real board. Members only: guests are sent to reserve a seat.
export default function Board() {
  const user = useUser();
  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24 pb-16">
      <div className="enamel-cobalt speckle max-w-md rounded-[2rem] p-8 text-center text-enamel">
        {user ? (
          <>
            <h1 className="heading-4">The board is being lettered.</h1>
            <p className="body-3 mt-3 text-cobalt-soft">News, the schedule and member features arrive in the next build of this demo.</p>
            <Link to="/join" className="btn btn-plain button-md mt-6 px-5 py-2.5">
              Back to your card
            </Link>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
