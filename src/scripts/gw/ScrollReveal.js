import { Motion } from "./Motion.js";

/* ScrollReveal — fades [data-reveal] elements in as they enter the viewport.
   Falls back to showing everything if IntersectionObserver is missing or
   the visitor has asked for reduced motion. */
export class ScrollReveal {
  constructor(options) {
    const o = options || {};
    this.items      = document.querySelectorAll(o.selector || '[data-reveal]');
    this.className  = o.className  || 'is-in';
    this.rootMargin = o.rootMargin || '0px 0px -12% 0px';
    this.threshold  = o.threshold != null ? o.threshold : 0.12;
  }

  start() {
    if (!('IntersectionObserver' in window) || Motion.reduced) return this.revealAll();

    this.observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(this.className);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: this.rootMargin, threshold: this.threshold });

    this.items.forEach(el => this.observer.observe(el));
    return this;
  }

  revealAll() {
    this.items.forEach(el => el.classList.add(this.className));
    return this;
  }
};
