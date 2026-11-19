import { getConstellationAndNode } from "@/lib/dateDistributor";

export interface IllustrativeMemoryEntry {
  id: string;
  title: string;
  location: string;
  dateIso: string;
  displayDate: string;
  image: string;
  imageAlt: string;
  caption: string;
}

const RAW_ENTRIES: IllustrativeMemoryEntry[] = [
  {
    id: "aurora-tromso",
    title: "Midnight Aurora over Arctic Fjords",
    location: "Tromso, Norway",
    dateIso: "2025-01-08",
    displayDate: "Jan 08, 2025",
    image: "/images/vault/memory-aurora.jpg",
    imageAlt: "Green aurora curtains glowing above snow-lined Arctic fjord waters",
    caption:
      "Emerald curtains drifting across mirror-still fjord water beneath sub-zero winter stars.",
  },
  {
    id: "sahara-twilight",
    title: "Twilight Horizons and Desert Dunes",
    location: "Merzouga, Morocco",
    dateIso: "2025-06-04",
    displayDate: "Jun 04, 2025",
    image: "/images/vault/memory-desert.jpg",
    imageAlt: "Starlit desert dunes under deep indigo twilight",
    caption:
      "Dunes cooling into silence as the first evening stars emerge above the eastern ridge.",
  },
  {
    id: "maldives-tide",
    title: "Phosphorescent Tides at Midnight",
    location: "Baa Atoll, Maldives",
    dateIso: "2025-07-12",
    displayDate: "Jul 12, 2025",
    image: "/images/vault/memory-ocean.jpg",
    imageAlt: "Bioluminescent blue waves breaking along a dark tropical shoreline",
    caption:
      "Bioluminescent waves lighting up the dark shoreline with every breaking crest.",
  },
  {
    id: "bromo-perseids",
    title: "Perseid Meteor Watch from the Summit",
    location: "Mount Bromo Crater, East Java",
    dateIso: "2025-08-14",
    displayDate: "Aug 14, 2025",
    image: "/images/vault/memory-mountain.jpg",
    imageAlt: "Volcanic crater beneath the Milky Way at night",
    caption:
      "Wrapped in wool at 2,300 meters while the galactic core arched cleanly over the caldera.",
  },
  {
    id: "altyn-campfire",
    title: "Campfire Beneath the Galactic Arch",
    location: "Altyn-Emel Steppe",
    dateIso: "2025-12-05",
    displayDate: "Dec 05, 2025",
    image: "/images/vault/stargazing-camp.jpg",
    imageAlt: "Tented stargazing camp glowing softly under a dark starry sky",
    caption:
      "Quiet winter warmth in open steppe country beneath the archer constellation.",
  },
];

export const ILLUSTRATIVE_MEMORIES = RAW_ENTRIES.map((entry) => {
  const mapping = getConstellationAndNode(entry.dateIso);
  return {
    ...entry,
    constellationId: mapping.constellation.id,
    constellationName: mapping.constellation.name,
    glowColor: mapping.constellation.glowColor,
    nodeIndex: mapping.nodeIndex,
    nodeNumberLabel: `Node ${String(mapping.nodeIndex + 1).padStart(2, "0")}`,
    nodeRange: mapping.formattedRange,
  };
});
