// Papan pesanan di pembuka, disusun seperti film: papanFrame(t) menghitung seluruh papan pada detik ke-t, jadi
// papan bisa dijeda dan diuji di detik mana pun.
//
// Papan tanpa bingkai yang menempel langsung di halaman. Di atas, satu pesanan yang sedang diracik: nama produknya
// ditulis huruf demi huruf, setiap huruf berputar di gulungannya seperti keping papan pesanan lalu berhenti tanpa
// pantulan, disusul nama sistem dan satu kalimat tentangnya. Strip antrean di kepala papan terisi selama pesanan
// diracik; setelah penuh pesanannya tersaji. Pada giliran berikutnya pesanan itu memudar dan turun ke daftar
// "Sebelumnya", mendorong pesanan lama ke bawah sampai yang terbawah hilang.
import { clamp01, easeInOut, easeOut, interpolate, noise } from './motion';

export type PapanStatus = 'diracik' | 'tersaji';

export const papanCycle = 4.6;
/** Baris di daftar "Sebelumnya" yang terlihat; satu baris lagi sedang keluar di bawah. */
export const papanHistory = 3;
/** Dengan gerak dikurangi, papan berhenti di gambar ini: semua huruf diam dan pesanan teratas sudah tersaji. */
export const papanStill = 4.1;

/** Pesanan sebelumnya memudar ke atas sebelum pesanan baru ditulis. */
const leave = 0.35;
/** Daftar "Sebelumnya" bergeser turun satu baris. */
const shift = { start: 0.1, end: 0.85 };
/** Huruf pertama nama produk mulai berputar. */
const write = 0.5;
const stagger = 0.045;
const spin = 0.62;
/** Huruf yang dilewati gulungan sebelum berhenti di huruf tujuannya. */
const spins = 5;
const detailAt = 1.15;
const wordDelay = 0.028;
const served = 3.5;

const reels = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789'];

const round = (value: number, places = 1000) => Math.round(value * places) / places;

export interface Glyph {
  char: string;
  /** Huruf di gulungan dari atas ke bawah; huruf terakhir adalah huruf tujuannya. */
  reel: string[];
  /** Letak gulungan dalam satuan huruf: 0 huruf pertama, reel.length - 1 huruf tujuan. */
  offset: number;
  /** Buram gerak dalam em, hanya selama gulungan masih cepat. */
  blur: number;
  opacity: number;
}

/** Huruf-huruf satu teks, `since` detik sejak huruf pertamanya mulai berputar. */
export function glyphsAt(text: string, since: number, seed: number): Glyph[] {
  return Array.from(text, (char, column) => {
    const local = since - column * stagger;
    const opacity = round(clamp01(local / 0.12));
    const set = reels.find((letters) => letters.includes(char));
    const progress = clamp01(local / spin);
    if (!set || progress >= 1) return { char, reel: [char], offset: 0, blur: 0, opacity };
    const reel = Array.from({ length: spins }, (_, step) => set[Math.floor(noise(seed * 31 + column, step + 1) * set.length)]!);
    // Gulungan melambat sampai berhenti; buramnya ikut kecepatannya, jadi huruf tujuan selalu tajam.
    return { char, reel: [...reel, char], offset: round(spins * easeOut(progress)), blur: round(0.09 * (1 - progress) ** 2), opacity };
  });
}

/** Teks yang muncul kata demi kata, dari buram dan sedikit di bawah menjadi tajam di tempatnya. */
function wordsAt(text: string, since: number) {
  return text.split(' ').map((word, index) => {
    const progress = easeOut(clamp01((since - index * wordDelay) / 0.5));
    return { text: word, opacity: round(progress), blur: round(4 * (1 - progress), 100), y: round(0.4 * (1 - progress)) };
  });
}

/**
 * Papan pada detik ke-t. `orders` adalah pesanan yang diputar bergiliran: pada giliran ke-n pesanan ke-n diracik
 * di atas, dan daftar "Sebelumnya" berisi pesanan-pesanan sebelum itu, yang terbaru paling atas.
 */
export function papanFrame(time: number, orders: readonly { brand: string; detail: string }[]) {
  const count = orders.length;
  const turn = Math.floor(time / papanCycle);
  const phase = time - turn * papanCycle;
  const indexOf = (order: number) => ((order % count) + count) % count;

  // Pesanan sorotan: sampai pesanan sebelumnya selesai memudar, yang tampil masih pesanan itu.
  const outgoing = phase < leave;
  const order = outgoing ? turn - 1 : turn;
  const index = indexOf(order);
  const since = outgoing ? Number.POSITIVE_INFINITY : phase - write;
  const fade = outgoing ? easeInOut(clamp01(phase / leave)) : 0;
  const glyphs = glyphsAt(orders[index]!.brand, since, order);
  const status: PapanStatus = !outgoing && phase < served ? 'diracik' : 'tersaji';
  const featured = {
    order,
    index,
    glyphs,
    settled: glyphs.every((glyph) => glyph.reel.length === 1 && glyph.opacity === 1),
    opacity: round(1 - fade),
    blur: round(6 * fade, 100),
    lift: round(-0.5 * fade),
    meta: round(outgoing ? 1 : easeOut(clamp01((phase - write + 0.15) / 0.4))),
    name: round(outgoing ? 1 : easeOut(clamp01((phase - detailAt) / 0.5))),
    words: wordsAt(orders[index]!.detail, outgoing ? Number.POSITIVE_INFINITY : phase - detailAt - 0.12),
    status,
  };

  // Daftar "Sebelumnya": pesanan yang baru tersaji masuk dari atas, yang lain turun satu baris.
  const slide = easeInOut(clamp01((phase - shift.start) / (shift.end - shift.start)));
  const history = Array.from({ length: papanHistory + 1 }, (_, row) => {
    const slot = row - 1 + slide;
    return {
      order: turn - 1 - row,
      index: indexOf(turn - 1 - row),
      slot: round(slot),
      opacity: round(interpolate(slot, [-1, 0, 1, 2, 3], [0, 1, 0.82, 0.62, 0])),
    };
  });

  // Strip antrean: satu ruas per pesanan. Ruas pesanan yang sudah tersaji penuh; ruas pesanan sorotan terisi
  // selama diracik.
  const current = indexOf(turn);
  const filling = round(easeInOut(clamp01((phase - write) / (served - write))));
  const queue = Array.from({ length: count }, (_, at) => (at < current ? 1 : at === current ? filling : 0));

  return { focus: turn, status, featured, history, queue, current };
}

export type PapanFrame = ReturnType<typeof papanFrame>;
