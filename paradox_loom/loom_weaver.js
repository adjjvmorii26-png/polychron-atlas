/**
 * Polychron Atlas — Paradox Loom Weaver
 * Interleaves contradictions and reports tension.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'polychron.config'), 'utf8'));
const CONTR_DIR = path.join(__dirname, 'contradictions');

function loadParadoxes() {
  return fs.readdirSync(CONTR_DIR)
    .filter(f => f.endsWith('.pl'))
    .map(f => {
      const txt = fs.readFileSync(path.join(CONTR_DIR, f), 'utf8');
      const tension = parseFloat((txt.match(/tension:\s*([\d.]+)/) || [])[1] || 0.5);
      return { file: f, tension };
    });
}

function weave(tick = 0) {
  const paradoxes = loadParadoxes();
  const avgTension = paradoxes.reduce((s, p) => s + p.tension, 0) / Math.max(1, paradoxes.length);
  const modulation = 0.04 * Math.sin(tick * 0.17);
  const effective = Math.min(1, avgTension + modulation);
  const stable = effective < CONFIG.paradox_loom.tension_threshold;

  console.log(`[loom] tick=${String(tick).padStart(2)}  tension=${effective.toFixed(3)}  stable=${stable}  knots=${paradoxes.length}`);
  return { tension: +effective.toFixed(3), stable, knots: paradoxes.length };
}

module.exports = { weave, loadParadoxes };

if (require.main === module) {
  console.log('PARADOX LOOM weaving…\n');
  for (let t = 0; t < 8; t++) weave(t);
}
