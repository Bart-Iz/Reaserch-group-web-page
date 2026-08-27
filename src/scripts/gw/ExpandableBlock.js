/* ExpandableBlock — one Community / Activities / Projects / Join card.
   Keeps the button's aria-expanded and the card's class in step, so the
   CSS animation and the screen-reader state can never disagree. */
export class ExpandableBlock {
  constructor(el) {
    this.el     = el;
    this.button = el.querySelector('.block__toggle');
    if (this.button) this.button.addEventListener('click', () => this.toggle());
  }

  get isOpen()  { return this.button.getAttribute('aria-expanded') === 'true'; }
  set isOpen(v) {
    this.button.setAttribute('aria-expanded', String(v));
    this.el.classList.toggle('is-open', v);
  }

  open()   { if (!this.isOpen) this.isOpen = true;  }
  close()  { if ( this.isOpen) this.isOpen = false; }
  toggle() { this.isOpen = !this.isOpen; }

  /* Returns { blockId: instance } so anything can open a block by name. */
  static mountAll(selector) {
    const byId = {};
    document.querySelectorAll(selector || '.block').forEach(el => {
      const block = new ExpandableBlock(el);
      if (el.id) byId[el.id] = block;
    });
    return byId;
  }
};
