import type { FilmFormat } from './film-clock';
import { clamp01, easeInOut, easeOut } from './motion';

export interface JourneyEntry {
  marker: string;
  context: string;
  title: string;
  teaser: string;
  detail: string;
  work?: string;
}

export const journeyEntries: readonly JourneyEntry[] = [
  {
    marker: 'PRA-PPG',
    context: 'Titik berangkat',
    title: 'Memulai dari Teknik Informatika murni',
    teaser: 'Pedagogik masih menjadi hal baru bagiku.',
    detail: 'Sebelum PPG, latar belajarku berangkat dari Teknik Informatika. Aku belum banyak mengenal pedagogik dan cara merancang pembelajaran untuk peserta didik.',
  },
  {
    marker: 'AWAL PPG',
    context: 'Mengenal pedagogik',
    title: 'Melihat Informatika dari sisi peserta didik',
    teaser: 'Belajar memahami peserta didik dan tujuan belajar.',
    detail: 'Di PPG, aku mulai belajar melihat pembelajaran dari sisi peserta didik: mengenali kebutuhan mereka, merumuskan tujuan, lalu memilih strategi dan asesmen yang sesuai.',
  },
  {
    marker: 'PERANGKAT',
    context: 'Merancang pembelajaran',
    title: 'Mengubah pengetahuan menjadi perangkat ajar',
    teaser: 'Menyusun modul, LKPD, media, dan penilaian.',
    detail: 'Aku belajar menyusun modul ajar, LKPD, media pembelajaran, dan instrumen penilaian. Aku mulai memahami bahwa teknologi perlu mendukung tujuan belajar.',
  },
  {
    marker: 'SMA N 15',
    context: 'Semester 1 · SMA Negeri 15 Surabaya',
    title: 'Mencoba praktik di sekolah pertama',
    teaser: 'Berlatih mengajar dan berkarya bersama.',
    detail: 'Praktik semester pertama mempertemukan rancangan pembelajaran dengan pengalaman kelas. Dalam perjalanan ini, JurnalKita menjadi karya kelompok untuk tugas artikel.',
    work: 'JurnalKita · karya kelompok',
  },
  {
    marker: 'SMP N 60',
    context: 'Semester 2 · SMP Negeri 60 Surabaya',
    title: 'Memperluas pengalaman di sekolah berbeda',
    teaser: 'Belajar lagi melalui praktik dan proyek kepemimpinan.',
    detail: 'Semester kedua memberiku konteks sekolah yang berbeda untuk terus belajar. SIGAP menjadi proyek kepemimpinan yang kami kerjakan bersama.',
    work: 'SIGAP · proyek kelompok',
  },
  {
    marker: 'INOVASI',
    context: 'Karya individu · Ruang Belajar',
    title: 'Merancang inovasi pembelajaran secara pribadi',
    teaser: 'Mengembangkan inovasi pembelajaran Informatika.',
    detail: 'Ruang Belajar menjadi karya inovasi pembelajaran Informatika yang kukembangkan sendiri. Di sini bekal bidang studi mulai kucoba hubungkan dengan kebutuhan belajar.',
    work: 'Ruang Belajar · karya individu',
  },
  {
    marker: 'ARAH GURU',
    context: 'Refleksi dan langkah berikutnya',
    title: 'Menjadi guru Informatika yang terus belajar',
    teaser: 'Menggabungkan bekal teknis dan cara pandang pedagogik.',
    detail: 'PPG memperluas cara pandangku: mengajar bukan hanya menyampaikan materi atau menggunakan teknologi. Aku juga perlu merancang pengalaman belajar, memperhatikan peserta didik, menilai proses, dan merefleksikan praktik. Perjalananku masih berlanjut.',
  },
];

const warmUp = 0.55;
const travel = 12;
export const journeyDuration = warmUp + travel;
export const journeyStill = journeyDuration + 0.8;
const round = (value: number) => Math.round(value * 1000) / 1000;

interface Layout {
  width: number;
  height: number;
  x0: number;
  x1: number;
  top: number;
  base: number;
}

const layouts: Record<FilmFormat, Layout> = {
  wide: { width: 960, height: 280, x0: 48, x1: 912, top: 40, base: 205 },
  tall: { width: 360, height: 402, x0: 25, x1: 335, top: 46, base: 336 },
};

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  const slopes = points.slice(1).map((point, index) => (point.y - points[index]!.y) / (point.x - points[index]!.x));
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0]!;
    if (index === points.length - 1) return slopes[index - 1]!;
    const left = slopes[index - 1]!;
    const right = slopes[index]!;
    return left * right <= 0 ? 0 : (2 * left * right) / (left + right);
  });
  return points.reduce((path, point, index) => {
    if (index === 0) return 'M' + point.x + ' ' + point.y.toFixed(1);
    const from = points[index - 1]!;
    const third = (point.x - from.x) / 3;
    return path + ' C' + (from.x + third).toFixed(1) + ' ' + (from.y + tangents[index - 1]! * third).toFixed(1)
      + ' ' + (point.x - third).toFixed(1) + ' ' + (point.y - tangents[index]! * third).toFixed(1)
      + ' ' + point.x + ' ' + point.y.toFixed(1);
  }, '');
}

const colors = ['#9dd3f0', '#72bee5', '#4d9bd0', '#68d7b0', '#73bce3', '#68d7b0', '#c8f4ff'];
const phases = [
  { label: 'Bekal Informatika', from: 0, to: 0.17 },
  { label: 'Belajar pedagogik', from: 0.17, to: 0.43 },
  { label: 'Praktik di sekolah', from: 0.43, to: 0.83 },
  { label: 'Karya dan refleksi', from: 0.83, to: 1 },
];

export function perjalananFrame(time: number, format: FilmFormat) {
  const layout = layouts[format];
  const { width, height, x0, x1, top, base } = layout;
  const last = journeyEntries.length - 1;
  const progress = clamp01((time - warmUp) / travel);
  const routePosition = progress * last;
  const current = Math.min(last, Math.floor(routePosition + 0.00001));
  const positionAt = (index: number) => index / last;
  // Ketinggian lintasan menyimbolkan perubahan cara pandang, bukan skor kompetensi.
  const points = journeyEntries.map((_, index) => {
    const step = positionAt(index);
    return {
      x: round(x0 + step * (x1 - x0)),
      y: round(base - 15 - step * (base - top - 30)),
    };
  });
  const segment = Math.min(last - 1, Math.floor(routePosition));
  const segmentProgress = easeInOut(clamp01(routePosition - segment));
  const from = points[segment]!;
  const to = points[segment + 1]!;
  const tip = {
    x: round(from.x + (to.x - from.x) * segmentProgress),
    y: round(from.y + (to.y - from.y) * segmentProgress),
  };
  const curve = smoothPath(points);
  const nodes = journeyEntries.map((entry, index) => {
    const at = warmUp + positionAt(index) * travel;
    const age = time - at;
    return {
      ...entry,
      x: points[index]!.x,
      y: points[index]!.y,
      labelY: Math.min(points[index]!.y + (format === 'wide' ? 26 : 22), height - 8),
      color: colors[index % colors.length],
      at,
      passed: age >= 0,
      active: index === current,
      opacity: easeOut(clamp01(age / 0.3)),
      ring: index === current && time >= warmUp ? 0.55 + Math.sin(time * 3.4) * 0.12 : 0,
      state: index < current ? 'done' as const : index === current ? 'now' as const : 'next' as const,
    };
  });
  const phaseBars = phases.map((phase) => {
    const fromX = x0 + phase.from * (x1 - x0);
    const toX = x0 + phase.to * (x1 - x0);
    return {
      ...phase,
      x: round(fromX),
      width: round(toX - fromX - 5),
      fill: round(clamp01((progress - phase.from) / (phase.to - phase.from))),
      done: progress >= phase.to,
    };
  });

  return {
    format,
    width,
    height,
    x0,
    x1,
    top,
    base,
    progress: round(progress),
    dashArray: round(progress * 100) + ' 100',
    curve,
    area: curve + ' L' + x1 + ' ' + base + ' L' + x0 + ' ' + base + ' Z',
    tip,
    current,
    readout: String(current + 1).padStart(2, '0') + ' / ' + String(journeyEntries.length).padStart(2, '0'),
    currentEntry: journeyEntries[current]!,
    nodes,
    phases: phaseBars,
    grid: [0.25, 0.5, 0.75].map((part) => round(top + part * (base - top))),
    complete: time >= journeyDuration,
  };
}
