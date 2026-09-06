// ─── Service Category Data ────────────────────────────────────────────────────
// Each category drives one independent ServiceSection component.
// "direction" alternates: ltr = images move right on scroll, rtl = move left.

export interface GalleryImage {
  url: string;
  title: string;
  category: string;
}

export interface ServiceConfig {
  id: string;
  title: string;
  description: string;
  direction: "ltr" | "rtl";
}

export const SERVICES: ServiceConfig[] = [
  {
    id: "Engagement",
    title: "Engagement",
    description: "Elegant engagement decoration and stage designs crafted around your love story.",
    direction: "ltr",
  },
  {
    id: "Reception",
    title: "Reception",
    description: "Grand reception venues transformed into unforgettable celebrations.",
    direction: "rtl",
  },
  {
    id: "Wedding",
    title: "Wedding",
    description: "Timeless wedding setups that capture every precious emotion.",
    direction: "ltr",
  },
  {
    id: "Birthday",
    title: "Birthday",
    description: "Vibrant birthday setups that make every year feel extraordinary.",
    direction: "rtl",
  },
  {
    id: "Baby Shower",
    title: "Baby Shower",
    description: "Warm and beautiful décor to welcome the newest addition to your family.",
    direction: "ltr",
  },
  {
    id: "Naming Ceremony",
    title: "Naming Ceremony",
    description: "Sacred and elegant setups to celebrate a child's first milestone.",
    direction: "rtl",
  },
  {
    id: "Garlands",
    title: "Garlands",
    description: "Exquisite floral garlands handcrafted for every auspicious occasion.",
    direction: "ltr",
  },
  {
    id: "Photography & Videography",
    title: "Photography & Videography",
    description: "Professional photography and cinematography to preserve your memories forever.",
    direction: "rtl",
  },
  {
    id: "LED Walls",
    title: "LED Walls",
    description: "High-definition LED wall installations that elevate any event's visual experience.",
    direction: "ltr",
  },
  {
    id: "Haldi",
    title: "Haldi",
    description: "Vibrant and joyful Haldi ceremony setups filled with colour and tradition.",
    direction: "rtl",
  },
  {
    id: "Games",
    title: "Games",
    description: "Creative entertainment setups and curated games to keep guests engaged.",
    direction: "ltr",
  },
  {
    id: "Celebrity Bookings",
    title: "Celebrity Bookings",
    description: "Exclusive celebrity appearances and performances for elite events.",
    direction: "rtl",
  },
  {
    id: "House Warming Ceremony",
    title: "House Warming",
    description: "Beautiful and traditional setups to bless your new home with warmth.",
    direction: "ltr",
  },
  {
    id: "Opening Ceremonies",
    title: "Opening Ceremonies",
    description: "Impactful grand openings and ribbon-cutting ceremonies that make a statement.",
    direction: "rtl",
  },
  {
    id: "Corporate Events",
    title: "Corporate Events",
    description: "Sophisticated corporate event setups that reflect your brand's prestige.",
    direction: "ltr",
  },
  {
    id: "Other Services",
    title: "Other Services",
    description: "Custom event solutions tailored to any unique celebration or occasion.",
    direction: "rtl",
  },
];
