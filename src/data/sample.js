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
  { tag: "Asks", title: "Looking for a bookkeeper who knows BIR e-invoicing, part time" },
];
