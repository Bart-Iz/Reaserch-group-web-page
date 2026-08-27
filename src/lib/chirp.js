/**
 * Generates the inspiral chirp drawn under the title.
 *
 * Frequency and amplitude follow the Newtonian inspiral scalings,
 * f ~ tau**(-3/8) and h ~ tau**(-1/4), where tau is the time remaining to
 * coalescence, followed by an exponentially damped ringdown.
 *
 * The phase is integrated in closed form rather than accumulated, and the
 * curve is sampled at a constant number of points per cycle, so the sampling
 * stays even as the frequency sweeps up. Runs at build time.
 */

// Newtonian inspiral exponents: frequency, and amplitude (h ~ f**(2/3)).
const F_EXP = -3 / 8;
const A_EXP = -1 / 4;
const PHASE_EXP = 1 + F_EXP; // 5/8, from integrating tau**(-3/8) over time

export function chirpPath({
  width = 1000,
  height = 128,
  xMerge = 760,
  amplitude = 44,
  cycles = 8.6,
  tauEnd = 0.02,
  tolerance = 5,
  ringdownRatio = 1.6,   // ringdown frequency / frequency at peak amplitude;
  ringdownDecay = 34,    // set from the remnant's mass and spin if you have them
  taper = 0.22,
} = {}) {
  const mid = height / 2;
  const k = 1 - tauEnd;

  // phi(u) = A * (1 - (1 - k*u)**(5/8)), with A fixed by phi(1) = 2*pi*cycles
  const totalPhase = 2 * Math.PI * cycles;
  const A = totalPhase / (1 - Math.pow(tauEnd, PHASE_EXP));

  const uAt = (phase) => (1 - Math.pow(1 - phase / A, 1 / PHASE_EXP)) / k;
  const envelope = (tau) => Math.pow(tau / tauEnd, A_EXP);

  // Steepest slope is 2*pi*amplitude per cycle, so this many points per cycle
  // keeps every straight segment under `tolerance`.
  const perCycle = Math.max(8, Math.ceil((2 * Math.PI * amplitude) / tolerance));
  const n = Math.max(2, Math.floor(cycles * perCycle));

  const pts = [];
  for (let j = 0; j <= n; j++) {
    const phase = (totalPhase * j) / n;   // even in phase, not in x
    const u = uAt(phase);
    const tau = 1 - k * u;
    let env = envelope(tau);
    if (taper > 0) {                      // raised-cosine ramp in from the axis
      const f = phase / (totalPhase * taper);
      if (f < 1) env *= 0.5 * (1 - Math.cos(Math.PI * f));
    }
    pts.push([xMerge * u, mid - amplitude * env * Math.sin(phase)]);
  }

  // Frequency at merger, cycles per x-unit: f = (dphi/du) / (2*pi*xMerge)
  const fMerge = (A * k * PHASE_EXP * Math.pow(tauEnd, F_EXP)) / (2 * Math.PI * xMerge);
  const fRing = ringdownRatio * fMerge;

  const span = width - xMerge;
  const steps = Math.max(2, Math.floor(fRing * span * perCycle));
  for (let j = 1; j <= steps; j++) {
    const d = (span * j) / steps;
    const phase = totalPhase + 2 * Math.PI * fRing * d;
    pts.push([xMerge + d, mid - amplitude * Math.exp(-d / ringdownDecay) * Math.sin(phase)]);
  }

  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
}
