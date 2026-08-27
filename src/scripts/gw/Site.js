import { Backdrop } from "./Backdrop.js";
import { SiteHeader } from "./SiteHeader.js";
import { ScrollReveal } from "./ScrollReveal.js";
import { ExpandableBlock } from "./ExpandableBlock.js";

/* Site — wires the pieces together.
   One scroll listener for the whole page, throttled to one animation frame,
   feeding whichever components care about the scroll position. */
export class Site {
  constructor() {
    this.backdrop = new Backdrop();
    this.header   = new SiteHeader();
    this.reveal   = new ScrollReveal();
    this.blocks   = ExpandableBlock.mountAll();
    this.ticking  = false;
  }

  start() {
    this.reveal.start();
    this.bindAnchors();

    const onScroll = () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => this.frame());
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    if (location.hash) this.openBlock(location.hash.slice(1));
    this.frame();
    return this;
  }

  frame() {
    const y  = window.pageYOffset || document.documentElement.scrollTop;
    const vh = window.innerHeight;
    const scrollable = Math.max(1, document.body.scrollHeight - vh);

    this.backdrop.update(y, vh);
    this.header.update(y, vh, scrollable);
    this.ticking = false;
  }

  openBlock(id) {
    const block = this.blocks[id];
    if (block) block.open();
  }

  /* A link to #community should open that block, not just scroll past it. */
  bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => this.openBlock(a.getAttribute('href').slice(1)));
    });
  }
};
