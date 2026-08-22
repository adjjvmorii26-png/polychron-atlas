/**
 * Polychron Atlas — Harmonic Array Core
 * Maintains phase-locked resonances.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'polychron.config'), 'utf8'));
const RES_DIR = path.join(__dirname, 'resonances');

function loadTones() {
  return fs.readdirSync(RES_DIR)
    .filter(f => f.endsWith('.ha'))
    .map(f => {
      const txt = fs.readFileSync(path.join(RES_DIR, f), 'utf8');
      const freq = parseFloat((txt.match(/frequency:\s*([\d.]+)/) || [])[1] || 1);
      const amp = parseFloat((txt.match(/amplitude:\s*([\d.]+)/) || [])[1] || 0.5);
      const phase = parseFloat((txt.match(/phase:\s*([\d.]+)/) || [])[1] || 0);
      return { file: f, freq, amp, phase };
    });
}

function resonate(tick = 0) {
  const tones = loadTones();
  const phases = tones.map(t => (t.phase + tick * 0.05 * t.freq) % 1);
  const phaseSpread = Math.max(...phases) - Math.min(...phases);
  const locked = phaseSpread <= CONFIG.harmonic_array.phase_lock;
  const avgAmp = tones.reduce((s, t) => s + t.amp, 0) / tones.length;

  console.log(`[array] tick=${String(tick).padStart(2)}  amp=${avgAmp.toFixed(3)}  spread=${phaseSpread.toFixed(3)}  locked=${locked}`);
  return { avgAmp: +avgAmp.toFixed(3), phaseSpread: +phaseSpread.toFixed(3), locked, tones: tones.length };
}

module.exports = { resonate, loadTones };

if (require.main === module) {
  console.log('HARMONIC ARRAY online…\n');
  for (let t = 0; t < 10; t++) resonate(t);
}
