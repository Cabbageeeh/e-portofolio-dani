// Film pendek ERP kavling, disusun seperti komposisi Remotion: kavlingFrame(t) menggambar seluruh layar pada
// detik ke-t. Tidak ada keadaan yang tertinggal di antara dua gambar, jadi film bisa diputar, dijeda, dilompati
// per bab, dan diuji di detik mana pun.
//
// Alurnya: garis batas calon lahan disurvei dan legalnya diperiksa, lahan dipecah jadi 18 kavling, satu kavling
// kosong dipesan, kamera menyelam ke kavling itu, lalu booking fee, DP, PPJB, cicilan, dan komisi sales tercatat
// satu per satu sebelum kamera mundur lagi ke seluruh lahan.
import type { FilmFormat } from './film-clock';
import { captionAt, clamp01, easeInOut, easeOut, interpolate, linear, mix, noise, shake, spring, type Caption, type Point } from './motion';

export type KavlingState = 'free' | 'booked' | 'sold';
type PlotLook = KavlingState | 'unknown';

export const kavlingDuration = 17;
/** Kavling yang dipesan bila pengunjung tidak memilih sendiri: Blok B-03. */
export const kavlingDefaultHero = 2;
export const kavlingBuyer = { name: 'Pilihan karya', initials: 'PK' };
const area = 'detail pembelajaran';
const price = 3;
const bookingFee = 1;
const downPayment = 2;
const months = 4;
const monthly = (price - downPayment) / months;
const commission = 3;

const baseStates: readonly KavlingState[] = ['sold', 'booked', 'free'];
export const kavlingCodes = ['JK', 'SG', 'RB'];
/** Hanya kavling yang masih kosong yang bisa dipesan pengunjung. */
export function kavlingPickable(index: number): boolean {
  return baseStates[index] === 'free';
}

const at = {
  pins: 0.8,
  legal: 1.9,
  scan: 3,
  scanEnd: 3.9,
  reveal: 4.2,
  hint: 4.7,
  click: 5.4,
  booking: 5.5,
  dived: 6.3,
  panel: 5.9,
  fee: 6.4,
  dpStart: 6.8,
  dp: 7.45,
  ppjb: 7.8,
  clause: 8.1,
  sign: 9.1,
  signed: 9.6,
  stamp: 9.65,
  cicilan: 10.2,
  paid1: 10.5,
  due2: 10.8,
  reminder: 11,
  paid2: 11.9,
  komisi: 12.6,
  checkPpjb: 12.9,
  checkDp: 13.2,
  unlock: 13.5,
  payStart: 13.6,
  paid: 14.3,
  panelOut: 15,
  pull: 15.2,
  pulled: 16.1,
  fade: 16.65,
};

/** Bab film untuk tombol lompat; `still` adalah gambar yang paling bercerita di bab itu. */
export const kavlingChapters = [
  { label: 'Koleksi', start: 0, still: 2.6 },
  { label: 'Pemetaan', start: at.scan, still: 5 },
  { label: 'Karya', start: at.booking, still: 7.6 },
  { label: 'Analisis', start: at.ppjb, still: 10 },
  { label: 'Refleksi', start: at.cicilan, still: 12.3 },
  { label: 'Tinjau', start: at.komisi, still: 14.8 },
] as const;
/** Dengan gerak dikurangi, film berhenti di gambar ini: kavling terjual dan komisinya sudah cair. */
export const kavlingStill = kavlingChapters[5].still;

export const kavlingPalette = {
  ink: '#eaf6ff',
  muted: '#9bb6ca',
  ok: '#68d7b0',
  wait: '#ffd166',
  booked: '#62b6e3',
  sold: '#3787bb',
  stamp: '#86d6f3',
  bubble: '#183e5a',
  read: '#5fc7ff',
};
const palette = kavlingPalette;

const looks: Record<PlotLook, { fill: string; fillOpacity: number; stroke: string; strokeOpacity: number; text: string }> = {
  unknown: { fill: palette.ink, fillOpacity: 0.04, stroke: palette.ink, strokeOpacity: 0.16, text: palette.muted },
  free: { fill: palette.ink, fillOpacity: 0.1, stroke: palette.ink, strokeOpacity: 0.36, text: palette.ink },
  booked: { fill: palette.booked, fillOpacity: 1, stroke: palette.booked, strokeOpacity: 1, text: '#2a1d15' },
  sold: { fill: palette.sold, fillOpacity: 1, stroke: palette.sold, strokeOpacity: 1, text: '#fff6ee' },
};

function captionsFor(code: string): Caption[] {
  return [
    { start: 0.2, end: 2.9, text: 'Tiga karya dari dua semester menjadi titik awal penelusuran.', tone: palette.wait },
    { start: at.scan, end: 5.4, text: 'Peta visual membuka jalur karya dan artefak.', tone: palette.ink },
    { start: 5.6, end: 7.7, text: `Karya ${code} dipilih untuk ditinjau lebih jauh.`, tone: palette.booked },
    { start: 7.9, end: 10.1, text: 'Tujuan, bukti, dan analisis disusun sebagai satu rangkaian.', tone: palette.sold },
    { start: 10.3, end: 12.5, text: 'Catatan refleksi melengkapi dokumentasi karya.', tone: palette.ok },
    { start: 12.7, end: 15.1, text: 'Tahap peninjauan bergerak menuju rangkuman.', tone: palette.ok },
    { start: 15.3, end: 16.7, text: 'Setiap karya dapat ditelusuri bersama konteksnya.', tone: palette.ok },
  ];
}

// Tata letak dua bentuk layar. Satuannya titik komposisi, bukan piksel; seluruh film diskalakan utuh ke lebar
// wadahnya. Panel transaksi berada di layar, bukan di dunia, jadi tidak ikut membesar saat kamera menyelam.
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Layout {
  width: number;
  height: number;
  plot: { w: number; h: number };
  cols: number[];
  rows: number[];
  road: { y: number; h: number };
  land: Point[];
  center: Point;
  peak: Point;
  hint: Point;
  zoom: number;
  heroScreen: Point;
  panel: Box;
  body: { h: number; row: number; chip: number; lineTop: number; lineGap: number; cellH: number; cellRows: number[]; bubbleY: number; amountY: number; badgeY: number };
}

const wide: Layout = {
  width: 640,
  height: 400,
  plot: { w: 70, h: 52 },
  cols: [0, 1, 2, 3, 4, 5].map((col) => 72 + col * 94),
  rows: [104, 192, 252],
  road: { y: 162, h: 22 },
  land: [
    { x: 64, y: 84 },
    { x: 584, y: 78 },
    { x: 576, y: 318 },
    { x: 70, y: 312 },
  ],
  center: { x: 320, y: 204 },
  peak: { x: 372, y: 182 },
  hint: { x: 320, y: 70 },
  zoom: 2.1,
  heroScreen: { x: 166, y: 198 },
  panel: { x: 322, y: 62, w: 298, h: 262 },
  body: { h: 150, row: 34, chip: 100, lineTop: 38, lineGap: 16, cellH: 22, cellRows: [20, 48], bubbleY: 84, amountY: 88, badgeY: 68 },
};

const tall: Layout = {
  width: 390,
  height: 560,
  plot: { w: 50, h: 46 },
  cols: [0, 1, 2, 3, 4, 5].map((col) => 24 + col * 68),
  rows: [172, 250, 302],
  road: { y: 224, h: 20 },
  land: [
    { x: 14, y: 150 },
    { x: 378, y: 142 },
    { x: 372, y: 370 },
    { x: 18, y: 364 },
  ],
  center: { x: 195, y: 260 },
  peak: { x: 232, y: 240 },
  hint: { x: 195, y: 132 },
  zoom: 1.9,
  heroScreen: { x: 195, y: 150 },
  panel: { x: 16, y: 238, w: 358, h: 222 },
  body: { h: 110, row: 32, chip: 116, lineTop: 34, lineGap: 14, cellH: 18, cellRows: [18, 41], bubbleY: 66, amountY: 78, badgeY: 58 },
};

const round = (value: number) => Math.round(value * 100) / 100;
const lerp = (from: Point, to: Point, amount: number): Point => ({ x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount });

export function rupiah(value: number): string {
  return `Tahap ${Math.max(1, Math.round(value))}`;
}

/** Bilangan yang berputar naik seperti penghitung, dibulatkan ke langkah tertentu agar tidak berkedip. */
function counter(target: number, progress: number, step: number): string {
  return rupiah(Math.round((target * progress) / step) * step);
}

/** Pembalikan kartu: kartu menipis ke garis lalu melebar lagi; warnanya berganti tepat di tengah. */
function flipScale(time: number, when: number): number {
  return Math.max(0.05, easeOut(clamp01(Math.abs(time - when) / 0.13)));
}

/** Kemunculan dan kepergian satu isi panel, berganti tanpa terputus saat bab berganti. */
function shown(time: number, start: number, end: number): { opacity: number; y: number } {
  const enter = spring(time - start, { stiffness: 200, damping: 22 });
  const leave = interpolate(time, [end - 0.2, end + 0.05], [0, 1], easeInOut);
  return { opacity: clamp01(enter * 1.5) * (1 - leave), y: round((1 - enter) * 14 - leave * 10) };
}

function contour(layout: Layout, level: number): string {
  const xs = layout.land.map((point) => point.x);
  const ys = layout.land.map((point) => point.y);
  const scale = 1 - level * 0.24;
  const rx = ((Math.max(...xs) - Math.min(...xs)) / 2) * 0.8 * scale;
  const ry = ((Math.max(...ys) - Math.min(...ys)) / 2) * 0.76 * scale;
  const center = lerp(layout.center, layout.peak, level / 3);
  const points = Array.from({ length: 48 }, (_, step) => {
    const angle = (step / 48) * Math.PI * 2;
    const wobble = 1 + 0.07 * Math.sin(angle * 3 + level) + 0.05 * Math.sin(angle * 5 + level * 2);
    return `${round(center.x + Math.cos(angle) * rx * wobble)} ${round(center.y + Math.sin(angle) * ry * wobble)}`;
  });
  return `M${points.join('L')}Z`;
}

const signature = (baseline: number) =>
  `M12 ${baseline}c6 -12 12 -14 14 -6s-4 12 2 8s10 -16 14 -10s-2 12 4 8s12 -12 18 -6s6 4 14 0`;

export function kavlingFrame(time: number, format: FilmFormat = 'wide', hero = kavlingDefaultHero) {
  const layout = format === 'tall' ? tall : wide;
  const { width, height, plot, body } = layout;
  const code = kavlingCodes[hero]!;
  const boxOf = (index: number): Box => ({ x: layout.cols[index % 6]!, y: layout.rows[Math.floor(index / 6)]!, ...plot });
  const heroBox = boxOf(hero);
  const heroCenter = { x: heroBox.x + plot.w / 2, y: heroBox.y + plot.h / 2 };
  const left = Math.min(...layout.land.map((point) => point.x));
  const right = Math.max(...layout.land.map((point) => point.x));
  const top = Math.min(...layout.land.map((point) => point.y));
  const bottom = Math.max(...layout.land.map((point) => point.y));

  // Kamera: mendekat pelan saat survei, menyelam ke kavling yang dipesan, lalu mundur di akhir.
  const settle = interpolate(time, [0, at.scan], [0.94, 1], easeOut);
  const dive = interpolate(time, [at.booking, at.dived], [0, 1], easeInOut) - interpolate(time, [at.pull, at.pulled], [0, 1], easeInOut);
  const zoom = settle * layout.zoom ** dive;
  const jolt = (time >= at.stamp ? Math.exp(-(time - at.stamp) * 9) * 2.4 : 0) + (time >= at.paid ? Math.exp(-(time - at.paid) * 9) * 1.2 : 0);
  const origin = lerp(layout.center, heroCenter, dive);
  const focus = lerp(layout.center, layout.heroScreen, dive);
  const camera = `translate(${round(focus.x + shake(time) * jolt)} ${round(focus.y + shake(time, 3) * jolt)}) scale(${round(zoom * 1000) / 1000}) translate(${round(-origin.x)} ${round(-origin.y)})`;
  const dim = 1 - 0.65 * dive;

  // Lahan: batas disurvei, kontur tanah, patok di setiap sudut, dan pemeriksaan legalitas.
  const dashed = interpolate(time, [1.25, 1.6], [0, 1]);
  const land = {
    d: `M${layout.land.map((point) => `${point.x} ${point.y}`).join('L')}Z`,
    fill: interpolate(time, [0.3, 1.4], [0, 1]),
    draw: interpolate(time, [0.25, 1.4], [0, 1], easeInOut),
    dashed,
    march: round(-time * 12),
  };
  const topo = interpolate(time, [at.scan, at.scan + 0.8], [0.26, 0.09]);
  const contours = [0, 1, 2, 3].map((level) => ({
    d: contour(layout, level),
    draw: interpolate(time, [0.1 + level * 0.18, 1.2 + level * 0.18], [0, 1], easeOut),
    opacity: topo,
  }));
  const pins = layout.land.map((corner, index) => {
    const when = at.pins + index * 0.14;
    const drop = spring(time - when, { stiffness: 220, damping: 14 });
    const ring = clamp01((time - when - 0.18) / 0.45);
    return {
      x: corner.x,
      y: round(corner.y - (1 - drop) * 28),
      opacity: clamp01(drop * 3),
      ring: ring > 0 && ring < 1 ? { x: corner.x, y: corner.y, r: round(3 + 12 * ring), opacity: round((1 - ring) * 0.7) } : null,
    };
  });
  const titleOut = interpolate(time, [at.scan, at.scan + 0.4], [0, 1]);
  const titleIn = spring(time - 0.9, { stiffness: 160, damping: 20 });
  const legalIn = spring(time - 1.2, { stiffness: 200, damping: 18 });
  const legalOk = time >= at.legal;
  const legalPop = spring(time - at.legal, { stiffness: 320, damping: 13 });
  const survey = {
    x: layout.center.x,
    y: layout.center.y,
    opacity: clamp01(titleIn * 1.4) * (1 - titleOut),
    rise: round((1 - titleIn) * 10),
    legal: {
      opacity: clamp01(legalIn * 1.6) * (1 - titleOut),
      scale: round((legalOk ? 0.9 + 0.1 * legalPop : legalIn) * 1000) / 1000,
      ok: legalOk,
      text: legalOk ? 'Konteks terpetakan' : 'Memetakan konteks',
      color: legalOk ? palette.ok : palette.wait,
      spin: round(time * 400),
    },
  };

  // Pemecahan lahan: garis pindai menyapu dari kiri, kavling bermunculan di belakangnya, lalu statusnya terbuka.
  const scanFrom = left - 12;
  const scanTo = right + 12;
  const scanX = interpolate(time, [at.scan, at.scanEnd], [scanFrom, scanTo], linear);
  const scan =
    time >= at.scan && time <= at.scanEnd + 0.25
      ? { x: round(scanX), y1: top - 10, y2: bottom + 10, opacity: time > at.scanEnd ? 1 - (time - at.scanEnd) / 0.25 : clamp01((time - at.scan) / 0.1) }
      : null;
  const roadX = layout.cols[0]!;
  const roadEnd = layout.cols[5]! + plot.w;
  const road = {
    x: roadX,
    y: layout.road.y,
    w: round(Math.min(Math.max(scanX - roadX, 0), roadEnd - roadX)),
    h: layout.road.h,
    full: roadEnd - roadX,
    label: interpolate(time, [3.6, 3.9], [0, 1]),
  };

  const hintOn = interpolate(time, [at.hint, at.hint + 0.3, at.booking - 0.15, at.booking], [0, 1, 1, 0]);
  const plots = baseStates.map((base, index) => {
    const box = boxOf(index);
    const cx = box.x + plot.w / 2;
    const cy = box.y + plot.h / 2;
    const isHero = index === hero;
    const popAt = at.scan + ((at.scanEnd - at.scan) * (cx - scanFrom)) / (scanTo - scanFrom) + Math.floor(index / 6) * 0.04;
    const pop = spring(time - popAt, { stiffness: 260, damping: 17 });
    const events: { at: number; state: KavlingState }[] = [{ at: at.reveal + (index % 6) * 0.08 + Math.floor(index / 6) * 0.1, state: isHero ? 'free' : base }];
    if (isHero) events.push({ at: at.fee, state: 'booked' }, { at: at.stamp + 0.05, state: 'sold' });
    let look: PlotLook = 'unknown';
    let flip = 1;
    for (const event of events) {
      if (time >= event.at) look = event.state;
      flip = Math.min(flip, flipScale(time, event.at));
    }
    const style = looks[look];
    const pulse = base === 'free' && look === 'free' ? hintOn * (0.32 + 0.3 * Math.sin((time - at.hint) * 7)) : 0;
    const grow = 0.6 + 0.4 * pop;
    const areaShown = isHero ? dive : 0;
    return {
      index,
      code: kavlingCodes[index]!,
      look,
      ...box,
      cx,
      cy,
      visible: pop > 0,
      transform: `translate(${cx} ${cy}) scale(${round(grow * 1000) / 1000} ${round(grow * flip * 1000) / 1000}) translate(${-cx} ${-cy})`,
      opacity: clamp01(pop * 1.6) * (isHero ? 1 : dim),
      fill: style.fill,
      fillOpacity: style.fillOpacity,
      stroke: style.stroke,
      strokeOpacity: Math.min(style.strokeOpacity + pulse, 1),
      text: style.text,
      labelY: round(cy + 3.6 - 5 * areaShown),
      area: areaShown,
      pickable: base === 'free' && time >= at.hint - 0.3 && time < at.booking,
    };
  });

  // Pengunjung (atau kursor film) memilih kavling kosong.
  const select = spring(time - at.click, { stiffness: 240, damping: 18 });
  const ringOut = interpolate(time, [at.pulled, at.fade], [0, 0.4]);
  const ring =
    select > 0
      ? {
          x: heroBox.x - 4,
          y: heroBox.y - 4,
          w: plot.w + 8,
          h: plot.h + 8,
          opacity: clamp01(select * 1.4) * (1 - ringOut),
          stroke: mix(palette.ink, palette.ok, clamp01((time - at.paid) / 0.4)),
        }
      : null;
  const cursorOn = interpolate(time, [4.95, 5.05, 5.5, 5.65], [0, 1, 1, 0]);
  const cursorAt = lerp({ x: layout.hint.x + 60, y: layout.hint.y + 26 }, { x: heroCenter.x + 4, y: heroCenter.y + 6 }, interpolate(time, [4.95, 5.35], [0, 1], easeInOut));
  const cursor =
    cursorOn > 0
      ? { x: round(cursorAt.x), y: round(cursorAt.y), opacity: cursorOn, scale: time >= 5.35 && time < 5.47 ? 0.82 : 1 }
      : null;
  const ripplePhase = clamp01((time - at.click) / 0.5);
  const ripple = ripplePhase > 0 && ripplePhase < 1 ? { x: heroCenter.x, y: heroCenter.y, r: round(6 + 30 * ripplePhase), opacity: round((1 - ripplePhase) * 0.55) } : null;
  const hint = hintOn > 0 ? { ...layout.hint, opacity: hintOn, rise: round((1 - hintOn) * 6) } : null;

  // Panel transaksi: muncul setelah kamera menyelam, berisi jalur tahap dan kartu untuk bab yang sedang diputar.
  const enter = spring(time - at.panel, { stiffness: 170, damping: 21 });
  const leave = interpolate(time, [at.panelOut, at.panelOut + 0.35], [0, 1], easeInOut);
  const panelOpacity = time >= at.panel ? clamp01(enter * 1.4) * (1 - leave) : 0;
  const shift = round((1 - enter) * 40 + leave * 24);
  const { panel: box } = layout;
  const bodyWidth = box.w - 36;
  const railWidth = (box.w - 36 - 4 * 6) / 5;
  const fills = [
    interpolate(time, [6, at.fee], [0, 1], easeOut),
    interpolate(time, [at.dpStart, at.dp], [0, 1], easeOut),
    interpolate(time, [at.clause, at.stamp], [0, 1]),
    interpolate(time, [at.paid1, at.paid1 + 0.3, at.paid2, at.paid2 + 0.3], [0, 1 / months, 1 / months, 2 / months]),
    interpolate(time, [at.checkPpjb, at.paid], [0, 1]),
  ];
  const panel =
    panelOpacity > 0.01
      ? {
          ...box,
          opacity: panelOpacity,
          transform: format === 'tall' ? `translate(${box.x} ${box.y + shift})` : `translate(${box.x + shift} ${box.y})`,
          title: `Karya ${code}`,
          detail: `${area} · simulasi peninjauan`,
          buyer: kavlingBuyer,
          bodyTop: 94,
          bodyWidth,
          rail: ['Bukti', 'Tujuan', 'Analisis', 'Refleksi', 'Tinjau'].map((label, index) => ({
            label,
            x: round(18 + index * (railWidth + 6)),
            w: round(railWidth),
            fill: round(railWidth * fills[index]!),
            opacity: fills[index]! > 0 ? 1 : 0.5,
          })),
        }
      : null;

  const bookingShown = shown(time, at.panel + 0.1, at.ppjb);
  const booking =
    panel && bookingShown.opacity > 0.01
      ? {
          ...bookingShown,
          rows: [
            { label: 'Tujuan belajar', amount: rupiah(bookingFee), when: at.fee, appear: at.panel + 0.15, bar: null },
            { label: 'Bukti kegiatan', amount: counter(downPayment, interpolate(time, [at.dpStart, at.dp], [0, 1], easeOut), 1), when: at.dp, appear: 6.6, bar: interpolate(time, [at.dpStart, at.dp], [0, 1], easeOut) },
          ].map((row, index) => ({
            label: row.label,
            amount: row.amount,
            y: index * (body.row + 8),
            opacity: clamp01(spring(time - row.appear, { stiffness: 200, damping: 20 }) * 1.5),
            check: round(spring(time - row.when, { stiffness: 320, damping: 15 }) * 1000) / 1000,
            draw: clamp01((time - row.when - 0.08) / 0.2),
            bar: row.bar === null ? null : round((bodyWidth - 60) * row.bar),
          })),
          rest: `Berlanjut ke analisis dan refleksi`,
          restY: 2 * (body.row + 8) + 14,
          restOpacity: interpolate(time, [at.dp, at.dp + 0.25], [0, 1]),
        }
      : null;

  const ppjbShown = shown(time, at.ppjb + 0.05, at.cicilan);
  const docX = body.chip + 14;
  const docWidth = bodyWidth - docX;
  const ppjb =
    panel && ppjbShown.opacity > 0.01
      ? {
          ...ppjbShown,
          chipWidth: body.chip,
          doc: { x: docX, w: docWidth, h: body.h, title: `Catatan analisis ${code}` },
          clauses: (() => {
          const clauseData = [
            { label: 'Tujuan pembelajaran', parts: ['Tujuan', 'pembelajaran'], lineParts: ['1. Tujuan', 'pembelajaran'] },
            { label: 'Materi dan media', parts: ['Materi', 'dan media'], lineParts: ['2. Materi', 'dan media'] },
            { label: 'Asesmen', parts: ['Asesmen'], lineParts: ['3. Asesmen'] },
            { label: 'Refleksi', parts: ['Refleksi'], lineParts: ['4. Refleksi'] },
          ];
          let lineCursor = body.lineTop;
          const lineStep = format === 'tall' ? 10 : 14;
          const clauseGap = format === 'tall' ? 2 : 4;
          return clauseData.map(({ label, parts, lineParts }, index) => {
            const start = at.clause + index * 0.24;
            const fly = spring(time - start, { stiffness: 150, damping: 19 });
            const lineY = lineCursor;
            lineCursor += lineParts.length * lineStep + clauseGap;
            const from = { x: 0, y: index * 28 };
            const to = { x: docX + 4, y: lineY - 15 };
            const place = lerp(from, to, fly);
            const flying = time >= start ? 1 - clamp01((time - start - 0.4) / 0.18) : 0;
            return {
              label,
              parts,
              y: index * 28,
              glow: time >= start ? 1 - clamp01((time - start) / 0.5) : 0,
              copy: flying > 0 ? { x: round(place.x), y: round(place.y), opacity: flying, scale: round((1 - 0.18 * fly) * 1000) / 1000 } : null,
              line: {
                parts: lineParts.map((text, lineIndex) => ({ text, y: lineY + lineIndex * lineStep })),
                opacity: clamp01((time - start - 0.32) / 0.2),
              },
            };
          });
          })(),
          signature: { d: signature(body.h - 16), draw: interpolate(time, [at.sign, at.signed], [0, 1], easeInOut), lineY: body.h - 11 },
          stamp:
            time >= at.stamp
              ? (() => {
                  const hit = spring(time - at.stamp, { stiffness: 380, damping: 16 });
                  return { x: docX + docWidth - 54, y: body.h - 28, scale: round((1.7 - 0.7 * hit) * 1000) / 1000, opacity: clamp01(hit * 2) };
                })()
              : null,
        }
      : null;

  const cicilanShown = shown(time, at.cicilan + 0.05, at.komisi);
  const cellWidth = (bodyWidth - 5 * 5) / 6;
  const bubbleIn = spring(time - at.reminder, { stiffness: 210, damping: 18 });
  const bubbleWidth = Math.min(bodyWidth, 236);
  const cicilan =
    panel && cicilanShown.opacity > 0.01
      ? {
          ...cicilanShown,
          info: `${months} aspek untuk meninjau karya`,
          cells: Array.from({ length: months }, (_, index) => {
            const paidAt = index === 0 ? at.paid1 : index === 1 ? at.paid2 : Infinity;
            const due = index === 1 && time >= at.due2 && time < at.paid2;
            const paid = time >= paidAt;
            const x = (index % 6) * (cellWidth + 5);
            const y = body.cellRows[Math.floor(index / 6)]!;
            const flip = Number.isFinite(paidAt) ? flipScale(time, paidAt) : 1;
            return {
              number: index + 1,
              x: round(x),
              y,
              w: round(cellWidth),
              h: body.cellH,
              state: paid ? 'paid' : due ? 'due' : 'later',
              transform: `translate(0 ${y + body.cellH / 2}) scale(1 ${round(flip * 1000) / 1000}) translate(0 ${-(y + body.cellH / 2)})`,
              pulse: due ? round(0.55 + 0.45 * Math.sin((time - at.due2) * 8)) : 1,
            };
          }),
          bubble:
            time >= at.reminder
              ? {
                  x: round(bodyWidth - bubbleWidth),
                  y: body.bubbleY,
                  w: bubbleWidth,
                  opacity: clamp01(bubbleIn * 1.6),
                  scale: round((0.85 + 0.15 * bubbleIn) * 1000) / 1000,
                  title: `Catatan karya ${code}`,
                  read: time >= at.reminder + 0.6,
                }
              : null,
        }
      : null;

  const komisiShown = shown(time, at.komisi + 0.05, Infinity);
  const unlock = spring(time - at.unlock, { stiffness: 200, damping: 12 });
  const payout = interpolate(time, [at.payStart, at.paid], [0, 1], easeOut);
  const badgeIn = spring(time - at.paid, { stiffness: 300, damping: 14 });
  const badge = { x: bodyWidth - 42, y: body.badgeY + 12 };
  const komisi =
    panel && komisiShown.opacity > 0.01
      ? {
          ...komisiShown,
          conditions: [
            { label: 'Tujuan pembelajaran jelas', when: at.checkPpjb },
            { label: 'Bukti karya tercatat', when: at.checkDp },
          ].map((condition, index) => ({
            label: condition.label,
            y: index * 24,
            opacity: clamp01(spring(time - (at.komisi + 0.1 + index * 0.08), { stiffness: 200, damping: 20 }) * 1.5),
            check: round(spring(time - condition.when, { stiffness: 320, damping: 15 }) * 1000) / 1000,
            draw: clamp01((time - condition.when - 0.06) / 0.2),
          })),
          lock: { x: bodyWidth - 22, y: 22, lift: round(-5 * unlock), color: mix(palette.muted, palette.ok, clamp01(unlock)) },
          amount: counter(commission, payout, 1),
          amountY: body.amountY,
          amountColor: mix(palette.muted, palette.ink, payout),
          note: 'Rangkuman untuk ditinjau dosen',
          badge: time >= at.paid ? { ...badge, scale: round(badgeIn * 1000) / 1000, opacity: clamp01(badgeIn * 2) } : null,
          sparks:
            time >= at.paid && time < at.paid + 0.8
              ? Array.from({ length: 12 }, (_, index) => {
                  const life = clamp01((time - at.paid) / 0.8);
                  const angle = noise(index, 1) * Math.PI * 2;
                  const reach = (24 + 30 * noise(index, 2)) * easeOut(life);
                  return { x: round(badge.x + Math.cos(angle) * reach), y: round(badge.y + Math.sin(angle) * reach), r: round(1.2 + 1.4 * noise(index, 3)), opacity: round(1 - life) };
                })
              : [],
        }
      : null;

  // Papan keterangan: hitungan kavling menurut statusnya, langsung dari gambar yang sedang tampil.
  const counts = { free: 0, booked: 0, sold: 0 };
  plots.forEach((item) => {
    if (item.look !== 'unknown') counts[item.look] += 1;
  });
  const revealed = plots.some((item) => item.look !== 'unknown');
  const chips = revealed
    ? [
        { text: `${counts.free} dipilih`, color: palette.ink, kind: 'dot' as const },
        { text: `${counts.booked} ditinjau`, color: palette.booked, kind: 'dot' as const },
        { text: `${counts.sold} terdokumentasi`, color: palette.sold, kind: 'dot' as const },
      ]
    : [
        { text: legalOk ? 'Konteks terpetakan' : 'memetakan konteks', color: survey.legal.color, kind: 'dot' as const },
        { text: '3 karya', color: palette.muted, kind: 'plain' as const, wideOnly: true },
      ];
  const subtitle =
    time < at.scan ? 'Tiga karya dari dua semester' : time < at.booking || time >= at.pull ? 'Peta portofolio Informatika' : `Karya ${code} untuk ditinjau`;
  const state = time < at.scan ? 'koleksi' : time < at.booking ? 'pemetaan' : time < at.pull ? 'peninjauan' : 'utuh';

  return {
    format,
    width,
    height,
    state,
    code,
    subtitle,
    chips,
    caption: captionAt(time, captionsFor(code)),
    fade: interpolate(time, [0, 0.35], [0, 1]) * interpolate(time, [at.fade, kavlingDuration], [1, 0]),
    camera,
    dim,
    land,
    contours,
    pins,
    survey,
    scan,
    road,
    plots,
    plotSize: plot,
    ring,
    cursor,
    ripple,
    hint,
    panel,
    booking,
    ppjb,
    cicilan,
    komisi,
    body: { ...body, w: bodyWidth },
  };
}

export type KavlingFrame = ReturnType<typeof kavlingFrame>;
