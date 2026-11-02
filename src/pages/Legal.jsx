import { Link } from "../lib/router.jsx";

// Plain-language drafts for BBH to review with their lawyer before launch. Not legal advice.
const FB = "https://www.facebook.com/adminBBH";

const DOCS = {
  privacy: {
    title: "Privacy",
    updated: "November 2, 2026",
    sections: [
      ["What we collect", "When you reserve a seat we ask for your name, business name, what your business does, where you're based, your email and a password. If you post an ask or offer, we keep that text with your name and business."],
      ["Why we collect it", "To give you a seat at the breakfast, show your place card to the table, let you sign in to the member board, and let other members see your asks and offers. We don't sell your details or use them for advertising."],
      ["Who can see it", "Other members who are signed in can see your name, business, area, seat and posts. Your email and password are never shown to anyone."],
      ["How long we keep it", "For as long as you're a member. Ask us and we'll delete your account and posts."],
      ["Your rights", "Under the Data Privacy Act of 2012 (Republic Act 10173) you can ask to see, correct or delete the personal data we hold about you, and you can complain to the National Privacy Commission."],
      ["Cookies and storage", "This site keeps you signed in by saving a small note in your browser. It doesn't use tracking or advertising cookies."],
      ["Contact", "Message the BBH organisers through our Facebook page."],
    ],
  },
  terms: {
    title: "Terms of use",
    updated: "November 2, 2026",
    sections: [
      ["Who can join", "Business owners, founders and managers who run a business in Cebu. The organisers may decline or remove a membership that doesn't fit the community."],
      ["Your seat", "Reserving a seat holds a place at that breakfast. If you can't come, give up your seat on the board so someone else can sit down."],
      ["Posting asks and offers", "Keep posts about real business needs and offers. No spam, no misleading claims, nothing illegal. The organisers may remove posts that break these rules."],
      ["Deals between members", "Introductions happen at the table, but any deal is between the members involved. BBH isn't a party to it and isn't responsible for it."],
      ["Changes", "We may update these terms. The date at the top shows the latest version."],
      ["Contact", "Message the BBH organisers through our Facebook page."],
    ],
  },
};

export default function Legal({ kind }) {
  const doc = DOCS[kind];
  return (
    <article className="px-4 pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[680px]">
        <h1 className="heading-3 md:heading-2 text-ink">{doc.title}</h1>
        <p className="caption-5 mt-3 text-ink-2">Last updated {doc.updated}</p>
        <p className="body-6 surface mt-6 rounded-xl px-4 py-3 text-ink-2">Draft for the BBH organisers to review before launch. It's written in plain language and isn't legal advice.</p>
        {doc.sections.map(([h, p]) => (
          <section key={h} className="mt-10">
            <h2 className="heading-6 text-ink">{h}</h2>
            <p className="body-3 mt-2 text-ink-2">
              {p}
              {h === "Contact" && (
                <>
                  {" "}
                  <a href={FB} target="_blank" rel="noreferrer" className="text-ink underline">
                    facebook.com/adminBBH
                  </a>
                </>
              )}
            </p>
          </section>
        ))}
        <Link to="/" className="btn btn-plain button-md mt-12 px-5 py-2.5">
          Back to the table
        </Link>
      </div>
    </article>
  );
}
