/**
 * smooth-scroll.ts
 *
 * Lenis dihapus sepenuhnya.
 * Browser modern (Chrome, Firefox, Safari) sudah punya native smooth scroll
 * yang sangat cepat dan responsif. Lenis justru menambah delay/momentum
 * yang membuat scroll terasa berat/lambat.
 *
 * GSAP ScrollTrigger bekerja langsung di atas native scroll — tidak butuh
 * wrapper apapun. Fungsi getLenis() dipertahankan sebagai no-op agar
 * import lama di komponen lain tidak error.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Noop object — komponen yang masih import getLenis() tidak perlu diubah
const NOOP_LENIS = {
  on: () => {},
  destroy: () => {},
  raf: () => {},
} as unknown as import('@studio-freight/lenis').default;

/** @deprecated Lenis telah dihapus. Fungsi ini hanya mengembalikan noop. */
export function getLenis() {
  return NOOP_LENIS;
}

/** @deprecated Tidak diperlukan lagi. */
export function destroyLenis() {}
