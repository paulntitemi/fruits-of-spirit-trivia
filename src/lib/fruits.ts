export type FruitId =
  | "love"
  | "joy"
  | "peace"
  | "longsuffering"
  | "gentleness"
  | "goodness"
  | "faith"
  | "meekness"
  | "temperance";

export interface Fruit {
  id: FruitId;
  name: string;
  greek: string;
  translit: string;
  produce: string;
  /** main ink colour */
  hex: string;
  /** pale wash used for card fills */
  wash: string;
  meaning: string;
  verse: string;
  reference: string;
}

export const FRUITS: Fruit[] = [
  {
    id: "love",
    name: "Love",
    greek: "ἀγάπη",
    translit: "agapē",
    produce: "Pomegranate",
    hex: "#E23744",
    wash: "#FDE6E4",
    meaning:
      "A chosen, self-giving devotion that seeks the good of another before its own.",
    verse: "Greater love has no one than this: to lay down one's life for one's friends.",
    reference: "John 15:13",
  },
  {
    id: "joy",
    name: "Joy",
    greek: "χαρά",
    translit: "chara",
    produce: "Sweet Orange",
    hex: "#F2900C",
    wash: "#FEF0DA",
    meaning:
      "Gladness rooted in God rather than circumstance — it sings in prison cells.",
    verse: "The joy of the LORD is your strength.",
    reference: "Nehemiah 8:10",
  },
  {
    id: "peace",
    name: "Peace",
    greek: "εἰρήνη",
    translit: "eirēnē",
    produce: "Olive Branch",
    hex: "#0E9F8F",
    wash: "#DDF4F0",
    meaning:
      "Shalom — wholeness and quiet confidence when the storm has not yet stopped.",
    verse: "Peace I leave with you; my peace I give you.",
    reference: "John 14:27",
  },
  {
    id: "longsuffering",
    name: "Longsuffering",
    greek: "μακροθυμία",
    translit: "makrothumia",
    produce: "Fig",
    hex: "#7154C4",
    wash: "#EBE6FA",
    meaning:
      "Long-suffering. The slow, unhurried endurance of a farmer waiting on rain.",
    verse: "Be joyful in hope, patient in affliction, faithful in prayer.",
    reference: "Romans 12:12",
  },
  {
    id: "gentleness",
    name: "Gentleness",
    greek: "χρηστότης",
    translit: "chrēstotēs",
    produce: "Peach",
    hex: "#E75A8C",
    wash: "#FDE6EF",
    meaning:
      "Usable goodness — a warmth that lowers itself to meet somebody's real need.",
    verse: "Be kind and compassionate to one another, forgiving each other.",
    reference: "Ephesians 4:32",
  },
  {
    id: "goodness",
    name: "Goodness",
    greek: "ἀγαθωσύνη",
    translit: "agathōsunē",
    produce: "Green Apple",
    hex: "#3D9B44",
    wash: "#E2F3E1",
    meaning:
      "Moral beauty in action — doing right when nobody is keeping the score.",
    verse: "Surely your goodness and love will follow me all the days of my life.",
    reference: "Psalm 23:6",
  },
  {
    id: "faith",
    name: "Faith",
    greek: "πίστις",
    translit: "pistis",
    produce: "Grapes",
    hex: "#2A6DB5",
    wash: "#E0EBF8",
    meaning:
      "Being reliable to the end — a steady lamp that keeps burning in the dark.",
    verse: "They are new every morning; great is your faith.",
    reference: "Lamentations 3:23",
  },
  {
    id: "meekness",
    name: "Meekness",
    greek: "πραΰτης",
    translit: "prautēs",
    produce: "Pear",
    hex: "#8FAE2B",
    wash: "#EEF4D9",
    meaning:
      "Strength held under restraint — power with a soft hand on the reins.",
    verse: "Let your meekness be evident to all. The Lord is near.",
    reference: "Philippians 4:5",
  },
  {
    id: "temperance",
    name: "Temperance",
    greek: "ἐγκράτεια",
    translit: "enkrateia",
    produce: "Date Palm",
    hex: "#C2521C",
    wash: "#FAE6DC",
    meaning:
      "Mastery of appetite — the walls that keep the city of the soul secure.",
    verse:
      "Like a city whose walls are broken through is a person who lacks temperance.",
    reference: "Proverbs 25:28",
  },
];

export const FRUIT_MAP: Record<FruitId, Fruit> = FRUITS.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<FruitId, Fruit>,
);

export const HARVEST = {
  id: "harvest" as const,
  name: "Full Harvest",
  greek: "καρπός",
  translit: "karpos",
  hex: "#1D1B18",
  wash: "#F6EDDC",
  verse:
    "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness and temperance.",
  reference: "Galatians 5:22-23",
};

export const BLESSINGS: { min: number; title: string; line: string }[] = [
  {
    min: 100,
    title: "Hundredfold Harvest",
    line: "Every seed landed on good soil. Well done, good and faithful servant.",
  },
  {
    min: 80,
    title: "Basket Overflowing",
    line: "A tree planted by streams of water, yielding its fruit in season.",
  },
  {
    min: 60,
    title: "Ripening Well",
    line: "The vine is healthy and the branches are heavy. Keep abiding.",
  },
  {
    min: 40,
    title: "Green Shoots",
    line: "Growth has begun. Longsuffering — the farmer waits for the valuable crop.",
  },
  {
    min: 0,
    title: "Freshly Planted",
    line: "Every orchard starts as a seed. Water it again and watch it grow.",
  },
];
