// HUBS come from BBH's live app (Nov 2026). Everything else here is SAMPLE: made-up members,
// businesses and deals for the demo. Replace before launch; the UI labels sample content "Sample".

// day: 0 = Sunday … 6 = Saturday, Asia/Manila
export const HUBS = [
  { id: "flora-faun", name: "Flora & Faun", day: 2, time: "8:30 AM", venue: "Patria de Cebu", city: "Cebu City" },
  { id: "bakery-soesterberg", name: "Bakery Soesterberg", day: 3, time: "8:30 AM", venue: "Bakery Soesterberg", city: "Cebu City" },
  { id: "88-garden-cafe", name: "88 Garden Cafe", day: 4, time: "9:00 AM", venue: "Paseo Ricardo", city: "Talisay City" },
  { id: "2nd-anniversary", name: "2nd Anniversary", day: 5, time: "6:00 AM", venue: "1Nito", city: "Cebu City" },
  { id: "la-carne", name: "La Carne", day: 5, time: "8:30 AM", venue: "La Carne", city: "Banilad" },
];

export const INDUSTRIES = [
  "Food and beverage",
  "Retail",
  "Construction and hardware",
  "Logistics and freight",
  "Health and wellness",
  "Professional services",
  "Tourism and hospitality",
  "Manufacturing",
  "Technology",
  "Real estate",
  "Other",
];

export const AREAS = ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Consolacion", "Liloan", "Minglanilla", "Elsewhere in Cebu"];

const m = (id, name, title, business, industry, area, hub, attending, joined, phone, website) => ({
  id: `BBH-${String(id).padStart(4, "0")}`,
  name, title, business, industry, area, hub, attending, joined, phone, website,
  email: `${name.split(" ")[0].toLowerCase()}@${business.toLowerCase().replace(/[^a-z]/g, "").slice(0, 14)}.ph`,
  sample: true,
});

export const MEMBERS = [
  m(1, "Ana Lim", "Owner", "Lim Builders Supply", "Construction and hardware", "Mandaue", "flora-faun", true, "2025-02-14", "+63 917 555 0101", "limbuilders.ph"),
  m(2, "Jun Villaflor", "Head roaster", "Kape Sugbo Roasters", "Food and beverage", "Cebu City", "bakery-soesterberg", true, "2025-03-02", "+63 917 555 0102", "kapesugbo.ph"),
  m(3, "Grace Abellana", "Owner", "Abellana Bakeshop", "Food and beverage", "Talisay", "88-garden-cafe", true, "2025-03-20", "+63 917 555 0103", ""),
  m(4, "Rafael Uy", "Managing director", "Pier 3 Freight", "Logistics and freight", "Cebu City", "la-carne", false, "2025-04-11", "+63 917 555 0104", "pier3freight.ph"),
  m(5, "Mae Tan", "Dentist and founder", "Tan Dental Studio", "Health and wellness", "Cebu City", "flora-faun", true, "2025-05-08", "+63 917 555 0105", "tandental.ph"),
  m(6, "Carlo Mendoza", "Founder", "Isla Furniture Works", "Manufacturing", "Mandaue", "2nd-anniversary", true, "2025-05-30", "+63 917 555 0106", "islafurniture.ph"),
  m(7, "Liza Cabahug", "Owner", "Cabahug Travel and Tours", "Tourism and hospitality", "Lapu-Lapu", "la-carne", true, "2025-06-17", "+63 917 555 0107", ""),
  m(8, "Ben Yap", "General manager", "Yap Auto Parts", "Retail", "Cebu City", "bakery-soesterberg", false, "2025-07-04", "+63 917 555 0108", ""),
  m(9, "Tessa Ouano", "Partner", "Ouano Law Office", "Professional services", "Mandaue", "flora-faun", true, "2025-07-22", "+63 917 555 0109", "ouanolaw.ph"),
  m(10, "Paolo Sy", "CTO", "Sugbo Cloud", "Technology", "Cebu City", "88-garden-cafe", true, "2025-08-09", "+63 917 555 0110", "sugbocloud.ph"),
  m(11, "Joy Remedio", "Broker", "Remedio Realty", "Real estate", "Talisay", "88-garden-cafe", false, "2025-08-28", "+63 917 555 0111", ""),
  m(12, "Mark Gaisano", "Operations head", "Banilad Fresh Mart", "Retail", "Cebu City", "la-carne", true, "2025-09-15", "+63 917 555 0112", ""),
  m(13, "Ria Fernandez", "Accountant", "Fernandez Books and Tax", "Professional services", "Cebu City", "bakery-soesterberg", true, "2025-10-03", "+63 917 555 0113", ""),
  m(14, "Nico Alcoseba", "Owner", "Alcoseba Print Shop", "Manufacturing", "Consolacion", "2nd-anniversary", false, "2025-11-19", "+63 917 555 0114", ""),
  m(15, "Bea Durano", "Clinic director", "Durano Physio", "Health and wellness", "Mandaue", "la-carne", true, "2026-01-12", "+63 917 555 0115", "duranophysio.ph"),
  m(16, "Kevin Lao", "Founder", "Lao Solar Systems", "Construction and hardware", "Liloan", "2nd-anniversary", true, "2026-02-26", "+63 917 555 0116", "laosolar.ph"),
  m(17, "Cathy Borromeo", "Chef and owner", "Kusina Borromeo", "Food and beverage", "Cebu City", "flora-faun", false, "2026-04-07", "+63 917 555 0117", ""),
  m(18, "Dan Pacana", "Fleet manager", "Pacana Logistics", "Logistics and freight", "Minglanilla", "88-garden-cafe", true, "2026-06-21", "+63 917 555 0118", ""),
];

// Member deals: offers from (sample) member businesses to other BBH members.
export const DEALS = [
  { id: "d1", value: "10%", title: "Off coffee beans for your office", by: "BBH-0002", hub: "bakery-soesterberg", until: "2026-11-30" },
  { id: "d2", value: "Free", title: "First consultation on contracts and permits", by: "BBH-0009", hub: "flora-faun", until: "2026-12-15" },
  { id: "d3", value: "15%", title: "Off domestic freight to Bohol and Leyte", by: "BBH-0004", hub: "la-carne", until: "2026-12-31" },
  { id: "d4", value: "₱500", title: "Off your first dental cleaning", by: "BBH-0005", hub: "flora-faun", until: "2026-12-31" },
  { id: "d5", value: "2 for 1", title: "Ensaymada boxes for client meetings", by: "BBH-0003", hub: "88-garden-cafe", until: "2026-11-28" },
  { id: "d6", value: "20%", title: "Off a rooftop solar site assessment", by: "BBH-0016", hub: "2nd-anniversary", until: "2027-01-31" },
];
