/* Motion — one place to ask whether the visitor wants animation at all.
   Every other class checks this before moving anything. */
export const Motion = {
  get reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};
