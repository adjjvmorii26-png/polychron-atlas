const fs = require("fs");
const path = require("path");

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "continuity.manifest.json"), "utf8"));
const required = [manifest.boot, manifest.entrypoint, ...manifest.domains];
const ledgerPath = path.join(root, "IXPANSION-LEDGER.json");

const missing = required.filter(p => !fs.existsSync(path.join(root, p)));
if (missing.length) {
  console.error(JSON.stringify({ status: "FAIL", missing }));
  process.exit(1);
}

const emptyDomains = manifest.domains.filter(d => {
  const target = path.join(root, d);
  return !fs.readdirSync(target).length;
});
if (emptyDomains.length) {
  console.error(JSON.stringify({ status: "FAIL", emptyDomains }));
  process.exit(1);
}

if (!fs.existsSync(ledgerPath)) {
  console.error(JSON.stringify({ status: "FAIL", reason: "ledger_missing" }));
  process.exit(1);
}

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const neighborSet = new Set(ledger.neighbors || []);
const ledgerValid = ledger.issuer === "ixpansion"
  && ledger.repo === "polychron-atlas"
  && Number.isInteger(ledger.stones_count)
  && ledger.stones_count > 0
  && Number.isInteger(ledger.total_stones_in_constellation)
  && ledger.total_stones_in_constellation >= ledger.stones_count
  && Array.isArray(ledger.stones)
  && ledger.stones.length === ledger.stones_count
  && Array.isArray(ledger.neighbors)
  && neighborSet.size === ledger.neighbors.length
  && typeof ledger.return_path === "string"
  && ledger.return_path.startsWith("https://");
if (!ledgerValid) {
  console.error(JSON.stringify({ status: "FAIL", reason: "ledger_contract" }));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  capsule: manifest.capsule,
  checked: required.length + 1
}, null, 2));
