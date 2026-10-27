// Alat gerak bergaya Remotion: setiap nilai di film dihitung dari waktu, bukan dari transisi CSS, jadi
// filmnya bisa diputar, dijeda, dan dilompati ke detik mana pun dengan gambar yang sama persis.

export type Easing = (progress: number) => number;

export const linear: Easing = (progress) => progress;
export const easeOut: Easing = (progress) => 1 - (1 - progress) ** 3;
export const easeInOut: Easing = (progress) =>
  progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
export const easeOutExpo: Easing = (progress) => (progress >= 1 ? 1 : 1 - 2 ** (-10 * progress));

export function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

/** Memetakan waktu ke nilai lewat titik-titik kunci; di luar rentangnya nilainya ditahan di ujung. */
export function interpolate(value: number, input: readonly number[], output: readonly number[], easing: Easing = linear): number {
  const last = input.length - 1;
  if (value <= input[0]!) return output[0]!;
  if (value >= input[last]!) return output[last]!;
  let segment = 0;
  while (value > input[segment + 1]!) segment += 1;
  const progress = easing((value - input[segment]!) / (input[segment + 1]! - input[segment]!));
  return output[segment]! + (output[segment + 1]! - output[segment]!) * progress;
}

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/** Pegas teredam dari 0 ke 1, dihitung langsung dari waktu sejak dilepas (detik). */
export function spring(elapsed: number, { stiffness = 170, damping = 16, mass = 1 }: SpringConfig = {}): number {
  if (elapsed <= 0) return 0;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta >= 1) return 1 - Math.exp(-omega * elapsed) * (1 + omega * elapsed);
  const damped = omega * Math.sqrt(1 - zeta ** 2);
  return 1 - Math.exp(-zeta * omega * elapsed) * (Math.cos(damped * elapsed) + ((zeta * omega) / damped) * Math.sin(damped * elapsed));
}

export interface Point {
  x: number;
  y: number;
}

export type Curve = readonly [Point, Point, Point, Point];

export function cubicPoint([p0, p1, p2, p3]: Curve, progress: number): Point {
  const u = 1 - progress;
  const [a, b, c, d] = [u ** 3, 3 * u ** 2 * progress, 3 * u * progress ** 2, progress ** 3];
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

/** Lengkung mendatar dari satu titik ke titik lain, seperti kabel yang menggantung longgar. */
export function sideways(from: Point, to: Point): Curve {
  const bend = (to.x - from.x) / 2;
  return [from, { x: from.x + bend, y: from.y }, { x: to.x - bend, y: to.y }, to];
}

export function curvePath([p0, p1, p2, p3]: Curve): string {
  return `M${p0.x} ${p0.y}C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
}

/** Guncangan kamera yang tetap untuk waktu yang sama, kira-kira di antara -1 dan 1. */
export function shake(time: number, seed = 0): number {
  return Math.sin(time * 47 + seed) * 0.6 + Math.sin(time * 89 + seed * 2.3) * 0.4;
}

/** Campuran dua warna heksadesimal; dipakai agar warna pun berpindah menurut waktu, bukan lewat transisi CSS. */
export function mix(from: string, to: string, amount: number): string {
  const channel = (hex: string, index: number) => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  const value = [0, 1, 2].map((index) => Math.round(channel(from, index) + (channel(to, index) - channel(from, index)) * clamp01(amount)));
  return `#${value.map((part) => part.toString(16).padStart(2, '0')).join('')}`;
}

/** Bilangan acak yang tetap untuk masukan yang sama, agar percikan sama persis di setiap putaran. */
export function noise(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export interface Caption {
  start: number;
  end: number;
  text: string;
  /** Warna titik di depan keterangan. */
  tone: string;
}

export interface CaptionFrame {
  tone: string;
  words: { text: string; opacity: number; y: number }[];
}

/** Keterangan film pada detik ini: kata-katanya naik satu per satu, lalu memudar bersama sebelum berganti. */
export function captionAt(time: number, captions: readonly Caption[]): CaptionFrame | null {
  const caption = captions.find((line) => time >= line.start && time < line.end);
  if (!caption) return null;
  const fadeOut = clamp01((time - (caption.end - 0.22)) / 0.22);
  return {
    tone: caption.tone,
    words: caption.text.split(' ').map((text, index) => {
      const rise = spring(time - caption.start - index * 0.045, { stiffness: 230, damping: 21 });
      return { text, opacity: clamp01(rise * 1.6) * (1 - fadeOut), y: (1 - rise) * 0.55 - fadeOut * 0.25 };
    }),
  };
}
