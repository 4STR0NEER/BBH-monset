// SAMPLE DATA. Every name, business, date and venue here is made up for the demo.
// Replace with BBH's real details before launch; the UI labels all of it "Sample".

// Seats around the table on the landing page. `null` = an open seat.
export const SEATS = [
  { name: "Ana Lim", business: "Lim Builders Supply", area: "Mandaue" },
  { name: "Jun Villaflor", business: "Kape Sugbo Roasters", area: "Cebu City" },
  { name: "Grace Abellana", business: "Abellana Bakeshop", area: "Talisay" },
  null,
  { name: "Rafael Uy", business: "Pier 3 Freight", area: "North Reclamation" },
  { name: "Mae Tan", business: "Tan Dental Studio", area: "Banilad" },
  { name: "Carlo Mendoza", business: "Isla Furniture Works", area: "Mandaue" },
  null,
  { name: "Liza Cabahug", business: "Cabahug Travel and Tours", area: "Lapu-Lapu" },
  { name: "Ben Yap", business: "Yap Auto Parts", area: "Colon" },
];

export const NEXT_BREAKFAST = {
  date: "2026-11-05T06:30:00+08:00",
  venue: "Sample venue, Cebu IT Park",
  topic: "Hiring your first manager",
  speaker: "Mae Tan, Tan Dental Studio",
  seatsTotal: 24,
  seatsTaken: 19,
};

// How a breakfast runs. `min` sets each block's length on the page, so a 30 minute block is
// visibly twice a 15 minute one.
export const AGENDA = [
  { time: "6:30", min: 30, title: "Kape and arrivals", text: "Find your place card, pour a cup, meet whoever sits beside you." },
  { time: "7:00", min: 20, title: "Round the table", text: "Everyone gets a minute: who you are, what you sell, what you need this month." },
  { time: "7:20", min: 25, title: "Member feature", text: "One member walks the table through a real problem in their business and what they did about it." },
  { time: "7:45", min: 15, title: "Asks and offers", text: "Suppliers, hires, referrals. Say what you need; someone at the table usually knows someone." },
];
export const AGENDA_END = "8:00";

export const BOARD_PREVIEW = [
  { tag: "News", title: "Mandaue suppliers report shorter port delays after the new North Reclamation schedule" },
  { tag: "Feature", title: "How Abellana Bakeshop went from one oven in Talisay to three branches" },
  { tag: "Asks", title: "Looking for a bookkeeper who knows BIR electronic invoicing, part time" },
];

// ─── The member board (all sample) ───

export const NEWS = [
  { id: "n1", tag: "Members", date: "2026-11-02", title: "Tan Dental Studio opens a second chair in Banilad and is hiring an assistant", text: "Mae Tan says the new chair doubles weekday slots. She is looking for an assistant with clinic experience; ask her at Thursday's breakfast." },
  { id: "n2", tag: "Cebu business", date: "2026-11-01", title: "Mandaue suppliers report shorter port delays after the North Reclamation schedule change", text: "Three members in hardware and freight say container pickups are moving a day faster this month. Rafael Uy will share numbers on Nov 26." },
  { id: "n3", tag: "Tips", date: "2026-10-30", title: "What electronic invoicing means for small retailers, in plain terms", text: "A one page summary from a member accountant: who has to switch, what your POS needs, and the three mistakes she sees most." },
  { id: "n4", tag: "Cebu business", date: "2026-10-29", title: "Colon and Carbon vendors start stocking early for holiday foot traffic", text: "Members in retail compare notes on how much to order before December and which suppliers still have stock." },
  { id: "n5", tag: "Members", date: "2026-10-27", title: "Kape Sugbo Roasters now supplies three IT Park cafes", text: "Jun Villaflor landed the third account through an introduction at the October breakfast." },
  { id: "n6", tag: "Tips", date: "2026-10-24", title: "Getting your business permit renewal done before the January rush", text: "A checklist from members who renewed early last year, with the documents most people forget." },
];

export const SCHEDULE = [
  { date: "2026-11-05T06:30:00+08:00", topic: "Hiring your first manager", lead: "Mae Tan, Tan Dental Studio", seatsLeft: 5 },
  { date: "2026-11-12T06:30:00+08:00", topic: "Selling to IT Park offices", lead: "Jun Villaflor, Kape Sugbo Roasters", seatsLeft: 11 },
  { date: "2026-11-19T06:30:00+08:00", topic: "Cash flow before the holidays", lead: "Grace Abellana, Abellana Bakeshop", seatsLeft: 14 },
  { date: "2026-11-26T06:30:00+08:00", topic: "Moving goods through Cebu ports", lead: "Rafael Uy, Pier 3 Freight", seatsLeft: 17 },
  { date: "2026-12-03T06:30:00+08:00", topic: "Year end round table: what worked this year", lead: "Everyone at the table", seatsLeft: 21 },
];

export const SPOTLIGHT = {
  name: "Grace Abellana",
  business: "Abellana Bakeshop",
  area: "Talisay",
  title: "From one oven in Talisay to three branches",
  quote: "I stopped trying to bake everything. Pan de sal and ensaymada pay the rent; everything else is a special.",
  text: [
    "Grace took over her mother's bakeshop with one deck oven and a counter facing the national road. For two years she baked forty products and sold out of none of them.",
    "She cut the menu to the six items that sold before 8 AM, moved baking to 3 AM, and opened her second branch beside a jeepney terminal. The third came from a referral at a BBH breakfast.",
  ],
};

export const POSTS = [
  { id: "p1", kind: "ask", name: "Liza Cabahug", business: "Cabahug Travel and Tours", at: "2026-11-01T09:12:00+08:00", text: "Looking for a part time bookkeeper who knows BIR electronic invoicing. Lapu-Lapu or remote." },
  { id: "p2", kind: "offer", name: "Carlo Mendoza", business: "Isla Furniture Works", at: "2026-10-31T17:40:00+08:00", text: "Spare workshop space in Mandaue on weekends. Good for small furniture or packaging work." },
  { id: "p3", kind: "ask", name: "Ben Yap", business: "Yap Auto Parts", at: "2026-10-30T07:55:00+08:00", text: "Anyone know a reliable courier for auto parts to Bohol? Weekly, mostly small boxes." },
  { id: "p4", kind: "offer", name: "Jun Villaflor", business: "Kape Sugbo Roasters", at: "2026-10-28T06:20:00+08:00", text: "Ten percent off coffee beans for BBH members' offices this month. Message me for the price list." },
];
