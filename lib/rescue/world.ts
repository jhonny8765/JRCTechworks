export const VIEW_W = 1100;
export const VIEW_H = 620;
export const WORLD_W = 2630;
export const GROUND_Y = 536;
export const PLAYER_W = 34;
export const PLAYER_H = 46;

export type Box = { x: number; y: number; w: number; h: number };
export type Terminal = { x: number; y: number; label: string; fixed: boolean };
export type DataBit = { x: number; y: number; taken: boolean; kind: "bit" | "heart" };
export type Glitch = { originX: number; x: number; y: number; range: number; speed: number; phase: number; alive: boolean };
export type Spike = Box;
export type Level = {
  number: number;
  name: string;
  subtitle: string;
  company: string;
  problem: string;
  color: string;
  secondary: string;
  backdrop: string;
  platforms: Box[];
  terminals: Terminal[];
  bits: DataBit[];
  glitches: Glitch[];
  spikes: Spike[];
  checkpoints: number[];
};

type LevelBlueprint = Omit<Level, "platforms" | "terminals" | "bits" | "glitches" | "spikes" | "checkpoints"> & {
  grounds: Array<[number, number]>;
  ledges: Array<[number, number, number]>;
  repairs: Array<[number, number, string]>;
  collectibles: Array<[number, number]>;
  enemies: Array<[number, number, number, number]>;
  traps: Array<[number, number]>;
};

const blueprints: LevelBlueprint[] = [
  {
    number: 1, name: "CASHFLOW CIRCUIT", subtitle: "THE BROKEN STORE", company: "SARI-SARI SYSTEMS",
    problem: "Fix the registers before the morning rush.", color: "#59e9f4", secondary: "#87aaff", backdrop: "#071c30",
    grounds: [[0, 600], [710, 1325], [1430, 1950], [2050, WORLD_W]],
    ledges: [[280, 436, 170], [835, 435, 170], [1110, 375, 170], [1550, 427, 170], [1780, 363, 160], [2110, 435, 175]],
    repairs: [[485, 484, "CARD TERMINAL"], [1235, 330, "SALES RECORDS"], [2200, 393, "POS REGISTER"]],
    collectibles: [[208, 483], [330, 397], [890, 393], [1050, 474], [1160, 333], [1510, 481], [1620, 390], [1835, 320], [2160, 391], [2350, 486]],
    enemies: [[425, 492, 72, 1.2], [980, 491, 84, 1.5], [1665, 488, 70, 1.3], [2315, 494, 75, 1.7]],
    traps: [[780, 42], [1480, 48], [2390, 49]],
  },
  {
    number: 2, name: "STOCKROOM SHIFT", subtitle: "INVENTORY CHAOS", company: "WAREHOUSE NETWORK",
    problem: "Recover the missing stock. Bring the records back online.", color: "#ab8cff", secondary: "#60d9ec", backdrop: "#16162d",
    grounds: [[0, 570], [680, 1260], [1390, 1920], [2030, WORLD_W]],
    ledges: [[240, 418, 175], [775, 418, 160], [1080, 356, 170], [1510, 421, 178], [1750, 344, 173], [2160, 400, 180]],
    repairs: [[360, 374, "STOCK COUNTER"], [1178, 312, "INVENTORY SYNC"], [2240, 357, "RESTOCK SYSTEM"]],
    collectibles: [[190, 481], [290, 375], [540, 478], [840, 375], [990, 481], [1140, 313], [1435, 482], [1600, 377], [1800, 301], [2160, 357], [2390, 480]],
    enemies: [[505, 489, 48, 1.5], [910, 488, 76, 1.9], [1655, 488, 70, 1.6], [2330, 490, 70, 1.9]],
    traps: [[730, 44], [1445, 65], [2055, 58]],
  },
  {
    number: 3, name: "BOOKING GRID", subtitle: "THE FINAL BACKLOG", company: "SERVICE HUB 03",
    problem: "Restore the appointments. Defeat the backlog.", color: "#f7b46a", secondary: "#fc78bc", backdrop: "#28152a",
    grounds: [[0, 605], [730, 1260], [1405, 1910], [2065, WORLD_W]],
    ledges: [[265, 420, 176], [830, 405, 168], [1120, 338, 170], [1540, 415, 170], [1760, 346, 168], [2140, 420, 174]],
    repairs: [[370, 376, "APPOINTMENT QUEUE"], [1225, 294, "CLIENT RECORDS"], [2210, 376, "AUTOMATION CORE"]],
    collectibles: [[145, 482], [325, 375], [540, 480], [880, 362], [1030, 480], [1170, 295], [1460, 482], [1600, 372], [1820, 302], [2140, 376], [2390, 481]],
    enemies: [[510, 489, 65, 2.1], [945, 485, 68, 2.0], [1635, 489, 65, 2.2], [2310, 489, 85, 2.0]],
    traps: [[785, 50], [1460, 60], [2100, 54]],
  },
];

export function createLevel(index: number): Level {
  const data = blueprints[index] ?? blueprints[0];
  const platforms = [
    ...data.grounds.map(([a, b]) => ({ x: a, y: GROUND_Y, w: b - a, h: VIEW_H - GROUND_Y })),
    ...data.ledges.map(([x, y, w]) => ({ x, y, w, h: 22 })),
  ];
  return {
    number: data.number,
    name: data.name,
    subtitle: data.subtitle,
    company: data.company,
    problem: data.problem,
    color: data.color,
    secondary: data.secondary,
    backdrop: data.backdrop,
    platforms,
    terminals: data.repairs.map(([x, y, label]) => ({ x, y, label, fixed: false })),
    bits: data.collectibles.map(([x, y]) => ({ x, y, taken: false, kind: "bit" })),
    glitches: data.enemies.map(([originX, y, range, speed], i) => ({ originX, x: originX, y, range, speed, phase: i * 1.3, alive: true })),
    spikes: data.traps.map(([x, w]) => ({ x, y: GROUND_Y - 15, w, h: 16 })),
    checkpoints: [76, 1490, 2110],
  };
}

export const LEVEL_COUNT = blueprints.length;
