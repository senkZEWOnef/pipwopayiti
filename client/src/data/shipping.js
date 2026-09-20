// Option lists for the shipping forms. Labels live in the locale files
// (shipping.options.*), so both languages stay in one place.

export const CONTAINER_SIZES = ["20ft", "40ft", "40ft_hc", "partial", "not_sure"];

export const CARGO_TYPES = [
  "household",
  "food",
  "building",
  "electronics",
  "vehicle",
  "commercial",
  "clothing",
  "other",
];

// The journey after approval, in order (matches the server's STATUS_FLOW).
export const STATUS_FLOW = [
  "approved",
  "cargo_received",
  "loaded",
  "departed",
  "in_transit",
  "arrived_haiti",
  "customs",
  "out_for_delivery",
  "delivered",
];

export const STATUS_ICONS = {
  submitted: "📝",
  approved: "✅",
  cargo_received: "📦",
  loaded: "🏗️",
  departed: "🚢",
  in_transit: "🌊",
  arrived_haiti: "⚓",
  customs: "🛃",
  out_for_delivery: "🚚",
  delivered: "🎉",
  rejected: "⛔",
};

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

// Proper nouns: same in Kreyòl and French (French spelling).
export const HAITI_CITIES = [
  "Port-au-Prince",
  "Pétion-Ville",
  "Delmas",
  "Carrefour",
  "Tabarre",
  "Croix-des-Bouquets",
  "Cap-Haïtien",
  "Les Cayes",
  "Gonaïves",
  "Saint-Marc",
  "Jacmel",
  "Jérémie",
  "Port-de-Paix",
  "Hinche",
  "Fort-Liberté",
  "Miragoâne",
  "Léogâne",
  "Petit-Goâve",
];

export const MY_SHIPMENTS_KEY = "pps_my_shipments";

export function rememberShipment(number) {
  try {
    const list = JSON.parse(localStorage.getItem(MY_SHIPMENTS_KEY) || "[]");
    const next = [number, ...list.filter((n) => n !== number)].slice(0, 5);
    localStorage.setItem(MY_SHIPMENTS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

export function myShipments() {
  try {
    return JSON.parse(localStorage.getItem(MY_SHIPMENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export const normalizeTracking = (v) => String(v || "").trim().toUpperCase().replace(/\s+/g, "");
