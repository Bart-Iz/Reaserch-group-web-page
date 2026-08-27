import { Motion } from "./Motion.js";

/* Backdrop — owns the image layer behind the page.
   Drifts it slowly on scroll and raises --dim so text keeps its contrast
   once the reader has left the hero. */
export class Backdrop {
  constructor(options) {
    const o = options || {};
    this.sky      = document.querySelector(o.sky || '.sky');
    this.root     = document.documentElement;
    this.drift    = o.drift    != null ? o.drift    : 0.05;  /* px of drift per px of scroll */
    this.maxDrift = o.maxDrift != null ? o.maxDrift : 22;    /* never expose an edge */
    this.scale    = o.scale    || 1.06;
  }

  update(y, viewportHeight) {
    this.root.style.setProperty('--dim', Math.min(1, y / (viewportHeight * 0.9)).toFixed(3));

    if (Motion.reduced || !this.sky) return;
    const d = Math.min(this.maxDrift, y * this.drift).toFixed(1);
    this.sky.style.transform = `scale(${this.scale}) translate3d(0,${d}px,0)`;
  }
};
