import { FacebookLogo } from "@phosphor-icons/react";
import Nav from "./components/Nav.jsx";
import { Logo } from "./components/ui.jsx";
import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import Board from "./pages/Board.jsx";
import Legal from "./pages/Legal.jsx";
import { Link, usePath } from "./lib/router.jsx";

const PAGES = {
  "/": Home,
  "/join": Join,
  "/board": Board,
  "/privacy": () => <Legal kind="privacy" />,
  "/terms": () => <Legal kind="terms" />,
};

export default function App() {
  const path = usePath();
  const Page = PAGES[path] ?? NotFound;
  return (
    <>
      <Nav />
      <main id="main">
        <Page />
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <section className="grid min-h-svh place-items-center px-4 pt-24 text-center">
      <div className="max-w-md">
        <p className="tnum font-mono text-ochre-ink">404</p>
        <h1 className="heading-3 mt-2 text-ink">This seat isn&rsquo;t at our table.</h1>
        <p className="body-3 mt-3 text-ink-2">The page you followed doesn&rsquo;t exist. The breakfast does.</p>
        <Link to="/" className="btn btn-plain button-md mt-8 px-5 py-2.5">
          Back to the table
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-8">
      <div className="panel-dark mx-auto flex max-w-6xl flex-col gap-6 rounded-[2rem] p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <Logo tone="paper" />
          <p className="body-6 mt-3 text-paper/70">Business Breakfast Hub · Cebu, Philippines</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a href="https://www.facebook.com/adminBBH" target="_blank" rel="noreferrer" className="title-4 inline-flex items-center gap-2 text-paper hover:underline">
            <FacebookLogo size={18} weight="bold" aria-hidden="true" /> BBH on Facebook
          </a>
          <p className="caption-5 text-paper/70">Website by Monset, built pro bono for the BBH community.</p>
          <p className="caption-5 flex gap-4 text-paper/70">
            <Link to="/privacy" className="underline hover:text-paper">
              Privacy
            </Link>
            <Link to="/terms" className="underline hover:text-paper">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
