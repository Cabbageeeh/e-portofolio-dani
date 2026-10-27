// Film pendek penjadwal guru, disusun seperti komposisi Remotion: jadwalFrame(t) menggambar seluruh layar pada
// detik ke-t. Tidak ada keadaan yang tertinggal di antara dua gambar, jadi film bisa diputar, dijeda, dilompati
// per bab, dan diuji di detik mana pun.
//
// Alur ilustrasi: penjadwal membaca aturan, menempatkan pelajaran satu per satu, menemukan bentrok,
// mencoba slot lain, lalu menjelaskan mengapa satu permintaan tidak dapat dipenuhi.
import type { FilmFormat } from './film-clock';
import { captionAt, clamp01, cubicPoint, easeInOut, interpolate, mix, spring, type Caption, type Point } from './motion';

export const jadwalDuration = 18;
export const jadwalDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];
const periods = 5;

export const jadwalTeachers: Record<string, string> = {
  Rina: 'Guru A',
  Sari: 'Guru B',
  Dedi: 'Guru C',
  Hasan: 'Guru D',
  Nita: 'Guru E',
  Maya: 'Guru F',
  Andi: 'Guru G',
  Joko: 'Guru H',
  Bayu: 'Guru I',
  Hadi: 'Guru J',
};
/** Guru yang jadwalnya disorot bila pengunjung tidak memilih sendiri. */
export const jadwalDefaultTeacher = 'Rina';

export const jadwalPalette = { ink: '#eef7ff', muted: '#9bb8cf', ok: '#7ce0b7', wait: '#85cfff', fail: '#f7bf63', clash: '#ff876d' };
const palette = jadwalPalette;
const tone = {
  mat: '#9bcaf1',
  ipa: '#85dcb7',
  indo: '#d2a9de',
  ips: '#b7d5e9',
  pjok: '#76d2dd',
  ing: '#a8bdf3',
  seni: '#ffc47d',
  tik: '#5dc4ee',
  fisika: '#eef7ff',
  agama: '#a9d88c',
  pkn: '#ed9daa',
};

interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  day: number;
  period: number;
  span: number;
  tone: string;
}

// Satu jadwal contoh dikunci manual; sisanya menunggu di antrean sesuai batasan.
const tahfiz: Lesson = { id: 'tahfiz', subject: 'Tahfiz', teacher: 'Hasan', day: 2, period: 0, span: 1, tone: tone.agama };
const queue: readonly Lesson[] = [
  { id: 'mat1', subject: 'Mat', teacher: 'Rina', day: 0, period: 0, span: 2, tone: tone.mat },
  { id: 'seni1', subject: 'Seni', teacher: 'Maya', day: 1, period: 2, span: 2, tone: tone.seni },
  { id: 'pjok', subject: 'PJOK', teacher: 'Joko', day: 4, period: 0, span: 2, tone: tone.pjok },
  { id: 'ipa1', subject: 'IPA', teacher: 'Nita', day: 1, period: 0, span: 1, tone: tone.ipa },
  { id: 'indo1', subject: 'B. Indo', teacher: 'Sari', day: 1, period: 1, span: 1, tone: tone.indo },
  { id: 'ips1', subject: 'IPS', teacher: 'Dedi', day: 0, period: 2, span: 1, tone: tone.ips },
  { id: 'ing1', subject: 'B. Ing', teacher: 'Andi', day: 2, period: 1, span: 1, tone: tone.ing },
  { id: 'mat2', subject: 'Mat', teacher: 'Rina', day: 2, period: 2, span: 1, tone: tone.mat },
  { id: 'tik', subject: 'TIK', teacher: 'Bayu', day: 3, period: 0, span: 1, tone: tone.tik },
  { id: 'indo2', subject: 'B. Indo', teacher: 'Sari', day: 3, period: 1, span: 1, tone: tone.indo },
  { id: 'seni2', subject: 'Seni', teacher: 'Maya', day: 0, period: 3, span: 1, tone: tone.seni },
  { id: 'agama', subject: 'Agama', teacher: 'Hasan', day: 0, period: 4, span: 1, tone: tone.agama },
  { id: 'pkn', subject: 'PKn', teacher: 'Dedi', day: 1, period: 4, span: 1, tone: tone.pkn },
  // Fisika mula-mula jatuh pada slot Guru J yang tidak tersedia, lalu digeser ke slot lain.
  { id: 'fisika', subject: 'Fisika', teacher: 'Hadi', day: 4, period: 2, span: 1, tone: tone.fisika },
  { id: 'ipa2', subject: 'IPA', teacher: 'Nita', day: 2, period: 3, span: 1, tone: tone.ipa },
  { id: 'indo3', subject: 'B. Indo', teacher: 'Sari', day: 2, period: 4, span: 1, tone: tone.indo },
  { id: 'mat3', subject: 'Mat', teacher: 'Rina', day: 3, period: 4, span: 1, tone: tone.mat },
  { id: 'ing2', subject: 'B. Ing', teacher: 'Andi', day: 4, period: 3, span: 1, tone: tone.ing },
  { id: 'ips2', subject: 'IPS', teacher: 'Dedi', day: 4, period: 4, span: 1, tone: tone.ips },
];
const lessons = [tahfiz, ...queue];
export const jadwalHours = lessons.reduce((sum, lesson) => sum + lesson.span, 0);
const fisika = queue.findIndex((lesson) => lesson.id === 'fisika');
const busy = { day: 3, period: 2, span: 2 };
const clashDay = 3;

const flight = 0.42;
const launchAt = queue.map((_, index) => (index < fisika ? 3.25 + index * 0.28 : index === fisika ? 7.05 : 11.3 + (index - fisika - 1) * 0.2));
const at = {
  tahfiz: 1,
  lock: 1.3,
  busy: 1.6,
  queue: 3,
  clash: launchAt[fisika]! + flight,
  probeA: 9.55,
  probeB: 9.85,
  shift: 10.1,
  shifted: 10.7,
  focus: 12.9,
  focusEnd: 14.15,
  request: 14.35,
  scan: 14.7,
  refuse: 15.5,
  fade: 17.5,
};

/** Bab film untuk tombol lompat; `still` adalah gambar yang paling bercerita di bab itu. */
export const jadwalChapters = [
  { label: 'Aturan', start: 0, still: 2.6 },
  { label: 'Susun', start: at.queue, still: 6.2 },
  { label: 'Bentrok', start: 7, still: 8.4 },
  { label: 'Geser', start: 9.4, still: 10.8 },
  { label: 'Beres', start: 11.2, still: 12.7 },
  { label: 'Mustahil', start: 14.2, still: 16.5 },
] as const;
/** Dengan gerak dikurangi, film berhenti di gambar ini: semua jam terjadwal tanpa bentrok. */
export const jadwalStill = jadwalChapters[4].still;
/** Detik saat jadwal guru yang dipilih mulai disorot. */
export const jadwalFocusAt = at.focus;

const captions: readonly Caption[] = [
  { start: 0.2, end: 2.9, text: 'Penjadwal membaca aturannya dulu: jam yang dikunci dan jam guru yang kosong.', tone: palette.wait },
  { start: 3.1, end: 6.95, text: 'Lalu setiap jam pelajaran ditempatkan satu per satu.', tone: palette.ink },
  { start: 7.2, end: 9.3, text: 'Fisika jatuh pada slot Guru J yang tidak tersedia.', tone: palette.fail },
  { start: 9.45, end: 11.1, text: 'Mesin mencari slot lain dan menggeser Fisika ke Jumat.', tone: palette.wait },
  { start: 11.3, end: 14.1, text: 'Semua jam terisi tanpa bentrok, dan Tahfiz tetap di tempatnya.', tone: palette.ok },
  { start: 14.3, end: 17.6, text: 'Bila jadwal tidak dapat disusun, sistem menjelaskan sebabnya.', tone: palette.fail },
];

// Tata letak dua bentuk layar. Satuannya titik komposisi, bukan piksel; seluruh film diskalakan utuh ke lebar
// wadahnya. Kisi jadwal berada di dunia (bisa didekati kamera), baki di sampingnya berada di layar.
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Layout {
  width: number;
  height: number;
  grid: { x: number; colW: number; colGap: number; y: number; rowH: number; rowGap: number; labelX: number; headerY: number };
  tray: { x: number; y: number; titleY: number; titleEnd: number; card: { w: number; h: number }; axis: 'x' | 'y'; step: number; visible: number; clip: Box };
  card: { name: Point; teacher: Point; hours: Point };
  rule: { h: number; step: number; w: number; title: Point; note: Point };
  focus: Box & { name: Point; detail: Point; clean: Point & { anchor: 'start' | 'end' }; hint: Point; hintLines: string[] };
  refusal: Box & { body: number[]; tip: number[]; bodyLines: string[]; tipLines: string[] };
  zoom: number;
  /** Titik kisi yang dipegang kamera saat mendekat, dan letaknya di layar ketika kamera sudah dekat. */
  zoomFrom: Point;
  zoomTo: Point;
}

const wide: Layout = {
  width: 640,
  height: 400,
  grid: { x: 52, colW: 68, colGap: 4, y: 86, rowH: 42, rowGap: 4, labelX: 36, headerY: 76 },
  tray: { x: 432, y: 96, titleY: 84, titleEnd: 620, card: { w: 188, h: 30 }, axis: 'y', step: 36, visible: 5, clip: { x: 428, y: 90, w: 196, h: 186 } },
  card: { name: { x: 14, y: 19 }, teacher: { x: 74, y: 19 }, hours: { x: 176, y: 19 } },
  rule: { h: 40, step: 48, w: 188, title: { x: 14, y: 17 }, note: { x: 14, y: 32 } },
  focus: {
    x: 432,
    y: 96,
    w: 188,
    h: 86,
    name: { x: 14, y: 26 },
    detail: { x: 14, y: 45 },
    clean: { x: 14, y: 68, anchor: 'start' },
    hint: { x: 432, y: 208 },
    hintLines: ['Klik mapel lain untuk', 'melihat jadwal gurunya.'],
  },
  refusal: {
    x: 432,
    y: 96,
    w: 188,
    h: 136,
    body: [50, 65, 80],
    tip: [104, 118],
    bodyLines: ['Guru F hanya tersedia', 'Senin dan Selasa, dan', 'kedua hari itu sudah penuh.'],
    tipLines: ['Saran: buka slot Guru F', 'di hari lain.'],
  },
  zoom: 1.18,
  zoomFrom: { x: 408, y: 76 },
  zoomTo: { x: 426, y: 64 },
};

const tall: Layout = {
  width: 390,
  height: 560,
  grid: { x: 34, colW: 64, colGap: 4, y: 90, rowH: 40, rowGap: 4, labelX: 20, headerY: 80 },
  tray: { x: 16, y: 340, titleY: 330, titleEnd: 374, card: { w: 86, h: 40 }, axis: 'x', step: 92, visible: 4, clip: { x: 12, y: 334, w: 366, h: 52 } },
  card: { name: { x: 10, y: 17 }, teacher: { x: 10, y: 31 }, hours: { x: 78, y: 17 } },
  rule: { h: 34, step: 40, w: 358, title: { x: 14, y: 15 }, note: { x: 14, y: 28 } },
  focus: {
    x: 16,
    y: 340,
    w: 358,
    h: 60,
    name: { x: 14, y: 24 },
    detail: { x: 14, y: 43 },
    clean: { x: 344, y: 24, anchor: 'end' },
    hint: { x: 16, y: 420 },
    hintLines: ['Klik mapel lain untuk melihat jadwal gurunya.'],
  },
  refusal: {
    x: 16,
    y: 340,
    w: 358,
    h: 104,
    body: [48, 63],
    tip: [88],
    bodyLines: ['Guru F hanya tersedia Senin dan Selasa,', 'dan kedua hari itu sudah penuh.'],
    tipLines: ['Saran: buka slot Guru F di hari lain.'],
  },
  zoom: 1.14,
  zoomFrom: { x: 370, y: 80 },
  zoomTo: { x: 372, y: 66 },
};

const rules = [
  { title: 'Tahfiz dikunci', note: 'diatur manual, tidak boleh digeser', color: palette.ink },
  { title: 'Guru J tidak tersedia', note: 'Kamis jam 3 dan 4', color: palette.wait },
  { title: 'Mat dua jam berurutan', note: 'tidak boleh dipisah', color: tone.mat },
];

const round = (value: number) => Math.round(value * 100) / 100;
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
/** Selubung muncul dan hilang sebuah unsur dalam rentang waktunya. */
const envelope = (time: number, start: number, end: number, fade = 0.25) => interpolate(time, [start, start + fade, end - fade, end], [0, 1, 1, 0]);

export function jadwalFrame(time: number, format: FilmFormat = 'wide', teacher = jadwalDefaultTeacher) {
  const layout = format === 'tall' ? tall : wide;
  const { width, height, grid, tray } = layout;
  const cell = (day: number, period: number, span = 1): Box => ({
    x: grid.x + day * (grid.colW + grid.colGap),
    y: grid.y + period * (grid.rowH + grid.rowGap),
    w: grid.colW,
    h: span * grid.rowH + (span - 1) * grid.rowGap,
  });

  // Kamera: diam selama jam pelajaran beterbangan, mendekat ke Kamis dan Jumat saat bentrok dan penggeseran.
  const zoom = interpolate(time, [at.clash + 0.05, at.clash + 0.55, 10.85, 11.25], [1, layout.zoom, layout.zoom, 1], easeInOut);
  const closeness = (zoom - 1) / (layout.zoom - 1);
  const focusX = lerp(layout.zoomFrom.x, layout.zoomTo.x, closeness);
  const focusY = lerp(layout.zoomFrom.y, layout.zoomTo.y, closeness);
  const camera = `translate(${round(focusX)} ${round(focusY)}) scale(${round(zoom * 1000) / 1000}) translate(${-layout.zoomFrom.x} ${-layout.zoomFrom.y})`;

  // Kisi minggu: nama hari, nomor jam, dan petak kosong muncul berurutan.
  const days = jadwalDays.map((label, day) => {
    const box = cell(day, 0);
    return { label, x: box.x + grid.colW / 2, y: grid.headerY, opacity: clamp01(spring(time - 0.25 - day * 0.07, { stiffness: 200, damping: 20 }) * 1.5) };
  });
  const hours = Array.from({ length: periods }, (_, period) => ({
    label: String(period + 1),
    x: grid.labelX,
    y: cell(0, period).y + grid.rowH / 2 + 4,
    opacity: clamp01(spring(time - 0.4 - period * 0.05, { stiffness: 200, damping: 20 }) * 1.5),
  }));

  // Permintaan mustahil: hari Guru F disorot, setiap petaknya ternyata penuh.
  const scanDim = interpolate(time, [at.scan - 0.2, at.scan + 0.1], [0, 1]) * interpolate(time, [at.fade, jadwalDuration], [1, 0]);
  const slots = Array.from({ length: periods * jadwalDays.length }, (_, index) => {
    const day = index % jadwalDays.length;
    const period = Math.floor(index / jadwalDays.length);
    const pop = spring(time - 0.35 - (day + period) * 0.05, { stiffness: 240, damping: 20 });
    const markAt = at.scan + 0.08 + day * 0.3 + period * 0.06;
    return {
      ...cell(day, period),
      opacity: clamp01(pop * 1.5),
      full: day < 2 && time >= markAt ? round(spring(time - markAt, { stiffness: 320, damping: 15 }) * 1000) / 1000 : 0,
    };
  });
  const bands = [0, 1].map((day) => {
    const box = cell(day, 0, periods);
    return { x: box.x - 3, y: box.y - 3, w: box.w + 6, h: box.h + 6, opacity: envelope(time, at.scan + day * 0.3, jadwalDuration, 0.2) };
  });

  // Jam Guru J yang tidak tersedia, yang menyala saat Fisika menabraknya.
  const busyBox = cell(busy.day, busy.period, busy.span);
  const grow = spring(time - at.busy, { stiffness: 170, damping: 20 });
  const clashGlow = interpolate(time, [at.clash, at.clash + 0.1, at.shift, at.shifted], [0, 1, 1, 0]);
  const unavailable = {
    ...busyBox,
    scale: round(grow * 1000) / 1000,
    opacity: clamp01(grow * 1.4) * (1 - 0.6 * scanDim),
    stroke: mix(palette.muted, palette.clash, clashGlow),
    fillOpacity: 0.08 + 0.16 * clashGlow,
    label: { x: busyBox.x + grid.colW / 2, y: cell(busy.day, busy.period + 1).y + grid.rowH / 2, opacity: interpolate(time, [1.85, 2.1], [0, 1]), color: mix(palette.muted, palette.fail, clashGlow) },
  };

  // Antrean: kartu bergeser maju setiap kali kartu terdepan terbang ke kisi.
  const queueIn = (index: number) => spring(time - at.queue - 0.05 * Math.min(index, 6), { stiffness: 200, damping: 22 });
  const slotOf = (index: number, moment: number) => index - launchAt.slice(0, index).reduce((sum, launch) => sum + spring(moment - launch, { stiffness: 200, damping: 24 }), 0);
  const slotPlace = (slot: number): Point =>
    tray.axis === 'y' ? { x: tray.x, y: tray.y + slot * tray.step } : { x: tray.x + slot * tray.step, y: tray.y };
  const queueOut = interpolate(time, [12.4, 12.7], [1, 0]);
  const cards = queue
    .map((lesson, index) => {
      if (time >= launchAt[index]!) return null;
      const slot = slotOf(index, time);
      const place = slotPlace(slot);
      const enter = queueIn(index);
      const opacity = clamp01(enter * 1.5) * clamp01(tray.visible - slot) * queueOut;
      if (opacity <= 0.01) return null;
      const lift = round((1 - enter) * 12);
      return {
        id: lesson.id,
        x: round(place.x),
        y: round(place.y + lift),
        ...tray.card,
        subject: lesson.subject,
        teacher: lesson.teacher,
        hours: `${lesson.span} jam`,
        tone: lesson.tone,
        opacity,
      };
    })
    .filter((card) => card !== null);

  // Jam pelajaran di kisi: Tahfiz yang terkunci jatuh lebih dulu, sisanya terbang dari antrean.
  const focusOn = interpolate(time, [at.focus, at.focus + 0.3, at.focusEnd - 0.25, at.focusEnd], [0, 1, 1, 0]);
  const blocks = lessons.map((lesson, order) => {
    const index = order - 1;
    const isTahfiz = order === 0;
    const isFisika = index === fisika;
    const launch = isTahfiz ? at.tahfiz : launchAt[index]!;
    if (time < launch) return null;
    const home = cell(isFisika ? clashDay : lesson.day, lesson.period, lesson.span);
    let center = { x: home.x + home.w / 2, y: home.y + home.h / 2 };
    let w = home.w;
    let h = home.h;
    let scale = 1;
    let shadow = 0;
    let opacity = 1;
    let ring = 0;
    const travel = isTahfiz ? 1 : interpolate(time, [launch, launch + flight], [0, 1], easeInOut);
    if (isTahfiz) {
      const drop = spring(time - launch, { stiffness: 200, damping: 14 });
      center = { x: center.x, y: center.y - (1 - drop) * 24 };
      opacity = clamp01(drop * 3);
    } else if (travel < 1) {
      const from = slotPlace(slotOf(index, launch));
      const start = { x: from.x + tray.card.w / 2, y: from.y + tray.card.h / 2 };
      const top = Math.min(start.y, center.y);
      center = cubicPoint(
        [start, { x: lerp(start.x, center.x, 0.3), y: top - 46 }, { x: lerp(start.x, center.x, 0.75), y: top - 30 }, center],
        travel,
      );
      w = lerp(tray.card.w, home.w, travel);
      h = lerp(tray.card.h, home.h, travel);
      scale = 1 + 0.08 * Math.sin(Math.PI * travel);
      shadow = Math.sin(Math.PI * travel);
    } else {
      const landed = time - launch - flight;
      scale = 1.06 - 0.06 * spring(landed, { stiffness: 380, damping: 14 });
      ring = landed < 0.45 ? 1 - landed / 0.45 : 0;
    }
    let fill = lesson.tone;
    if (isFisika && travel >= 1) {
      // Bentrok: Fisika bergetar dan memerah, lalu diangkat dan digeser ke Jumat.
      const since = time - at.clash;
      if (since < 1.2) center = { x: center.x + Math.sin(since * 42) * 5 * Math.exp(-since * 4.5), y: center.y };
      const move = interpolate(time, [at.shift, at.shifted], [0, 1], easeInOut);
      const target = cell(lesson.day, lesson.period);
      center = { x: lerp(center.x, target.x + target.w / 2, move), y: center.y - 12 * Math.sin(Math.PI * move) };
      scale *= 1 + 0.1 * Math.sin(Math.PI * move);
      shadow = Math.max(shadow, Math.sin(Math.PI * move));
      fill = mix(lesson.tone, palette.clash, clashGlow);
      if (time >= at.shifted) ring = Math.max(0, 1 - (time - at.shifted) / 0.45);
    }
    const mine = lesson.teacher === teacher;
    opacity *= 1 - 0.74 * focusOn * (mine ? 0 : 1);
    opacity *= 1 - 0.6 * scanDim * (lesson.day >= 2 ? 1 : 0);
    const landedAt = isTahfiz ? at.tahfiz : launch + flight;
    return {
      id: lesson.id,
      subject: lesson.subject,
      teacher: lesson.teacher,
      x: round(center.x - w / 2),
      y: round(center.y - h / 2),
      w: round(w),
      h: round(h),
      cx: round(center.x),
      cy: round(center.y),
      transform: `translate(${round(center.x)} ${round(center.y)}) scale(${round(scale * 1000) / 1000}) translate(${round(-center.x)} ${round(-center.y)})`,
      fill,
      opacity,
      shadow: round(shadow),
      ring: round(ring),
      focus: mine ? focusOn : 0,
      locked: isTahfiz ? round(spring(time - at.lock, { stiffness: 300, damping: 14 }) * 1000) / 1000 : null,
      clickable: time >= 11.2 && time < 14.2 && time >= landedAt + 0.1,
      tall: lesson.span > 1,
    };
  }).filter((block) => block !== null);

  // Percobaan slot lain: Kamis jam 4 ditolak, Jumat jam 3 diterima.
  const probes = [
    { day: 3, period: 3, start: at.probeA, verdict: at.probeA + 0.2, end: at.probeA + 0.5, ok: false },
    { day: 4, period: 2, start: at.probeB, verdict: at.probeB + 0.15, end: at.shifted, ok: true },
  ]
    .filter((probe) => time >= probe.start && time < probe.end + 0.2)
    .map((probe) => {
      const box = cell(probe.day, probe.period);
      return {
        ...box,
        ok: probe.ok,
        opacity: envelope(time, probe.start, probe.end + 0.2, 0.15),
        mark: time >= probe.verdict ? round(spring(time - probe.verdict, { stiffness: 320, damping: 14 }) * 1000) / 1000 : 0,
      };
    });

  // Baki di samping kisi: aturan, antrean, jadwal guru, lalu penolakan permintaan.
  const ruleCards = rules.map((rule, index) => {
    const enter = spring(time - 0.6 - index * 0.55, { stiffness: 200, damping: 21 });
    const opacity = clamp01(enter * 1.5) * interpolate(time, [2.75, 3], [1, 0]);
    return { ...rule, x: tray.x, y: round(tray.y + index * layout.rule.step + (1 - enter) * 12), w: layout.rule.w, h: layout.rule.h, opacity };
  }).filter((rule) => rule.opacity > 0.01);

  const remaining = queue.reduce((sum, lesson, index) => sum + (time < launchAt[index]! ? lesson.span : 0), 0);
  const trayTitle =
    time < 2.95
      ? { text: 'Aturan penjadwalan', count: '', opacity: envelope(time, 0.4, 2.95) }
      : time < 12.7
        ? { text: 'Antrean jam pelajaran', count: `${remaining} jam tersisa`, opacity: envelope(time, at.queue, 12.7) }
        : time < at.focusEnd
          ? { text: 'Jadwal guru', count: '', opacity: envelope(time, at.focus, at.focusEnd) }
          : { text: 'Permintaan baru', count: '', opacity: envelope(time, at.request - 0.1, at.fade + 0.3) };

  const teacherLessons = lessons.filter((lesson) => lesson.teacher === teacher);
  const teacherHours = teacherLessons.reduce((sum, lesson) => sum + lesson.span, 0);
  const teacherDays = [...new Set(teacherLessons.map((lesson) => lesson.day))].sort((a, b) => a - b).map((day) => jadwalDays[day]);
  const focusEnter = spring(time - at.focus, { stiffness: 200, damping: 21 });
  const focus =
    focusOn > 0.01
      ? {
          ...layout.focus,
          y: round(layout.focus.y + (1 - focusEnter) * 12),
          opacity: focusOn,
          name: { ...layout.focus.name, text: jadwalTeachers[teacher] ?? teacher },
          detail: { ...layout.focus.detail, text: `${teacherHours} jam: ${teacherDays.join(', ')}` },
          clean: layout.focus.clean,
        }
      : null;

  const requestIn = spring(time - at.request, { stiffness: 200, damping: 20 });
  const request =
    time >= at.request && time < at.refuse + 0.2
      ? {
          x: tray.x,
          y: round(tray.y + (1 - requestIn) * 12),
          ...tray.card,
          opacity: clamp01(requestIn * 1.5) * interpolate(time, [at.refuse - 0.1, at.refuse + 0.15], [1, 0]),
          subject: 'Seni +1',
          teacher: 'Maya',
          tone: tone.seni,
        }
      : null;
  const refuseIn = spring(time - at.refuse, { stiffness: 210, damping: 19 });
  const refusal = time >= at.refuse ? { ...layout.refusal, y: round(layout.refusal.y + (1 - refuseIn) * 14), opacity: clamp01(refuseIn * 1.5) } : null;

  // Papan keterangan: jam yang sudah terjadwal dan keadaan penjadwal saat ini.
  const placed = lessons.reduce((sum, lesson, order) => {
    const index = order - 1;
    const landed = order === 0 ? at.tahfiz + 0.2 : index === fisika ? at.shifted : launchAt[index]! + flight;
    return sum + (time >= landed ? lesson.span : 0);
  }, 0);
  const clashing = time >= at.clash && time < at.shifted;
  const status =
    time < at.queue
      ? { text: 'membaca aturan', color: palette.wait, kind: 'dot' as const }
      : time < at.clash
        ? { text: 'menyusun', color: palette.ink, kind: 'dot' as const }
        : time < 9.4
          ? { text: 'memeriksa bentrok', color: palette.fail, kind: 'dot' as const }
          : time < at.shifted
            ? { text: 'mencari slot lain', color: palette.wait, kind: 'dot' as const }
            : time < 14.2
              ? { text: '0 bentrok', color: palette.ok, kind: 'dot' as const }
              : time < at.refuse
                ? { text: 'memeriksa permintaan', color: palette.wait, kind: 'dot' as const }
                : { text: 'tidak bisa disusun', color: palette.fail, kind: 'dot' as const };
  const chips = [
    ...(clashing ? [{ text: '1 bentrok', color: palette.fail, kind: 'pill' as const }] : []),
    status,
    { text: 'SIMULASI', color: palette.muted, kind: 'plain' as const, wideOnly: true },
  ];
  const state = time < at.queue ? 'aturan' : time < 7 ? 'susun' : time < 9.4 ? 'bentrok' : time < 11.2 ? 'geser' : time < 14.2 ? 'rampung' : 'mustahil';

  return {
    format,
    width,
    height,
    state,
    placed,
    subtitle: `${placed} dari ${jadwalHours} jam terjadwal`,
    chips,
    caption: captionAt(time, captions),
    fade: interpolate(time, [0, 0.35], [0, 1]) * interpolate(time, [at.fade, jadwalDuration], [1, 0]),
    camera,
    alarm: round(interpolate(time, [at.clash, at.clash + 0.08, at.clash + 1.1], [0, 0.55, 0])),
    days,
    hours,
    slots,
    bands,
    unavailable,
    blocks,
    probes,
    tray: { ...tray, title: trayTitle },
    ruleCards,
    cards,
    focus,
    hint: focus ? { lines: layout.focus.hintLines, ...layout.focus.hint, opacity: focus.opacity } : null,
    request,
    refusal,
    cardText: layout.card,
    ruleText: layout.rule,
  };
}

export type JadwalFrame = ReturnType<typeof jadwalFrame>;
