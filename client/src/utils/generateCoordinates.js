/**
 * Generates random but ecologically meaningful coordinates for search results.
 * Each call produces a unique location within diverse biome regions worldwide,
 * seeded by a combination of index and a per-session random salt so that
 * different searches yield different map pins.
 */

// Ecologically diverse regions spanning all continents
const BIOME_REGIONS = [
  // Tropical Rainforests
  { name: "Amazon Basin", lat: [-8, 2], lon: [-70, -50] },
  { name: "Congo Rainforest", lat: [-4, 4], lon: [18, 30] },
  { name: "Borneo", lat: [-2, 6], lon: [108, 118] },
  { name: "Daintree", lat: [-18, -15], lon: [145, 146.5] },
  // Savannas & Grasslands
  { name: "Serengeti", lat: [-4, 0], lon: [34, 36] },
  { name: "Cerrado Brazil", lat: [-18, -10], lon: [-52, -44] },
  { name: "Great Plains", lat: [35, 48], lon: [-105, -95] },
  { name: "Kazakh Steppe", lat: [45, 52], lon: [60, 75] },
  // Deserts
  { name: "Sahara", lat: [20, 30], lon: [-5, 15] },
  { name: "Sonoran", lat: [29, 34], lon: [-114, -109] },
  { name: "Namib", lat: [-27, -20], lon: [14, 17] },
  { name: "Gobi", lat: [40, 46], lon: [95, 115] },
  // Temperate Forests
  { name: "Pacific Northwest", lat: [43, 50], lon: [-125, -120] },
  { name: "Black Forest", lat: [47, 49], lon: [7, 9] },
  { name: "Tasmanian Wilderness", lat: [-43, -41], lon: [145, 147] },
  { name: "Appalachian", lat: [34, 40], lon: [-84, -78] },
  // Boreal / Tundra
  { name: "Siberian Taiga", lat: [55, 65], lon: [80, 120] },
  { name: "Canadian Boreal", lat: [50, 60], lon: [-110, -80] },
  { name: "Scandinavian Tundra", lat: [65, 70], lon: [15, 30] },
  // Mountains
  { name: "Himalayas", lat: [27, 32], lon: [78, 90] },
  { name: "Andes Altiplano", lat: [-22, -14], lon: [-70, -64] },
  { name: "Alps", lat: [45, 48], lon: [6, 14] },
  { name: "Ethiopian Highlands", lat: [6, 14], lon: [36, 42] },
  // Coastal / Wetlands
  { name: "Sundarbans", lat: [21.5, 22.5], lon: [88.5, 90] },
  { name: "Everglades", lat: [25, 26.5], lon: [-81.5, -80] },
  { name: "Camargue", lat: [43.2, 43.7], lon: [4, 5] },
  // Islands & Coral
  { name: "Galapagos", lat: [-1.5, 0.5], lon: [-92, -89] },
  { name: "Madagascar East", lat: [-22, -14], lon: [48, 50] },
  { name: "Great Barrier Reef", lat: [-20, -14], lon: [145, 150] },
  // Arctic & Subarctic
  { name: "Svalbard", lat: [76, 80], lon: [14, 22] },
  { name: "Alaskan Tundra", lat: [64, 70], lon: [-165, -145] },
];

// Simple deterministic pseudo-random number generator (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate a session-unique salt so each search gets different locations
let sessionSalt = Math.floor(Math.random() * 1000000);

/**
 * Generates a unique coordinate for a search result.
 * @param {number} index - The result index
 * @param {string} [queryHash] - Optional query string to seed variation per search
 * @returns {[number, number]} [longitude, latitude]
 */
export function generateCoordinates(index, queryHash = "") {
  // Create a unique seed from index + session salt + query
  let hash = sessionSalt + index * 7919;
  for (let i = 0; i < queryHash.length; i++) {
    hash = ((hash << 5) - hash + queryHash.charCodeAt(i)) | 0;
  }

  const rng = mulberry32(Math.abs(hash));

  // Pick a biome region pseudo-randomly
  const regionIndex = Math.floor(rng() * BIOME_REGIONS.length);
  const region = BIOME_REGIONS[regionIndex];

  // Generate coordinates within the region with some Gaussian-like spread
  const u1 = rng();
  const u2 = rng();
  // Box-Muller for slight clustering toward center
  const gaussian = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2);
  const spread = 0.3; // 0 = center only, 1 = full range

  const latRange = region.lat[1] - region.lat[0];
  const lonRange = region.lon[1] - region.lon[0];
  const latCenter = (region.lat[0] + region.lat[1]) / 2;
  const lonCenter = (region.lon[0] + region.lon[1]) / 2;

  const lat = Math.max(
    region.lat[0],
    Math.min(region.lat[1], latCenter + gaussian * spread * latRange * 0.5)
  );

  // Use a different random pull for longitude
  const u3 = rng();
  const u4 = rng();
  const gaussian2 = Math.sqrt(-2 * Math.log(Math.max(u3, 0.001))) * Math.cos(2 * Math.PI * u4);
  const lon = Math.max(
    region.lon[0],
    Math.min(region.lon[1], lonCenter + gaussian2 * spread * lonRange * 0.5)
  );

  return [lon, lat];
}

/**
 * Call this to refresh the session salt, ensuring next search shows new locations.
 */
export function refreshCoordinateSalt() {
  sessionSalt = Math.floor(Math.random() * 1000000);
}