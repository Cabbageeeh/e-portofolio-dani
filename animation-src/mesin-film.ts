// Film pendek Mesin WhatsApp, disusun seperti komposisi Remotion: mesinFrame(t) menggambar seluruh layar pada
// detik ke-t. Tidak ada keadaan yang tertinggal di antara dua gambar, jadi film bisa diputar, dijeda, dilompati
// per bab, dan diuji di detik mana pun.
//
// Alurnya: empat server menjalankan nomor WhatsApp pelanggan, Toko Aira menautkan nomornya lewat pindai QR, Agen
// AI membalas pembeli, smart campaign mengirim promo bertahap, lalu Server 4 mati: pesan yang belum terkirim
// ditahan, sesi setiap nomor pindah ke server lain tanpa pindai ulang, dan kampanye lanjut sampai pesan terakhir.
import type { FilmFormat } from './film-clock';
import { captionAt, clamp01, cubicPoint, curvePath, easeInOut, easeOut, interpolate, mix, noise, shake, sideways, spring, type Caption, type Curve, type Point } from './motion';

export type MesinState = 'tautkan' | 'chat' | 'kampanye' | 'mati' | 'pindah' | 'lanjut';

export const mesinDuration = 18;
export const mesinServers = 4;
export const mesinPerServer = 12;
export const mesinTotal = mesinServers * mesinPerServer;
export const mesinHero = { name: 'Kelas Digital', initials: 'KD' };
export const mesinBuyer = { name: 'Guru', initial: 'G' };
export const mesinContacts = 12;
/** Server yang mati, dan pesan kampanye yang sudah terkirim tepat saat ia mati. */
const deadServer = 3;
const sentBeforeDown = 6;
/** Pertanyaan pembeli bila pengunjung tidak memilih sendiri. */
export const mesinDefaultQuestion = 0;

/** Pertanyaan yang bisa dipilih pengunjung, dan balasan Agen AI untuk masing-masing. */
export const mesinQuestions = [
  { chip: 'Tujuan', ask: ['Apa tujuan belajar', 'pada topik ini?'], reply: ['Memahami konsep, lalu', 'menerapkannya lewat praktik.'] },
  { chip: 'Materi', ask: ['Materi dan media apa', 'yang digunakan?'], reply: ['Modul ringkas dan simulasi', 'interaktif sebagai contoh.'] },
  { chip: 'Asesmen', ask: ['Bagaimana pemahaman', 'dapat ditinjau?'], reply: ['Gunakan pertanyaan pemantik', 'dan bukti hasil belajar.'] },
] as const;
const contacts = ['Tujuan', 'Materi', 'Media', 'LKPD', 'Asesmen', 'Refleksi', 'Modul', 'Video', 'Proyek', 'Rubrik', 'Diskusi', 'Catatan'];

const at = {
  slots: 0.45,
  panel: 0.9,
  qr: 1.05,
  scan: 1.95,
  scanEnd: 2.55,
  linked: 2.65,
  joined: 3.1,
  chat: 3.6,
  chips: 4.05,
  click: 5,
  ask: 5.15,
  typing: 5.55,
  reply: 6.45,
  delivered: 6.75,
  read: 7.15,
  campaign: 7.8,
  send: 8.25,
  down: 10.4,
  move: 12.05,
  resume: 13.75,
  done: 15.7,
  out: 17.35,
};
/** Detik saat pertanyaan pembeli dipilih; klik pengunjung melompat ke sini. */
export const mesinAskAt = at.click;
const flight = 0.55;
const moveGap = 0.07;
const landAt = (order: number) => at.move + order * moveGap + flight;
const moved = landAt(mesinPerServer - 1);

/** Bab film untuk tombol lompat; `still` adalah gambar yang paling bercerita di bab itu. */
export const mesinChapters = [
  { label: 'Hubungkan', start: 0, still: 3.35 },
  { label: 'Interaksi', start: at.chat, still: 7.4 },
  { label: 'Antrean', start: at.campaign, still: 10.2 },
  { label: 'Gangguan', start: at.down, still: 11.7 },
  { label: 'Pemulihan', start: at.move, still: 13.6 },
  { label: 'Berlanjut', start: at.resume, still: 16.4 },
] as const;
/** Dengan gerak dikurangi, film berhenti di gambar ini: semua nomor sudah pindah dan kampanye selesai. */
export const mesinStill = mesinChapters[5].still;

export const mesinPalette = { ink: '#eaf6ff', muted: '#9bb6ca', ok: '#68d7b0', fail: '#ff8795', wait: '#ffd166', read: '#5fc7ff', bubble: '#183e5a' };
const palette = mesinPalette;

const captions: readonly Caption[] = [
  { start: 0.2, end: 3.45, text: 'Satu alur menghubungkan layanan digital dengan ruang belajar.', tone: palette.ok },
  { start: 3.7, end: 7.65, text: 'Pertanyaan belajar dijawab melalui pilihan interaktif.', tone: palette.ok },
  { start: 7.9, end: 10.3, text: 'Materi bergerak bertahap dalam simulasi ini.', tone: palette.ok },
  { start: 10.5, end: 11.05, text: 'Satu simpul layanan mengalami gangguan.', tone: palette.fail },
  { start: 11.1, end: 11.95, text: 'Antrean proses ditahan sementara.', tone: palette.wait },
  { start: 12.05, end: 13.65, text: 'Sesi dialihkan ke simpul lain yang aktif.', tone: palette.wait },
  { start: 13.8, end: 15.9, text: 'Alur belajar berlanjut dari titik terakhir.', tone: palette.ok },
  { start: 16, end: 17.6, text: 'Simulasi selesai tanpa memutus alur.', tone: palette.ok },
];

// Tata letak dua bentuk layar. Satuannya titik komposisi, bukan piksel; seluruh film diskalakan utuh ke lebar
// wadahnya. Rak server berada di dunia yang disorot kamera, panel ponsel menempel di layar.
interface Chip {
  text: string;
  color: string;
  kind: 'dot' | 'pill' | 'plain';
  wideOnly?: boolean;
}
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Layout {
  width: number;
  height: number;
  rack: { x: number; y: number; w: number; h: number; gap: number; slotTop: number };
  slot: { cols: number; w: number; h: number; gap: number };
  panel: Box;
  /** Kabel menyambung ke tepi kiri panel (lebar) atau tepi atasnya (tegak), sejajar nomor Toko Aira. */
  bend: 'sideways' | 'downward';
  qr: { cell: number; y: number };
  bubble: number;
  chips: { y: number; hintY: number };
  log: { y: number; row: number; rows: number };
}

const wide: Layout = {
  width: 640,
  height: 400,
  rack: { x: 20, y: 66, w: 64, h: 248, gap: 8, slotTop: 34 },
  slot: { cols: 2, w: 24, h: 22, gap: 4 },
  panel: { x: 340, y: 60, w: 280, h: 266 },
  bend: 'sideways',
  qr: { cell: 6, y: 58 },
  bubble: 196,
  chips: { y: 226, hintY: 216 },
  log: { y: 150, row: 26, rows: 4 },
};

const tall: Layout = {
  width: 390,
  height: 560,
  rack: { x: 16, y: 66, w: 82, h: 106, gap: 10, slotTop: 32 },
  slot: { cols: 4, w: 15, h: 14, gap: 3 },
  panel: { x: 16, y: 188, w: 358, h: 280 },
  bend: 'downward',
  qr: { cell: 6, y: 60 },
  bubble: 230,
  chips: { y: 240, hintY: 230 },
  log: { y: 152, row: 26, rows: 4 },
};

const round = (value: number) => Math.round(value * 100) / 100;
const lerp = (from: Point, to: Point, amount: number): Point => ({ x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount });

function downward(from: Point, to: Point): Curve {
  const bend = (to.y - from.y) / 2;
  return [from, { x: from.x, y: from.y + bend }, { x: to.x, y: to.y - bend }, to];
}

/** Kemunculan dan kepergian satu isi panel, berganti tanpa terputus saat bab berganti. */
function shown(time: number, start: number, end: number): { opacity: number; y: number } {
  const enter = spring(time - start, { stiffness: 200, damping: 22 });
  const leave = interpolate(time, [end - 0.2, end + 0.05], [0, 1], easeInOut);
  return { opacity: clamp01(enter * 1.5) * (1 - leave), y: round((1 - enter) * 14 - leave * 10) };
}

// Kode QR rekaan: tiga pola penanda di sudut dan modul acak yang tetap, cukup untuk terbaca sebagai QR.
const qrSize = 17;
const qrModules: { row: number; col: number }[] = [];
for (let row = 0; row < qrSize; row += 1) {
  for (let col = 0; col < qrSize; col += 1) {
    const finder = (r: number, c: number) => r < 7 && c < 7;
    const inFinder = finder(row, col) || finder(row, qrSize - 1 - col) || finder(qrSize - 1 - row, col);
    if (inFinder) {
      const r = row < 7 ? row : qrSize - 1 - row;
      const c = col < 7 ? col : qrSize - 1 - col;
      const ring = Math.max(Math.abs(r - 3), Math.abs(c - 3));
      if (ring !== 2) qrModules.push({ row, col });
    } else if (row !== 7 && col !== 7 && row !== qrSize - 8 && col !== qrSize - 8 && noise(row * qrSize + col, 5) > 0.52) {
      qrModules.push({ row, col });
    }
  }
}

/** Posisi slot di dalam rak: dua belas pertama terisi, sisanya kosong sebagai cadangan. */
function slotBox(layout: Layout, server: number, slot: number): Box {
  const { rack, slot: size } = layout;
  const inner = size.cols * size.w + (size.cols - 1) * size.gap;
  const x = rack.x + server * (rack.w + rack.gap) + (rack.w - inner) / 2 + (slot % size.cols) * (size.w + size.gap);
  const y = rack.y + rack.slotTop + Math.floor(slot / size.cols) * (size.h + size.gap);
  return { x, y, w: size.w, h: size.h };
}

// Saat Server 4 mati, nomor-nomornya pindah ke slot cadangan server lain. Toko Aira pindah lebih dulu.
const heroSlot = 11;
const moves = Array.from({ length: mesinPerServer }, (_, slot) => {
  const order = mesinPerServer - 1 - slot;
  return { slot, order, server: 2 - (order % 3), target: mesinPerServer + Math.floor(order / 3) };
});

export function mesinState(time: number): MesinState {
  if (time < at.chat) return 'tautkan';
  if (time < at.campaign) return 'chat';
  if (time < at.down) return 'kampanye';
  if (time < at.move) return 'mati';
  if (time < at.resume) return 'pindah';
  return 'lanjut';
}

/** Pesan kampanye yang sudah terkirim pada detik ini, sebagai bilangan pecahan agar daftar kirimnya bisa bergulir. */
function sentAt(time: number): number {
  if (time < at.send) return 0;
  if (time < at.down) return interpolate(time, [at.send, at.down], [0, sentBeforeDown]);
  if (time < at.resume) return sentBeforeDown;
  return interpolate(time, [at.resume, at.done], [sentBeforeDown, mesinContacts], easeOut);
}

export function mesinFrame(time: number, format: FilmFormat = 'wide', question = mesinDefaultQuestion) {
  const layout = format === 'tall' ? tall : wide;
  const { width, height, rack, panel: box } = layout;
  const state = mesinState(time);
  const sinceDown = time - at.down;
  const asked = mesinQuestions[question] ?? mesinQuestions[0];

  // Kamera: mendekat pelan di awal, mendorong ke server yang mati sambil berguncang, lalu lepas saat sesi pindah.
  const settle = interpolate(time, [0, 2.4], [0.95, 1], easeOut);
  const deadCenter = { x: rack.x + deadServer * (rack.w + rack.gap) + rack.w / 2, y: rack.y + rack.h / 2 };
  const fleetCenter = { x: rack.x + (mesinServers * rack.w + (mesinServers - 1) * rack.gap) / 2, y: rack.y + rack.h / 2 };
  const punch = sinceDown >= 0 ? 0.07 * spring(sinceDown, { stiffness: 220, damping: 15 }) * (1 - spring(time - at.move, { stiffness: 80, damping: 14 })) : 0;
  const tremor = sinceDown >= 0 && sinceDown < 1 ? 6 * Math.exp(-sinceDown * 6) : 0;
  const origin = lerp(fleetCenter, deadCenter, clamp01(punch / 0.07));
  const zoom = settle * (1 + punch);
  const camera = `translate(${round(origin.x + tremor * shake(time, 1))} ${round(origin.y + tremor * shake(time, 2))}) scale(${round(zoom * 1000) / 1000}) translate(${round(-origin.x)} ${round(-origin.y)})`;

  // Rak server: masuk satu per satu, lampu setiap nomor berkedip pelan, dan Server 4 memerah saat mati.
  const dead = time >= at.down;
  const racks = Array.from({ length: mesinServers }, (_, server) => {
    const enter = spring(time - 0.15 - server * 0.12, { stiffness: 190, damping: 18 });
    const isDead = dead && server === deadServer;
    const jitter = isDead && sinceDown < 0.8 ? 3 * Math.exp(-sinceDown * 5) * shake(time, server) : 0;
    const load = isDead ? 0 : 0.35 + 0.4 * noise(server, 7) + 0.12 * Math.sin(time * 2.1 + server * 1.7);
    const color = isDead ? mix(palette.ok, palette.fail, sinceDown / 0.15) : palette.ok;
    return {
      server,
      label: `Server ${server + 1}`,
      status: isDead ? 'mati' : '',
      x: rack.x + server * (rack.w + rack.gap),
      y: rack.y,
      w: rack.w,
      h: rack.h,
      transform: `translate(${round(jitter)} ${round((1 - enter) * 18)})`,
      opacity: clamp01(enter * 1.5) * (isDead ? 1 - 0.35 * clamp01((time - moved) / 0.5) : 1),
      color,
      dead: isDead,
      load: round(clamp01(load) * (rack.w - 20)),
    };
  });

  // Nomor-nomor di setiap rak, termasuk yang sedang melayang pindah dari Server 4.
  const linked = time >= at.joined;
  const slots: { id: string; x: number; y: number; w: number; h: number; opacity: number; scale: number; fill: string; hero: boolean; lit: number; empty: boolean; trail: number }[] = [];
  const rings: { x: number; y: number; r: number; opacity: number }[] = [];
  let heroBox = slotBox(layout, deadServer, heroSlot);
  let online = 0;
  for (let server = 0; server < mesinServers; server += 1) {
    for (let slot = 0; slot < mesinPerServer; slot += 1) {
      const hero = server === deadServer && slot === heroSlot;
      const pop = spring(time - at.slots - server * 0.12 - slot * 0.025, { stiffness: 240, damping: 16 });
      const home = slotBox(layout, server, slot);
      const glimmer = 0.75 + 0.25 * Math.sin(time * 2.3 + (server * 12 + slot) * 1.9);
      if (server !== deadServer || !dead) {
        if (hero && !linked) {
          slots.push({ id: `${server}-${slot}`, ...home, opacity: clamp01(pop * 1.5), scale: 1, fill: palette.ink, hero, lit: 0, empty: true, trail: 0 });
          continue;
        }
        const join = hero ? spring(time - at.joined, { stiffness: 300, damping: 13 }) : 1;
        slots.push({ id: `${server}-${slot}`, ...home, opacity: clamp01(pop * 1.5), scale: round((0.6 + 0.4 * pop) * (hero ? 0.7 + 0.3 * join : 1) * 1000) / 1000, fill: hero ? palette.ink : palette.ok, hero, lit: hero ? 1 : glimmer, empty: false, trail: 0 });
        online += 1;
        continue;
      }
      // Server 4 sudah mati: nomornya merah dan menunggu, lalu melayang ke slot cadangan server lain.
      const move = moves[slot]!;
      const leave = at.move + move.order * moveGap;
      const progress = clamp01((time - leave) / flight);
      const target = slotBox(layout, move.server, move.target);
      if (time < leave) {
        const blink = 0.45 + 0.35 * Math.abs(Math.sin((time - at.down) * 5 + slot));
        slots.push({ id: `${server}-${slot}`, ...home, opacity: 1, scale: 1, fill: hero ? mix(palette.ink, palette.fail, 0.6) : palette.fail, hero, lit: blink, empty: false, trail: 0 });
        if (hero) heroBox = home;
        continue;
      }
      const eased = easeInOut(progress);
      const lift = -Math.sin(progress * Math.PI) * (format === 'tall' ? 34 : 48);
      const point = lerp(home, target, eased);
      const land = spring(time - leave - flight, { stiffness: 320, damping: 14 });
      const scale = progress < 1 ? 1 + 0.35 * Math.sin(progress * Math.PI) : 0.85 + 0.15 * land;
      const fill = progress < 1 ? mix(palette.fail, palette.wait, eased) : mix(palette.wait, hero ? palette.ink : palette.ok, clamp01((time - leave - flight) / 0.3));
      slots.push({ id: `${server}-${slot}`, x: round(point.x), y: round(point.y + lift), w: home.w, h: home.h, opacity: 1, scale: round(scale * 1000) / 1000, fill, hero, lit: 1, empty: false, trail: progress < 1 ? 1 : 0 });
      if (progress >= 1) {
        online += 1;
        const ring = clamp01((time - leave - flight) / 0.45);
        if (ring < 1) rings.push({ x: target.x + target.w / 2, y: target.y + target.h / 2, r: round(6 + 16 * ring), opacity: round((1 - ring) * 0.7) });
      }
      if (hero) heroBox = { x: point.x, y: point.y + lift, w: home.w, h: home.h };
      // Slot lama yang ditinggalkan tetap tampak kosong di rak yang mati.
      slots.push({ id: `${server}-${slot}-empty`, ...home, opacity: 0.6, scale: 1, fill: palette.fail, hero: false, lit: 0, empty: true, trail: 0 });
    }
  }
  const heroLanded = !dead || time >= landAt(0);
  const heroOnline = linked && (!dead || heroLanded);

  // Kabel dari nomor Toko Aira ke ponselnya; pesan berjalan sebagai kilau di sepanjang kabel.
  const enterPanel = spring(time - at.panel, { stiffness: 170, damping: 21 });
  const leavePanel = interpolate(time, [at.out, mesinDuration], [0, 1], easeInOut);
  const panelOpacity = time >= at.panel ? clamp01(enterPanel * 1.4) * (1 - leavePanel) : 0;
  const shift = round((1 - enterPanel) * 40);
  const panelAt = format === 'tall' ? { x: box.x, y: box.y + shift } : { x: box.x + shift, y: box.y };
  const from = format === 'tall' ? { x: heroBox.x + heroBox.w / 2, y: heroBox.y + heroBox.h } : { x: heroBox.x + heroBox.w, y: heroBox.y + heroBox.h / 2 };
  const along = (value: number, start: number, size: number) => Math.min(Math.max(value, start + 24), start + size - 24);
  const plug = format === 'tall' ? { x: along(from.x, panelAt.x, box.w), y: panelAt.y } : { x: panelAt.x, y: along(from.y, panelAt.y, box.h) };
  const curve = layout.bend === 'sideways' ? sideways(from, plug) : downward(from, plug);
  const relink = dead ? clamp01((time - landAt(0)) / 0.35) : 1;
  const cableDraw = time < at.joined ? 0 : dead ? (heroLanded ? easeOut(relink) : 1) : easeOut(clamp01((time - at.joined) / 0.35));
  const pulses: { at: number; toPhone: boolean }[] = [
    { at: at.linked, toPhone: false },
    { at: at.ask - 0.05, toPhone: false },
    { at: at.reply - 0.3, toPhone: true },
  ];
  const packets: { x: number; y: number; r: number; opacity: number }[] = [];
  const glide = (start: number, toPhone: boolean, length: number, r: number) => {
    const progress = (time - start) / length;
    if (progress < 0 || progress > 1) return;
    for (let echo = 0; echo < 4; echo += 1) {
      const behind = progress - echo * 0.05;
      if (behind < 0) continue;
      const along = easeInOut(behind);
      const point = cubicPoint(curve, toPhone ? along : 1 - along);
      packets.push({ x: round(point.x), y: round(point.y), r: round(r * (1 - echo / 5)), opacity: round(1 - echo / 4) });
    }
  };
  pulses.forEach((pulse) => glide(pulse.at, pulse.toPhone, 0.4, 3));
  for (const [start, end] of [
    [at.send, at.down],
    [at.resume + 0.1, at.done],
  ] as const) {
    for (let launch = start; launch < end; launch += 0.2) glide(launch, true, 0.32, 2.4);
  }
  const cable =
    panelOpacity > 0.01 && time >= at.linked
      ? {
          d: curvePath(curve),
          draw: round(cableDraw),
          broken: dead && !heroLanded,
          color: dead && !heroLanded ? palette.fail : palette.ok,
          opacity: panelOpacity,
        }
      : null;

  // Panel kelas digital: sambungkan ruang, pilih pertanyaan, lalu tinjau urutan materi.
  const panel =
    panelOpacity > 0.01
      ? { ...box, opacity: panelOpacity, transform: `translate(${panelAt.x} ${panelAt.y})`, owner: mesinHero }
      : null;

  const qrShown = shown(time, at.panel + 0.05, at.chat);
  const qrWidth = qrSize * layout.qr.cell;
  const linkPop = spring(time - at.linked, { stiffness: 260, damping: 15 });
  const qr =
    panel && qrShown.opacity > 0.01
      ? {
          ...qrShown,
          x: round((box.w - qrWidth) / 2),
          top: layout.qr.y,
          size: qrWidth,
          cell: layout.qr.cell,
          modules: qrModules.map((module) => {
            const when = at.qr + ((module.row + module.col) / (2 * qrSize)) * 0.7;
            return { x: module.col * layout.qr.cell, y: module.row * layout.qr.cell, opacity: round(clamp01((time - when) / 0.12) * (1 - 0.75 * clamp01(linkPop))) };
          }),
          scan:
            time >= at.scan && time <= at.scanEnd + 0.15
              ? { y: round(interpolate(time, [at.scan, at.scanEnd], [-4, qrWidth + 4], easeInOut)), opacity: time > at.scanEnd ? 1 - (time - at.scanEnd) / 0.15 : 1 }
              : null,
          check: time >= at.linked ? { scale: round(linkPop * 1000) / 1000, draw: clamp01((time - at.linked - 0.1) / 0.25) } : null,
          title: time >= at.linked ? 'Ruang terhubung' : 'Menyiapkan ruang belajar',
          detail: time >= at.linked ? 'Sesi aktif pada simpul 4' : 'Simulasi koneksi layanan',
          titleColor: time >= at.linked ? palette.ok : palette.ink,
          textY: layout.qr.y + qrWidth + 26,
        }
      : null;

  const chatShown = shown(time, at.chat, at.campaign);
  const lineHeight = 14;
  const askHeight = 14 + asked.ask.length * lineHeight;
  const replyHeight = 30 + asked.reply.length * lineHeight;
  const askIn = spring(time - at.ask, { stiffness: 220, damping: 18 });
  const replyIn = spring(time - at.reply, { stiffness: 220, damping: 18 });
  const typingOn = interpolate(time, [at.typing, at.typing + 0.15, at.reply - 0.1, at.reply], [0, 1, 1, 0]);
  const chipsOn = interpolate(time, [at.chips, at.chips + 0.3, at.click + 0.15, at.click + 0.45], [0, 1, 1, 0]);
  const chipWidth = (box.w - 24 - 2 * 8) / 3;
  const chipAt = (index: number) => ({ x: 12 + index * (chipWidth + 8), y: layout.chips.y });
  const target = chipAt(question);
  const cursorOn = interpolate(time, [4.45, 4.55, at.click + 0.1, at.click + 0.25], [0, 1, 1, 0]);
  const cursorPoint = lerp({ x: box.w - 40, y: layout.chips.y - 60 }, { x: target.x + chipWidth / 2, y: target.y + 14 }, interpolate(time, [4.5, at.click - 0.1], [0, 1], easeInOut));
  const askTop = 60;
  const replyTop = askTop + askHeight + 12;
  const tick = time >= at.read ? 'read' : time >= at.delivered ? 'delivered' : 'sent';
  const chat =
    panel && chatShown.opacity > 0.01
      ? {
          ...chatShown,
          buyer: mesinBuyer,
          ask:
            time >= at.ask
              ? { lines: asked.ask, y: askTop, w: layout.bubble, h: askHeight, opacity: clamp01(askIn * 1.6), scale: round((0.85 + 0.15 * askIn) * 1000) / 1000 }
              : null,
          typing: typingOn > 0 ? { y: replyTop, opacity: typingOn, dots: [0, 1, 2].map((dot) => round(-2.5 * Math.max(0, Math.sin((time - at.typing) * 9 - dot * 0.9)))) } : null,
          reply:
            time >= at.reply
              ? { lines: asked.reply, x: box.w - 12 - layout.bubble, y: replyTop, w: layout.bubble, h: replyHeight, opacity: clamp01(replyIn * 1.6), scale: round((0.85 + 0.15 * replyIn) * 1000) / 1000, tick }
              : null,
          chips:
            chipsOn > 0
              ? {
                  opacity: chipsOn,
                  hintY: layout.chips.hintY,
                  items: mesinQuestions.map((item, index) => ({
                    ...chipAt(index),
                    index,
                    w: round(chipWidth),
                    label: item.chip,
                    chosen: time >= at.click && index === question,
                    faded: time >= at.click && index !== question,
                  })),
                  pickable: time >= at.chips && time < at.click,
                }
              : null,
          cursor: cursorOn > 0 ? { x: round(cursorPoint.x), y: round(cursorPoint.y), opacity: cursorOn, scale: time >= at.click - 0.08 && time < at.click + 0.05 ? 0.82 : 1 } : null,
        }
      : null;

  // Tahapan materi: progres visual, log yang bergulir, dan pemulihan saat satu simpul berhenti.
  const campaignShown = shown(time, at.campaign + 0.05, Infinity);
  const sent = sentAt(time);
  const sentCount = Math.floor(sent);
  const holding = time >= at.down && time < at.resume;
  const finished = time >= at.done;
  const campaignStatus = finished ? 'selesai' : holding ? (time >= at.move ? 'memindah sesi' : 'ditahan') : 'berjalan';
  const statusColor = finished ? palette.ok : holding ? (time >= at.move ? palette.wait : palette.fail) : palette.ok;
  const step = Math.max(sent - 1, 0);
  const newest = Math.floor(step);
  const slide = easeOut(clamp01((step - newest) * 3));
  const alertIn = spring(sinceDown - 0.15, { stiffness: 260, damping: 16 }) * (1 - interpolate(time, [at.resume - 0.25, at.resume], [0, 1]));
  const doneIn = spring(time - at.done, { stiffness: 300, damping: 14 });
  // Baris yang tertutup kartu peringatan atau kartu selesai disembunyikan selama kartunya tampil.
  const cover = clamp01(Math.max(time >= at.down ? alertIn : 0, time >= at.done ? doneIn : 0));
  const logRows = Array.from({ length: layout.log.rows + 1 }, (_, row) => {
    const index = newest - row;
    if (sent < 1 || index < 0) return null;
    const y = (row - 1 + slide) * layout.log.row;
    const opacity = row === 0 ? slide : row === layout.log.rows ? 1 - slide : 1;
    return { key: index, name: contacts[index % contacts.length]!, number: index + 1, y: round(y + layout.log.row), opacity: round(opacity * (holding ? 0.35 : 1) * (y + layout.log.row <= 74 ? 1 - cover : 1)) };
  }).filter((row): row is NonNullable<typeof row> => row !== null);
  const campaign =
    panel && campaignShown.opacity > 0.01
      ? {
          ...campaignShown,
          sent: String(sentCount),
          total: `/ ${mesinContacts} terkirim`,
          bar: round(((box.w - 36) * sent) / mesinContacts),
          barColor: holding ? palette.wait : palette.ok,
          barWidth: box.w - 36,
          status: campaignStatus,
          statusColor,
          log: logRows,
          logTop: layout.log.y,
          logHeight: layout.log.row * layout.log.rows,
          alert:
            alertIn > 0.01
              ? {
                  scale: round((0.9 + 0.1 * alertIn) * 1000) / 1000,
                  opacity: clamp01(alertIn * 1.5),
                  title: time >= at.move ? 'Mengalihkan sesi' : 'Simpul layanan berhenti',
                  detail: 'Antrean ditahan sementara, lalu dilanjutkan',
                  color: time >= at.move ? palette.wait : palette.fail,
                  progress: round(clamp01((time - at.move) / (moved - at.move))),
                }
              : null,
          done:
            finished
              ? {
                  scale: round((0.9 + 0.1 * doneIn) * 1000) / 1000,
                  opacity: clamp01(doneIn * 2),
                  check: round(doneIn * 1000) / 1000,
                  title: 'Seluruh tahap terselesaikan',
                  detail: 'Simulasi alur belajar mencapai akhir',
                  sparks:
                    time < at.done + 0.8
                      ? Array.from({ length: 12 }, (_, index) => {
                          const life = clamp01((time - at.done) / 0.8);
                          const angle = noise(index, 1) * Math.PI * 2;
                          const reach = (22 + 28 * noise(index, 2)) * easeOut(life);
                          return { x: round(Math.cos(angle) * reach), y: round(Math.sin(angle) * reach), r: round(1.2 + 1.4 * noise(index, 3)), opacity: round(1 - life) };
                        })
                      : [],
                }
              : null,
        }
      : null;

  // Papan keterangan: keadaan bab yang sedang diputar, dan jam di layar lebar.
  const liveServers = dead ? mesinServers - 1 : mesinServers;
  const status: Record<MesinState, { text: string; color: string }> = {
    tautkan: { text: linked ? 'Ruang digital terhubung' : 'menyiapkan koneksi', color: linked ? palette.ok : palette.wait },
    chat: { text: time >= at.typing ? 'Respons sedang disiapkan' : 'interaksi tersedia', color: palette.ok },
    kampanye: { text: `${sentCount} dari ${mesinContacts} langkah`, color: palette.ok },
    mati: { text: 'simpul layanan berhenti', color: palette.fail },
    pindah: { text: 'mengalihkan sesi', color: palette.wait },
    lanjut: { text: finished ? 'alur terselesaikan' : `${sentCount} dari ${mesinContacts} langkah`, color: palette.ok },
  };
  const chips: Chip[] = [
    ...(state === 'mati' ? [{ text: `${mesinContacts - sentBeforeDown} ditahan`, color: palette.wait, kind: 'pill' as const }] : []),
    { ...status[state], kind: 'dot' },
    { text: `10.41.${String(Math.floor(time)).padStart(2, '0')}`, color: palette.muted, kind: 'plain', wideOnly: true },
  ];

  return {
    format,
    width,
    height,
    state,
    subtitle: `Ilustrasi alur digital · ${online} modul · ${liveServers} simpul aktif`,
    online,
    heroOnline,
    chips,
    caption: captionAt(time, captions),
    fade: interpolate(time, [0, 0.3], [0, 1]) * interpolate(time, [at.out + 0.1, mesinDuration], [1, 0]),
    camera,
    racks,
    slots,
    rings,
    cable,
    packets,
    panel,
    qr,
    chat,
    campaign,
    alarm: 0.55 * interpolate(time, [at.down, at.down + 0.25, at.move, at.move + 0.6], [0, 1, 0.5, 0]),
    flash: sinceDown >= 0 && sinceDown < 0.14 ? 0.2 * (1 - sinceDown / 0.14) : 0,
  };
}

export type MesinFrame = ReturnType<typeof mesinFrame>;
