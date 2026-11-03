import { Link } from "../lib/router.jsx";

// Plain-language drafts for BBH to review with their lawyer before launch. Not legal advice.
const FB = "https://www.facebook.com/adminBBH";

const DOCS = {
  privacy: {
    title: "Privacy",
    updated: "November 4, 2026",
    sections: [
      ["What we collect", "When you join a hub we ask for your name, title, business name, field of business, where you're based, the hub you go to, your email and a password. Your mobile number and website are optional. We also keep whether you said you're coming to this week's breakfast."],
      ["Why we collect it", "To make your digital calling card, let you sign in, and help the organisers plan each hub's breakfast. We don't sell your details or use them for advertising."],
      ["Who can see it", "Your card is public to anyone with its link or QR code: your name, title, business, field of business, hub, and the mobile number, email and website you put on it. Only put on your card what you're happy to hand out. BBH organisers can see the member list and attendance. Your password is never shown to anyone."],
      ["How long we keep it", "For as long as you're a member. Ask us and we'll delete your account and card."],
      ["Your rights", "Under the Data Privacy Act of 2012 (Republic Act 10173) you can ask to see, correct or delete the personal data we hold about you, and you can complain to the National Privacy Commission."],
      ["Cookies and storage", "This site keeps you signed in by saving a small note in your browser. It doesn't use tracking or advertising cookies."],
      ["Contact", "Message the BBH organisers through our Facebook page."],
    ],
  },
  terms: {
    title: "Terms of use",
    updated: "November 4, 2026",
    sections: [
      ["Who can join", "Business owners, founders and managers who run a business in Cebu. The organisers may decline or remove a membership that doesn't fit the community."],
      ["Your card", "Keep your card accurate and about your own business. Don't use someone else's name or business."],
      ["Member deals", "Deals are offered by members, not by BBH. The member offering a deal sets its terms and honours it."],
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
        <h1 className="display-2 text-cream">{doc.title}</h1>
        <p className="caption-5 mt-3 text-mute">Last updated {doc.updated}</p>
        <p className="body-6 surface mt-6 rounded-xl px-4 py-3 text-mute">Draft for the BBH organisers to review before launch. It's written in plain language and isn't legal advice.</p>
        {doc.sections.map(([h, p]) => (
          <section key={h} className="mt-10">
            <h2 className="title-2 text-cream">{h}</h2>
            <p className="body-3 mt-2 text-mute">
              {p}
              {h === "Contact" && (
                <>
                  {" "}
                  <a href={FB} target="_blank" rel="noreferrer" className="text-cream underline">
                    facebook.com/adminBBH
                  </a>
                </>
              )}
            </p>
          </section>
        ))}
        <Link to="/" className="btn btn-line mt-12 px-6">
          Back to the hubs
        </Link>
      </div>
    </article>
  );
}
