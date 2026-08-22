/**
 * Polychron Atlas — Null Orchard Growth
 * Tracks void fruit growth and decay risk.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'polychron.config'), 'utf8'));
const FRUIT_DIR = path.join(__dirname, 'void_fruit');

function loadFruit() {
  return fs.readdirSync(FRUIT_DIR)
    .filter(f => f.endsWith('.no'))
    .map(f => {
      const txt = fs.readFileSync(path.join(FRUIT_DIR, f), 'utf8');
      const growth = parseFloat((txt.match(/growth:\s*([\d.]+)/) || [])[1] || 0.4);
      const risk = parseFloat((txt.match(/decay_risk:\s*([\d.]+)/) || [])[1] || 0.3);
      return { file: f, growth, risk };
    });
}

function grow(tick = 0) {
  const fruit = loadFruit();
  const avgGrowth = fruit.reduce((s, f) => s + f.growth, 0) / Math.max(1, fruit.length);
  const avgRisk = fruit.reduce((s, f) => s + f.risk, 0) / Math.max(1, fruit.length);
  const growing = avgGrowth > CONFIG.null_orchard.growth_rate;
  const decaying = avgRisk > CONFIG.null_orchard.decay_threshold;

  console.log(`[orchard] tick=${String(tick).padStart(2)}  growth=${avgGrowth.toFixed(3)}  risk=${avgRisk.toFixed(3)}  growing=${growing}  decaying=${decaying}`);
  return { avgGrowth: +avgGrowth.toFixed(3), avgRisk: +avgRisk.toFixed(3), growing, decaying, count: fruit.length };
}

module.exports = { grow, loadFruit };

if (require.main === module) {
  console.log('NULL ORCHARD growing…\n');
  for (let t = 0; t < 8; t++) grow(t);
}
