/* SiteHeader — the bar that slides in once the hero is behind you,
   plus the reading-progress hairline along its bottom edge. */
export class SiteHeader {
  constructor(options) {
    const o = options || {};
    this.el        = document.getElementById(o.id || 'topbar');
    this.root      = document.documentElement;
    this.showAfter = o.showAfter != null ? o.showAfter : 0.72;  /* fraction of a screen */
  }

  update(y, viewportHeight, scrollable) {
    if (!this.el) return;
    this.el.classList.toggle('is-visible', y > viewportHeight * this.showAfter);
    this.root.style.setProperty('--progress', (y / scrollable).toFixed(4));
  }
};
