// Catatan sangrai sebagai film: sangraiFrame(t) menggambar seluruh layar mesin sangrai pada detik ke-t, seperti
// perangkat lunak sangrai yang merekam satu sesi. Garis waktu berjalan dari tahun pertama sampai tahun ini; kurva
// suhu tergambar di belakangnya dengan ujung yang membara, setiap tahap ditandai saat terlewati, bilah fase
// terisi, dan penghitung naik mengikuti kontribusi sungguhan per tahun. Film diputar sekali, lalu asap mengepul.
//
// Kurvanya profil suhu sangrai yang digayakan, naik terus dari biji hijau sampai siap seduh, bukan grafik
// kontribusi. Angka sungguhan ada di penghitung dan catatannya.
import type { FilmFormat } from './film-clock';
import { clamp01, easeOut, mix, noise } from './motion';

export interface SangraiYear {
  year: number;
  contributions: number;
}

export interface SangraiEntry {
  year: number;
  until?: number;
  roast: string;
  text: string;
}

export interface SangraiInput {
  years: readonly SangraiYear[];
  entries: readonly SangraiEntry[];
  /** Kontribusi setahun terakhir; penghitung berakhir tepat di angka ini. */
  total: number;
}

/** Layar menyala dulu, lalu sesi sangrai direkam selama `roast` detik. */
const warmUp = 0.7;
const roast = 9.4;
export const sangraiEnd = warmUp + roast;
/** Dengan gerak dikurangi, layar berhenti di gambar ini: sesi rampung dan asap sudah naik. */
export const sangraiStill = sangraiEnd + 1.2;
/** Satu sesi sangrai sungguhan kira-kira sepuluh menit; jam di layar memetakan garis waktu ke sana. */
const sessionSeconds = 648;
const lowTemp = 0;
const highTemp = 100;

interface Layout {
  width: number;
  height: number;
  x0: number;
  x1: number;
  top: number;
  base: number;
  yearY: number;
  phaseY: number;
  /** Persen fase di baris sendiri bila bilahnya terlalu sempit untuk nama dan persen sebaris. */
  phaseStacked: boolean;
  /** Letak tiga sel bacaan (suhu, waktu, tahap): x serta garis dasar label dan angkanya. */
  display: { cells: { x: number; labelY: number; valueY: number }[]; size: number };
}
const layouts: Record<FilmFormat, Layout> = {
  wide: {
    width: 960,
    height: 336,
    x0: 40,
    x1: 920,
    top: 92,
    base: 248,
    yearY: 276,
    phaseY: 296,
    phaseStacked: false,
    display: {
      cells: [
        { x: 40, labelY: 16, valueY: 44 },
        { x: 196, labelY: 16, valueY: 44 },
        { x: 352, labelY: 16, valueY: 44 },
      ],
      size: 22,
    },
  },
  // Layar sempit: tahap mendapat baris sendiri karena namanya bisa sepanjang "Retakan pertama".
  tall: {
    width: 340,
    height: 384,
    x0: 18,
    x1: 322,
    top: 132,
    base: 292,
    yearY: 316,
    phaseY: 336,
    phaseStacked: true,
    display: {
      cells: [
        { x: 18, labelY: 14, valueY: 38 },
        { x: 170, labelY: 14, valueY: 38 },
        { x: 18, labelY: 66, valueY: 90 },
      ],
      size: 19,
    },
  },
};

const round = (value: number, places = 10) => Math.round(value * places) / places;

/** Warna biji di setiap tahap: hijau mentah, keemasan, lalu cokelat tua siap seduh. */
function beanColor(t: number): string {
  return t <= 0.5 ? mix('#9dd3f0', '#4d9bd0', t / 0.5) : mix('#4d9bd0', '#173b5a', (t - 0.5) / 0.5);
}

/** Warna panas di ujung kurva, dari hijau dingin sampai jingga membara; sama dengan gradasi garisnya. */
function heatColor(heat: number): string {
  if (heat < 0.5) return mix('#9dd3f0', '#4d9bd0', heat / 0.5);
  if (heat < 0.75) return mix('#4d9bd0', '#3fc4b2', (heat - 0.5) / 0.25);
  return mix('#3fc4b2', '#c8f4ff', (heat - 0.75) / 0.25);
}

// Garis halus yang tidak pernah melampaui titik datanya: kemiringan tiap titik adalah rata-rata harmonik
// kemiringan di kiri dan kanannya, dan nol di puncak atau lembah.
function smoothPath(points: { x: number; y: number }[]): string {
  const slopes = points.slice(1).map((point, index) => (point.y - points[index]!.y) / (point.x - points[index]!.x));
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0]!;
    if (index === points.length - 1) return slopes[index - 1]!;
    const [left, right] = [slopes[index - 1]!, slopes[index]!];
    return left * right <= 0 ? 0 : (2 * left * right) / (left + right);
  });
  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x} ${point.y.toFixed(1)}`;
    const from = points[index - 1]!;
    const third = (point.x - from.x) / 3;
    return `${path} C${(from.x + third).toFixed(1)} ${(from.y + tangents[index - 1]! * third).toFixed(1)} ${(point.x - third).toFixed(1)} ${(point.y - tangents[index]! * third).toFixed(1)} ${point.x} ${point.y.toFixed(1)}`;
  }, '');
}

const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function sangraiFrame(time: number, format: FilmFormat, input: SangraiInput) {
  const layout = layouts[format];
  const { width, height, x0, x1, top, base } = layout;
  const first = input.years[0]!.year;
  const last = input.years.at(-1)!.year;
  const span = last - first;

  // Garis kemajuan konseptual tumbuh sepanjang perjalanan, bukan ukuran penilaian aktual.
  const tempAt = (year: number) => lowTemp + (highTemp - lowTemp) * (0.08 + 0.92 * clamp01((year - first) / span) ** 1.25);
  const xAt = (year: number) => x0 + ((year - first) / span) * (x1 - x0);
  const yAt = (temp: number) => base - ((temp - lowTemp) / (highTemp - lowTemp)) * (base - top);
  /** Detik film saat garis waktu tiba di tahun ini. */
  const reachAt = (year: number) => warmUp + ((year - first) / span) * roast;

  const progress = clamp01((time - warmUp) / roast);
  const now = first + progress * span;
  const temp = tempAt(now);
  const heat = (temp - lowTemp) / (highTemp - lowTemp);
  const tip = { x: round(xAt(now)), y: round(yAt(temp)) };
  const served = time >= sangraiEnd;
  const lit = easeOut(clamp01(time / warmUp));

  // Penghitung mengikuti kontribusi kumulatif: angkanya nyaris diam di tahun-tahun awal, lalu melesat di akhir.
  const totalAll = input.years.reduce((sum, entry) => sum + entry.contributions, 0);
  let gathered = 0;
  input.years.forEach((entry, index) => {
    if (index === 0) gathered += now >= entry.year ? entry.contributions : 0;
    else gathered += entry.contributions * clamp01(now - input.years[index - 1]!.year);
  });
  const readout = served ? input.total : Math.round(input.total * (totalAll ? gathered / totalAll : progress));

  const entries = input.entries.map((entry, index, all) => {
    const year = entry.until ? (entry.year + entry.until) / 2 : entry.year;
    const at = reachAt(year);
    const age = time - at;
    const shown = clamp01(age / 0.35);
    return {
      ...entry,
      x: round(xAt(year)),
      y: round(yAt(tempAt(year))),
      at,
      bean: beanColor(index / (all.length - 1)),
      opacity: round(shown, 1000),
      // Riak panas saat tahap terlewati: melebar dan memudar sekali, tanpa memantul.
      ring: age >= 0 && age < 1 ? { r: round(9 + 22 * easeOut(age)), opacity: round(0.7 * (1 - age), 1000) } : null,
    };
  });
  const current = entries.reduce((found, entry, index) => (time >= entry.at ? index : found), 0);
  const log = entries.map((entry, index) => ({
    ...entry,
    state: served || index < current ? ('done' as const) : index === current && time >= warmUp ? ('now' as const) : ('next' as const),
  }));

  const years = input.years.map((entry) => ({
    year: entry.year,
    x: round(xAt(entry.year)),
    passed: now >= entry.year - 0.001 && time >= warmUp,
    current: !served && Math.abs(now - entry.year) < 0.5 && time >= warmUp,
  }));

  // Tiga fase yang dicatat setiap perangkat lunak sangrai, dibatasi oleh tahap menguning dan retakan pertama.
  const yellow = first + span / 3;
  const crack = first + (span * 2) / 3;
  const phases = [
    { label: 'Konteks', from: first, to: yellow },
    { label: 'Praktik', from: yellow, to: crack },
    { label: 'Refleksi', from: crack, to: last },
  ];
  const phaseBars = phases.map((phase) => {
    const from = xAt(phase.from);
    const to = xAt(phase.to);
    const fill = clamp01((now - phase.from) / (phase.to - phase.from));
    return {
      label: phase.label,
      x: round(from),
      w: round(to - from - 6),
      fill: time >= warmUp ? round(fill, 1000) : 0,
      share: `${Math.round(((phase.to - phase.from) / span) * 100)}%`,
      done: fill >= 1,
    };
  });

  // Bara yang terlepas dari ujung kurva selama sangrai; makin panas, makin terang. Tiap bara lahir di detik
  // tetap, jadi letaknya bisa dihitung ulang tanpa menyimpan apa pun.
  const emberGap = 0.085;
  const emberLife = 1.15;
  const period = 30 * emberGap;
  const embers = Array.from({ length: 30 }, (_, index) => {
    const born = index * emberGap + Math.floor((time - index * emberGap) / period) * period;
    const age = time - born;
    if (born < warmUp || born > sangraiEnd || age > emberLife) return null;
    const bornYear = first + clamp01((born - warmUp) / roast) * span;
    const bornHeat = (tempAt(bornYear) - lowTemp) / (highTemp - lowTemp);
    const drift = (noise(index, 1) - 0.5) * 34;
    return {
      x: round(xAt(bornYear) + drift * age + Math.sin(age * 5 + index) * 2.5),
      y: round(yAt(tempAt(bornYear)) - age * (26 + 34 * noise(index, 2))),
      r: round(0.9 + 1.5 * noise(index, 3)),
      color: heatColor(Math.min(bornHeat + 0.15, 1)),
      opacity: round(bornHeat * 0.95 * (1 - age / emberLife) ** 1.5, 1000),
    };
  }).filter((ember) => ember !== null);

  // Asap yang mengepul dari biji yang baru dikeluarkan, terus naik selama layar terlihat.
  const sinceEnd = time - sangraiEnd;
  const smoke = [0, 1, 2].map((index) => {
    const phase = (((sinceEnd - index * 0.8) % 2.4) + 2.4) % 2.4 / 2.4;
    return {
      x: (index - 1) * 9,
      y: round(6 - 30 * phase),
      opacity: sinceEnd > 0 ? round(0.55 * Math.sin(Math.PI * phase) * clamp01(sinceEnd / 0.8), 1000) : 0,
    };
  });

  const display = [
    { label: 'Kemajuan visual', value: `${Math.round(temp)}%` },
    { label: 'Perjalanan', value: clock(progress * sessionSeconds) },
    { label: 'Karya', value: entries[current]!.roast },
  ].map((cell, index) => ({ ...cell, ...layout.display.cells[index]! }));

  return {
    format,
    width,
    height,
    x0,
    x1,
    top,
    base,
    yearY: layout.yearY,
    phaseY: layout.phaseY,
    phaseStacked: layout.phaseStacked,
    displayRow: layout.display,
    state: served ? ('served' as const) : time >= warmUp ? ('roasting' as const) : ('idle' as const),
    lit: round(lit, 1000),
    readout,
    grid: [25, 50, 75, 100].map((value) => ({ temp: value, y: round(yAt(value)) })),
    curve: smoothPath(input.years.map((entry) => ({ x: xAt(entry.year), y: yAt(tempAt(entry.year)) }))),
    reveal: served ? width : tip.x,
    tip,
    tipColor: heatColor(heat),
    // Ujung kurva membara selama sangrai, lalu meredup pelan setelah biji dikeluarkan.
    glow: round(time < warmUp ? 0 : served ? 0.35 + 0.65 * Math.exp(-1.6 * sinceEnd) : 0.45 + 0.55 * heat, 1000),
    playhead: time >= warmUp && !served ? round(clamp01((time - warmUp) / 0.3) * clamp01((sangraiEnd - time) / 0.3), 1000) : 0,
    display,
    years,
    phases: phaseBars,
    entries,
    log,
    current,
    embers,
    smoke,
    smokeAt: entries.at(-1)!,
  };
}

export type SangraiFrame = ReturnType<typeof sangraiFrame>;
