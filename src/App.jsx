import { FacebookLogo } from "@phosphor-icons/react";
import Nav from "./components/Nav.jsx";
import { Logo } from "./components/ui.jsx";
import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import MyCard, { PublicCard } from "./pages/Card.jsx";
import Admin from "./pages/Admin.jsx";
import Legal from "./pages/Legal.jsx";
import { Link, usePath } from "./lib/router.jsx";

const PAGES = {
  "/": Home,
  "/join": Join,
  "/card": MyCard,
  "/admin": Admin,
  "/privacy": () => <Legal kind="privacy" />,
  "/terms": () => <Legal kind="terms" />,
};

export default function App() {
  const path = usePath();
  const cardId = path.match(/^\/c\/([\w-]+)\/?$/)?.[1];
  const Page = cardId ? () => <PublicCard id={cardId} /> : (PAGES[path] ?? NotFound);
  return (
    <div className="grain">
      <Nav />
      <main id="main">
        <Page />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <section className="lamp grid min-h-svh place-items-center px-4 pt-24 text-center">
      <div className="max-w-md">
        <p className="tnum font-mono text-gold">404</p>
        <h1 className="serif-1 mt-2 text-cream">No table here.</h1>
        <p className="body-3 mt-3 text-mute">The page you followed doesn&rsquo;t exist. The breakfasts do.</p>
        <Link to="/" className="btn btn-line mt-8 px-6">
          See the hubs
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-cream/10 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="caption-5 mt-3 text-mute">Business Breakfast Hub · Cebu, Philippines</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a href="https://www.facebook.com/adminBBH" target="_blank" rel="noreferrer" className="title-4 inline-flex items-center gap-2 text-cream hover:underline">
            <FacebookLogo size={18} weight="bold" aria-hidden="true" /> BBH on Facebook
          </a>
          <p className="caption-5 flex gap-4 text-mute">
            <Link to="/privacy" className="underline hover:text-cream">
              Privacy
            </Link>
            <Link to="/terms" className="underline hover:text-cream">
              Terms
            </Link>
            <Link to="/admin" className="underline hover:text-cream">
              Admin
            </Link>
          </p>
          <p className="caption-5 text-faint">Website by Monset, built pro bono for the BBH community.</p>
        </div>
      </div>
    </footer>
  );
}
