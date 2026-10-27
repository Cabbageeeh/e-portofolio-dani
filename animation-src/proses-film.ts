// Langkah kerja sebagai film kecil yang diputar sekali: kartu tiap langkah muncul bergantian, dari kabur dan
// pudar menjadi tajam seperti tinta yang meresap, sambil naik sedikit ke tempatnya tanpa pantulan.
// prosesFrame(t) menghitung semuanya dari detik ke-t.
import { clamp01, easeOut } from './motion';

// Kartu berikutnya mulai muncul `stagger` detik setelah yang sebelumnya; tiap kartu butuh `reveal` detik.
const lead = 0.15;
const stagger = 0.22;
const reveal = 0.9;
const stepStart = (index: number) => lead + index * stagger;

export const prosesEnd = (count: number) => stepStart(count - 1) + reveal;
/** Dengan gerak dikurangi, langkah kerja langsung tampil di gambar ini: semua kartu tajam di tempatnya. */
export const prosesStill = (count: number) => prosesEnd(count) + 0.5;

const round = (value: number) => Math.round(value * 1000) / 1000;

export function prosesFrame(time: number, count: number) {
  const steps = Array.from({ length: count }, (_, index) => {
    const ink = easeOut(clamp01((time - stepStart(index)) / reveal));
    return { ink: round(ink), blur: round(6 * (1 - ink)), rise: round(18 * (1 - ink)) };
  });
  return { steps };
}

export type ProsesFrame = ReturnType<typeof prosesFrame>;
