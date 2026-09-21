// The 12 showroom designs. Names/descriptions live in the locale files (store.items.<id>).
// No prices: everything is made to order, so each item leads to a quote request.

export const STORE_CATEGORIES = ["kitchens", "vanities", "closets", "tv"];

// Value passed to the contact form's "interested in" select
export const CATEGORY_TO_SERVICE = {
  kitchens: "kitchen",
  vanities: "vanity",
  closets: "closets",
  tv: "tv",
};

export const STORE_ITEMS = [
  { id: "k1", category: "kitchens", image: "/store/k1.webp" },
  { id: "k2", category: "kitchens", image: "/store/k2.webp" },
  { id: "k3", category: "kitchens", image: "/store/k3.webp" },
  { id: "v1", category: "vanities", image: "/store/v1.webp" },
  { id: "v2", category: "vanities", image: "/store/v2.webp" },
  { id: "v3", category: "vanities", image: "/store/v3.webp" },
  { id: "c1", category: "closets", image: "/store/c1.webp" },
  { id: "c2", category: "closets", image: "/store/c2.webp" },
  { id: "c3", category: "closets", image: "/store/c3.webp" },
  { id: "t1", category: "tv", image: "/store/t1.webp" },
  { id: "t2", category: "tv", image: "/store/t2.webp" },
  { id: "t3", category: "tv", image: "/store/t3.webp" },
];

export const findItem = (id) => STORE_ITEMS.find((i) => i.id === id);

// Random selection, one item per category first (for variety), then any others.
export function pickRandom(count) {
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const onePerCategory = shuffle(STORE_CATEGORIES).map((c) =>
    shuffle(STORE_ITEMS.filter((i) => i.category === c))[0]
  );
  const rest = shuffle(STORE_ITEMS.filter((i) => !onePerCategory.includes(i)));
  return [...onePerCategory, ...rest].slice(0, count);
}
