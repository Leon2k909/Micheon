/**
 * The city the hole eats.
 *
 * hole.io works because the map is a CITY — roads, blocks, pavements, and
 * things sitting where those things actually sit. Ours was an infinite grey
 * grid with props scattered at random over it, which is why it never read as
 * a place. A bin in the middle of a road and a tower block on a pavement both
 * look like a bug even when the physics underneath is fine.
 *
 * So the world is generated: roads on a grid, blocks between them, buildings
 * inside the blocks, street furniture on the pavements and traffic on the
 * roads. Everything is placed by rule, and the rule is what makes it legible
 * as you zoom out.
 */

export type HoleTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PropKind =
  | "bottle" | "can" | "cone" | "litter"
  | "bin" | "bench" | "lamp" | "postbox" | "sign" | "hydrant"
  | "person" | "bike" | "scooter"
  | "car" | "van" | "taxi"
  | "tree" | "bus" | "truck"
  | "house" | "shop"
  | "tower";

export type PropSpec = {
  kind: PropKind;
  /** World units across. Everything is compared against the hole's radius. */
  size: number;
  tier: HoleTier;
  color: string;
  roof?: string;
  de: string;
  en: string;
  /** Named in all three courses, so the caption is never the wrong language. */
  fr: string;
  /** Where in the city this belongs. */
  place: "pavement" | "road" | "block";
};

export const PROP_SPECS: PropSpec[] = [
  // Tier 1 — litter. What a brand new hole can manage.
  { kind: "bottle", size: 9, tier: 1, color: "#4ade80", de: "die Flasche", en: "bottle", fr: "la bouteille", place: "pavement" },
  { kind: "can", size: 8, tier: 1, color: "#f87171", de: "die Dose", en: "can", fr: "la canette", place: "pavement" },
  { kind: "litter", size: 7, tier: 1, color: "#fbbf24", de: "der Müll", en: "litter", fr: "les déchets", place: "pavement" },
  { kind: "cone", size: 12, tier: 1, color: "#fb923c", de: "der Kegel", en: "traffic cone", fr: "le plot", place: "road" },

  // Tier 2 — street furniture.
  { kind: "hydrant", size: 15, tier: 2, color: "#ef4444", de: "der Hydrant", en: "fire hydrant", fr: "la bouche d'incendie", place: "pavement" },
  { kind: "sign", size: 17, tier: 2, color: "#60a5fa", de: "das Schild", en: "sign", fr: "le panneau", place: "pavement" },
  { kind: "bin", size: 20, tier: 2, color: "#64748b", de: "der Mülleimer", en: "bin", fr: "la poubelle", place: "pavement" },
  { kind: "postbox", size: 22, tier: 2, color: "#dc2626", de: "der Briefkasten", en: "postbox", fr: "la boîte aux lettres", place: "pavement" },
  { kind: "lamp", size: 24, tier: 2, color: "#fcd34d", de: "die Laterne", en: "street lamp", fr: "le lampadaire", place: "pavement" },
  { kind: "bench", size: 28, tier: 2, color: "#a16207", de: "die Bank", en: "bench", fr: "le banc", place: "pavement" },

  // Tier 3 — people and small vehicles.
  { kind: "person", size: 16, tier: 3, color: "#f9a8d4", de: "die Person", en: "person", fr: "la personne", place: "pavement" },
  { kind: "scooter", size: 22, tier: 3, color: "#22d3ee", de: "der Roller", en: "scooter", fr: "la trottinette", place: "pavement" },
  { kind: "bike", size: 30, tier: 3, color: "#06b6d4", de: "das Fahrrad", en: "bicycle", fr: "le vélo", place: "road" },

  // Tier 4 — cars.
  { kind: "car", size: 46, tier: 4, color: "#3b82f6", de: "das Auto", en: "car", fr: "la voiture", place: "road" },
  { kind: "taxi", size: 48, tier: 4, color: "#facc15", de: "das Taxi", en: "taxi", fr: "le taxi", place: "road" },
  { kind: "van", size: 58, tier: 4, color: "#e2e8f0", de: "der Lieferwagen", en: "van", fr: "la camionnette", place: "road" },

  // Tier 5 — big vehicles and trees.
  { kind: "tree", size: 62, tier: 5, color: "#16a34a", de: "der Baum", en: "tree", fr: "l'arbre", place: "pavement" },
  { kind: "bus", size: 88, tier: 5, color: "#f97316", de: "der Bus", en: "bus", fr: "le bus", place: "road" },
  { kind: "truck", size: 96, tier: 5, color: "#8b5cf6", de: "der Lastwagen", en: "lorry", fr: "le camion", place: "road" },

  // Tier 6 — buildings.
  { kind: "shop", size: 130, tier: 6, color: "#f472b6", roof: "#be185d", de: "der Laden", en: "shop", fr: "le magasin", place: "block" },
  { kind: "house", size: 150, tier: 6, color: "#fbbf24", roof: "#b45309", de: "das Haus", en: "house", fr: "la maison", place: "block" },

  // Tier 7 — the thing you are working towards.
  { kind: "tower", size: 230, tier: 7, color: "#6366f1", roof: "#3730a3", de: "das Hochhaus", en: "tower block", fr: "la tour", place: "block" },
];

export function specsForPlace(place: PropSpec["place"]): PropSpec[] {
  return PROP_SPECS.filter((spec) => spec.place === place);
}

/**
 * Score is the object's footprint, not a hand-written number.
 *
 * Tying points to area means a bus is worth what a bus looks like it should
 * be worth, and a new prop cannot be accidentally mispriced.
 */
export function propPoints(spec: PropSpec): number {
  return Math.round((spec.size * spec.size) / 16);
}

export type CityProp = {
  id: number;
  spec: PropSpec;
  x: number;
  y: number;
  /** Resting rotation, so a street does not look like a showroom. */
  rotation: number;
  /** 0 while it sits there; climbs to 1 as it falls in. */
  fall: number;
  /** Which hole is swallowing it, so two cannot fight over one object. */
  claimedBy: number | null;
  spin: number;
};

export type CityLayout = {
  size: number;
  roadStep: number;
  roadWidth: number;
  props: CityProp[];
};

/** A small deterministic generator, so a seed reproduces a city exactly. */
export function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Distance from a coordinate to the centre line of the nearest road. */
export function distanceToRoad(value: number, roadStep: number): number {
  const offset = ((value % roadStep) + roadStep) % roadStep;
  return Math.min(offset, roadStep - offset);
}

export function isOnRoad(x: number, y: number, roadStep: number, roadWidth: number): boolean {
  const half = roadWidth / 2;
  return distanceToRoad(x, roadStep) < half || distanceToRoad(y, roadStep) < half;
}

/**
 * Build the city.
 *
 * Roads first, then everything else placed relative to them: traffic on the
 * carriageway, street furniture on the pavement strip just off it, buildings
 * set back inside the blocks. Nothing is placed at random across the whole
 * map, which is the difference between a city and a scatter.
 */
export function buildCity(options: {
  size: number;
  roadStep: number;
  roadWidth: number;
  seed: number;
}): CityLayout {
  const { size, roadStep, roadWidth, seed } = options;
  const random = makeRandom(seed);
  const props: CityProp[] = [];
  let id = 1;

  const add = (spec: PropSpec, x: number, y: number) => {
    props.push({
      id: id++,
      spec,
      x,
      y,
      rotation: (random() - 0.5) * 0.5,
      fall: 0,
      claimedBy: null,
      spin: (random() - 0.5) * 6,
    });
  };

  const pick = <T,>(list: T[]): T => list[Math.floor(random() * list.length)];
  const blockSpecs = specsForPlace("block");
  const pavementSpecs = specsForPlace("pavement");
  const roadSpecs = specsForPlace("road");

  const blocks = Math.floor(size / roadStep);
  for (let bx = 0; bx < blocks; bx += 1) {
    for (let by = 0; by < blocks; by += 1) {
      const left = bx * roadStep + roadWidth / 2;
      const top = by * roadStep + roadWidth / 2;
      const inner = roadStep - roadWidth;
      if (inner < 60) continue;

      // One building per block, set back from the road, with the tallest
      // reserved for the middle of the map so there is somewhere to aim for.
      const centreish = Math.abs(bx - blocks / 2) < blocks * 0.22 && Math.abs(by - blocks / 2) < blocks * 0.22;
      const candidates = centreish ? blockSpecs : blockSpecs.filter((spec) => spec.tier < 7);
      const building = pick(candidates.length ? candidates : blockSpecs);
      if (building.size < inner * 0.92) {
        add(building, left + inner / 2, top + inner / 2);
      }

      // Pavement strip: a few small things along each edge of the block.
      const perEdge = 2 + Math.floor(random() * 3);
      for (let step = 0; step < perEdge; step += 1) {
        const along = left + inner * ((step + 0.5) / perEdge) + (random() - 0.5) * 12;
        const inset = roadWidth * 0.34;
        add(pick(pavementSpecs), along, top - inset);
        add(pick(pavementSpecs), along, top + inner + inset);
        const down = top + inner * ((step + 0.5) / perEdge) + (random() - 0.5) * 12;
        add(pick(pavementSpecs), left - inset, down);
        add(pick(pavementSpecs), left + inner + inset, down);
      }
    }
  }

  // Traffic, spaced along the carriageways so vehicles sit in the road.
  for (let line = 0; line <= blocks; line += 1) {
    const centre = line * roadStep;
    const count = Math.floor(size / 260);
    for (let step = 0; step < count; step += 1) {
      const along = (step + 0.5) * (size / count) + (random() - 0.5) * 60;
      if (random() < 0.75) add(pick(roadSpecs), along, centre + (random() - 0.5) * roadWidth * 0.4);
      if (random() < 0.75) add(pick(roadSpecs), centre + (random() - 0.5) * roadWidth * 0.4, along);
    }
  }

  return {
    size,
    roadStep,
    roadWidth,
    props: props.filter((prop) => prop.x > 40 && prop.y > 40 && prop.x < size - 40 && prop.y < size - 40),
  };
}

/**
 * Radius from swallowed area.
 *
 * Growth has to be area-based or it feels wrong in both directions. Adding a
 * fixed number of pixels per object means a bottle moves the needle as much
 * as a bus early on, and nothing moves it at all later. Adding AREA means
 * eating a car when you are small is a jump you can see, and the same car at
 * tower-block size is the rounding error it should be.
 */
export function radiusForArea(area: number): number {
  return Math.sqrt(area / Math.PI);
}

export function areaForRadius(radius: number): number {
  return Math.PI * radius * radius;
}

/** A hole swallows anything whose footprint is smaller than its mouth. */
export function canSwallow(holeRadius: number, propSize: number): boolean {
  return holeRadius * 2 > propSize * 0.92;
}

/**
 * How far to pull the camera back for a hole of this size.
 *
 * This is the single most important number in the game and it used not to
 * exist: the old camera followed at 1:1 forever, so a hole near its maximum
 * radius was wider than the canvas and you played blind. Keeping the hole at
 * a roughly constant size on screen is what makes growth readable — the hole
 * looks the same and the city shrinks around it.
 *
 * Clamped at both ends: zoomed in too far at the start and you cannot see
 * what to run at, out too far at the end and the props are single pixels.
 */
export function zoomForRadius(
  radius: number,
  targetScreenRadius: number,
  minZoom: number,
  maxZoom: number
): number {
  if (radius <= 0) return maxZoom;
  return Math.max(minZoom, Math.min(maxZoom, targetScreenRadius / radius));
}

/** What the hole measures on screen once the zoom above is applied. */
export function screenRadius(
  radius: number,
  targetScreenRadius: number,
  minZoom: number,
  maxZoom: number
): number {
  return radius * zoomForRadius(radius, targetScreenRadius, minZoom, maxZoom);
}
