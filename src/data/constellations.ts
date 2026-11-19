import { ConstellationData } from "@/types";

export const CONSTELLATIONS: ConstellationData[] = [
  {
    id: "capricorn",
    name: "Capricorn",
    symbol: "♑",
    periodText: "Dec 22 - Jan 19",
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    glowColor: "#34D399",
    lineColor: "rgba(52, 211, 153, 0.45)",
    center: [30.6, -15.32, 29.22],
    nodes: [
      [24.5, -9.45, 36.54],   // Algedi
      [26.78, -19.4, 30.52],  // Psi Cap
      [29.91, -19.2, 27.6],   // Omega/Chi curve
      [32.72, -17.24, 25.63], // Zeta Cap
      [36.4, -12.35, 23.4],   // Deneb Algedi
      [31.2, -13.23, 29.61],  // Theta Cap
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
  },
  {
    id: "aquarius",
    name: "Aquarius",
    symbol: "♒",
    periodText: "Jan 20 - Feb 18",
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    glowColor: "#38BDF8",
    lineColor: "rgba(56, 189, 248, 0.45)",
    center: [40.98, -3.31, 18.3],
    nodes: [
      [34.77, -4.51, 28.2],   // Sadalsuud
      [39.27, 0.21, 21.97],   // Sadalmelik
      [41.2, 1.74, 18.02],    // Pi Aqr (Water Jar top)
      [40.89, -0.76, 18.77],  // Sadachbia (Water Jar hub)
      [42.08, 0.39, 15.93],   // Eta Aqr (Water Jar spout)
      [42.88, -6.32, 12.09],  // Hydor
      [41.43, -13.54, 11.2],  // Skat
    ],
    lines: [
      [0, 1],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [5, 6],
    ],
  },
  {
    id: "pisces",
    name: "Pisces",
    symbol: "♓",
    periodText: "Feb 19 - Mar 20",
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    glowColor: "#2DD4BF",
    lineColor: "rgba(45, 212, 191, 0.45)",
    center: [44.08, 7.24, -5.45],
    nodes: [
      [44.43, 3.3, 6.32],     // Gamma Psc (Circlet)
      [44.67, 4.85, 2.51],    // Iota Psc (Circlet)
      [44.89, 2.28, 2.19],    // Lambda Psc (Circlet)
      [44.64, 5.66, -0.7],    // Omega Psc
      [39.98, 2.96, -20.44],  // Alrischa (V apex)
      [40.81, 11.27, -15.24], // Kullat Nunu
      [39.19, 18.77, -11.7],  // Tau Psc (Northern Fish)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 0],
      [1, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "aries",
    name: "Aries",
    symbol: "♈",
    periodText: "Mar 21 - Apr 19",
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    glowColor: "#FB7185",
    lineColor: "rgba(251, 113, 133, 0.45)",
    center: [34.91, 17.44, -22.41],
    nodes: [
      [38.37, 13.67, -19.13], // Mesarthim
      [37.74, 15.3, -19.14],  // Sheratan
      [35.16, 18.13, -21.45], // Hamal
      [26.8, 21.83, -28.82],  // Bharani (41 Ari)
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    id: "taurus",
    name: "Taurus",
    symbol: "♉",
    periodText: "Apr 20 - May 20",
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    glowColor: "#A3E635",
    lineColor: "rgba(163, 230, 53, 0.45)",
    center: [16.09, 13.76, -39.71],
    nodes: [
      [18.35, 12.12, -39.26], // Hyadum I (V apex)
      [16.5, 14.78, -39.17],  // Ain
      [5.79, 21.55, -39.08],  // Elnath (upper horn)
      [15.47, 12.79, -40.28], // Aldebaran
      [4.09, 16.23, -41.77],  // Tianguan (lower horn)
      [22.19, 9.73, -37.92],  // Lambda Tau
      [27.85, 7.06, -34.63],  // Omicron Tau
    ],
    lines: [
      [6, 5],
      [5, 0],
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    symbol: "♊",
    periodText: "May 21 - Jun 20",
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    glowColor: "#FACC15",
    lineColor: "rgba(250, 204, 21, 0.45)",
    center: [-12.14, 19.2, -38.84],
    nodes: [
      [-15.48, 23.99, -34.79], // Castor
      [-17.88, 21.23, -35.42], // Pollux
      [-11.85, 22.83, -36.92], // Tau Gem
      [-18.33, 18.55, -36.67], // Kappa Gem
      [-3.76, 17.12, -41.45],  // Tejat
      [-6.82, 12.37, -42.73],  // Alhena
      [-7.54, 19.1, -40.04],   // Mebsuta
      [-14.39, 16.72, -39.22], // Wasat
    ],
    lines: [
      [0, 2],
      [2, 6],
      [6, 4],
      [1, 3],
      [3, 7],
      [7, 5],
      [2, 3],
    ],
  },
  {
    id: "cancer",
    name: "Cancer",
    symbol: "♋",
    periodText: "Jun 21 - Jul 22",
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    glowColor: "#CBD5E1",
    lineColor: "rgba(203, 213, 225, 0.50)",
    center: [-27.77, 13.84, -32.59],
    nodes: [
      [-26.23, 21.65, -29.47], // Iota Cnc
      [-27.37, 16.47, -31.69], // Asellus Borealis
      [-28.15, 14.02, -32.19], // Asellus Australis
      [-24.92, 7.18, -36.77],  // Tarf
      [-30.94, 9.25, -31.34],  // Acubens
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
    ],
  },
  {
    id: "leo",
    name: "Leo",
    symbol: "♌",
    periodText: "Jul 23 - Aug 22",
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    glowColor: "#F59E0B",
    lineColor: "rgba(245, 158, 11, 0.45)",
    center: [-39.38, 14.97, -15.82],
    nodes: [
      [-34.32, 18.14, -22.75], // Ras Elased
      [-34.37, 19.73, -21.32], // Rasalas
      [-37.17, 17.88, -17.99], // Adhafera
      [-38.36, 15.27, -17.89], // Algieba
      [-37.98, 12.98, -20.34], // Eta Leo
      [-38.91, 9.33, -20.6],   // Regulus
      [-41.3, 15.78, -8.38],   // Zosma
      [-42.52, 11.97, -8.61],  // Chertan
      [-43.5, 11.32, -2.07],   // Denebola
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [3, 6],
      [5, 7],
      [6, 7],
      [6, 8],
      [7, 8],
    ],
  },
  {
    id: "virgo",
    name: "Virgo",
    symbol: "♍",
    periodText: "Aug 23 - Sep 22",
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    glowColor: "#6EE7B7",
    lineColor: "rgba(110, 231, 183, 0.45)",
    center: [-43.37, -0.83, 11.96],
    nodes: [
      [-44.98, 1.17, -0.45],  // Zavijava
      [-44.75, -0.55, 4.72],  // Zaniah
      [-44.17, -1.11, 8.51],  // Porrima
      [-43.59, 2.32, 10.91],  // Auva
      [-42.73, 7.63, 11.87],  // Vindemiatrix
      [-41.47, -0.5, 17.47],  // Heze
      [-41.43, -7.94, 15.66], // Spica
      [-42.8, -3.99, 13.32],  // Theta Vir
      [-37.92, -4.34, 23.84], // Syrma
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 7],
      [7, 6],
      [3, 5],
      [5, 6],
      [5, 8],
    ],
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "♎",
    periodText: "Sep 23 - Oct 22",
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    glowColor: "#F472B6",
    lineColor: "rgba(244, 114, 182, 0.45)",
    center: [-27.93, -14.61, 32.12],
    nodes: [
      [-28.98, -7.34, 33.63],  // Zubeneschamali
      [-31.77, -12.44, 29.34], // Zubenelgenubi
      [-25.65, -11.49, 35.15], // Zubenelhakrabi
      [-28.26, -19.22, 29.28], // Brachium
      [-28.31, -15.24, 31.49], // Iota Lib
      [-23.18, -21.22, 32.21], // Upsilon Lib
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 4],
      [4, 3],
      [2, 5],
    ],
  },
  {
    id: "scorpio",
    name: "Scorpio",
    symbol: "♏",
    periodText: "Oct 23 - Nov 21",
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    glowColor: "#A78BFA",
    lineColor: "rgba(167, 139, 250, 0.45)",
    center: [-12.21, -24.31, 35.84],
    nodes: [
      [-20.29, -15.25, 37.16], // Graffias
      [-20.72, -17.31, 36],    // Dschubba
      [-20.38, -19.81, 34.89], // Fang
      [-15.52, -20.03, 37.19], // Antares
      [-11.15, -25.35, 35.46], // Larawag
      [-9.46, -30.32, 31.88],  // Zeta2 Sco
      [-3.25, -30.69, 32.75],  // Sargas
      [-2.67, -28.34, 34.85],  // Girtab
      [-4.13, -27.15, 35.65],  // Shaula
    ],
    lines: [
      [0, 1],
      [1, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
    ],
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    symbol: "♐",
    periodText: "Nov 22 - Dec 21",
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    glowColor: "#818CF8",
    lineColor: "rgba(129, 140, 248, 0.45)",
    center: [6.65, -21.79, 38.81],
    nodes: [
      [4.52, -18.68, 40.69],  // Kaus Borealis (Teapot lid)
      [2.8, -22.51, 38.86],   // Kaus Media
      [-0.43, -22.98, 38.69], // Alnasl (Spout tip)
      [3.22, -26.27, 36.39],  // Kaus Australis
      [8.26, -20.08, 39.42],  // Phi Sgr
      [11.48, -22.55, 37.22], // Ascella
      [10.37, -19.45, 39.23], // Nunki (Handle top)
      [12.65, -20.64, 37.94], // Tau Sgr (Handle outer)
    ],
    lines: [
      [0, 1],
      [0, 4],
      [1, 4],
      [1, 2],
      [2, 3],
      [1, 3],
      [3, 5],
      [5, 4],
      [4, 6],
      [6, 7],
      [7, 5],
    ],
  },
];

export const CONSTELLATION_MAP: Record<string, ConstellationData> =
  CONSTELLATIONS.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {} as Record<string, ConstellationData>);
